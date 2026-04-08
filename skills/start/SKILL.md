---
name: start
description: "Entry point for all Powers4All requests. Classifies the request, launches the browser interface, and orchestrates the workflow. Use for ANY user request."
---

<STOP>
DO NOT DO ANYTHING ELSE BEFORE COMPLETING STEP 1.
DO NOT investigate, search, read files, or explore the codebase.
DO NOT write any analysis in the terminal.
Your VERY FIRST action must be launching the browser server.
</STOP>

# OUTPUT RULES

<ABSOLUTE-RULE>
ALL user-facing output goes to the browser as HTML pages. The terminal is ONLY for:
- "Open this URL in your browser: http://localhost:PORT — then press Enter here."
- "Check your browser and press Enter when done."
- "Investigating..." / "Working on it..."

Your HTML pages MUST NOT contain ANY technical terms — see the investigate skill for the full forbidden terms list and translation table. You speak to a non-technical user about modules, screens, features, and behaviors.

FORBIDDEN in any HTML page you write:
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

Before writing ANY HTML file, mentally review EVERY sentence. If it contains ANY technical term, rewrite it.
</ABSOLUTE-RULE>

# STEP 1 — Launch browser server (MANDATORY FIRST ACTION)

Find the plugin root and launch the server:

```bash
PA_ROOT="$(find ~/.claude/plugins/cache -path '*/pa/*/hooks/hooks.json' 2>/dev/null | head -1 | xargs dirname | xargs dirname)"
"$PA_ROOT/scripts/start-server.sh" --project-dir "$(pwd)"
```

If that fails, try:
```bash
PA_ROOT="$(find ~/.claude/plugins/cache -name 'start-server.sh' -path '*/pa/*' 2>/dev/null | head -1 | xargs dirname | xargs dirname)"
"$PA_ROOT/scripts/start-server.sh" --project-dir "$(pwd)"
```

Save `screen_dir` and `state_dir` from the JSON output.

Tell user: **"Open this URL in your browser: http://localhost:PORT — then press Enter here."**

Wait for Enter.

<STOP>
DO NOT PROCEED until the server is running and you have screen_dir and state_dir.
If the server failed, fix it and retry. DO NOT skip the browser.
</STOP>

# STEP 2 — Push welcome page

Write `$screen_dir/welcome.html` that restates the user's request in business language, confirms understanding, and — if the request is ambiguous — asks ONE clarifying question with clickable options plus a text input for free-text.

Use this template:

```html
<h2>Your request</h2>
<p class="subtitle">Here is what I understood</p>

<div class="chat">
  <div class="chat-message chat-user">
    <div class="chat-avatar">You</div>
    <div class="chat-bubble">[Restate the user's request in their own words]</div>
  </div>
  <div class="chat-message chat-agent">
    <div class="chat-avatar">PA</div>
    <div class="chat-bubble">[Your response — confirm understanding OR ask ONE clarifying question]</div>
  </div>
</div>

<!-- If the request is clear, offer a simple confirmation -->
<div class="options">
  <div class="option" data-choice="confirmed" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>That's right, go ahead</h3><p>I confirm this is what I need</p></div>
  </div>
  <div class="option" data-choice="clarify" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content"><h3>Not quite — let me clarify</h3><p>I want to add or change something</p></div>
  </div>
</div>

<!-- If the request is ambiguous, replace the options above with specific choices -->
<!--
<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>[Option A]</h3><p>[Description]</p></div>
  </div>
  <div class="option" data-choice="b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content"><h3>[Option B]</h3><p>[Description]</p></div>
  </div>
</div>
-->

<div class="text-input-form">
  <textarea id="user-input" placeholder="Or describe in your own words..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

Then say in terminal: **"Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events` if it exists.

# STEP 3 — Classify the request

Based on the request and any clarification, classify:

| Type | Signals | Action |
|---|---|---|
| **bug** | "doesn't work", "error", "broken", "problem", "crash", "stuck", "wrong result" | Go to STEP 4A |
| **question** | "how does", "how to", "what is", "explain", "why does", "where is" | Go to STEP 4B |
| **style** | "color", "design", "font", "size", "rounded", "spacing", "look", "visual", "layout" | Go to STEP 4C |
| **evolution** | "add", "new feature", "I want", "it should", "could we", "change the behavior", "create" | Go to STEP 4D |

If the classification is unclear, push a clarification page with the possible interpretations as clickable options. Do not guess.

# STEP 4A — Bug: Invoke investigate skill

Invoke the `investigate` skill. It will handle the full root-cause investigation process and push results to the browser.

After the investigate skill completes, go to STEP 5.

# STEP 4B — Question: Invoke explain skill

Invoke the `explain` skill. It will research the codebase and push visual explanations to the browser.

After the explain skill completes, go to STEP 5.

# STEP 4C — Style: Invoke preview skill

Invoke the `preview` skill. It will generate before/after previews in the browser.

After the preview skill completes, go to STEP 5.

# STEP 4D — Evolution: Brainstorming

<HARD-GATE>
Do NOT start implementation before the user has approved a design.
This applies to EVERY evolution, however simple it seems.
"Simple" changes are where unexamined assumptions cause the most wasted work.
The design can be short for truly simple requests, but you MUST present it and get approval.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every evolution goes through this process. A label change, a button addition, a new column — all of them. You MUST present a design and get approval. The brainstorming may be brief (one question, one approach, one confirmation page) but you cannot skip it.

## Phase 1: Understand

Explore the codebase silently (say "Investigating..." in the terminal — nothing else). Then push clarifying questions ONE AT A TIME to the browser.

Rules:
- One question per page. Never batch questions.
- Prefer multiple-choice questions with clickable options.
- Always include a text input for open-ended responses.
- Focus on: purpose, constraints, success criteria.
- Maximum 3 questions before proposing approaches.
- If the request is already clear from the welcome page, skip to Phase 2.

Use this template for each question page:

```html
<h2>One more thing</h2>
<p class="subtitle">I want to make sure I build the right thing</p>

<div class="section">
  <p>[Context for why you're asking — what you've understood so far, and what's still unclear]</p>
</div>

<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>[Option A]</h3><p>[Description in business terms]</p></div>
  </div>
  <div class="option" data-choice="b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content"><h3>[Option B]</h3><p>[Description in business terms]</p></div>
  </div>
  <div class="option" data-choice="c" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content"><h3>[Option C]</h3><p>[Description in business terms]</p></div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Or describe in your own words..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

After each question, say in terminal: **"Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`.

## Phase 2: Propose approaches

Push a page with 2-3 approaches. Lead with your recommended option and explain why. Show trade-offs for each.

```html
<h2>Approaches</h2>
<p class="subtitle">Here are the options I see — I recommend Option A</p>

<div class="section">
  <h3>My recommendation: [Approach name]</h3>
  <p>[Why this is the best approach — in business terms, focusing on user impact]</p>
</div>

<div class="options">
  <div class="option" data-choice="approach-a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>[Approach A — the recommended one]</h3>
      <p>[One-line description]</p>
    </div>
  </div>
  <div class="option" data-choice="approach-b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>[Approach B — the alternative]</h3>
      <p>[One-line description]</p>
    </div>
  </div>
  <div class="option" data-choice="approach-c" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content">
      <h3>[Approach C — if there's a third]</h3>
      <p>[One-line description]</p>
    </div>
  </div>
</div>

<!-- Show trade-offs for each approach -->
<div class="section" style="margin-top: 1.5rem;">
  <h3>Trade-offs at a glance</h3>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">Option A — [Approach name]</div>
    <div class="split" style="padding: 1rem;">
      <div class="pros">
        <h4>Advantages</h4>
        <ul>
          <li>[Pro 1]</li>
          <li>[Pro 2]</li>
        </ul>
      </div>
      <div class="cons">
        <h4>Limitations</h4>
        <ul>
          <li>[Con 1]</li>
          <li>[Con 2]</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="change-item">
    <div class="change-location">Option B — [Approach name]</div>
    <div class="split" style="padding: 1rem;">
      <div class="pros">
        <h4>Advantages</h4>
        <ul>
          <li>[Pro 1]</li>
          <li>[Pro 2]</li>
        </ul>
      </div>
      <div class="cons">
        <h4>Limitations</h4>
        <ul>
          <li>[Con 1]</li>
          <li>[Con 2]</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Or suggest a different approach..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

Say in terminal: **"Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`.

## Phase 3: Present design

Once an approach is chosen, present the design in sections. Scale each section to its complexity: a few sentences if straightforward, more detail if nuanced.

For simple evolutions, one page with all sections is fine. For complex ones, use one page per section and get approval after each.

Rules:
- Each section describes WHAT will change in business terms.
- After each section (or after the full page for simple evolutions), ask "Does this look right?"
- Cover: what changes, what stays the same, what the user will see differently.
- YAGNI ruthlessly — remove unnecessary features from the design.
- Be ready to go back and revise if something doesn't make sense.

```html
<h2>Proposed design</h2>
<p class="subtitle">Here is what will change — section by section</p>

<div class="progress-tracker">
  <div class="progress-step active">Design review</div>
  <div class="progress-step pending">Your approval</div>
  <div class="progress-step pending">Implementation</div>
  <div class="progress-step pending">Done</div>
</div>

<div class="section">
  <h3>What changes</h3>
  <p>[Describe the new behavior in business terms. What will the user see or experience differently?]</p>
</div>

<div class="section">
  <h3>What stays the same</h3>
  <p>[Reassure the user that existing functionality is preserved. List anything they might worry about.]</p>
</div>

<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Affected screen or feature name]</div>
    <div class="split">
      <div class="change-before">
        <h4>Today</h4>
        <p>[Current behavior in business terms]</p>
      </div>
      <div class="change-after">
        <h4>After the change</h4>
        <p>[New behavior in business terms]</p>
      </div>
    </div>
  </div>
</div>

<!-- Repeat change-item blocks for each affected area -->

<div class="options" style="margin-top: 1.5rem;">
  <div class="option" data-choice="approve" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>Looks good, go ahead</h3><p>Approve the design and start implementation</p></div>
  </div>
  <div class="option" data-choice="modify" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content"><h3>Almost — I want to change something</h3><p>Tell me what to adjust</p></div>
  </div>
  <div class="option" data-choice="restart" onclick="toggleSelect(this)">
    <div class="letter">C</div>
    <div class="content"><h3>Let's rethink this</h3><p>Go back to the approaches</p></div>
  </div>
  <div class="option" data-choice="cancel" onclick="toggleSelect(this)">
    <div class="letter">D</div>
    <div class="content"><h3>Cancel</h3><p>I don't want to make this change</p></div>
  </div>
</div>

<div class="text-input-form">
  <textarea id="user-input" placeholder="Or tell me what to adjust..."></textarea>
  <button onclick="submitTextInput()">Send</button>
</div>
```

Say in terminal: **"Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`.

Handle the response:
- **approve**: Proceed to Phase 4.
- **modify**: Push a revised design page incorporating the feedback. Loop back to the beginning of Phase 3.
- **restart**: Loop back to Phase 2.
- **cancel**: Push a closing page, go to STEP 5.

## Phase 4: Spec self-review, then implement

Before proceeding, perform a silent self-review of the design:

1. **Placeholder scan:** Any "TBD", "TODO", vague requirements? Fix them.
2. **Internal consistency:** Do the sections contradict each other? Does the approach match the design details?
3. **Scope check:** Is this focused enough for a single implementation cycle, or does it need decomposition into sub-projects?
4. **Ambiguity check:** Could any requirement be interpreted two different ways? If so, pick one and make it explicit.
5. **YAGNI check:** Is every element of the design necessary to meet the stated goal? Remove anything that isn't.

Fix any issues found. No need to re-present to the user unless changes are substantial.

Then write the spec to `docs/powers4all/specs/YYYY-MM-DD-<feature-name>-design.md` in business language, and push a summary page:

```html
<h2>Ready to build</h2>
<p class="subtitle">Here is a summary of everything we agreed on</p>

<div class="progress-tracker">
  <div class="progress-step completed">Design review</div>
  <div class="progress-step completed">Your approval</div>
  <div class="progress-step active">Implementation</div>
  <div class="progress-step pending">Done</div>
</div>

<div class="section">
  <h3>What I will do</h3>
  <ul style="margin-left: 1.25rem; color: var(--text-secondary); font-size: 0.9rem;">
    <li>[Change 1 in business terms]</li>
    <li>[Change 2 in business terms]</li>
    <li>[Change 3 in business terms]</li>
  </ul>
</div>

<div class="options">
  <div class="option" data-choice="go" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>Go ahead</h3><p>Start the implementation now</p></div>
  </div>
  <div class="option" data-choice="wait" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content"><h3>Wait</h3><p>I want to review something first</p></div>
  </div>
</div>
```

Say in terminal: **"Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`.

If **go**: Invoke the `writing-plans` skill to create the implementation plan. After the plan is written, invoke `subagent-driven-development` or `executing-plans` depending on user choice. Push progress updates to the browser during implementation.

If **wait**: Wait for the user to come back and indicate readiness.

During implementation, push progress pages to the browser:

```html
<h2>Implementation in progress</h2>
<p class="subtitle">I am building what we agreed on</p>

<div class="progress-tracker">
  <div class="progress-step completed">Design review</div>
  <div class="progress-step completed">Your approval</div>
  <div class="progress-step active">Implementation</div>
  <div class="progress-step pending">Done</div>
</div>

<div class="section">
  <h3>Progress</h3>
  <ul style="margin-left: 1.25rem; color: var(--text-secondary); font-size: 0.9rem;">
    <li style="color: var(--success);">[Completed step 1]</li>
    <li style="color: var(--success);">[Completed step 2]</li>
    <li style="color: var(--accent); font-weight: 500;">[Currently working on...]</li>
    <li style="color: var(--text-tertiary);">[Upcoming step]</li>
  </ul>
</div>

<p style="color: var(--text-secondary); margin-top: 1.5rem; font-size: 0.85rem;">
  This may take a moment. I will let you know as soon as it's done.
</p>
```

# STEP 5 — End session

Push a final summary page showing what was accomplished:

```html
<h2>Done</h2>
<p class="subtitle">Here is a summary of what was accomplished</p>

<div class="progress-tracker">
  <div class="progress-step completed">[Step 1 name]</div>
  <div class="progress-step completed">[Step 2 name]</div>
  <div class="progress-step completed">[Step 3 name]</div>
  <div class="progress-step completed">Done</div>
</div>

<div class="section">
  <h3>What was done</h3>
  <p>[Summary in business terms — what changed, what was fixed, what was answered]</p>
</div>

<!-- For evolutions and bugs, show before/after -->
<div class="change-summary">
  <div class="change-item">
    <div class="change-location">[Affected area]</div>
    <div class="split">
      <div class="change-before">
        <h4>Before</h4>
        <p>[Previous behavior]</p>
      </div>
      <div class="change-after">
        <h4>After</h4>
        <p>[New behavior]</p>
      </div>
    </div>
  </div>
</div>

<div class="options" style="margin-top: 1.5rem;">
  <div class="option" data-choice="new-request" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>I have another request</h3><p>Start a new conversation</p></div>
  </div>
  <div class="option" data-choice="done" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content"><h3>I'm done</h3><p>Close the session</p></div>
  </div>
</div>
```

Say in terminal: **"Check your browser and press Enter when done."**

Wait for Enter. Read `$state_dir/events`.

- If **new-request**: Loop back to STEP 2 with the new request.
- If **done**: Stop the server:

```bash
"$PA_ROOT/scripts/stop-server.sh" "$SESSION_DIR"
```

# Red Flags — You're cutting corners

| Thought | Reality |
|---------|---------|
| "Let me just answer in the terminal" | Push it to the browser. ALL output goes to the browser. |
| "This evolution is too simple for brainstorming" | Simple = where assumptions cause most waste. Follow the full process. |
| "I'll skip the clarifying questions" | You don't understand the request well enough. Ask. One at a time. |
| "The user probably wants X" | Ask, don't assume. Push a question page. |
| "I'll show them the code change" | Describe in business terms. They don't read code. |
| "Let me just implement it quickly" | Design first. Always. HARD-GATE. |
| "I'll ask multiple questions at once" | One question per page. Always. |
| "This file name provides useful context" | Translate to a module or feature name. |
| "I'll present the design and implement in one step" | Present design, wait for approval, THEN implement. Separate steps. |
| "Let me skip the approaches and jump to the design" | 2-3 approaches with trade-offs first. The user picks. |
