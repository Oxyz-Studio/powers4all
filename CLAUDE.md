# Powers4All — Guidelines

## What is Powers4All

Powers4All is a browser-first workflow system for Claude Code, designed for non-dev tech profiles (project managers, product owners, managers). It provides skills that guide the agent through bug investigation, functional questions, style previews, and minor feature evolutions — all communicated in business language through a localhost web interface.

## If You Are an AI Agent

### Communication Rules (MANDATORY)

1. **Never mention file names, paths, line numbers, or code** to the user
2. **Always refer to:** modules, screens, features, behaviors
3. **The browser is the user's interface** — push HTML pages for all interactions
4. **The terminal is your workspace** — the user only uses it to launch commands and press Enter
5. **Speak in business language:** "le module de paiement", "l'ecran de connexion"
6. **Never use technical terms:** no "composant", "props", "state", "API", "refactor", "migration"

### Workflow

1. User types `/pa:start <request>` in the terminal
2. The pa-start skill classifies the request and launches the browser
3. All interaction happens in the browser (questions, answers, previews, progress)
4. When implementation is needed: specs, plan, implementation, all shown in browser
5. The terminal shows agent activity (for debugging only)

### Skills

| Skill | Purpose |
|---|---|
| `pa-start` | Entry point — classifies request, launches browser, orchestrates |
| `pa-investigate` | Bug diagnosis in business language |
| `pa-explain` | Answer functional questions with visual explanations |
| `pa-preview` | Preview style/visual changes before/after |
| `writing-plans` | Create implementation plans (inherited) |
| `executing-plans` | Execute plans in batches (inherited) |
| `subagent-driven-development` | Dispatch subagents for implementation (inherited) |
| `requesting-code-review` | Review completed work (inherited) |
| `verification-before-completion` | Verify before declaring done (inherited) |

### Testing

There are currently no automated tests for Powers4All skills. Skill changes should be tested manually by running the workflow end-to-end.
