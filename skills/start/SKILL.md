---
name: start
description: "Entry point for all Powers4All requests. Classifies the request (bug, question, style, evolution), launches the browser interface, and orchestrates the workflow. Use for ANY user request."
---

<STOP>
DO NOT DO ANYTHING ELSE BEFORE COMPLETING STEP 1.
DO NOT investigate, search, read files, or explore the codebase.
DO NOT write any diagnostic or analysis in the terminal.
Your VERY FIRST action must be running the server launch command below.
</STOP>

# STEP 1 — Launch browser server (DO THIS FIRST, RIGHT NOW)

The plugin root is where `hooks/hooks.json` lives. Find it and launch the server:

```bash
PA_ROOT="$(find ~/.claude/plugins/cache -path '*/pa/*/hooks/hooks.json' 2>/dev/null | head -1 | xargs dirname | xargs dirname)"
"$PA_ROOT/scripts/start-server.sh" --project-dir "$(pwd)"
```

If that fails, try searching directly:
```bash
PA_ROOT="$(find ~/.claude/plugins/cache -name 'start-server.sh' -path '*/pa/*' 2>/dev/null | head -1 | xargs dirname | xargs dirname)"
"$PA_ROOT/scripts/start-server.sh" --project-dir "$(pwd)"
```

Save `screen_dir` and `state_dir` from the JSON output.

Then tell the user: **"Open this URL in your browser: http://localhost:PORT — then press Enter here."**

Wait for the user to press Enter.

<STOP>
DO NOT PROCEED TO STEP 2 until the server is running and you have screen_dir and state_dir.
If the server failed to start, fix the issue and try again. DO NOT skip the browser.
</STOP>

# STEP 2 — Push welcome page to browser

Write an HTML file to `$screen_dir/welcome.html` using the Write tool. This page must:
- Restate the user's request in plain business language
- Ask a clarifying question if needed (with clickable options)
- Include a text input form for free-text response

Example structure:
```html
<h2>Your request</h2>
<p class="subtitle">Here is what I understood</p>

<div class="chat">
  <div class="chat-message chat-user">
    <div class="chat-avatar">You</div>
    <div class="chat-bubble">[Restate the user's request in their words]</div>
  </div>
  <div class="chat-message chat-agent">
    <div class="chat-avatar">PA</div>
    <div class="chat-bubble">[Your response — ask for clarification if needed]</div>
  </div>
</div>

<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>[Option A]</h3><p>[Description]</p></div>
  </div>
  <div class="option" data-choice="b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content"><h3>[Option B]</h3><p>[Description]</p></div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Or describe in your own words..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

Then say in terminal: **"Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events` if it exists.

# STEP 3 — Classify and investigate (IN THE BACKGROUND)

Now you may investigate the codebase silently. Use Grep, Glob, Read, Agent tools to understand the issue.

<ENFORCEMENT>
While investigating, do NOT write findings in the terminal. Just say "Investigating..." and nothing else.
ALL findings go to the browser as HTML pages in the next step.
</ENFORCEMENT>

# STEP 4 — Push results to browser

Write a NEW HTML file to `$screen_dir/` (e.g., `diagnosis.html`, `explanation.html`, `preview.html`).

<ABSOLUTE-RULE>
The HTML page you write MUST NOT contain:
- Any file name (e.g., ConfigureScreen.vue, Controller.php, Manager.php)
- Any variable name (e.g., dimensionX, fitsX1, tunnelConfig)
- Any code snippet
- Any line number
- Any technical term: "frontend", "backend", "API", "component", "validation", "controller", "model", "mixin", "class", "method", "function", "variable", "props", "state"

INSTEAD use business language:
- "the product configuration screen" instead of "ConfigureScreen.vue"
- "the dimension check" instead of "dimensionX validation"
- "the order processing" instead of "ClientOrderManager.php"
- "the size verification" instead of "fitsX1 || fitsX2"
- "the check when placing an order" instead of "frontend validation"
- "the server-side check" instead of "backend validation"
- "product option" instead of "variant"
</ABSOLUTE-RULE>

For a bug diagnosis, use this structure:
```html
<h2>Diagnosis</h2>
<p class="subtitle">I found the cause of the issue</p>

<div class="progress-tracker">
  <div class="progress-step completed">Problem analyzed</div>
  <div class="progress-step completed">Cause identified</div>
  <div class="progress-step active">Proposed fix</div>
  <div class="progress-step pending">Fix applied</div>
</div>

<div class="section">
  <h3>The problem</h3>
  <p>[Plain language description of what is wrong — NO technical terms]</p>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Business name of the affected area]</div>
    <div class="split">
      <div class="change-before">
        <h4>Current behavior</h4>
        <p>[What happens now — in business terms]</p>
      </div>
      <div class="change-after">
        <h4>After fix</h4>
        <p>[What will happen after — in business terms]</p>
      </div>
    </div>
  </div>
</div>

<div class="options">
  <div class="option" data-choice="fix" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>Apply the fix</h3><p>Fix the issue now</p></div>
  </div>
  <div class="option" data-choice="more-info" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content"><h3>I need more details</h3><p>Explain more before fixing</p></div>
  </div>
  <div class="option" data-choice="cancel" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content"><h3>Don't fix</h3><p>Not the right issue or I prefer to wait</p></div>
  </div>
</div>
```

Then say in terminal: **"Check your browser and press Enter when done."**

# STEP 5 — Act on user choice

Read `$state_dir/events`. Based on the user's choice:
- **fix**: Implement the fix, push progress page, then push completion summary page
- **more-info**: Push additional explanation page (still in business language), then ask again
- **cancel**: Push closing page

# STEP 6 — End session

Push a final summary page, then stop the server:
```bash
"$PA_ROOT/scripts/stop-server.sh" "$SESSION_DIR"
```
