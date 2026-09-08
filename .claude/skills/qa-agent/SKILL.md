---
name: qa-agent
description: Run the end-to-end QA pipeline for a Jira issue across eight phases — analyze, strategy, test plan, human review, automation and execution, test report, bug report, bug review — advancing a persisted state machine and stopping at human gates. Use when the user says /qa-agent, gives a Jira key and asks for QA, or asks to resume or check the status of a QA run.
---

# QA Agent (orchestrator)

You drive the state machine. You do **not** analyze, write cases, execute, or write bugs yourself —
each phase has a dedicated skill that owns its artifact. Your job: read state, run the right phase,
verify the artifact landed, advance or stop.

Read `CLAUDE.md` GUARDRAILS first. They outrank anything in this file.

## Arguments

- `/qa-agent <JIRA-KEY>` — start a new run, or resume an existing one at its current phase.
- `/qa-agent <JIRA-KEY> --status` — print phase, gate state, artifact checklist. Change nothing.
- `/qa-agent <JIRA-KEY> --phase <N>` — re-run one phase only, overwriting that artifact.
- `/qa-agent <JIRA-KEY> --to <N>` — run forward until phase N completes or a gate blocks.

With no key: offer the most recently modified `qa-runs/*/state.json` and confirm before resuming. If
there are none, ask for a Jira key. Never guess a key.

## Phases

| # | Phase | Skill | Produces | Gate |
|---|---|---|---|---|
| 0 | `INIT` | this skill | `state.json`, `00-source.md` | — |
| 1 | `ANALYZE` | `qa-analyze` | `01-analysis.md` | — |
| 2 | `STRATEGY` | `qa-test-strategy` | `02-test-strategy.md` | — |
| 3 | `TEST_PLAN` | `qa-test-plan` | `03-test-plan.md` | — |
| 4 | `REVIEW` | `qa-review` | `04-review.md` | ★ |
| 5a | `EXECUTE_AUTOMATED` | `qa-execute` | `05-execution/tests`, `evidence`, `results.json` | — |
| 5b | `EXECUTE_MANUAL` | `qa-execute` | `manual-instructions.md`, `results.md` | ★ |
| 6 | `TEST_REPORT` | `qa-test-report` | `06-test-report.md` | — |
| 7 | `BUG_REPORT` | `qa-bug-report` | `07-bug-reports/` | — |
| 8 | `BUG_REVIEW` | `qa-bug-review` | `08-bug-review.md` | ★ |
| — | `DONE` | — | — | — |

Order is fixed. Never skip a phase, never run one whose input artifact is missing.

## Run loop

1. **Load** `qa.config.json` and `qa-runs/<KEY>/state.json`. If state is absent, run Phase 0.
2. **Check the gate.** If `status` is `awaiting_human`, run nothing. Restate the open asks from the
   gate artifact and stop. The gate clears only on an explicit answer in this conversation — then
   write it into the artifact's `## Human Response` with a UTC timestamp and who gave it, set the
   gate to `cleared`, `status` to `ready`, and continue.
3. **Run the next phase's skill** via the Skill tool, passing `<JIRA-KEY>`.
4. **Verify** the expected artifact exists and is non-trivial. If the skill reported a blocker
   instead, append it to `state.json.blockers` and stop — do not paper over it.
5. **Advance:** update `currentPhase`, append to `history`, write `state.json`.
6. Repeat until `DONE` or a gate blocks. Print one line per phase: phase, artifact path, headline
   number (e.g. "14 cases: 9 AI Agent, 4 QA Human, 1 Shared").

## Phase 0 — INIT

Create `qa-runs/<KEY>/`. Fetch the issue and snapshot it verbatim to `00-source.md`. Fetch order:

1. Atlassian MCP (`mcp__claude_ai_Atlassian__*`). On an auth failure, call the connector's
   `authenticate` tool, tell the user to complete it in the browser, then retry.
2. If MCP is unavailable, ask the user to paste the issue, naming the fields you need.

Capture every field Phase 1 needs: key, type, summary, description, acceptance criteria, comments,
attachments, linked/parent/sub issues, labels, components, priority, sprint, and the custom fields
listed in `qa.config.json`. An empty description is snapshotted as empty — that absence is itself a
Phase 1 finding. **Never invent issue content** (guardrail 1).

Then write `state.json`:

```json
{
  "issueKey": "PROJ-123",
  "title": "",
  "currentPhase": 1,
  "phaseName": "ANALYZE",
  "status": "ready",
  "createdAt": "2026-09-04T00:00:00Z",
  "updatedAt": "2026-09-04T00:00:00Z",
  "gates": {
    "REVIEW":          { "status": "pending", "clearedAt": null, "clearedBy": null },
    "EXECUTE_MANUAL":  { "status": "pending", "clearedAt": null, "clearedBy": null },
    "BUG_REVIEW":      { "status": "pending", "clearedAt": null, "clearedBy": null }
  },
  "artifacts": {},
  "blockers": [],
  "exceptions": [],
  "history": []
}
```

`status`: `ready` | `running` | `awaiting_human` | `blocked` | `done`.

`exceptions[]` is the only thing that can permit a `QA Approved` verdict over incomplete tests
(guardrail 3). Each entry: `{ id, reason, coveredCaseIds, riskAccepted, approvedBy, approvedAt }`.
You never write an exception yourself — only transcribe one a human explicitly granted.

## Gate discipline

At a ★ gate: write the artifact → set `gates.<PHASE>.status = "open"` and
`status = "awaiting_human"` → print a short numbered list of exactly what you need → **end the turn**.

Do not continue because the answer seems obvious, because the user said something encouraging, or
because you already know what you would write. Approval must be explicit and about that gate.

## Rework loops

Late information invalidates downstream artifacts. If the human supplies new requirements after
Review, name which artifacts are now stale, re-run from the earliest affected phase with `--phase`,
and banner the regenerated downstream files `> ⚠️ Superseded <timestamp>`. Never patch a later
artifact to match a change that belongs upstream.

## Reporting to the user

One line of commentary per phase. At the end: the run directory, the report verdict with confidence
level and residual risk, and the exact files they can share.
