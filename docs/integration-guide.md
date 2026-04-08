# Powers4All — Orchestrator Integration Guide

> **What is this?** This document is for orchestrators like OpenClaw that run Claude Code as a backend service. It explains how to bridge Powers4All's browser interface with Claude Code's terminal, so that end users interact exclusively through a web browser — never through a terminal.
>
> **The chain:** Your orchestrator starts and controls a **Claude Code** process. Claude Code loads the **Powers4All plugin**, which provides skills (`pa:start`, `pa:investigate`, `pa:explain`, `pa:preview`) that generate interactive HTML pages served via a local HTTP server. Your job is to **connect the user's browser clicks to Claude Code's stdin** so the conversation flows automatically.
>
> **Who reads this?** The developer (or AI agent) building the orchestrator integration. Not the end user.

## Architecture

```
┌──────────────┐          ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   Browser    │  WS/HTTP │  PA Server   │  webhook  │ Orchestrator │  stdin   │  Claude Code │
│   (user)     │◄────────►│  (Node.js)   │─────────►│  (OpenClaw)  │────────►│  (agent)     │
│              │          │  port ~52000  │          │              │          │              │
│ clicks/types │          │ serves pages │          │ receives     │          │ runs skills  │
│ sees results │          │ captures     │          │ webhooks     │          │ writes HTML  │
│              │          │ events       │          │ sends Enter  │          │ reads events │
└──────────────┘          └──────────────┘          └──────────────┘          └──────────────┘
```

## What the orchestrator needs to do

1. **Start Claude Code** as a subprocess with stdin/stdout pipes
2. **Send the initial command** to Claude Code's stdin: `/pa:start <user request>\n`
3. **Listen for the webhook** from the PA server when the user interacts in the browser
4. **Send a newline** (`\n`) to Claude Code's stdin whenever a webhook is received
5. **Repeat** until the session ends

That's it. The orchestrator is a simple bridge between the browser and Claude Code.

## Step-by-step setup

### 1. Install the Powers4All plugin in the target project

```bash
claude --project-dir /path/to/project -c "/plugin marketplace add Oxyz-Studio/powers4all && /plugin install pa@powers4all"
```

### 2. Start Claude Code as a subprocess

The orchestrator starts Claude Code as a child process with piped stdin/stdout:

```python
import subprocess

process = subprocess.Popen(
    ["claude", "--project-dir", "/path/to/project"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)
```

### 3. Send the initial command

When the user submits a request through the orchestrator's own UI:

```python
request = "Le filtre par date ne marche pas sur la liste des commandes"
process.stdin.write(f"/pa:start {request}\n".encode())
process.stdin.flush()
```

### 4. Set up a webhook endpoint

The orchestrator must expose an HTTP endpoint to receive webhooks from the PA server. The PA server will POST to this URL when the user interacts in the browser.

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = json.loads(self.rfile.read(content_length))

        # body = {
        #   "session": "/path/to/project/.powers4all/sessions/12345-...",
        #   "event": {
        #     "type": "click",           # or "text-input"
        #     "choice": "fix",           # for clicks
        #     "text": "Corriger le...",  # label text
        #     "value": "user typed this", # for text-input
        #     "timestamp": 1706000101
        #   }
        # }

        # Send Enter to Claude Code to trigger next turn
        process.stdin.write(b"\n")
        process.stdin.flush()

        self.send_response(200)
        self.end_headers()

webhook_server = HTTPServer(("0.0.0.0", 8080), WebhookHandler)
```

### 5. Configure the PA server to use the webhook

The PA skills need to know the webhook URL. There are two approaches:

**Approach A: Environment variable (recommended)**

Set `PA_WEBHOOK_URL` before starting Claude Code:

```python
import os
os.environ["PA_WEBHOOK_URL"] = "http://localhost:8080/pa-event"

process = subprocess.Popen(
    ["claude", "--project-dir", "/path/to/project"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    env={**os.environ, "PA_WEBHOOK_URL": "http://localhost:8080/pa-event"}
)
```

The PA server reads `PA_WEBHOOK_URL` from environment and sends webhooks automatically.

**Approach B: Pass via start-server.sh flag**

If the orchestrator controls how the server is started, pass the URL directly:

```bash
start-server.sh --project-dir /path/to/project --webhook-url http://localhost:8080/pa-event
```

### 6. Forward the browser URL to the user

When Claude Code starts and the PA server launches, the orchestrator should capture the server URL from Claude Code's stdout. Look for a JSON line containing:

```json
{
  "type": "server-started",
  "port": 52633,
  "url": "http://localhost:52633",
  "screen_dir": "...",
  "state_dir": "...",
  "webhook": "http://localhost:8080/pa-event"
}
```

Forward this URL to the user (via iframe, redirect, or proxy).

**For remote deployments (VPS):** Start the PA server with `--host 0.0.0.0` so it binds to all interfaces, and `--url-host <public-hostname>` so the URL uses the correct hostname:

```bash
start-server.sh --project-dir /app --host 0.0.0.0 --url-host myserver.example.com --webhook-url http://localhost:8080/pa-event
```

## Webhook payload reference

### Click event

```json
{
  "session": "/path/to/project/.powers4all/sessions/12345-1706000000",
  "event": {
    "type": "click",
    "choice": "fix",
    "text": "Corriger le problème\nCorriger les 3 points...",
    "id": null,
    "timestamp": 1706000101
  }
}
```

### Text input event

```json
{
  "session": "/path/to/project/.powers4all/sessions/12345-1706000000",
  "event": {
    "type": "text-input",
    "value": "Le bug arrive quand je clique deux fois rapidement",
    "timestamp": 1706000205
  }
}
```

## Event flow timeline

```
Time  Browser              PA Server            Orchestrator         Claude Code
────  ───────              ─────────            ────────────         ───────────
T0    -                    -                    Starts Claude Code   Boots, loads plugin
T1    -                    -                    Sends "/pa:start"    Receives command
T2    -                    Server launches      -                    Launches server
T3    User opens URL       Serves welcome page  -                    Pushes HTML, waits
T4    User clicks "A"      Records event        Receives webhook     -
T5    -                    -                    Sends \n to stdin    Next turn starts
T6    -                    -                    -                    Reads events, investigates
T7    Page updates         Serves diagnosis     -                    Pushes HTML, waits
T8    User clicks "fix"    Records event        Receives webhook     -
T9    -                    -                    Sends \n to stdin    Next turn starts
T10   -                    -                    -                    Implements fix
T11   Page updates         Serves completion    -                    Pushes HTML, waits
```

## Minimal orchestrator example (Python)

```python
#!/usr/bin/env python3
"""Minimal Powers4All orchestrator — bridges browser and Claude Code."""

import subprocess
import json
import os
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

WEBHOOK_PORT = 8080
PROJECT_DIR = "/path/to/project"

# Global reference to Claude Code process
claude_process = None

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        event = json.loads(body)

        print(f"[webhook] User event: {event['event'].get('type')} — {event['event'].get('choice', event['event'].get('value', ''))}")

        # Send Enter to Claude Code
        if claude_process and claude_process.stdin:
            claude_process.stdin.write(b"\n")
            claude_process.stdin.flush()
            print("[webhook] Sent Enter to Claude Code")

        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        pass  # Suppress default logging

def start_webhook_server():
    server = HTTPServer(("0.0.0.0", WEBHOOK_PORT), WebhookHandler)
    print(f"[orchestrator] Webhook listening on port {WEBHOOK_PORT}")
    server.serve_forever()

def start_claude(user_request):
    global claude_process

    env = {**os.environ, "PA_WEBHOOK_URL": f"http://localhost:{WEBHOOK_PORT}/pa-event"}

    claude_process = subprocess.Popen(
        ["claude", "--project-dir", PROJECT_DIR],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env
    )

    # Send the initial request
    command = f"/pa:start {user_request}\n"
    claude_process.stdin.write(command.encode())
    claude_process.stdin.flush()
    print(f"[orchestrator] Sent to Claude Code: {command.strip()}")

    # Read stdout in background to monitor progress
    def read_output():
        for line in claude_process.stdout:
            text = line.decode().strip()
            if text:
                print(f"[claude] {text}")

    threading.Thread(target=read_output, daemon=True).start()

    return claude_process

if __name__ == "__main__":
    # Start webhook server in background
    threading.Thread(target=start_webhook_server, daemon=True).start()

    # Start Claude Code with a user request
    user_request = input("Enter your request: ")
    process = start_claude(user_request)

    print(f"[orchestrator] Claude Code running (PID {process.pid})")
    print(f"[orchestrator] Open the browser URL shown in Claude Code output")
    print(f"[orchestrator] User interactions will auto-forward to Claude Code")

    # Wait for Claude Code to finish
    process.wait()
    print("[orchestrator] Session ended")
```

## VPS deployment notes

For running on a VPS where users connect remotely:

1. **Bind to all interfaces:** Use `--host 0.0.0.0` so the browser can connect from outside
2. **Set public hostname:** Use `--url-host your-domain.com` so URLs are correct
3. **Proxy the PA server:** Put nginx/caddy in front for HTTPS
4. **Firewall:** Only expose the PA server port and your orchestrator's web port
5. **Process isolation:** Run each user session in its own container/namespace
6. **WebSocket support:** Make sure your reverse proxy supports WebSocket upgrades

### Nginx proxy example

```nginx
server {
    listen 443 ssl;
    server_name pa.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:52633;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Browser shows blank page | Content placeholder bug | Ensure frame-template.html has only ONE `<!-- CONTENT -->` |
| Webhook not received | PA_WEBHOOK_URL not set | Pass via env var or --webhook-url flag |
| Claude Code doesn't continue | Newline not sent to stdin | Ensure `\n` is written and flushed after webhook |
| Pages not updating | WebSocket disconnected | Check browser console for WS errors, refresh page |
| Server exits after 30min | Idle timeout | User interaction resets the timer; adjust IDLE_TIMEOUT_MS in server.cjs if needed |
