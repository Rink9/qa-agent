---
name: qa-test-report
description: Phase 6 — consolidate automated and manual results into a test report with totals by status, automation vs manual coverage, critical and high failures, regression concerns, environment issues, missing requirements, per-test evidence, and a QA verdict with confidence and residual risk. Use when the user says /qa-test-report or asks for the QA results or summary for a ticket.
---

# Phase 6 — Test Report

Inputs: `03-test-plan.md`, `05-execution/results.md`, `results.json`, `02-test-strategy.md` (exit
criteria), `01-analysis.md` (requirements). Output: `qa-runs/<KEY>/06-test-report.md` from
`templates/test-report.md`.

## Reconcile before writing

Join plan cases to results on `TC-` id and check:

- Every plan case has exactly one result. A case with none is `Not Run` — report it, never drop it.
- No result references a case absent from the plan.
- Totals match the plan's summary block. If they do not, explain why in the Reconciliation section
  (cases added post-approval, cases descoped) rather than quietly adjusting the numbers.

**Never fill in a status you did not observe** (guardrail 5). No inferring `Passed` because the code
looks right, no promoting `Not Run` because a similar case passed. `Not Run`, `Blocked` and
`Requires Human Validation` are results, and they are the ones that matter most.

## The verdict

`QA Approved` | `QA Approved with Exceptions` | `Not Approved` | `Incomplete`, decided against the
strategy's exit criteria, each criterion listed met / not met with its evidence. State it first — a
reader who stops after the first screen must have it.

**Guardrail 3 is absolute.** You may not write `QA Approved` if any required case is `Failed`,
`Blocked`, `Not Run`, or `Requires Human Validation`, or if a `BLOCKER` question is unanswered. The
only exception is a documented human-approved entry in `state.json.exceptions` — then the verdict is
`QA Approved with Exceptions` and the report names the exception, who approved it, and the risk they
accepted. If coverage is too thin to judge at all, the verdict is `Incomplete` and you name what is
missing. A confident verdict on partial data is the worst thing this pipeline can produce.

## Required sections

- **Totals by status** — `Passed` / `Failed` / `Blocked` / `Not Run` / `Requires Human Validation`,
  and pass rate over *executed* cases with the denominator shown so it is honest.
- **Automation vs manual coverage** — counts and pass rates split by Execution Owner, plus what was
  planned as `Automated` but ended `Manual Only` / `Candidate` / `Blocked`, and why. This tells the
  team where the suite actually stands.
- **Critical and high failures** — every `P0`/`P1` failure first, with symptom, affected area and
  the `BUG-` id it will become in Phase 7.
- **Regression concerns** — results for the regression set the strategy named, plus any failure in
  previously working behavior. Call these out separately from new-feature failures; they carry
  different release consequences.
- **Environment issues** — instability, downtime, data or access problems, third-party sandbox
  failures. These explain `Blocked` rows and are **not** product defects — say so explicitly, so
  nobody files them as bugs.
- **Missing requirements** — ACs with no case, cases whose only coverage is `Not Run`, and questions
  still unanswered. Lead with these; a report that buries its gaps is a false comfort.
- **Per-test evidence** — the full results table with an evidence path per case, so any status can be
  audited.
- **Requirement coverage** — `AC-`/`REQ-` → cases → rolled-up status.
- **Run metadata** — environment, build/commit, framework, run window, who executed the manual cases.
- **Recommendation** — what shipping now would mean, the concrete blocker list, and the retest scope.

## Tone

Report plainly. Do not soften a `Not Approved`, do not editorialize about developers, do not pad the
pass rate by excluding inconvenient cases. Close with Confidence & Residual Risk (guardrail 4):
confidence in the verdict, its basis, and what is still unknown after this run.

Hand the failed case ids to the orchestrator for Phase 7.
