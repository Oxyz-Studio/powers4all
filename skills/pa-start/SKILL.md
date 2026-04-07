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
5. **When implementation is needed:** transition to specs, plan, implementation via the browser

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
| **bug** | "ne marche pas", "erreur", "bug", "probleme", "plante", "bloque" | Invoke `pa-investigate` |
| **question** | "comment marche", "comment faire", "c'est quoi", "expliquer", "pourquoi" | Invoke `pa-explain` |
| **style** | "couleur", "design", "police", "taille", "arrondi", "espacement", "apparence" | Invoke `pa-preview` |
| **evolution** | "ajouter", "nouvelle fonctionnalite", "je voudrais que", "il faudrait" | Brainstorming allege (below) |

## Step 4: Workflow by Type

### Bug
Invoke the `pa-investigate` skill. Pass the server state (screen_dir, state_dir) and the classified request.

### Question
Invoke the `pa-explain` skill. Pass the server state and the question.

### Style
Invoke the `pa-preview` skill. Pass the server state and the style request.

### Evolution — Lightweight Brainstorming

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
