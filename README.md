# a11y-audit

> **Candidates:** this repository is the AccessiBit take-home exercise. Start from
> [`CHALLENGE.md`](./CHALLENGE.md) for the rules and then [`TICKET.md`](./TICKET.md) for the task.

Minimal WCAG audit CLI. This is a small, self-contained slice of the AccessiBit
monitoring pipeline: the same rules run nightly on client sites, and several
clients also run this CLI in their own CI.

## How it is used

- **CI gate** — clients run `a11y-audit ./build` in CI. Exit code `1` fails the build.
- **Compliance evidence** — the `--json` report is archived per client and attached to
  the periodic compliance statement we deliver to them.
- **Dashboard** — the JSON report is ingested by the dashboard (`services/ingest`, not in
  this repo). See the contract note in `src/report.ts` before changing the output shape.

## Quick start

```bash
pnpm install
pnpm a11y fixtures/acme            # human-readable output, exit code 1 on findings
pnpm a11y fixtures/acme --json     # JSON report (the shape the dashboard ingests)
pnpm test
pnpm typecheck
```

Requires Node 20+ and pnpm (`corepack enable` if you don't have it). npm works too:
`npm install && npm run a11y -- fixtures/acme`.

## Layout

```
src/
  cli.ts          entry point, exit codes
  audit.ts        collects pages, runs rules, builds findings
  rules/          one file per rule (id, WCAG criterion, impact, check())
  report.ts       report shape + text formatter  ← read the contract note
  selector.ts     CSS-like path + snippet for an element
fixtures/         real-ish client pages used as test data (acme, globex)
tests/            vitest
```

## Rules

| id            | WCAG  | impact   |
| ------------- | ----- | -------- |
| img-alt       | 1.1.1 | critical |
| iframe-title  | 4.1.2 | serious  |
| link-name     | 2.4.4 | serious  |
| heading-order | 1.3.1 | moderate |

Rules are deliberately simple approximations (no full accessible-name computation,
no ARIA role handling). Adding a rule means adding a file in `src/rules/` and
registering it in `src/rules/index.ts`.
