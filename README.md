# Pedlai

A focused task board built with **Vite + React + TypeScript**. Add tasks with a
priority, track progress, filter by status, and everything persists locally in
the browser via `localStorage`.

## Requirements

- Node.js 22.x
- npm 10.x

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
```

## Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the Vite dev server (host `0.0.0.0`).  |
| `npm run build`     | Type-check and produce a production build.   |
| `npm run preview`   | Preview the production build locally.        |
| `npm run lint`      | Lint the codebase with ESLint.               |
| `npm run typecheck` | Type-check without emitting output.          |
| `npm test`          | Run the unit tests with Vitest.              |

## Project structure

```
src/
  App.tsx        # UI: composer, filters, task list, stats
  App.css        # component styling
  useTasks.ts    # task state + localStorage persistence hook
  types.ts       # shared types
  useTasks.test.ts
  test/setup.ts  # Vitest / Testing Library setup
```

## Cloud Agent environment

This repository is configured for Cursor Cloud Agents via
[`.cursor/environment.json`](.cursor/environment.json). The `install` step runs
`npm ci` (falling back to `npm install` when no lockfile is present) and the dev
server is started as a named `dev` terminal.
