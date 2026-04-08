---
name: preview
description: "Preview style and visual changes in the browser. Verifies current state, shows before/after comparisons, proposes variants, and implements changes after user approval."
---

<STOP>
The browser server MUST already be running (started by the `start` skill).
You MUST have `screen_dir` and `state_dir` variables.
If you don't have them, STOP and tell the user to run `/pa:start` first.
</STOP>

# The Iron Law

```
NO PREVIEW WITHOUT VERIFYING CURRENT STATE FIRST
```

You must READ the actual styles/code to understand the current state before showing a preview.
Don't guess what something looks like — verify.

# OUTPUT RULES

<ABSOLUTE-RULE>
ALL user-facing output goes to the browser as HTML pages. The terminal is ONLY for:
- "Check your browser. I'm preparing a preview..."
- "Preview ready. Check your browser and press Enter when done."
- "Change applied. Check your browser for the summary."

Your HTML pages MUST NOT contain:
- File names or paths (e.g., ConfigureScreen.vue, Controller.php, styles.scss)
- Variable names (e.g., dimensionX, fitsX1, --primary-color)
- Code snippets of any kind
- Line numbers (e.g., "line 456")
- Technical terms: "frontend", "backend", "API", "component", "validation", "controller", "model", "mixin", "class", "method", "function", "variable", "props", "state", "Vue", "React", "PHP", "JavaScript", "SQL", "query", "migration"
- CSS property names (e.g., "border-radius", "padding", "margin", "font-size", "box-shadow", "line-height", "letter-spacing", "z-index", "opacity", "display", "flex", "grid")
- CSS values (e.g., "16px", "#ff0000", "rgba(0,0,0,0.1)", "1rem", "400", "sans-serif")
- HTML element names (e.g., "div", "button", "input", "span", "section", "header", "footer")

TRANSLATE everything:
- "ConfigureScreen.vue" → "the product configuration screen"
- "dimensionX validation" → "the dimension check"
- "ClientOrderManager.php" → "the order processing module"
- "frontend validation" → "the check on the ordering screen"
- "backend validation" → "the server-side check"
- "variant" → "product option" or "product reference"
- "null/undefined" → "missing information"
- "API endpoint" → "the system's communication channel"

TRANSLATE style terms:
- "border-radius: 12px" → "more rounded corners"
- "padding: 16px" → "more breathing room"
- "color: #0071e3" → "blue"
- "font-size: 14px" → "slightly larger text"
- "margin-bottom" → "spacing below"
- "box-shadow" → "subtle shadow effect"
- "font-weight: 600" → "bolder text"
- "letter-spacing" → "character spacing"
- "line-height" → "line spacing"
- "opacity: 0.5" → "semi-transparent"
- "background-color" → "background"
- "text-transform: uppercase" → "all capitals"
- "transition: 0.3s" → "smooth animation"

Before writing ANY HTML file, mentally review EVERY sentence. If it contains ANY technical term, rewrite it.
</ABSOLUTE-RULE>

# STEP 1 — Push "analyzing" page

Write `$screen_dir/analyzing-style.html`:

```html
<h2>Analyzing your style request</h2>
<p class="subtitle">I'm looking at the current design to prepare a preview</p>

<div class="progress-tracker">
  <div class="progress-step active">Reading the current style</div>
  <div class="progress-step pending">Preparing the preview</div>
  <div class="progress-step pending">Showing you the options</div>
</div>

<div class="section" style="margin-top: 2rem;">
  <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem;">
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
      I am reading the current design to understand exactly how things look right now. I will not guess — I verify the existing appearance before showing you anything.
    </p>
  </div>
</div>

<p style="color: var(--text-tertiary); margin-top: 1.5rem; font-size: 0.85rem;">
  This may take a moment. I will notify you as soon as the preview is ready.
</p>
```

Say in terminal: **"Check your browser. I'm preparing a preview..."**

# STEP 2 — Analyze current state (INTERNAL — silent)

1. **Find the relevant styles** — Use Grep/Glob to locate the CSS/styles that affect the requested element
2. **Read the actual values** — Don't assume. Read the current border-radius, colors, spacing, fonts, shadows, etc.
3. **Understand the context** — Is this a global style? Component-specific? Theme variable? Does it inherit from a parent?
4. **Check for side effects** — Will changing this affect other elements? Are there shared classes, variables, or mixins?
5. **Prepare variants** — If the request is open-ended ("make it more modern"), prepare 2-3 distinct visual options

<ENFORCEMENT>
Do NOT write ANY style details in the terminal.
Do NOT show CSS code to the user ever.
ALL previews are RENDERED HTML in the browser — the user sees the visual result, not the code.
</ENFORCEMENT>

# STEP 3 — Push preview page

Update the progress tracker first. Write `$screen_dir/analyzing-style.html`:

```html
<h2>Analyzing your style request</h2>
<p class="subtitle">I'm looking at the current design to prepare a preview</p>

<div class="progress-tracker">
  <div class="progress-step completed">Reading the current style</div>
  <div class="progress-step completed">Preparing the preview</div>
  <div class="progress-step active">Showing you the options</div>
</div>

<div class="section" style="margin-top: 2rem;">
  <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem;">
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
      Preview is almost ready. Preparing the visual comparison now.
    </p>
  </div>
</div>
```

Then push the actual preview.

---

**For specific changes (e.g., "make buttons blue")** — show before/after:

Write `$screen_dir/preview.html`:

```html
<h2>Preview</h2>
<p class="subtitle">[Description of the requested change in plain language — e.g., "Here is how the buttons would look with a blue color and rounder shape"]</p>

<div class="split">
  <div class="mockup">
    <div class="mockup-header">Current look</div>
    <div class="mockup-body" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
      <!-- RENDER the element with CURRENT styles read from the codebase -->
      <!-- Example: if previewing a button change, render an actual button with the real current inline styles -->
      <!-- The inline styles MUST match the values you read in STEP 2 — do not invent values -->

      <!-- EXAMPLE for a button preview (adapt to what was actually requested): -->
      <button style="background: #6c757d; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">Place order</button>
      <button style="background: transparent; color: #6c757d; border: 1px solid #6c757d; padding: 10px 20px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">Cancel</button>

      <!-- EXAMPLE for a card preview: -->
      <!--
      <div style="background: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 16px; width: 100%; max-width: 300px;">
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #333;">Product name</div>
        <div style="color: #666; font-size: 14px; margin-bottom: 12px;">Short description of the item</div>
        <div style="font-weight: 700; font-size: 18px; color: #333;">29.99</div>
      </div>
      -->

      <!-- EXAMPLE for an input field preview: -->
      <!--
      <div style="width: 100%; max-width: 300px;">
        <label style="display: block; font-size: 13px; color: #666; margin-bottom: 4px;">Email address</label>
        <input type="text" value="user@example.com" style="width: 100%; padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; font-family: inherit; box-sizing: border-box;" readonly>
      </div>
      -->
    </div>
  </div>
  <div class="mockup">
    <div class="mockup-header">New look</div>
    <div class="mockup-body" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
      <!-- RENDER the same element with PROPOSED styles applied -->
      <!-- Change ONLY the properties the user requested — keep everything else identical -->

      <!-- EXAMPLE matching the button preview above, with blue + rounded applied: -->
      <button style="background: #0071e3; color: #fff; border: none; padding: 10px 24px; border-radius: 12px; font-size: 14px; cursor: pointer; font-family: inherit; box-shadow: 0 2px 8px rgba(0,113,227,0.3);">Place order</button>
      <button style="background: transparent; color: #0071e3; border: 1px solid #0071e3; padding: 10px 24px; border-radius: 12px; font-size: 14px; cursor: pointer; font-family: inherit;">Cancel</button>

      <!-- EXAMPLE matching the card preview above, with modernized look: -->
      <!--
      <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; width: 100%; max-width: 300px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #1a1a1a;">Product name</div>
        <div style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Short description of the item</div>
        <div style="font-weight: 700; font-size: 18px; color: #0071e3;">29.99</div>
      </div>
      -->

      <!-- EXAMPLE matching the input field preview above, with modernized look: -->
      <!--
      <div style="width: 100%; max-width: 300px;">
        <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 6px; font-weight: 500;">Email address</label>
        <input type="text" value="user@example.com" style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 14px; font-family: inherit; box-sizing: border-box; background: #f9fafb;" readonly>
      </div>
      -->
    </div>
  </div>
</div>

<div class="section">
  <h3>What changes</h3>
  <p>[Plain language description — e.g., "The buttons become blue with more rounded corners and a subtle shadow effect. The outline button also picks up the blue color for its border and text."]</p>
</div>

<div class="options">
  <div class="option" data-choice="apply" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Apply this change</h3>
      <p>Update the design now</p>
    </div>
  </div>
  <div class="option" data-choice="adjust" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>Adjust something</h3>
      <p>I'd like to modify the proposal</p>
    </div>
  </div>
  <div class="option" data-choice="cancel" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>Cancel</h3>
      <p>Keep the current design</p>
    </div>
  </div>
</div>
```

---

**For open-ended changes (e.g., "make it more modern")** — show variant cards:

Write `$screen_dir/preview.html`:

```html
<h2>Style proposals</h2>
<p class="subtitle">[Description of what was requested — e.g., "Here are three directions for a more modern look"]</p>

<div class="cards">
  <div class="card" data-choice="variant-a" onclick="toggleSelect(this)">
    <div class="card-image" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; align-items: center; background: var(--bg-secondary);">
      <!-- Rendered preview of variant A with actual CSS applied inline -->
      <!-- EXAMPLE: "Clean and minimal" variant -->
      <button style="background: #1a1a1a; color: #fff; border: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; letter-spacing: 0.3px;">Place order</button>
      <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; width: 100%; max-width: 260px;">
        <div style="font-weight: 600; font-size: 15px; color: #1a1a1a; margin-bottom: 6px;">Product name</div>
        <div style="color: #9ca3af; font-size: 13px;">Clean lines, neutral tones</div>
      </div>
    </div>
    <div class="card-body">
      <h3>Option A — Clean and minimal</h3>
      <p>Dark buttons, subtle borders, plenty of white space. A refined, understated look.</p>
    </div>
  </div>

  <div class="card" data-choice="variant-b" onclick="toggleSelect(this)">
    <div class="card-image" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; align-items: center; background: var(--bg-secondary);">
      <!-- Rendered preview of variant B -->
      <!-- EXAMPLE: "Bold and colorful" variant -->
      <button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; padding: 12px 28px; border-radius: 24px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; box-shadow: 0 4px 12px rgba(102,126,234,0.4);">Place order</button>
      <div style="background: #fff; border: none; border-radius: 16px; padding: 16px; width: 100%; max-width: 260px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        <div style="font-weight: 700; font-size: 15px; color: #1a1a1a; margin-bottom: 6px;">Product name</div>
        <div style="color: #764ba2; font-size: 13px; font-weight: 500;">Vibrant accents, soft shadows</div>
      </div>
    </div>
    <div class="card-body">
      <h3>Option B — Bold and colorful</h3>
      <p>Gradient accents, fully rounded buttons, floating card effect with soft shadows.</p>
    </div>
  </div>

  <div class="card" data-choice="variant-c" onclick="toggleSelect(this)">
    <div class="card-image" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; align-items: center; background: var(--bg-secondary);">
      <!-- Rendered preview of variant C -->
      <!-- EXAMPLE: "Warm and approachable" variant -->
      <button style="background: #f59e0b; color: #fff; border: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;">Place order</button>
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; width: 100%; max-width: 260px;">
        <div style="font-weight: 600; font-size: 15px; color: #92400e; margin-bottom: 6px;">Product name</div>
        <div style="color: #b45309; font-size: 13px;">Warm tones, inviting feel</div>
      </div>
    </div>
    <div class="card-body">
      <h3>Option C — Warm and approachable</h3>
      <p>Amber accents, warm backgrounds, a friendly and inviting feel throughout.</p>
    </div>
  </div>
</div>
```

---

Tell user: **"Preview ready. Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`.

# STEP 4 — Act on user choice

Read `$state_dir/events`.

## If "apply" or a variant chosen:

Push a progress page to `$screen_dir/applying-style.html`:

```html
<h2>Applying the change</h2>
<p class="subtitle">Updating the design now</p>

<div class="progress-tracker">
  <div class="progress-step completed">Current style analyzed</div>
  <div class="progress-step completed">Preview approved</div>
  <div class="progress-step active">Applying the change</div>
  <div class="progress-step pending">Verifying</div>
</div>

<div class="section" style="margin-top: 1.5rem;">
  <h3>What I am doing</h3>
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; background: var(--selected-bg); color: var(--accent); font-weight: 500; font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; background: var(--accent); flex-shrink: 0; animation: pulse 1.5s ease-in-out infinite;"></span>
      Updating the design to match the preview
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; color: var(--text-tertiary); font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0;"></span>
      Checking that nothing else is affected
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; color: var(--text-tertiary); font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0;"></span>
      Verifying the result
    </div>
  </div>
</div>

<p style="color: var(--text-tertiary); margin-top: 1.5rem; font-size: 0.85rem;">
  This may take a moment. I will let you know when the change is applied and verified.
</p>
```

Now implement the style change in the actual code:

1. **Make the change** — Edit the actual CSS/style files to apply the approved design
2. **Check for side effects** — Ensure no other elements are unintentionally affected
3. **Proceed to STEP 5** — Verification before claiming completion

## If "adjust":

Push a text-input page to `$screen_dir/adjust.html`:

```html
<h2>What would you like to change?</h2>
<p class="subtitle">Tell me what to adjust in the preview</p>

<div class="section">
  <p>The preview showed the following change:</p>
  <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; margin-top: 0.75rem;">
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">[Recap the proposed change in plain language — e.g., "Blue buttons with rounded corners and a shadow effect"]</p>
  </div>
</div>

<div class="section">
  <h3>Common adjustments</h3>
</div>

<div class="options">
  <div class="option" data-choice="different-color" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Different color</h3>
      <p>I'd like a different color scheme</p>
    </div>
  </div>
  <div class="option" data-choice="more-subtle" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>More subtle</h3>
      <p>The change is too strong — make it softer</p>
    </div>
  </div>
  <div class="option" data-choice="more-bold" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>More bold</h3>
      <p>The change is too subtle — make it stronger</p>
    </div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Or describe exactly what to change..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

Say in terminal: **"Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`. Then generate a new preview incorporating the adjustment — loop back to STEP 3.

## If "cancel":

Push a closing page to `$screen_dir/closed.html`:

```html
<h2>Preview closed</h2>
<p class="subtitle">No changes were made</p>

<div class="progress-tracker">
  <div class="progress-step completed">Current style analyzed</div>
  <div class="progress-step completed">Preview shown</div>
  <div class="progress-step pending">No change applied</div>
</div>

<div class="section" style="margin-top: 1.5rem;">
  <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem;">
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
      The design was left unchanged. You can revisit this at any time.
    </p>
  </div>
</div>
```

Say in terminal: **"Preview closed. No changes were made."**

# STEP 5 — Verification Before Completion

<IRON-LAW>
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
</IRON-LAW>

Before pushing the "change applied" page:

1. **Verify syntax** — Check that the modified style file is syntactically valid (no unclosed braces, no typos in property names, no missing semicolons)
2. **Verify no breakage** — Read nearby styles and confirm nothing else was unintentionally affected by the change
3. **Run build/lint** — If the project has a build command, CSS linter, or style checker, run it and confirm it passes with exit code 0
4. **Verify the change matches the preview** — Re-read the modified file and confirm the values match exactly what was shown in the preview
5. **ONLY THEN** push the success page

If ANY verification step fails:
- Fix the issue
- Run verification again from the start
- Do NOT claim success without passing all checks
- Do NOT use "should work now" — RUN the verification

Update the progress page during verification. Write `$screen_dir/applying-style.html`:

```html
<h2>Applying the change</h2>
<p class="subtitle">Almost done — verifying the result</p>

<div class="progress-tracker">
  <div class="progress-step completed">Current style analyzed</div>
  <div class="progress-step completed">Preview approved</div>
  <div class="progress-step completed">Change applied</div>
  <div class="progress-step active">Verifying</div>
</div>

<div class="section" style="margin-top: 1.5rem;">
  <h3>What I am doing</h3>
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; background: rgba(52, 199, 89, 0.1); color: var(--success); font-weight: 500; font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; background: var(--success); flex-shrink: 0;"></span>
      Design updated to match the preview
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; background: rgba(52, 199, 89, 0.1); color: var(--success); font-weight: 500; font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; background: var(--success); flex-shrink: 0;"></span>
      No other areas affected
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; background: var(--selected-bg); color: var(--accent); font-weight: 500; font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; background: var(--accent); flex-shrink: 0; animation: pulse 1.5s ease-in-out infinite;"></span>
      Running final checks
    </div>
  </div>
</div>

<p style="color: var(--text-tertiary); margin-top: 1.5rem; font-size: 0.85rem;">
  Just a moment — confirming everything is correct before wrapping up.
</p>
```

After ALL verification passes, push the completion page to `$screen_dir/complete.html`:

```html
<h2>Change applied</h2>
<p class="subtitle">The design has been updated</p>

<div class="progress-tracker">
  <div class="progress-step completed">Current style analyzed</div>
  <div class="progress-step completed">Preview approved</div>
  <div class="progress-step completed">Change applied</div>
  <div class="progress-step completed">Verified</div>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[What was changed — e.g., "Button appearance"]</div>
    <div class="split">
      <div class="change-before">
        <h4>Before</h4>
        <p>[Plain language description of the old look — e.g., "Gray buttons with square corners"]</p>
      </div>
      <div class="change-after">
        <h4>After</h4>
        <p>[Plain language description of the new look — e.g., "Blue buttons with rounded corners and a subtle shadow"]</p>
      </div>
    </div>
  </div>
</div>

<!-- If multiple elements were changed, add additional change-items: -->
<!--
<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Second affected element — e.g., "Outline buttons"]</div>
    <div class="split">
      <div class="change-before">
        <h4>Before</h4>
        <p>[Old look]</p>
      </div>
      <div class="change-after">
        <h4>After</h4>
        <p>[New look]</p>
      </div>
    </div>
  </div>
</div>
-->

<div class="section">
  <h3>What was checked</h3>
  <div style="background: rgba(52, 199, 89, 0.1); border: 1px solid var(--success); border-radius: 12px; padding: 1.25rem;">
    <p style="color: var(--success); font-weight: 600; margin-bottom: 0.5rem;">All checks passed</p>
    <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">[Describe in business terms what was verified — e.g., "The new appearance matches the preview. No other screens or elements were affected. All automated checks pass."]</p>
  </div>
</div>

<div class="section">
  <h3>Visual comparison</h3>
</div>

<div class="split">
  <div class="mockup">
    <div class="mockup-header">Before</div>
    <div class="mockup-body" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
      <!-- Render the element with the OLD styles (same as the "Current look" from STEP 3) -->
      <!-- EXAMPLE: -->
      <button style="background: #6c757d; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">Place order</button>
      <button style="background: transparent; color: #6c757d; border: 1px solid #6c757d; padding: 10px 20px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">Cancel</button>
    </div>
  </div>
  <div class="mockup">
    <div class="mockup-header">After</div>
    <div class="mockup-body" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
      <!-- Render the element with the NEW styles (same as the "New look" from STEP 3) -->
      <!-- EXAMPLE: -->
      <button style="background: #0071e3; color: #fff; border: none; padding: 10px 24px; border-radius: 12px; font-size: 14px; cursor: pointer; font-family: inherit; box-shadow: 0 2px 8px rgba(0,113,227,0.3);">Place order</button>
      <button style="background: transparent; color: #0071e3; border: 1px solid #0071e3; padding: 10px 24px; border-radius: 12px; font-size: 14px; cursor: pointer; font-family: inherit;">Cancel</button>
    </div>
  </div>
</div>
```

Say in terminal: **"Change applied. Check your browser for the summary."**

# Red Flags — STOP

| Thought | Reality |
|---------|---------|
| "I'll show the CSS code in the preview" | NEVER. Show the rendered visual result. |
| "border-radius: 12px is clear enough" | Not to a non-dev. Say "more rounded corners". |
| "I know what the current style looks like" | Read the actual CSS. Don't assume. |
| "The change is simple, skip the preview" | Every change gets a preview. No exceptions. |
| "I'll just apply it without verification" | Verify BEFORE claiming success. Always. |
| "Should work now" | RUN the verification. "Should" is not evidence. |
| "The linter passed so it's fine" | Linter passing does not prove the change is correct. |
| "I'll mention the file name for context" | Translate to a screen or feature name. |
| "I'll describe the CSS properties" | Describe the visual effect: color, shape, spacing. |
| "Partial check is enough" | Partial proves nothing. Full verification or nothing. |
