---
name: qa-bug-report
description: Phase 7 — write a markdown bug report for each failed test case with title, related Test ID, Jira link, environment, URL, preconditions, repro steps, expected, actual, severity, priority, evidence, logs and affected area. Markdown deliverables only; Phase 8 finalizes them for handover. This pipeline never writes to Jira. Use when the user says /qa-bug-report or asks to write up bugs or defects from failing tests.
---

# Phase 7 — Bug Reports

Inputs: `06-test-report.md`, `03-test-plan.md`, `05-execution/results.md`, `results.json`, and the
evidence directory. Output: one file per defect at `qa-runs/<KEY>/07-bug-reports/BUG-<KEY>-<n>.md`,
from `templates/bug-report.md`.

**Guardrail 2: Jira is read-only for this entire pipeline.** This phase writes local markdown drafts,
which are the deliverable. Nothing is ever created in Jira — not here, not at Phase 8, not on request.
Do not call any Atlassian write tool. Phase 8 approval finalizes these files for handover; a human
files them in Jira if they want them there.

If there are no `Failed` results, write nothing, say so, and let the orchestrator mark the phase
done.

## One bug per defect, not per failure

Group failures sharing a root cause into a single bug citing all their `TC-` ids. Split one failing
case into several bugs when it exposes genuinely separate defects. State the grouping you chose and
why in the handoff, so the human can regroup at Phase 8.

Failures caused by the test or the environment are **not** product bugs. List them separately as
test-suite follow-ups. Filing them as defects burns the team's trust in this pipeline faster than
missing a real bug does.

A `Requires Human Validation` case is not yet a bug — it goes back to the human, not into a draft.

## Required fields

Render every field in `qa.config.json` `bugReport.requiredFields`:

- **Title** — `[Affected area] Observable problem under condition`. Unique in a backlog at a glance;
  never "doesn't work".
- **Related Test ID** — `TC-###` (all of them if grouped).
- **Jira link** — the parent issue key and URL from `qa.config.json` `issueUrlTemplate`.
- **Environment** — env name, build/commit, browser/device/OS, account and role, feature flags.
- **URL** — the exact page or endpoint where it reproduces.
- **Preconditions** — the exact state required before step 1.
- **Steps to reproduce** — numbered, **minimal**, with literal data values. Strip every step not
  needed to reproduce. A developer must be able to follow them with no access to this repo.
- **Expected** — quoted from the plan's Expected, citing the `AC-`.
- **Actual** — what was observed: exact error text, status code, rendered state.
- **Severity** — from `vocabulary.severity`, by user impact and whether a workaround exists.
- **Priority** — from `vocabulary.priority`, by urgency to fix.
- **Evidence** — screenshot, video, trace, API response paths from `results.json`, plus the
  assertion diff.
- **Logs** — the relevant excerpt (console errors, server log, network failure), not a whole dump.
- **Affected area** — component, module, or service from the Phase 1 blast radius.

Also record reproducibility (`Always` / `Intermittent (n/m)` / `Once`) and the isolated-rerun result
— a case that passed on rerun is a flake signal the developer needs, and saying so is not a
weakness in the report.

## Rules

Report only what was observed. Do not diagnose root cause in product code unless you actually read
it, and label any hypothesis explicitly as a hypothesis. Do not inflate severity for attention, and
do not soften a genuine blocker to be agreeable — both corrupt triage.

Close each report with Confidence & Residual Risk: how sure you are this is a real product defect at
this severity. Hand the draft list to the orchestrator for Phase 8.
