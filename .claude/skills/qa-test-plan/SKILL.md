---
name: qa-test-plan
description: Phase 3 — write the test case table for a Jira issue with the fixed columns (Test ID, Test Type, Priority/Risk, Preconditions, Test Data, Steps, Test URL, Expected, Actual, QA Status, Automation Status, Execution Owner, Notes), tracing every case to an acceptance criterion. Use when the user says /qa-test-plan or asks for test cases for a ticket.
---

# Phase 3 — Test Plan

Inputs: `01-analysis.md`, `02-test-strategy.md`. Output: `qa-runs/<KEY>/03-test-plan.md` from
`templates/test-plan.md`.

No gate here — the plan goes to the Phase 4 Review gate together with the analysis and strategy.
But write it as if it were being signed off, because it is.

## The fixed table

Every case is one row, columns in this exact order:

| Column | Rule |
|---|---|
| **Test ID** | `TC-###`. **Permanent** — on a re-run keep existing ids on their cases and append new ones. |
| **Test Type** | One of the types marked `Required? = Yes` in the strategy. A type the strategy rejected cannot appear here. |
| **Priority/Risk** | `P0`–`P3` inherited from the strategy's risk rating for that area. |
| **Preconditions** | State, role, data, feature flags needed before step 1. |
| **Test Data** | Concrete literal values, including the boundary ones. Not "valid input". |
| **Steps** | Numbered, imperative, one action each. Never "verify everything works". |
| **Test URL** | The exact page/endpoint from `qa.config.json` environments. `n/a` only if genuinely none. |
| **Expected** | Observable and specific — exact message, state, status code, count. |
| **Actual** | Left empty at plan time. Filled only in Phase 5. |
| **QA Status** | `Not Run` at plan time. |
| **Automation Status** | `Automated` \| `Manual Only` \| `Candidate` \| `Blocked` |
| **Execution Owner** | `AI Agent` \| `QA Human` \| `Shared` |
| **Notes** | Why this owner/automation call, dependencies, flake risk. |

Also record each case's `Covers` (`AC-`/`REQ-` ids) — a case that covers nothing does not belong in
the plan.

## Deriving cases

Systematically, not by free association. For each AC: happy path → equivalence partitions →
boundary values → negative and error paths → permissions and roles → state and concurrency → the
regression cases the strategy named. Then one pass per additional required test type (API,
Responsive, Cross-browser, Accessibility, …) so no `Yes` in the strategy goes unrepresented.

Write expected results a stranger could judge. "Shows an error" is not a result. "Shows
`Range must be 90 days or fewer` beneath the field and Export stays disabled" is.

**Guardrail 1:** an expected result must trace to an AC, a stated requirement, or a recorded human
answer. If you are asserting behavior the ticket never specified, that is an open question for
Review — flag it in Notes rather than quietly inventing the contract.

## Ownership and automation

Apply the strategy's automation posture:

- `AI Agent` + `Automated` — deterministic, repeatable, valuable on every run.
- `QA Human` + `Manual Only` — needs human judgment (visual, UX, exploratory), or the interface is
  unstable or unavailable to automation.
- `Shared` — the agent drives setup or data and a human validates the outcome; also the right owner
  for anything that will end as `Requires Human Validation`.
- `Candidate` — worth automating later, manual for this run.

**Never automate for coverage vanity.** A case that costs more to automate than it will ever return
on a one-off is `Manual Only`, and the Notes say so. Give a one-line reason per case: the split is
the main thing the human signs off on, so make it arguable rather than asserted.

## Summary block

Head the document with counts Phase 6 will reconcile against: total cases; by Automation Status; by
Execution Owner; by priority; by test type; and AC coverage (`covered / total`, listing uncovered
`AC-` ids with the reason). Discovering an uncovered AC in the report is too late.

## Footer

Close with Confidence & Residual Risk, then hand to the orchestrator for Phase 4.
