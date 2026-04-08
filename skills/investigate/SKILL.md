---
name: investigate
description: "Bug investigation and diagnosis for non-dev users. Uses systematic root-cause analysis internally, presents findings in business language via the browser."
---

<STOP>
The browser server MUST already be running (started by the `start` skill).
You MUST have `screen_dir` and `state_dir` variables.
If you don't have them, STOP and tell the user to run `/pa:start` first.
</STOP>

# The Iron Law

```
NO DIAGNOSIS WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot present a diagnosis to the user.
Symptom-level explanations are FAILURE. Find the actual root cause.

# OUTPUT RULES

<ABSOLUTE-RULE>
ALL user-facing output goes to the browser as HTML pages. The terminal is ONLY for:
- "Check your browser. I'm investigating..."
- "Diagnosis ready. Check your browser and press Enter."
- "Still investigating..."

Your HTML pages MUST NOT contain:
- File names or paths (e.g., ConfigureScreen.vue, Controller.php)
- Variable names (e.g., dimensionX, fitsX1)
- Code snippets of any kind
- Line numbers
- Technical terms: "frontend", "backend", "API", "component", "validation", "controller", "model", "mixin", "class", "method", "function", "variable", "props", "state", "Vue", "React", "PHP", "JavaScript", "SQL", "query", "migration"

TRANSLATE everything:
- "ConfigureScreen.vue" → "the product configuration screen"
- "dimensionX validation" → "the dimension check"
- "ClientOrderManager.php" → "the order processing module"
- "frontend validation" → "the check on the ordering screen"
- "backend validation" → "the server-side check"
- "variant" → "product option" or "product reference"
- "null/undefined" → "missing information"
- "API endpoint" → "the system's communication channel"

Before writing ANY HTML file, mentally review EVERY sentence. If it contains ANY technical term, rewrite it.
</ABSOLUTE-RULE>

# STEP 1 — Push "investigating" page

Write an HTML file to `$screen_dir/investigating.html`:

```html
<h2>Investigation in progress</h2>
<p class="subtitle">I am analyzing the issue you reported</p>

<div class="progress-tracker">
  <div class="progress-step active">Phase 1 — Tracing the root cause</div>
  <div class="progress-step pending">Phase 2 — Comparing with normal behavior</div>
  <div class="progress-step pending">Phase 3 — Confirming the diagnosis</div>
  <div class="progress-step pending">Phase 4 — Presenting findings</div>
</div>

<div class="section" style="margin-top: 2rem;">
  <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem;">
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
      I am reading through the relevant parts of the system to find exactly where and why the issue occurs. I will not guess — I trace the problem back to its origin before drawing any conclusions.
    </p>
  </div>
</div>

<p style="color: var(--text-tertiary); margin-top: 1.5rem; font-size: 0.85rem;">
  This may take a few moments. I will notify you as soon as I have a confirmed diagnosis.
</p>
```

Say in terminal: **"Check your browser. I'm investigating — I'll let you know when I have results."**

# STEP 2 — Phase 1: Root Cause Investigation (INTERNAL — silent)

BEFORE attempting ANY diagnosis:

1. **Read error context carefully**
   - What exactly happened? What was expected?
   - What are the exact conditions (data, timing, user actions)?
   - Don't skip past error messages — they often contain the exact solution
   - Note line numbers, file paths, error codes for your internal use

2. **Reproduce the path**
   - Trace the user's journey through the code
   - What code path does this scenario follow?
   - What data flows through each step?
   - Can you identify the exact steps that trigger the issue?

3. **Check recent changes**
   - `git log` for related files
   - Recent commits that could have introduced the issue
   - Configuration or dependency changes
   - Environmental differences

4. **Trace data flow backward** (Root Cause Tracing)
   - Start where the bad behavior occurs
   - Ask: "What called this? What value was passed?"
   - Keep tracing UP the call chain until you find the original source
   - The ROOT CAUSE is where the bad value/logic ORIGINATES, not where it manifests

   ```
   For EACH layer boundary in the system:
     - What data enters this layer?
     - What data exits this layer?
     - Does the data transform correctly?
     - WHERE does the logic break?
   ```

5. **Gather evidence at each layer**
   - For multi-component systems: understand what enters and exits each layer
   - Identify WHERE the logic breaks (not just THAT it breaks)
   - Log your findings internally — which layer receives correct data, which layer produces wrong data

<ENFORCEMENT>
Do NOT write ANY findings in the terminal during this phase.
Do NOT push a diagnosis page yet.
You are gathering evidence. No conclusions until Phase 2.
</ENFORCEMENT>

# STEP 3 — Phase 2: Pattern Analysis (INTERNAL — silent)

1. **Find working examples** — Is there similar logic that works correctly? What's different?
2. **Compare** — List every difference between working and broken behavior, however small
3. **Understand dependencies** — What settings, configuration, or conditions affect this?
4. **Don't assume "that can't matter"** — small differences often cause bugs

Update the browser to show Phase 2 progress. Write to `$screen_dir/investigating.html`:

```html
<h2>Investigation in progress</h2>
<p class="subtitle">I am analyzing the issue you reported</p>

<div class="progress-tracker">
  <div class="progress-step completed">Phase 1 — Root cause traced</div>
  <div class="progress-step active">Phase 2 — Comparing with normal behavior</div>
  <div class="progress-step pending">Phase 3 — Confirming the diagnosis</div>
  <div class="progress-step pending">Phase 4 — Presenting findings</div>
</div>

<div class="section" style="margin-top: 2rem;">
  <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem;">
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
      I have identified a potential cause. I am now comparing it against working behavior to make sure my diagnosis is accurate.
    </p>
  </div>
</div>

<p style="color: var(--text-tertiary); margin-top: 1.5rem; font-size: 0.85rem;">
  Almost there. Verifying my findings before presenting them to you.
</p>
```

# STEP 4 — Phase 3: Hypothesis and Verification (INTERNAL — silent)

1. **Form single hypothesis** — Write it down (internally): "The root cause is X because Y"
2. **Verify against evidence** — Does your hypothesis explain ALL the symptoms?
3. **If hypothesis doesn't hold** — Form NEW hypothesis, don't force the first one
4. **Don't pretend to know** — If something is unclear, investigate more, don't guess

## The 3-Fix Rule

If you've identified 3 or more separate issues that all contribute to the problem, STOP and consider:
- Is this a systemic/architectural issue rather than individual bugs?
- Present it to the user as a broader concern, not a list of patches
- Frame it as "the way the system handles [business process] needs rethinking" rather than listing individual defects

# STEP 5 — Phase 4: Push diagnosis page to browser

Now that you have a verified root cause, write `$screen_dir/diagnosis.html`:

```html
<h2>Diagnosis</h2>
<p class="subtitle">I identified the cause of the issue</p>

<div class="progress-tracker">
  <div class="progress-step completed">Phase 1 — Root cause traced</div>
  <div class="progress-step completed">Phase 2 — Compared with normal behavior</div>
  <div class="progress-step completed">Phase 3 — Diagnosis confirmed</div>
  <div class="progress-step active">Phase 4 — Your decision</div>
</div>

<div class="section">
  <h3>The problem</h3>
  <p>[Plain language description of what goes wrong. Describe the business scenario, the expected behavior, and where the system deviates. NO technical terms.]</p>
</div>

<div class="section">
  <h3>How it happened</h3>
  <p>[Plain language explanation of the flow. Walk through what the system does step by step, in terms the user understands. Use phrases like "when you place an order", "the system checks", "the result is sent to", etc.]</p>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Business name of the affected area — e.g., "Order size verification"]</div>
    <div class="split">
      <div class="change-before">
        <h4>What happens currently</h4>
        <p>[Current broken behavior in plain business language]</p>
      </div>
      <div class="change-after">
        <h4>What should happen</h4>
        <p>[Correct behavior in plain business language]</p>
      </div>
    </div>
  </div>
</div>

<!-- If multiple related issues were found, add additional change-items: -->
<!--
<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Second affected area]</div>
    <div class="split">
      <div class="change-before">
        <h4>What happens currently</h4>
        <p>[Current behavior]</p>
      </div>
      <div class="change-after">
        <h4>What should happen</h4>
        <p>[Correct behavior]</p>
      </div>
    </div>
  </div>
</div>
-->

<!-- If 3+ issues found (3-Fix Rule triggered), add a systemic note: -->
<!--
<div class="section">
  <div style="background: rgba(255, 159, 10, 0.1); border: 1px solid var(--warning); border-radius: 12px; padding: 1.25rem;">
    <h3 style="color: var(--warning); margin-bottom: 0.5rem;">Broader concern</h3>
    <p style="font-size: 0.9rem;">[Explain that this is not just one defect but a broader issue with how the system handles this business process. Suggest that a more thorough rework of this area may be warranted rather than patching individual issues.]</p>
  </div>
</div>
-->

<div class="options">
  <div class="option" data-choice="fix" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Apply the fix</h3>
      <p>Fix the issue now</p>
    </div>
  </div>
  <div class="option" data-choice="more-info" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>I need more details</h3>
      <p>Explain more before fixing</p>
    </div>
  </div>
  <div class="option" data-choice="cancel" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>Don't fix</h3>
      <p>Not the right issue or I prefer to wait</p>
    </div>
  </div>
</div>
```

**Example of GOOD diagnosis content:**

> **The problem:** When placing an order, the system checks if the chosen frame size fits the selected product's limits. However, it checks each dimension (width and height) separately against both possible orientations. This means a frame that is too tall can still pass the check because its width fits in the other orientation. Additionally, the spacing added around the image is not included in this size check, so the final dimensions exceed the product's maximum.
>
> **How it happened:** The size check runs when the customer confirms their frame dimensions. It compares the width against the product's maximum width, and the height against the maximum height. But it also checks the reverse — width against maximum height, and height against maximum width. If either combination passes, the order goes through. The spacing (margins around the image) is added after this check, so the final size can be larger than the product allows.

**Example of BAD diagnosis content (NEVER write this):**

> "The bug is in ConfigureScreenCa.vue:476 where fitsX1 and fitsY2 are OR'd together allowing cross-axis validation. The mixin calculates dimensionX but doesn't account for the margin prop passed from the parent component."

Say in terminal: **"Diagnosis ready. Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`.

# STEP 6 — Act on user choice

Read `$state_dir/events`.

## If "fix":

Push a progress page to `$screen_dir/fixing.html`:

```html
<h2>Applying the fix</h2>
<p class="subtitle">Working on it now</p>

<div class="progress-tracker">
  <div class="progress-step completed">Phase 1 — Root cause traced</div>
  <div class="progress-step completed">Phase 2 — Compared with normal behavior</div>
  <div class="progress-step completed">Phase 3 — Diagnosis confirmed</div>
  <div class="progress-step active">Phase 4 — Implementing the fix</div>
</div>

<div class="section" style="margin-top: 1.5rem;">
  <h3>What I am doing</h3>
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; background: var(--selected-bg); color: var(--accent); font-weight: 500; font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; background: var(--accent); flex-shrink: 0; animation: pulse 1.5s ease-in-out infinite;"></span>
      Fixing the root cause of the issue
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; color: var(--text-tertiary); font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0;"></span>
      Adding safeguards to prevent recurrence
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; color: var(--text-tertiary); font-size: 0.9rem;">
      <span style="width: 1.25rem; height: 1.25rem; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0;"></span>
      Verifying everything works correctly
    </div>
  </div>
</div>

<p style="color: var(--text-tertiary); margin-top: 1.5rem; font-size: 0.85rem;">
  This may take a moment. I will let you know when the fix is complete and verified.
</p>
```

Now implement the fix:

1. **Fix at the ROOT CAUSE** — not at the symptom. If you traced data flow backward in Phase 1 and found the original source of the bad value/logic, fix it THERE.

2. **Apply defense-in-depth** — Add checks at multiple layers to make the bug structurally impossible:
   - Layer 1: Where data enters the system (reject obviously invalid input)
   - Layer 2: Where the business logic runs (ensure data makes sense for this operation)
   - Layer 3: Where the result is produced (final safety net before output)
   - All layers are necessary — different scenarios bypass different checks

3. **After implementation, VERIFY the fix actually works:**
   - Run the relevant tests
   - Check the behavior matches the "what should happen" from the diagnosis
   - Confirm no other functionality is broken
   - DO NOT claim fix is done without verification evidence

4. **If verification fails:** Return to Phase 1 with new information. Do NOT claim success.

## If "more-info":

Push a deeper explanation page to `$screen_dir/more-info.html` — STILL in business language. Use analogies the user can relate to.

```html
<h2>More details</h2>
<p class="subtitle">Here is a deeper explanation of the issue</p>

<div class="section">
  <h3>Step by step, what happens</h3>
  <p>[Walk through the business flow in numbered steps, explaining what the system does at each point and where exactly it goes wrong. Use everyday language and analogies.]</p>
  <ol style="margin-top: 0.75rem; margin-left: 1.5rem; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.8;">
    <li>[Step 1 in plain language]</li>
    <li>[Step 2 in plain language]</li>
    <li>[Step 3 — where it goes wrong, highlighted]</li>
    <li>[Step 4 — consequence]</li>
  </ol>
</div>

<div class="section">
  <h3>Why does this matter?</h3>
  <p>[Explain the business impact: what could go wrong if this is not fixed, who is affected, etc.]</p>
</div>

<div class="section">
  <h3>What the fix will change</h3>
  <p>[Explain in concrete terms what will be different after the fix, from the user's perspective.]</p>
</div>

<div class="options">
  <div class="option" data-choice="fix" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Apply the fix</h3>
      <p>I understand, go ahead and fix it</p>
    </div>
  </div>
  <div class="option" data-choice="cancel" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>Don't fix</h3>
      <p>I prefer to wait or handle this differently</p>
    </div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Ask a follow-up question..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

Say in terminal: **"More details posted. Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events` and act on the new choice.

## If "cancel":

Push a closing page to `$screen_dir/closed.html`:

```html
<h2>Investigation closed</h2>
<p class="subtitle">No changes were made</p>

<div class="progress-tracker">
  <div class="progress-step completed">Phase 1 — Root cause traced</div>
  <div class="progress-step completed">Phase 2 — Compared with normal behavior</div>
  <div class="progress-step completed">Phase 3 — Diagnosis confirmed</div>
  <div class="progress-step pending">Phase 4 — No fix applied</div>
</div>

<div class="section" style="margin-top: 1.5rem;">
  <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem;">
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
      The investigation is complete but no changes were applied. You can revisit this issue at any time.
    </p>
  </div>
</div>
```

Say in terminal: **"Investigation closed. No changes were made."**

# STEP 7 — Verification Before Completion

<IRON-LAW>
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
</IRON-LAW>

Before pushing the "fix complete" page:
1. Run the relevant tests or verification commands
2. Confirm the fix actually resolves the issue
3. Check no other functionality is broken
4. ONLY THEN push the success page

If verification fails: return to Phase 1 with new information. Do NOT claim success.

Push completion page to `$screen_dir/complete.html`:

```html
<h2>Fix applied and verified</h2>
<p class="subtitle">The issue has been resolved</p>

<div class="progress-tracker">
  <div class="progress-step completed">Phase 1 — Root cause traced</div>
  <div class="progress-step completed">Phase 2 — Compared with normal behavior</div>
  <div class="progress-step completed">Phase 3 — Diagnosis confirmed</div>
  <div class="progress-step completed">Phase 4 — Fix applied and verified</div>
</div>

<div class="section" style="margin-top: 1.5rem;">
  <h3>What was fixed</h3>
  <p>[Plain language summary of the root cause that was fixed.]</p>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Business name of the affected area]</div>
    <div class="split">
      <div class="change-before">
        <h4>Before</h4>
        <p>[What used to happen — the broken behavior]</p>
      </div>
      <div class="change-after">
        <h4>After</h4>
        <p>[What happens now — the correct behavior]</p>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <h3>Safeguards added</h3>
  <p>[Explain in business language what protections were added to prevent this issue from recurring. E.g., "The system now checks the total size including spacing before accepting the order, and a second independent check runs before the order is finalized."]</p>
</div>

<div class="section">
  <h3>Verification</h3>
  <div style="background: rgba(52, 199, 89, 0.1); border: 1px solid var(--success); border-radius: 12px; padding: 1.25rem;">
    <p style="color: var(--success); font-weight: 600; margin-bottom: 0.5rem;">All checks passed</p>
    <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">[Describe in business terms what was verified. E.g., "Orders with oversized frames are now correctly rejected. Existing orders with valid sizes continue to work normally. All automated checks pass."]</p>
  </div>
</div>
```

Say in terminal: **"Fix complete. Check your browser for the summary."**

# Red Flags — STOP and return to Phase 1

If you catch yourself:
- Presenting a diagnosis without tracing the root cause
- Describing symptoms instead of causes
- Saying "probably" or "might be" in your diagnosis
- Proposing a fix before completing investigation
- Skipping pattern analysis (Phase 2)
- Making the diagnosis about code instead of business behavior
- Claiming fix works without running verification
- Fixing where the error APPEARS instead of where it ORIGINATES
- Adding more fixes on top of failed fixes instead of re-investigating
- Listing 3+ separate patches without considering systemic issues

**ALL of these mean: STOP. Return to the appropriate phase.**

**If 3+ fix attempts have failed:** This is not a series of bugs — this is an architectural issue. Present it to the user as a broader concern that needs rethinking, not more patches.
