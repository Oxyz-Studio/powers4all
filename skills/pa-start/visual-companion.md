# Powers4All Visual Interface Guide

## Overview

The browser is ALWAYS the primary interface for Powers4All. Unlike brainstorming where the browser is an optional visual companion, in Powers4All every user interaction goes through the browser. The terminal is exclusively the agent's workspace — the user never reads or types there (beyond pressing Enter to signal they have responded in the browser).

This means every question, every clarification, every preview, every confirmation, and every summary must be rendered as an HTML page in the browser.

## How It Works

The visual interface uses the same mechanism as brainstorming:

1. A local HTTP server watches a directory (`screen_dir`) for HTML files
2. When a new HTML file is written, the server detects it via filesystem watching
3. Connected browsers receive a WebSocket `reload` message and refresh automatically
4. User interactions (clicks on options, text input submissions) are recorded via WebSocket to `state_dir/events`
5. The agent reads the events file to process user responses

The server handles all WebSocket framing, file watching, and client management. The agent only needs to write HTML files and read the events file.

## Starting a Session

Start the visual companion server using the script in `skills/brainstorming/scripts/`:

```bash
skills/brainstorming/scripts/start-server.sh --project-dir <project-root>
```

### Options

| Flag | Description |
|---|---|
| `--project-dir <path>` | Store session files under `<path>/.powers4all/sessions/`. Persists after server stops. |
| `--host <bind-host>` | Host/interface to bind (default: `127.0.0.1`). Use `0.0.0.0` for remote environments. |
| `--url-host <host>` | Hostname shown in the returned URL. |
| `--foreground` | Run server in the current terminal (no backgrounding). |
| `--background` | Force background mode. |

### JSON Output

The server outputs a JSON line on startup with the following fields:

```json
{
  "type": "server-started",
  "port": 51234,
  "host": "127.0.0.1",
  "url_host": "localhost",
  "url": "http://localhost:51234",
  "screen_dir": "/path/to/session/content",
  "state_dir": "/path/to/session/state"
}
```

Save `screen_dir` and `state_dir` — they are needed for all subsequent operations. Tell the user to open the `url` in their browser.

## The Loop

Every interaction with the user follows this pattern:

1. **Check server is alive** — verify that `$STATE_DIR/server-info` exists
2. **Write HTML** to a new file in `screen_dir` — use a semantic file name, never reuse a previous name
3. **Tell user in terminal** — print: "Check the browser and respond. Press Enter when done."
4. **Wait for Enter** — the user presses Enter in the terminal after interacting in the browser
5. **Read events** — read `$STATE_DIR/events` to get the user's clicks and text input
6. **Process and continue** — use the event data to determine the next step

The server automatically clears the events file when a new screen file is detected, so each read captures only the events from the current screen.

## Available Components

The frame template (`frame-template.html`) provides styled CSS classes for all common UI patterns. Content HTML is injected into the frame automatically — you only need to write the inner content, not the full document structure.

### Options (A/B/C Choices)

Clickable options for single or multiple choice. Each option has a letter badge and content area.

```html
<div class="options">
  <div class="option" data-choice="choice-a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Option title</h3>
      <p>Description text</p>
    </div>
  </div>
  <div class="option" data-choice="choice-b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>Another option</h3>
      <p>Description text</p>
    </div>
  </div>
</div>
```

For multi-select, add `data-multiselect` to the container:

```html
<div class="options" data-multiselect>
  <!-- options here -->
</div>
```

**Classes:** `.options`, `.option`, `.letter`, `.content`

### Cards

Visual cards for showing designs, mockups, or variants. Cards support images and body text. They can also be selectable.

```html
<div class="cards">
  <div class="card" data-choice="variant-a" onclick="toggleSelect(this)">
    <div class="card-image">
      <!-- Visual content or rendered preview -->
    </div>
    <div class="card-body">
      <h3>Card title</h3>
      <p>Card description</p>
    </div>
  </div>
</div>
```

**Classes:** `.cards`, `.card`, `.card-image`, `.card-body`

### Mockup Container

A bordered container for rendering UI mockups with an optional header label.

```html
<div class="mockup">
  <div class="mockup-header">Preview title</div>
  <div class="mockup-body">
    <!-- Rendered mockup content -->
  </div>
</div>
```

**Classes:** `.mockup`, `.mockup-header`, `.mockup-body`

### Split View

Side-by-side comparison layout. Collapses to single column on narrow screens.

```html
<div class="split">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

**Classes:** `.split`

### Pros/Cons

Two-column layout for listing advantages and disadvantages.

```html
<div class="pros-cons">
  <div class="pros">
    <h4>Advantages</h4>
    <ul>
      <li>First advantage</li>
      <li>Second advantage</li>
    </ul>
  </div>
  <div class="cons">
    <h4>Disadvantages</h4>
    <ul>
      <li>First disadvantage</li>
      <li>Second disadvantage</li>
    </ul>
  </div>
</div>
```

**Classes:** `.pros-cons`, `.pros`, `.cons`

### Chat

Conversation-style display for restating the user's request and showing the agent's response. User messages appear right-aligned with accent color; agent messages appear left-aligned.

```html
<div class="chat">
  <div class="chat-message chat-user">
    <div class="chat-avatar">You</div>
    <div class="chat-bubble">User's message here</div>
  </div>
  <div class="chat-message chat-agent">
    <div class="chat-avatar">PA</div>
    <div class="chat-bubble">Agent's response here</div>
  </div>
</div>
```

**Classes:** `.chat`, `.chat-message`, `.chat-user`, `.chat-agent`, `.chat-bubble`, `.chat-avatar`

### Change Summary

Business-language diff for showing before/after changes. Used in diagnosis pages and completion summaries.

```html
<div class="change-summary">
  <div class="change-item">
    <div class="change-location">Module or feature name</div>
    <div class="split">
      <div class="change-before">
        <h4>Before</h4>
        <p>Previous behavior description</p>
      </div>
      <div class="change-after">
        <h4>After</h4>
        <p>New behavior description</p>
      </div>
    </div>
  </div>
</div>
```

The change item can optionally include action buttons:

```html
<div class="change-actions">
  <button data-choice="apply">Apply</button>
  <button data-choice="reject">Reject</button>
</div>
```

**Classes:** `.change-summary`, `.change-item`, `.change-location`, `.change-before`, `.change-after`, `.change-actions`

### Text Input Form

Free-text input area for when the user needs to type a response instead of choosing from options. Pressing Enter submits (Shift+Enter for newline).

```html
<div class="text-input-form">
  <textarea id="user-input" placeholder="Describe your need..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

After submission, the form is automatically disabled and the indicator bar updates to show "Message sent". The `submitTextInput()` function sends the text via WebSocket and records it to the events file.

**Classes:** `.text-input-form`
**Required:** `textarea` with `id="user-input"`, button calling `submitTextInput()`

### Progress Tracker

Vertical step tracker showing workflow progress. Each step can be completed, active (with pulse animation), or pending.

```html
<div class="progress-tracker">
  <div class="progress-step completed">Completed step</div>
  <div class="progress-step active">Current step</div>
  <div class="progress-step pending">Future step</div>
</div>
```

**Classes:** `.progress-tracker`, `.progress-step`
**Modifiers:** `.completed` (green checkmark), `.active` (blue with pulse animation), `.pending` (grayed out)

### Mock Elements

Inline elements for building quick UI mockups within mockup containers.

```html
<div class="mock-nav">Navigation Bar</div>
<div style="display: flex;">
  <div class="mock-sidebar">Sidebar content</div>
  <div class="mock-content">
    <input class="mock-input" placeholder="Input field">
    <button class="mock-button">Action button</button>
  </div>
</div>
```

**Classes:** `.mock-nav`, `.mock-sidebar`, `.mock-content`, `.mock-button`, `.mock-input`

### General Layout Helpers

| Class | Purpose |
|---|---|
| `.section` | Block with bottom margin for separating content sections |
| `.subtitle` | Secondary text below headings |
| `.label` | Small uppercase label text |
| `.placeholder` | Dashed border placeholder for areas not yet designed |

## Browser Events Format

User interactions are recorded as JSON lines in `$STATE_DIR/events`. Each line is a complete JSON object.

### Click Events

When the user clicks an element with a `data-choice` attribute:

```json
{
  "type": "click",
  "text": "Option title and description text",
  "choice": "the-data-choice-value",
  "id": "element-id-or-null",
  "timestamp": 1712500000000
}
```

### Text Input Events

When the user submits text via `submitTextInput()`:

```json
{
  "type": "text-input",
  "value": "The text the user typed",
  "timestamp": 1712500000000
}
```

### Reading Events

Read all events from the file. Each line is one event:

```bash
cat "$STATE_DIR/events"
```

The events file is automatically cleared when a new HTML screen file is written to `screen_dir`, so each read returns only events from the current screen.

## File Naming

HTML files written to `screen_dir` should use semantic, descriptive names. Never reuse a file name — the server detects new files vs. updates based on whether the name was seen before.

Guidelines:
- Use lowercase with hyphens: `welcome.html`, `diagnosis.html`, `fix-summary.html`
- Add version suffixes when iterating: `preview-v1.html`, `preview-v2.html`
- Name by purpose, not by order: `clarification-bug-type.html` instead of `step-2.html`
- Never overwrite a previous screen — always create a new file

## Custom Components

The agent can always write arbitrary HTML and inline CSS for needs not covered by the built-in components. The frame template provides CSS custom properties (theme variables) that should be used for consistency:

| Variable | Purpose |
|---|---|
| `--bg-primary` | Page background |
| `--bg-secondary` | Card/container background |
| `--bg-tertiary` | Subtle background, badges |
| `--border` | Border color |
| `--text-primary` | Main text |
| `--text-secondary` | Secondary text |
| `--text-tertiary` | Placeholder text |
| `--accent` | Primary action color |
| `--accent-hover` | Hover state for accent |
| `--success` | Success/completed state |
| `--warning` | Warning state |
| `--error` | Error/before state |
| `--selected-bg` | Selected item background |
| `--selected-border` | Selected item border |

All variables adapt automatically to light and dark mode via `prefers-color-scheme`.

## Cleaning Up

When the session is complete, stop the server:

```bash
skills/brainstorming/scripts/stop-server.sh $SESSION_DIR
```

This kills the server process and cleans up ephemeral session files (those under `/tmp`). Persistent sessions (under `.powers4all/`) are kept so pages can be reviewed later.
