# Powers4All Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use pa:subagent-driven-development (recommended) or pa:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform powers4all into Powers4All — a browser-first workflow for non-dev tech profiles (PMs, POs, managers) that communicates in business language and uses a localhost web interface as the primary interaction surface.

**Architecture:** Extend the existing brainstorm visual companion server to serve as the primary UI for all skills. Create 4 new skills (pa-start, pa-investigate, pa-explain, pa-preview) that push HTML pages to the browser. Enrich the frame template with new CSS components (chat, diff viewer, text input form, progress tracker). Remove dev-only skills. Adapt CLAUDE.md.

**Tech Stack:** Node.js (server.cjs), vanilla HTML/CSS/JS (zero dependencies), Claude Code skills (SKILL.md markdown)

---

## File Structure

### Files to create
- `skills/pa-start/SKILL.md` — Entry point skill: classification, server launch, orchestration
- `skills/pa-start/visual-companion.md` — Visual companion guide adapted for powers4all (full workflow, not just brainstorming)
- `skills/pa-investigate/SKILL.md` — Bug investigation skill in business language
- `skills/pa-explain/SKILL.md` — Functional question answering skill
- `skills/pa-preview/SKILL.md` — Style change preview skill
- `skills/using-powers4all/SKILL.md` — Replacement for the previous intro skill, adapted for powers4all
- `commands/pa-start.md` — Slash command entry point

### Files to modify
- `skills/brainstorming/scripts/frame-template.html` — Add chat, diff viewer, text input form, progress tracker CSS components
- `skills/brainstorming/scripts/helper.js` — Add text input submission support via WebSocket
- `skills/brainstorming/scripts/server.cjs` — Handle `text-input` event type in WebSocket messages
- `CLAUDE.md` — Adapt for powers4all project identity and non-dev audience
- `package.json` — Rename to powers4all

### Files to delete
- `skills/test-driven-development/` — Not relevant for non-dev users
- `skills/systematic-debugging/` — Replaced by pa-investigate
- `skills/using-git-worktrees/` — Too technical
- `skills/finishing-a-development-branch/` — Too technical
- `skills/receiving-code-review/` — Not relevant
- `skills/writing-skills/` — Not relevant for end users
- `skills/using-powers4all/` — Replaces the previous intro skill
- `skills/brainstorming/` — Replaced by pa-start (scripts/ kept in place)
- `commands/brainstorm.md` — Replaced by pa-start.md
- `commands/execute-plan.md` — Not needed as direct command
- `commands/write-plan.md` — Not needed as direct command

---

### Task 1: Rename project and update package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update package.json**

```json
{
  "name": "powers4all",
  "version": "0.1.0",
  "type": "module",
  "type": "module"
}
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "chore: rename project to powers4all"
```

---

### Task 2: Add text input components to frame-template.html

**Files:**
- Modify: `skills/brainstorming/scripts/frame-template.html`

- [ ] **Step 1: Add new CSS components before the closing `</style>` tag**

Add the following CSS after the existing `/* ===== INLINE MOCKUP ELEMENTS ===== */` section and before `</style>`:

```css
    /* ===== CHAT / CONVERSATION ===== */
    .chat { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
    .chat-message { display: flex; gap: 0.75rem; align-items: flex-start; }
    .chat-message.chat-user { flex-direction: row-reverse; }
    .chat-bubble {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      max-width: 80%;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .chat-user .chat-bubble { background: var(--accent); color: white; border-color: var(--accent); }
    .chat-agent .chat-bubble { background: var(--bg-secondary); }
    .chat-avatar {
      width: 2rem; height: 2rem;
      border-radius: 50%;
      background: var(--bg-tertiary);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; flex-shrink: 0;
      color: var(--text-secondary);
    }
    .chat-user .chat-avatar { background: var(--accent); color: white; }

    /* ===== CHANGE SUMMARY (business-language diff) ===== */
    .change-summary { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
    .change-item {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    .change-location {
      background: var(--bg-tertiary);
      padding: 0.5rem 1rem;
      font-weight: 600;
      font-size: 0.85rem;
      border-bottom: 1px solid var(--border);
    }
    .change-item .split { padding: 1rem; }
    .change-before, .change-after { padding: 0.75rem; border-radius: 8px; }
    .change-before { background: rgba(255, 59, 48, 0.08); }
    .change-after { background: rgba(52, 199, 89, 0.08); }
    .change-before h4 { color: var(--error); font-size: 0.8rem; margin-bottom: 0.25rem; }
    .change-after h4 { color: var(--success); font-size: 0.8rem; margin-bottom: 0.25rem; }
    .change-actions {
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--border);
      display: flex; gap: 0.5rem; justify-content: flex-end;
    }
    .change-actions button {
      padding: 0.4rem 1rem;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--bg-secondary);
      color: var(--text-primary);
      cursor: pointer;
      font-size: 0.85rem;
    }
    .change-actions button:hover { border-color: var(--accent); }
    .change-actions button[data-choice="apply"] { background: var(--success); color: white; border-color: var(--success); }
    .change-actions button[data-choice="reject"] { background: var(--error); color: white; border-color: var(--error); }

    /* ===== TEXT INPUT FORM ===== */
    .text-input-form {
      display: flex; flex-direction: column; gap: 0.5rem;
      margin-top: 1rem; padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    .text-input-form textarea {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.75rem;
      font-family: inherit;
      font-size: 0.9rem;
      color: var(--text-primary);
      resize: vertical;
      min-height: 3rem;
      line-height: 1.5;
    }
    .text-input-form textarea:focus { outline: none; border-color: var(--accent); }
    .text-input-form button {
      align-self: flex-end;
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .text-input-form button:hover { background: var(--accent-hover); }
    .text-input-form button:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ===== PROGRESS TRACKER ===== */
    .progress-tracker { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1.5rem; }
    .progress-step {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .progress-step::before {
      content: '';
      width: 1.25rem; height: 1.25rem;
      border-radius: 50%;
      border: 2px solid var(--border);
      flex-shrink: 0;
    }
    .progress-step.completed { color: var(--text-primary); }
    .progress-step.completed::before {
      background: var(--success);
      border-color: var(--success);
      /* Checkmark via box-shadow trick (no SVG needed) */
      box-shadow: inset 0 0 0 2px white;
    }
    .progress-step.active {
      background: var(--selected-bg);
      color: var(--accent);
      font-weight: 500;
    }
    .progress-step.active::before {
      border-color: var(--accent);
      background: var(--accent);
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .progress-step.pending { color: var(--text-tertiary); }
```

- [ ] **Step 2: Update the header title in the HTML body**

Replace the header content:

```html
  <div class="header">
    <h1>Powers4All</h1>
    <div class="status">Connected</div>
  </div>
```

- [ ] **Step 3: Update indicator bar default text**

Replace the indicator bar text:

```html
  <div class="indicator-bar">
    <span id="indicator-text">Interagissez ci-dessus, puis revenez au terminal</span>
  </div>
```

- [ ] **Step 4: Verify the file is valid HTML**

Run: `node -e "const fs=require('fs'); const h=fs.readFileSync('skills/brainstorming/scripts/frame-template.html','utf-8'); console.log(h.includes('chat-bubble') && h.includes('change-summary') && h.includes('text-input-form') && h.includes('progress-tracker') ? 'OK: all components present' : 'FAIL: missing components')"`

Expected: `OK: all components present`

- [ ] **Step 5: Commit**

```bash
git add skills/brainstorming/scripts/frame-template.html
git commit -m "feat: add chat, diff viewer, text input, progress tracker CSS components"
```

---

### Task 3: Add text input support to helper.js

**Files:**
- Modify: `skills/brainstorming/scripts/helper.js`

- [ ] **Step 1: Add submitTextInput function and form handling**

Add the following before the closing `})();` in helper.js, after the `window.brainstorm = { ... };` block:

```javascript
  // Text input form submission
  window.submitTextInput = function() {
    const textarea = document.getElementById('user-input');
    if (!textarea) return;
    const value = textarea.value.trim();
    if (!value) return;

    sendEvent({
      type: 'text-input',
      value: value
    });

    // Disable form after submission to prevent double-send
    textarea.disabled = true;
    textarea.value = '';
    const btn = textarea.closest('.text-input-form')?.querySelector('button');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Envoyé';
    }

    // Update indicator
    const indicator = document.getElementById('indicator-text');
    if (indicator) {
      indicator.innerHTML = '<span class="selected-text">Message envoyé</span> — retournez au terminal pour continuer';
    }
  };

  // Handle Enter key in textarea (Shift+Enter for newline)
  document.addEventListener('keydown', (e) => {
    if (e.target.id === 'user-input' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      window.submitTextInput();
    }
  });
```

- [ ] **Step 2: Update indicator bar text for French**

In the existing click event listener, update the fallback text. Replace:

```javascript
        indicator.textContent = 'Click an option above, then return to the terminal';
```

with:

```javascript
        indicator.textContent = 'Interagissez ci-dessus, puis revenez au terminal';
```

And replace:

```javascript
        indicator.innerHTML = '<span class="selected-text">' + label + ' selected</span> — return to terminal to continue';
```

with:

```javascript
        indicator.innerHTML = '<span class="selected-text">' + label + ' sélectionné</span> — retournez au terminal pour continuer';
```

And replace:

```javascript
        indicator.innerHTML = '<span class="selected-text">' + selected.length + ' selected</span> — return to terminal to continue';
```

with:

```javascript
        indicator.innerHTML = '<span class="selected-text">' + selected.length + ' sélectionnés</span> — retournez au terminal pour continuer';
```

- [ ] **Step 3: Verify helper.js is valid JavaScript**

Run: `node -c skills/brainstorming/scripts/helper.js`

Expected: `skills/brainstorming/scripts/helper.js`  (no syntax errors)

- [ ] **Step 4: Commit**

```bash
git add skills/brainstorming/scripts/helper.js
git commit -m "feat: add text input form submission and French UI labels in helper.js"
```

---

### Task 4: Handle text-input events in server.cjs

**Files:**
- Modify: `skills/brainstorming/scripts/server.cjs`

- [ ] **Step 1: Update handleMessage to handle text-input events**

In the `handleMessage` function, the existing code already writes any event with a `choice` field to the events file. The `text-input` events don't have a `choice` field, so they won't be recorded. Update the condition to also record `text-input` events.

Replace:

```javascript
  if (event.choice) {
    const eventsFile = path.join(STATE_DIR, 'events');
    fs.appendFileSync(eventsFile, JSON.stringify(event) + '\n');
  }
```

with:

```javascript
  if (event.choice || event.type === 'text-input') {
    const eventsFile = path.join(STATE_DIR, 'events');
    fs.appendFileSync(eventsFile, JSON.stringify(event) + '\n');
  }
```

- [ ] **Step 2: Update the waiting page title**

Replace:

```javascript
const WAITING_PAGE = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Brainstorm Companion</title>
<style>body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
h1 { color: #333; } p { color: #666; }</style>
</head>
<body><h1>Brainstorm Companion</h1>
<p>Waiting for the agent to push a screen...</p></body></html>`;
```

with:

```javascript
const WAITING_PAGE = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Powers4All</title>
<style>body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
h1 { color: #333; } p { color: #666; }
@media (prefers-color-scheme: dark) { body { background: #1d1d1f; } h1 { color: #f5f5f7; } p { color: #86868b; } }</style>
</head>
<body><h1>Powers4All</h1>
<p>En attente de l'agent...</p></body></html>`;
```

- [ ] **Step 3: Verify server.cjs has no syntax errors**

Run: `node -c skills/brainstorming/scripts/server.cjs`

Expected: `skills/brainstorming/scripts/server.cjs`  (no syntax errors)

- [ ] **Step 4: Commit**

```bash
git add skills/brainstorming/scripts/server.cjs
git commit -m "feat: handle text-input events in server and update to Powers4All branding"
```

---

### Task 5: Delete dev-only skills

**Files:**
- Delete: `skills/test-driven-development/`
- Delete: `skills/systematic-debugging/`
- Delete: `skills/using-git-worktrees/`
- Delete: `skills/finishing-a-development-branch/`
- Delete: `skills/receiving-code-review/`
- Delete: `skills/writing-skills/`
- Delete: previous intro skill directory
- Delete: `skills/brainstorming/` (only `SKILL.md`, `visual-companion.md`, `spec-document-reviewer-prompt.md` — keep the `scripts/` directory)
- Delete: `commands/brainstorm.md`
- Delete: `commands/execute-plan.md`
- Delete: `commands/write-plan.md`

- [ ] **Step 1: Remove dev-only skill directories**

```bash
rm -rf skills/test-driven-development
rm -rf skills/systematic-debugging
rm -rf skills/using-git-worktrees
rm -rf skills/finishing-a-development-branch
rm -rf skills/receiving-code-review
rm -rf skills/writing-skills
rm -rf skills/using-powers4all-old
```

- [ ] **Step 2: Remove brainstorming skill files (keep scripts/)**

```bash
rm -f skills/brainstorming/SKILL.md
rm -f skills/brainstorming/visual-companion.md
rm -f skills/brainstorming/spec-document-reviewer-prompt.md
```

- [ ] **Step 3: Remove old commands**

```bash
rm -f commands/brainstorm.md
rm -f commands/execute-plan.md
rm -f commands/write-plan.md
```

- [ ] **Step 4: Verify only desired skills remain**

```bash
ls skills/
```

Expected directories: `brainstorming` (scripts only), `dispatching-parallel-agents`, `executing-plans`, `pa-start` (not yet created), `requesting-code-review`, `subagent-driven-development`, `verification-before-completion`, `writing-plans`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove dev-only skills not relevant for non-dev users"
```

---

### Task 6: Create the using-powers4all skill

**Files:**
- Create: `skills/using-powers4all/SKILL.md`

- [ ] **Step 1: Create the skill directory and file**

```bash
mkdir -p skills/using-powers4all
```

Write `skills/using-powers4all/SKILL.md`:

```markdown
---
name: using-powers4all
description: Use when starting any conversation - establishes how to find and use skills for non-dev tech profiles, requiring Skill tool invocation before ANY response
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## Context

Powers4All is designed for non-dev tech profiles: project managers, product owners, managers. The primary interface is the browser (localhost), not the terminal. All communication must use business language — never mention file names, line numbers, or technical jargon.

## Instruction Priority

1. **User's explicit instructions** (CLAUDE.md, direct requests) — highest priority
2. **Powers4All skills** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority

## How to Access Skills

Use the `Skill` tool in Claude Code. When you invoke a skill, its content is loaded and presented to you — follow it directly.

## Using Skills

### The Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means you should invoke the skill to check.

### Available Skills

| Skill | When to use |
|---|---|
| `pa-start` | Any new request from the user — bug, question, style change, feature |
| `pa-investigate` | Bug investigation and diagnosis |
| `pa-explain` | Answering functional questions about the application |
| `pa-preview` | Previewing style or visual changes |
| `writing-plans` | Creating implementation plans after design approval |
| `executing-plans` | Executing implementation plans in batches |
| `subagent-driven-development` | Dispatching subagents for implementation tasks |
| `requesting-code-review` | Reviewing completed work |
| `verification-before-completion` | Verifying work before declaring done |
| `dispatching-parallel-agents` | Running independent tasks in parallel |

### Communication Rules

These rules apply to ALL skills and ALL interactions:

1. **Never mention file names, paths, or line numbers** — refer to modules, screens, features
2. **Never show raw code** to the user — describe changes in business terms
3. **Use the browser as the primary interface** — push HTML pages for all interactions
4. **The terminal is for the agent's internal work** — the user interacts via the browser
5. **Speak in terms of:** modules, screens, features, behaviors, user actions
6. **When describing changes:** use before/after in natural language, not code diffs

### Red Flags

These thoughts mean STOP — you're rationalizing:

| Thought | Reality |
|---------|---------|
| "Let me just answer in the terminal" | Use the browser. Push an HTML page. |
| "I'll show them the code change" | Describe the change in business terms. |
| "This file path is important context" | Translate to module/feature name. |
| "This is just a quick answer" | Quick answers still go through the browser. |
| "The user probably understands code" | Assume non-dev. Always use business language. |
```

- [ ] **Step 2: Verify file exists**

```bash
cat skills/using-powers4all/SKILL.md | head -5
```

Expected: The frontmatter with `name: using-powers4all`

- [ ] **Step 3: Commit**

```bash
git add skills/using-powers4all/SKILL.md
git commit -m "feat: add using-powers4all skill for non-dev audience"
```

---

### Task 7: Create the pa-start skill

**Files:**
- Create: `skills/pa-start/SKILL.md`
- Create: `skills/pa-start/visual-companion.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p skills/pa-start
```

- [ ] **Step 2: Write the pa-start SKILL.md**

Write `skills/pa-start/SKILL.md`:

```markdown
---
name: pa-start
description: "Entry point for all Powers4All requests. Classifies the request (bug, question, style, evolution), launches the browser interface, and orchestrates the workflow. Use for ANY user request."
---

# Powers4All — Start

The single entry point for all user requests. Classifies the request type, launches the browser interface, and guides the user through the appropriate workflow — all in business language, all in the browser.

<HARD-GATE>
ALL interaction with the user happens in the browser. The terminal is your workspace. The browser is the user's workspace. Never ask the user to read or type in the terminal beyond the initial command and pressing Enter to signal they've responded in the browser.
</HARD-GATE>

## Communication Rules

You are speaking to a non-technical user. ALWAYS follow these rules:

1. **Never mention file names, paths, line numbers, or code** — refer to modules, screens, features, behaviors
2. **Describe changes as before/after in natural language** — not as code diffs
3. **Use terms like:** "le module de paiement", "l'ecran de connexion", "la liste des commandes", "le bouton d'envoi"
4. **Never use terms like:** "composant", "props", "state", "API endpoint", "migration", "refactor"

## Checklist

1. **Launch the browser server** if not already running
2. **Push a welcome page** confirming the request and asking for clarification if needed
3. **Classify the request** into one of: bug, question, style, evolution
4. **Execute the appropriate workflow** (see below)
5. **When implementation is needed:** transition to specs → plan → implementation via the browser

## Step 1: Launch Server

Start the visual companion server. The scripts are in `skills/brainstorming/scripts/`.

```bash
skills/brainstorming/scripts/start-server.sh --project-dir <project-root>
```

Save `screen_dir` and `state_dir` from the JSON output. Tell the user to open the URL in their browser.

## Step 2: Welcome Page

Push a first page to `screen_dir` that:
- Restates the user's request in clear business language
- If the request is clear: confirms understanding and shows what will happen next
- If the request is ambiguous: asks ONE clarifying question with clickable options

Example welcome page for a bug report:

```html
<h2>Votre demande</h2>
<p class="subtitle">J'ai bien compris votre signalement</p>

<div class="chat">
  <div class="chat-message chat-user">
    <div class="chat-avatar">Vous</div>
    <div class="chat-bubble">Le filtre par date ne marche pas sur la liste des commandes</div>
  </div>
  <div class="chat-message chat-agent">
    <div class="chat-avatar">PA</div>
    <div class="chat-bubble">Je vais investiguer le filtre par date sur la liste des commandes. Pouvez-vous preciser le probleme ?</div>
  </div>
</div>

<div class="options">
  <div class="option" data-choice="no-filter" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Le filtre ne fait rien</h3>
      <p>Je selectionne une date mais la liste ne change pas</p>
    </div>
  </div>
  <div class="option" data-choice="wrong-results" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>Les resultats sont incorrects</h3>
      <p>Le filtre fonctionne mais affiche les mauvaises commandes</p>
    </div>
  </div>
  <div class="option" data-choice="error" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>Une erreur s'affiche</h3>
      <p>Un message d'erreur apparait quand j'utilise le filtre</p>
    </div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Ou decrivez le probleme avec vos mots..."></textarea>
  <button onclick="submitTextInput()">Envoyer</button>
</div>
```

## Step 3: Classification

Based on the initial request and any clarification, classify into:

| Type | Signals | Next workflow |
|---|---|---|
| **bug** | "ne marche pas", "erreur", "bug", "probleme", "plante", "bloque" | → Invoke `pa-investigate` |
| **question** | "comment marche", "comment faire", "c'est quoi", "expliquer", "pourquoi" | → Invoke `pa-explain` |
| **style** | "couleur", "design", "police", "taille", "arrondi", "espacement", "apparence" | → Invoke `pa-preview` |
| **evolution** | "ajouter", "nouvelle fonctionnalite", "je voudrais que", "il faudrait" | → Brainstorming allege (below) |

## Step 4: Workflow by Type

### Bug → pa-investigate
Invoke the `pa-investigate` skill. Pass the server state (screen_dir, state_dir) and the classified request.

### Question → pa-explain
Invoke the `pa-explain` skill. Pass the server state and the question.

### Style → pa-preview
Invoke the `pa-preview` skill. Pass the server state and the style request.

### Evolution → Lightweight Brainstorming

For functional evolutions, run a lightweight brainstorming directly:

1. Push 2-3 clarifying questions (one per page, via browser)
2. Push a summary page with the proposed change described in business terms
3. Ask for validation via a clickable option: [Valider] / [Modifier] / [Annuler]
4. Once validated: write specs (in business language, saved to docs/), then invoke `writing-plans` skill
5. Show the plan as a progress tracker in the browser
6. Execute via `subagent-driven-development` or `executing-plans`
7. Push a final summary page with what changed

## The Browser Loop

For every interaction step:

1. **Check server is alive:** verify `$STATE_DIR/server-info` exists
2. **Write HTML** to a new file in `screen_dir` (semantic name, never reuse)
3. **Tell user in terminal:** "Consultez le navigateur et repondez. Appuyez sur Entree quand c'est fait."
4. **Wait for user** to press Enter in terminal
5. **Read `$STATE_DIR/events`** to get browser interactions (clicks, text input)
6. **Process and continue** to next step

## Ending a Session

When the workflow is complete, push a final summary page:

```html
<h2>Termine</h2>
<p class="subtitle">Voici ce qui a ete fait</p>

<div class="progress-tracker">
  <div class="progress-step completed">Demande analysee</div>
  <div class="progress-step completed">Diagnostic realise</div>
  <div class="progress-step completed">Correction appliquee</div>
  <div class="progress-step completed">Verification effectuee</div>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">Module concerne</div>
    <div class="split">
      <div class="change-before">
        <h4>Avant</h4>
        <p>Description du comportement precedent</p>
      </div>
      <div class="change-after">
        <h4>Apres</h4>
        <p>Description du nouveau comportement</p>
      </div>
    </div>
  </div>
</div>
```

Then stop the server:
```bash
skills/brainstorming/scripts/stop-server.sh $SESSION_DIR
```
```

- [ ] **Step 3: Write the visual-companion.md guide**

Write `skills/pa-start/visual-companion.md` — this is an adapted version of the brainstorming visual companion guide, focused on the full powers4all workflow instead of brainstorming only. Copy and adapt from `skills/brainstorming/visual-companion.md` with these changes:
- Title: "Powers4All Visual Interface Guide"
- The browser is ALWAYS used (not optional)
- Remove "when to use browser vs terminal" decision — always use browser for user interaction
- Keep all technical details about screen_dir, state_dir, events, file naming
- Add documentation for new components (chat, change-summary, text-input-form, progress-tracker)
- Keep server startup/shutdown instructions

- [ ] **Step 4: Commit**

```bash
git add skills/pa-start/
git commit -m "feat: add pa-start entry point skill with visual companion guide"
```

---

### Task 8: Create the pa-investigate skill

**Files:**
- Create: `skills/pa-investigate/SKILL.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p skills/pa-investigate
```

- [ ] **Step 2: Write the pa-investigate SKILL.md**

Write `skills/pa-investigate/SKILL.md`:

```markdown
---
name: pa-investigate
description: "Bug investigation and diagnosis for non-dev users. Explores code, identifies root cause, presents diagnosis in business language via the browser, proposes and implements fix after user approval."
---

# Powers4All — Investigate

Investigate a bug reported by a non-technical user. Explore the codebase, identify the root cause, present the diagnosis in business language, and implement the fix after approval — all via the browser interface.

<HARD-GATE>
NEVER show code, file names, paths, or technical details to the user. ALL communication uses business language: modules, screens, features, behaviors. The browser is the user's interface.
</HARD-GATE>

## Prerequisites

- The browser server is already running (started by pa-start)
- `screen_dir` and `state_dir` are known
- The bug has been described and classified by pa-start

## Workflow

### Phase 1: Acknowledge and Investigate

1. Push a page showing the investigation is in progress:

```html
<h2>Investigation en cours</h2>
<p class="subtitle">J'analyse le probleme que vous avez signale</p>

<div class="progress-tracker">
  <div class="progress-step active">Analyse du probleme</div>
  <div class="progress-step pending">Identification de la cause</div>
  <div class="progress-step pending">Proposition de correction</div>
  <div class="progress-step pending">Application de la correction</div>
</div>

<p style="color: var(--text-secondary); margin-top: 1.5rem; font-size: 0.85rem;">
  Cela peut prendre un moment. Je vous previens des que j'ai trouve quelque chose.
</p>
```

2. Silently investigate:
   - Read relevant source files based on the bug description
   - Search for related code using Grep/Glob
   - Check recent git history for related changes
   - Identify the root cause

### Phase 2: Present Diagnosis

Push a diagnosis page in business language:

```html
<h2>Diagnostic</h2>
<p class="subtitle">J'ai identifie la cause du probleme</p>

<div class="progress-tracker">
  <div class="progress-step completed">Analyse du probleme</div>
  <div class="progress-step completed">Identification de la cause</div>
  <div class="progress-step active">Proposition de correction</div>
  <div class="progress-step pending">Application de la correction</div>
</div>

<div class="section">
  <h3>Le probleme</h3>
  <p>[Description du probleme en langage metier — ex: "Le filtre par date sur la liste des commandes ne prend pas en compte le fuseau horaire, ce qui decale les resultats d'un jour."]</p>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Nom du module/fonctionnalite concerne]</div>
    <div class="split">
      <div class="change-before">
        <h4>Comportement actuel</h4>
        <p>[Description du comportement bugge]</p>
      </div>
      <div class="change-after">
        <h4>Apres correction</h4>
        <p>[Description du comportement attendu apres fix]</p>
      </div>
    </div>
  </div>
</div>

<div class="options">
  <div class="option" data-choice="fix" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Appliquer la correction</h3>
      <p>Je corrige le probleme maintenant</p>
    </div>
  </div>
  <div class="option" data-choice="more-info" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>J'ai besoin de plus d'informations</h3>
      <p>Expliquez-moi davantage avant de corriger</p>
    </div>
  </div>
  <div class="option" data-choice="cancel" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>Ne pas corriger</h3>
      <p>Ce n'est pas le bon probleme ou je prefere attendre</p>
    </div>
  </div>
</div>
```

### Phase 3: Implement Fix

If the user chooses "fix":

1. Push a progress page
2. Implement the fix (use subagents if complex)
3. Run verification (tests, linting)
4. Push a completion page with before/after summary

If the user chooses "more-info":
- Push an additional explanation page with more detail (still in business language)
- Ask again for approval

If the user chooses "cancel":
- Push a closing page, offer to investigate something else

### Phase 4: Verification and Summary

After implementing the fix, invoke `verification-before-completion` internally, then push:

```html
<h2>Correction appliquee</h2>
<p class="subtitle">Le probleme a ete corrige et verifie</p>

<div class="progress-tracker">
  <div class="progress-step completed">Analyse du probleme</div>
  <div class="progress-step completed">Identification de la cause</div>
  <div class="progress-step completed">Correction appliquee</div>
  <div class="progress-step completed">Verification effectuee</div>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Module concerne]</div>
    <div class="split">
      <div class="change-before">
        <h4>Avant</h4>
        <p>[Ancien comportement]</p>
      </div>
      <div class="change-after">
        <h4>Maintenant</h4>
        <p>[Nouveau comportement]</p>
      </div>
    </div>
  </div>
</div>
```
```

- [ ] **Step 3: Commit**

```bash
git add skills/pa-investigate/
git commit -m "feat: add pa-investigate skill for business-language bug diagnosis"
```

---

### Task 9: Create the pa-explain skill

**Files:**
- Create: `skills/pa-explain/SKILL.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p skills/pa-explain
```

- [ ] **Step 2: Write the pa-explain SKILL.md**

Write `skills/pa-explain/SKILL.md`:

```markdown
---
name: pa-explain
description: "Answer functional questions about the application in business language via the browser. Explains how features work, how to perform actions, and how systems connect — using visual diagrams, flow charts, and clear language."
---

# Powers4All — Explain

Answer questions about how the application works, how to perform specific actions, or how different parts of the system connect. All explanations use business language and are presented visually in the browser.

<HARD-GATE>
NEVER show code, file names, paths, or technical details to the user. ALL communication uses business language: modules, screens, features, behaviors. Use diagrams, flow charts, and visual explanations whenever possible. The browser is the user's interface.
</HARD-GATE>

## Prerequisites

- The browser server is already running (started by pa-start)
- `screen_dir` and `state_dir` are known
- The question has been captured by pa-start

## Workflow

### Phase 1: Understand and Research

1. Read the codebase to understand the feature/system the user is asking about
2. Map out the business logic, user flows, and relationships
3. Translate technical implementation into business concepts

### Phase 2: Generate Visual Explanation

Push an explanation page. Adapt the format to the question type:

**For "How does X work?" questions — use a flow diagram:**

```html
<h2>Comment fonctionne [fonctionnalite]</h2>
<p class="subtitle">Voici le parcours etape par etape</p>

<div class="progress-tracker">
  <div class="progress-step completed">1. [Premiere etape du flux — ex: L'utilisateur remplit le formulaire]</div>
  <div class="progress-step completed">2. [Deuxieme etape — ex: Le systeme verifie les informations]</div>
  <div class="progress-step completed">3. [Troisieme etape — ex: Un email de confirmation est envoye]</div>
  <div class="progress-step completed">4. [Derniere etape — ex: Le compte est active]</div>
</div>

<div class="section">
  <h3>Details importants</h3>
  <p>[Explication complementaire en langage naturel]</p>
</div>
```

**For "How to do X?" questions — use step-by-step instructions:**

```html
<h2>Comment [action]</h2>
<p class="subtitle">Suivez ces etapes</p>

<div class="options">
  <div class="option">
    <div class="letter">1</div>
    <div class="content">
      <h3>[Action a realiser]</h3>
      <p>[Description detaillee de l'etape]</p>
    </div>
  </div>
  <div class="option">
    <div class="letter">2</div>
    <div class="content">
      <h3>[Action suivante]</h3>
      <p>[Description detaillee]</p>
    </div>
  </div>
</div>
```

**For "What is X?" questions — use a simple explanation with context:**

```html
<h2>[Nom de la fonctionnalite]</h2>
<p class="subtitle">[Definition courte en une phrase]</p>

<div class="section">
  <h3>A quoi ca sert</h3>
  <p>[Explication du role et de l'utilite]</p>
</div>

<div class="section">
  <h3>Comment c'est utilise</h3>
  <p>[Description des cas d'usage concrets]</p>
</div>

<div class="section">
  <h3>Liens avec d'autres fonctionnalites</h3>
  <p>[Relations avec d'autres parties du systeme, en termes metier]</p>
</div>
```

### Phase 3: Follow-up

After the explanation, always offer:

```html
<div class="options" style="margin-top: 2rem;">
  <div class="option" data-choice="more-detail" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>J'ai besoin de plus de details</h3>
      <p>Approfondissez un aspect en particulier</p>
    </div>
  </div>
  <div class="option" data-choice="another-question" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>J'ai une autre question</h3>
      <p>Posez une nouvelle question</p>
    </div>
  </div>
  <div class="option" data-choice="done" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>C'est clair, merci</h3>
      <p>J'ai compris ce que je voulais savoir</p>
    </div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Ou posez votre question ici..."></textarea>
  <button onclick="submitTextInput()">Envoyer</button>
</div>
```

If "more-detail": push a deeper explanation page on the same topic
If "another-question": loop back to Phase 1 with the new question
If "done": push a closing page
```

- [ ] **Step 3: Commit**

```bash
git add skills/pa-explain/
git commit -m "feat: add pa-explain skill for answering functional questions visually"
```

---

### Task 10: Create the pa-preview skill

**Files:**
- Create: `skills/pa-preview/SKILL.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p skills/pa-preview
```

- [ ] **Step 2: Write the pa-preview SKILL.md**

Write `skills/pa-preview/SKILL.md`:

```markdown
---
name: pa-preview
description: "Preview style and visual changes in the browser. Shows before/after comparisons, proposes variants, and implements changes after user approval."
---

# Powers4All — Preview

Preview visual and style changes in the browser. Show before/after comparisons, propose variants when relevant, and implement the chosen changes after user approval.

<HARD-GATE>
NEVER show CSS code, file names, or technical properties. Describe changes as visual effects: "les boutons sont plus arrondis", "la couleur passe du gris au bleu". ALL previews happen in the browser. The user sees rendered results, not code.
</HARD-GATE>

## Prerequisites

- The browser server is already running (started by pa-start)
- `screen_dir` and `state_dir` are known
- The style change request has been captured by pa-start

## Workflow

### Phase 1: Identify and Analyze

1. Read the codebase to find the relevant styles
2. Understand what the user wants to change
3. Prepare 2-3 visual variants if the request is open-ended (e.g., "rendre plus moderne")
4. If the request is specific (e.g., "boutons bleus"), prepare one preview

### Phase 2: Show Preview

**For specific changes — show before/after:**

```html
<h2>Apercu du changement</h2>
<p class="subtitle">[Description du changement demande]</p>

<div class="split">
  <div class="mockup">
    <div class="mockup-header">Avant</div>
    <div class="mockup-body">
      <!-- Rendered HTML showing the current visual state -->
      <!-- Use actual CSS values from the codebase to reproduce the look -->
    </div>
  </div>
  <div class="mockup">
    <div class="mockup-header">Apres</div>
    <div class="mockup-body">
      <!-- Rendered HTML showing the proposed visual change -->
      <!-- Apply the new CSS values to show the result -->
    </div>
  </div>
</div>

<div class="options">
  <div class="option" data-choice="apply" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Appliquer ce changement</h3>
    </div>
  </div>
  <div class="option" data-choice="adjust" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>Ajuster</h3>
      <p>Je voudrais modifier quelque chose</p>
    </div>
  </div>
  <div class="option" data-choice="cancel" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>Annuler</h3>
    </div>
  </div>
</div>
```

**For open-ended changes — show variants as cards:**

```html
<h2>Propositions de style</h2>
<p class="subtitle">[Description de ce qui a ete demande]</p>

<div class="cards">
  <div class="card" data-choice="variant-a" onclick="toggleSelect(this)">
    <div class="card-image">
      <!-- Rendered preview of variant A -->
    </div>
    <div class="card-body">
      <h3>Option A — [Nom descriptif]</h3>
      <p>[Description courte de l'effet visuel]</p>
    </div>
  </div>
  <div class="card" data-choice="variant-b" onclick="toggleSelect(this)">
    <div class="card-image">
      <!-- Rendered preview of variant B -->
    </div>
    <div class="card-body">
      <h3>Option B — [Nom descriptif]</h3>
      <p>[Description courte]</p>
    </div>
  </div>
</div>
```

### Phase 3: Implement

After user approval:

1. Push a progress page
2. Implement the style change
3. Run verification
4. Push a confirmation page with the final before/after

### Phase 4: Iterate if Needed

If the user chose "adjust":
- Show a text input form asking what to change
- Generate a new preview with the adjustments
- Loop back to Phase 2
```

- [ ] **Step 3: Commit**

```bash
git add skills/pa-preview/
git commit -m "feat: add pa-preview skill for visual change previews"
```

---

### Task 11: Create the pa-start command

**Files:**
- Create: `commands/pa-start.md`

- [ ] **Step 1: Write the command file**

Write `commands/pa-start.md`:

```markdown
---
description: "Lancer une demande Powers4All — bug, question, changement de style ou evolution"
---

Invoke the `pa-start` skill to handle this request. Pass the user's message as the request to process.
```

- [ ] **Step 2: Commit**

```bash
git add commands/pa-start.md
git commit -m "feat: add /pa-start slash command"
```

---

### Task 12: Adapt CLAUDE.md for Powers4All

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Rewrite CLAUDE.md**

Replace the entire content of `CLAUDE.md` with the powers4all project guidelines:

```markdown
# Powers4All — Guidelines

## What is Powers4All

Powers4All is a browser-first workflow system for Claude Code, designed for non-dev tech profiles (project managers, product owners, managers). It provides skills that guide the agent through bug investigation, functional questions, style previews, and minor feature evolutions — all communicated in business language through a localhost web interface.

## If You Are an AI Agent

### Communication Rules (MANDATORY)

1. **Never mention file names, paths, line numbers, or code** to the user
2. **Always refer to:** modules, screens, features, behaviors
3. **The browser is the user's interface** — push HTML pages for all interactions
4. **The terminal is your workspace** — the user only uses it to launch commands and press Enter
5. **Speak in business language:** "le module de paiement", "l'ecran de connexion"
6. **Never use technical terms:** no "composant", "props", "state", "API", "refactor", "migration"

### Workflow

1. User types `/pa:start <request>` in the terminal
2. The pa-start skill classifies the request and launches the browser
3. All interaction happens in the browser (questions, answers, previews, progress)
4. When implementation is needed: specs → plan → implementation, all shown in browser
5. The terminal shows agent activity (for debugging only)

### Skills

| Skill | Purpose |
|---|---|
| `pa-start` | Entry point — classifies request, launches browser, orchestrates |
| `pa-investigate` | Bug diagnosis in business language |
| `pa-explain` | Answer functional questions with visual explanations |
| `pa-preview` | Preview style/visual changes before/after |
| `writing-plans` | Create implementation plans (inherited) |
| `executing-plans` | Execute plans in batches (inherited) |
| `subagent-driven-development` | Dispatch subagents for implementation (inherited) |
| `requesting-code-review` | Review completed work (inherited) |
| `verification-before-completion` | Verify before declaring done (inherited) |

### Testing

There are currently no automated tests for Powers4All skills. Skill changes should be tested manually by running the workflow end-to-end.
```

- [ ] **Step 2: Update the AGENTS.md symlink if needed**

Verify that `AGENTS.md` is still a symlink to `CLAUDE.md`:

```bash
ls -la AGENTS.md
```

Expected: `AGENTS.md -> CLAUDE.md`

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "feat: adapt CLAUDE.md for Powers4All project identity and non-dev audience"
```

---

### Task 13: Final verification

- [ ] **Step 1: Verify project structure**

```bash
echo "=== Skills ===" && ls skills/ && echo "=== Commands ===" && ls commands/ && echo "=== Scripts ===" && ls skills/brainstorming/scripts/
```

Expected:
- Skills: `brainstorming` (scripts only), `dispatching-parallel-agents`, `executing-plans`, `pa-explain`, `pa-investigate`, `pa-preview`, `pa-start`, `requesting-code-review`, `subagent-driven-development`, `using-powers4all`, `verification-before-completion`, `writing-plans`
- Commands: `pa-start.md`
- Scripts: `frame-template.html`, `helper.js`, `server.cjs`, `start-server.sh`, `stop-server.sh`

- [ ] **Step 2: Verify server starts correctly**

```bash
skills/brainstorming/scripts/start-server.sh --project-dir /tmp/pa-test
```

Expected: JSON with `type: "server-started"`, a URL, screen_dir, state_dir

- [ ] **Step 3: Verify new CSS components render**

Write a test HTML file to screen_dir and verify it loads:

```bash
SCREEN_DIR=$(cat /tmp/pa-test/.powers4all/sessions/*/state/server-info | python3 -c "import sys,json; print(json.load(sys.stdin)['screen_dir'])")
```

Write a test page to `$SCREEN_DIR/test-components.html` with all new components (chat, change-summary, text-input-form, progress-tracker) and verify it renders at the server URL.

- [ ] **Step 4: Stop test server and clean up**

```bash
SESSION_DIR=$(dirname $(dirname $(cat /tmp/pa-test/.powers4all/sessions/*/state/server-info | head -1 | python3 -c "import sys,json; print(json.load(sys.stdin)['state_dir'])")))
skills/brainstorming/scripts/stop-server.sh "$SESSION_DIR"
rm -rf /tmp/pa-test
```

- [ ] **Step 5: Commit any remaining changes**

```bash
git status
# If clean: no commit needed
# If changes: git add -A && git commit -m "chore: final cleanup"
```
