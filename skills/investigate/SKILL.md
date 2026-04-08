---
name: investigate
description: "Bug investigation and diagnosis for non-dev users. Explores code, identifies root cause, presents diagnosis in business language via the browser, proposes and implements fix after user approval."
---

<STOP>
The browser server MUST already be running (started by the `start` skill).
You MUST have `screen_dir` and `state_dir` variables.
If you don't have them, STOP and tell the user to run `/pa:start` first.
</STOP>

# STEP 1 — Push "investigating" page

Write an HTML file to `$screen_dir/investigating.html`:

```html
<h2>Investigation in progress</h2>
<p class="subtitle">I am analyzing the issue you reported</p>

<div class="progress-tracker">
  <div class="progress-step active">Analyzing the issue</div>
  <div class="progress-step pending">Identifying the cause</div>
  <div class="progress-step pending">Proposing a fix</div>
  <div class="progress-step pending">Applying the fix</div>
</div>

<p style="color: var(--text-secondary); margin-top: 1.5rem; font-size: 0.85rem;">
  This may take a moment. I will let you know as soon as I find something.
</p>
```

Say in terminal: **"Check your browser. I'm investigating — I'll let you know when I have results."**

# STEP 2 — Investigate silently

Use Grep, Glob, Read, Agent tools to explore the codebase and find the root cause.

<ENFORCEMENT>
Do NOT write ANY findings in the terminal. No code, no file names, no analysis.
The ONLY thing you may say in the terminal is "Still investigating..." if it takes long.
ALL findings go to the browser in Step 3.
</ENFORCEMENT>

# STEP 3 — Push diagnosis page

Write a NEW HTML file to `$screen_dir/diagnosis.html`.

<ABSOLUTE-RULE>
YOUR HTML PAGE MUST NOT CONTAIN ANY OF THESE — CHECK BEFORE WRITING:
- File names or paths (e.g., ConfigureScreen.vue, Controller.php, Manager.php)
- Variable names (e.g., dimensionX, fitsX1, tunnelConfig)
- Code snippets of any kind
- Line numbers (e.g., "line 456")
- Technical terms: "frontend", "backend", "API", "component", "validation", "controller", "model", "mixin", "class", "method", "function", "variable", "props", "state", "Vue", "React", "PHP", "JavaScript", "SQL"

TRANSLATE everything to business language:
- "ConfigureScreen.vue" → "the product configuration screen"
- "dimensionX validation" → "the dimension check"
- "ClientOrderManager.php" → "the order processing module"
- "fitsX1 || fitsX2" → "the size verification"
- "frontend validation" → "the check on the ordering screen"
- "backend validation" → "the server-side check"
- "variant" → "product option"
- "the condition at line 476" → "the size comparison logic"

Before writing the file, mentally review EVERY sentence. If it contains ANY technical term, rewrite it.
</ABSOLUTE-RULE>

Use this HTML structure:

```html
<h2>Diagnosis</h2>
<p class="subtitle">I identified the cause of the issue</p>

<div class="progress-tracker">
  <div class="progress-step completed">Issue analyzed</div>
  <div class="progress-step completed">Cause identified</div>
  <div class="progress-step active">Proposed fix</div>
  <div class="progress-step pending">Fix applied</div>
</div>

<div class="section">
  <h3>The problem</h3>
  <p>[Plain language description — e.g., "When ordering a frame, the system checks if the dimensions fit the selected product. However, it checks each dimension separately against both axes of the product limits, which means a frame that is too tall can still pass if its width fits."]</p>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Business name — e.g., "Order size verification"]</div>
    <div class="split">
      <div class="change-before">
        <h4>Current behavior</h4>
        <p>[What happens now in plain language]</p>
      </div>
      <div class="change-after">
        <h4>After fix</h4>
        <p>[What will happen after in plain language]</p>
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

Then say in terminal: **"Diagnosis ready. Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`.

# STEP 4 — Act on user choice

- **fix**: Implement, push progress page, then push completion summary
- **more-info**: Push deeper explanation page (STILL in business language), ask again
- **cancel**: Push closing page
