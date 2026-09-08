# Phase 2 — Test Strategy — {{JIRA_KEY}}: {{TITLE}}

**Written:** {{UTC_TIMESTAMP}} · **Based on:** `01-analysis.md`

## 1. Test Type Selection

Every type is judged. Never include all by default — a `Yes` and a `No` each need a reason.

| Test Type | Required? | Reason |
|---|---|---|
| Functional | Yes / No | |
| UI | Yes / No | |
| API | Yes / No | |
| Integration | Yes / No | |
| E2E | Yes / No | |
| Regression | Yes / No | |
| Negative | Yes / No | |
| Responsive | Yes / No | |
| Cross-browser | Yes / No | |
| Accessibility | Yes / No | |
| Performance | Yes / No | |
| Security | Yes / No | |
| Data | Yes / No | |

## 2. Scope

**In:** REQ-00#, … · **Out:** {{item}} — {{reason}}

## 3. Risk Ranking

| Area | Likelihood | Impact | Risk | Test depth |
|---|---|---|---|---|
| | H/M/L | H/M/L | `HIGH`/`MEDIUM`/`LOW` | |

**Deliberately under-tested:** {{area}} — {{why acceptable}}

## 4. Regression Impact

| Existing behavior at risk | Why | Cases to re-run |
|---|---|---|

## 5. Environment & Data

- **Target environment:** {{env}} — {{url}} · **Feature flags:** {{flag = state}}
- **Accounts / roles:** · **Fixtures / test data:** · **Third-party sandboxes:**

## 6. Automation Posture

- **Framework:** {{from qa.config.json}} · **Existing suite reused:** {{path or "none"}}
- **Automate when:** {{criteria}}
- **Keep manual when:** {{criteria}}
- **Shared ownership when:** {{criteria}}

## 7. Entry Criteria

- [ ] {{must be true before execution starts}}

## 8. Exit Criteria

Phase 6 judges the verdict against exactly these. Make them checkable.

- [ ] {{e.g. 100% of P0/P1 cases executed with a recorded status}}
- [ ] {{e.g. every AC covered by at least one Passed case}}
- [ ] {{e.g. no open Blocker or Critical defects}}

## 9. Risks to the Test Effort

| Risk | Mitigation |
|---|---|

## 10. Coverage Matrix

| REQ / AC | Test types | Depth | Priority |
|---|---|---|---|

**Accepted coverage gaps:** {{AC id}} — {{reason}}

<!-- Shared footer — every phase artifact ends with this block (guardrail 4). -->

## Confidence & Residual Risk

- **Confidence:** `High` | `Medium` | `Low`
- **Basis:** {{what this rests on — source quality, coverage achieved, evidence collected}}
- **Residual risk:** {{what remains uncertain or untested after this phase, and the impact if wrong}}
- **What would raise confidence:** {{the specific missing answer, access, data, or run}}
