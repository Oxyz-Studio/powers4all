---
name: using-pa
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
| `start` | Any new request from the user — bug, question, style change, feature |
| `investigate` | Bug investigation and diagnosis |
| `explain` | Answering functional questions about the application |
| `preview` | Previewing style or visual changes |
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
