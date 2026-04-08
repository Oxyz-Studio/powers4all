---
name: preview
description: "Preview style and visual changes in the browser. Shows before/after comparisons, proposes variants, and implements changes after user approval."
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

# Powers4All — Preview

Preview visual and style changes in the browser. Show before/after comparisons, propose variants when relevant, and implement the chosen changes after user approval.

<HARD-GATE>
NEVER show CSS code, file names, or technical properties. Describe changes as visual effects: "les boutons sont plus arrondis", "la couleur passe du gris au bleu". ALL previews happen in the browser. The user sees rendered results, not code.
</HARD-GATE>

## Prerequisites

- The browser server is already running (started by start)
- `screen_dir` and `state_dir` are known
- The style change request has been captured by start

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
