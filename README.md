# TeamPulse — Frontend Intern Assignment

A React + TypeScript team activity dashboard. Your job is to find and fix the bugs, then build a new feature.

## Getting Started

1. Install dependencies and run:

```bash
npm install
npm run dev
```

The app will open at `http://localhost:5173`. Poke around, open the browser console, resize the viewport, and start finding bugs.

2. Create your own private GitHub repository and push your work there — this is what you submit.

## Your Tasks

1. **Find and fix bugs** — The app compiles and runs, but is riddled with bugs. Some are obvious; others are subtle. Some are connected — fixing one may reveal another. It's up to you to discover what's broken and how deep it goes.

2. **Build the Search feature** — The "Search Comments" feature in the sidebar is a non-functional placeholder. Build it from scratch following the requirements on the assignment page.

3. **Write a bug report** — Document each bug you find and fix.

## Constraints

- No external UI component libraries (no MUI, shadcn, Chakra, Radix)
- No external utility libraries (no lodash, no react-window, no headless UI)
- React, TypeScript, and standard browser/DOM APIs only
- Raw CSS or CSS Modules for styling

## Deliverables

1. **GitHub repo link** — your own repo, created from this zip
2. **Deployed link** — Vercel / Netlify / etc.
3. **README.md** — choices, approach, trade-offs, and what you'd improve with more time
4. **BUG_REPORT.md** — see format below
5. **FEATURE_NOTES.md** — brief notes on your search implementation approach
6. **Time log** — approximate hours spent (honor system)
7. **Git commit history** — your first commit should be the original codebase unchanged. Each subsequent commit should correspond to one bug fix. Commit messages must describe the symptom you observed (e.g. "fix: timer freezes after first tick" not "fix bug 1").

**Partial submissions are totally acceptable.** If you run out of time, submit what you have and note in README.md what's remaining and what you would do next.

## BUG_REPORT.md Format

Use this template for **each** bug you find. Copy it once per bug.

```markdown
## Bug N — [Short descriptive name]

- **Exact error / console output:** (paste verbatim — e.g. "Uncaught TypeError: Cannot read properties of null (reading 'name')" — write "no console error" if it was a silent visual bug)
- **Steps to reproduce:**
  1. Open the app at localhost:5173
  2. [exact element you clicked / action you took]
  3. [what you observed]
- **Viewport / device tested:** (e.g. 1280×800 desktop Chrome / 375px mobile)
- **Symptom — what you saw:** (describe what was actually happening)
- **Root cause — the why:** (explain the underlying JS/React/CSS reason, not just "it was wrong")
- **Fix and why it works:**
- **Connected to another bug?** yes/no — if yes, which one and what's the connection
```

> We care about your **explanations** as much as your fixes. A correct fix with a wrong explanation scores less than a correct fix with a correct explanation.

## Stack

- React 18
- TypeScript
- Vite
- Raw CSS (no Tailwind)
