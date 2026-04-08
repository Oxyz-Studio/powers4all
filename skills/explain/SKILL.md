---
name: explain
description: "Answer functional questions about the application in business language via the browser. Explains how features work, how to perform actions, and how systems connect — using visual diagrams, flow charts, and clear language."
---

<CRITICAL-ENFORCEMENT>
## MANDATORY: Browser-Only Output

ALL diagnostic findings MUST be pushed as HTML pages to the browser. NEVER write diagnostic results in the terminal. The terminal is ONLY for:
- "Please check your browser and press Enter when done"
- Brief status: "Investigating..."

Everything else goes to the browser as an HTML page.

## MANDATORY: Zero Technical Language

You will be FIRED if you mention ANY of these in your output to the user:
- File names, paths, or line numbers (e.g., `ConfigureScreen.vue:456`)
- Variable names (e.g., `dimensionX`, `fitsX1`)
- Code snippets of any kind
- Technical terms: "frontend", "backend", "API", "component", "validation logic", "variant", "controller", "model"

INSTEAD, translate everything to business language:
- "ConfigureScreen.vue line 456" → "the product configuration screen"
- "dimensionX validation" → "the dimension check"
- "ClientOrderManager.php" → "the order processing module"
- "fitsX1 || fitsX2" → "the size verification"
- "frontend validation" → "the check on the ordering screen"
- "backend validation" → "the server-side verification"
- "variant" → "product option" or "product reference"
</CRITICAL-ENFORCEMENT>

# Powers4All — Explain

Answer questions about how the application works, how to perform specific actions, or how different parts of the system connect. All explanations use business language and are presented visually in the browser.

<HARD-GATE>
NEVER show code, file names, paths, or technical details to the user. ALL communication uses business language: modules, screens, features, behaviors. Use diagrams, flow charts, and visual explanations whenever possible. The browser is the user's interface.
</HARD-GATE>

## Prerequisites

- The browser server is already running (started by start)
- `screen_dir` and `state_dir` are known
- The question has been captured by start

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
