---
name: qa-test-strategy
description: Phase 2 — decide the test strategy for a Jira issue by selecting only the test types the change actually needs, with a Test Type / Required? / Reason table, plus risk ranking, environments, data, automation posture and entry/exit criteria. Use when the user says /qa-test-strategy or asks for the testing approach or scope for a ticket.
---

# Phase 2 — Test Strategy

Input: `01-analysis.md`. Output: `qa-runs/<KEY>/02-test-strategy.md` from
`templates/test-strategy.md`.

The strategy is the *why and how much*. The plan that follows is the *what*. If you catch yourself
writing test steps, you are in the wrong skill.

## The test type decision (the core output)

Evaluate every type in `qa.config.json` `vocabulary.testTypes` and output a row for each:

| Test Type | Required? | Reason |
|---|---|---|
| Functional | Yes | {{what in the change demands it}} |
| Accessibility | No | {{why this change cannot affect it}} |

Types: Functional, UI, API, Integration, E2E, Regression, Negative, Responsive, Cross-browser,
Accessibility, Performance, Security, Data.

**Never include all types by default.** A `Yes` needs a reason grounded in the Phase 1 analysis —
a specific requirement, interface, or blast-radius item. A `No` needs a reason too: "the change is
server-side only, no rendered output" is a decision; a blank cell is negligence. Listing Performance
and Security as decoration on a copy-change ticket wastes the team's time and devalues the whole
report.

Every `Yes` must produce cases in Phase 3, and every `No` is a coverage boundary the Review gate can
challenge.

## Risk ranking

| Area | Likelihood | Impact | Risk | Test depth |

Drive depth from risk: `HIGH` areas get negative, boundary and integration coverage; `LOW` areas get
a happy path. Name what you are **deliberately under-testing** and why — that admission is the main
value of writing a strategy down, and it feeds the residual-risk statement in every later phase.

## The rest

- **Scope** — `REQ-` ids in, and explicitly out with the reason.
- **Regression impact** — existing behavior at risk (from blast radius) and the set to re-run.
- **Environment & data** — target env and URL from `qa.config.json`, accounts and roles, fixtures,
  third-party sandboxes, feature flags and their required state.
- **Automation posture** — the criteria Phase 3 will apply to set Automation Status and Execution
  Owner: value per run, stability, cost to automate, need for human judgment. Name the framework
  from config; if `automation.framework` is empty, ask now and write the answer back to the config.
- **Entry criteria** — what must be true before execution starts.
- **Exit criteria** — measurable and checkable, because the Phase 6 verdict is judged against them:
  AC coverage, required-case execution, pass rate, open-defect thresholds by severity. These are
  what guardrail 3 tests "QA Approved" against, so write them so a reader can tick them off.
- **Risks to the test effort itself** — env instability, missing data, undelivered dependency, each
  with a mitigation.

## Coverage matrix

Map every `REQ-`/`AC-` to the types and depth that will cover it. Any row with no coverage goes
under **Accepted coverage gaps** with a reason — never leave a requirement silently uncovered.

## Footer

Close with Confidence & Residual Risk. Report the profile in one line to the orchestrator
(e.g. "6 of 13 types required, 3 HIGH-risk areas, 1 accepted gap").
