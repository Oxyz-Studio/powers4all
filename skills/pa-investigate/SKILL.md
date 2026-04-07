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
