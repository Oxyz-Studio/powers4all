---
name: explain
description: "Answer functional questions about the application in business language via the browser. Verifies understanding against actual code before presenting. Uses visual diagrams, flow charts, and clear language."
---

<STOP>
The browser server MUST already be running (started by the `start` skill).
You MUST have `screen_dir` and `state_dir` variables.
If you don't have them, STOP and tell the user to run `/pa:start` first.
</STOP>

# The Iron Law

```
NO EXPLANATION WITHOUT VERIFIED UNDERSTANDING FIRST
```

If you haven't read and understood the actual code, you cannot explain it to the user.
Guesses and assumptions are FAILURE. Verify against the source code.

# OUTPUT RULES

<ABSOLUTE-RULE>
ALL user-facing output goes to the browser as HTML pages. The terminal is ONLY for:
- "Check your browser. I'm researching your question..."
- "Explanation ready. Check your browser and press Enter."
- "Still researching..."

Your HTML pages MUST NOT contain:
- File names or paths (e.g., ConfigureScreen.vue, Controller.php, Manager.php)
- Variable names (e.g., dimensionX, fitsX1, tunnelConfig)
- Code snippets of any kind
- Line numbers (e.g., "line 456")
- Technical terms: "frontend", "backend", "API", "component", "validation", "controller", "model", "mixin", "class", "method", "function", "variable", "props", "state", "Vue", "React", "PHP", "JavaScript", "SQL", "query", "migration", "endpoint", "middleware"

TRANSLATE everything to business language:
- "ConfigureScreen.vue" → "the product configuration screen"
- "dimensionX validation" → "the dimension check"
- "ClientOrderManager.php" → "the order processing module"
- "frontend validation" → "the check on the ordering screen"
- "backend validation" → "the server-side check"
- "variant" → "product option"
- "API endpoint" → "the system's communication channel"
- "database query" → "the information lookup"
- "middleware" → "the processing step"

Before writing ANY HTML file, mentally review EVERY sentence. If it contains ANY technical term, rewrite it.
</ABSOLUTE-RULE>

# STEP 1 — Push "researching" page

Write `$screen_dir/researching.html`:

```html
<h2>Researching your question</h2>
<p class="subtitle">I'm looking into how this works</p>

<div class="progress-tracker">
  <div class="progress-step active">Understanding the question</div>
  <div class="progress-step pending">Reading the relevant parts</div>
  <div class="progress-step pending">Verifying my understanding</div>
  <div class="progress-step pending">Preparing the explanation</div>
</div>

<p style="color: var(--text-secondary); margin-top: 1.5rem; font-size: 0.85rem;">
  This may take a moment. I'll have an answer for you shortly.
</p>
```

Say in terminal: **"Check your browser. I'm researching your question..."**

# STEP 2 — Research (INTERNAL — silent)

## Phase 1: Understand the question
- What exactly is the user asking?
- What level of detail do they need?
- What context do they already have?

## Phase 2: Find and read the code
- Use Grep, Glob, Read to locate the feature/system
- Read the ACTUAL implementation — not just file names or structure
- Trace the complete flow from start to finish

## Phase 3: Trace the flow
- Follow the code path to understand how data moves through the system
- Note each transformation, check, or decision point
- Identify where user actions trigger system behavior

## Phase 4: Verify your understanding
Cross-check your understanding:
- Does your mental model match what the code actually does?
- Are there edge cases or special conditions?
- Is there documentation or tests that confirm your understanding?
- If something surprises you, dig deeper — don't gloss over it

<ENFORCEMENT>
Do NOT write ANY findings in the terminal. Just "Still researching..." if needed.
Do NOT present an explanation until you've completed ALL 4 phases.
If you're not sure about something, read more code. Don't guess.
</ENFORCEMENT>

## Verification Checklist (INTERNAL — before presenting)

Before pushing the explanation page, verify:
- [ ] I read the actual code, not just file names or structure
- [ ] I traced the complete flow, not just the entry point
- [ ] I can explain what happens at each step
- [ ] I checked for edge cases and special conditions
- [ ] My explanation is consistent with what the code actually does
- [ ] I'm not making assumptions about parts I didn't read

If any checkbox fails: go back and read more code. Do NOT present an unverified explanation.

# STEP 3 — Push explanation page

Write `$screen_dir/explanation.html`. Adapt the format to the question type:

## For "How does X work?" — step-by-step flow:

```html
<h2>How [feature name] works</h2>
<p class="subtitle">Here's the step-by-step process</p>

<div class="progress-tracker">
  <div class="progress-step completed">1. [First step — e.g., "The user fills in the order form"]</div>
  <div class="progress-step completed">2. [Second step — e.g., "The system checks the dimensions against the product limits"]</div>
  <div class="progress-step completed">3. [Third step — e.g., "If everything fits, the order is saved"]</div>
  <div class="progress-step completed">4. [Fourth step — e.g., "A confirmation email is sent"]</div>
</div>

<div class="section">
  <h3>Important details</h3>
  <p>[Additional context — edge cases, conditions, special behaviors — all in plain language]</p>
</div>

<div class="section">
  <h3>What this means in practice</h3>
  <p>[Practical implications — what the user sees, what can go wrong, what to watch for]</p>
</div>
```

## For "How to do X?" — numbered instructions:

```html
<h2>How to [action]</h2>
<p class="subtitle">Follow these steps</p>

<div class="options">
  <div class="option">
    <div class="letter">1</div>
    <div class="content">
      <h3>[Action to take]</h3>
      <p>[Detailed description of the step, what the user should see]</p>
    </div>
  </div>
  <div class="option">
    <div class="letter">2</div>
    <div class="content">
      <h3>[Next action]</h3>
      <p>[Detailed description]</p>
    </div>
  </div>
  <div class="option">
    <div class="letter">3</div>
    <div class="content">
      <h3>[Final action]</h3>
      <p>[What to expect when done]</p>
    </div>
  </div>
</div>
```

## For "What is X?" — explanation with context:

```html
<h2>[Feature name]</h2>
<p class="subtitle">[One-sentence definition in plain language]</p>

<div class="section">
  <h3>What it does</h3>
  <p>[Role and purpose — what problem it solves, why it exists]</p>
</div>

<div class="section">
  <h3>How it's used</h3>
  <p>[Concrete use cases — when and why someone would interact with this]</p>
</div>

<div class="section">
  <h3>How it connects to other features</h3>
  <p>[Relationships with other parts of the system, in business terms]</p>
</div>
```

## For complex explanations — use multiple pages

If the topic is large, break it into overview + detail pages. Push one at a time, asking after each if the user wants to go deeper.

Tell user: **"Explanation ready. Check your browser and press Enter when done."**

# STEP 4 — Follow-up

Always end with follow-up options:

```html
<div class="options" style="margin-top: 2rem;">
  <div class="option" data-choice="more-detail" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>I need more details</h3>
      <p>Go deeper on a specific aspect</p>
    </div>
  </div>
  <div class="option" data-choice="another-question" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>I have another question</h3>
      <p>Ask about something else</p>
    </div>
  </div>
  <div class="option" data-choice="done" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>That's clear, thanks</h3>
      <p>I understand what I needed to know</p>
    </div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Or ask your follow-up question here..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

Read `$state_dir/events`:
- **more-detail**: Research deeper on the specific aspect. Push a more detailed page. VERIFY against code again before presenting.
- **another-question**: Loop back to STEP 1 with the new question.
- **done**: Push a brief closing page:

```html
<h2>Got it!</h2>
<p class="subtitle">Glad I could help</p>
<p style="color: var(--text-secondary);">If you have more questions later, just run <code>/pa:start</code> again.</p>
```

# Red Flags — STOP and verify more

| Thought | Reality |
|---------|---------|
| "I think this is how it works" | Read the code. VERIFY. Don't think — know. |
| "It probably does X" | "Probably" = you haven't checked. Go read. |
| "Based on the file name, it likely..." | File names lie. Read the implementation. |
| "I'll explain the general pattern" | Explain what THIS code does, not general patterns. |
| "The user won't notice if I'm slightly wrong" | Wrong explanations destroy trust. Verify. |
| "I'll use technical terms just this once" | No. Translate to business language. Always. |
| "This is taking too long, I'll present what I have" | Incomplete understanding = wrong explanation. Keep reading. |
| "I'll just describe the architecture" | Describe the BEHAVIOR, not the architecture. |
