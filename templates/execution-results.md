# Phase 5 — Execution Results — {{JIRA_KEY}}

**Environment:** {{env}} — {{url}} · **Build:** {{sha}} · **Framework:** {{fw}}
**Automated run:** {{start}} → {{end}} · **Manual executed by:** {{name}} on {{date}}

## Totals

| QA Status | AI Agent | QA Human | Shared | Total |
|---|---|---|---|---|
| Passed | | | | |
| Failed | | | | |
| Blocked | | | | |
| Not Run | | | | |
| Requires Human Validation | | | | |

## Results

The Phase 3 table with `Actual` and `QA Status` filled. This is the record Phase 6 reads.

| Test ID | Test Type | Priority/Risk | Preconditions | Test Data | Steps | Test URL | Expected | Actual | QA Status | Automation Status | Execution Owner | Notes | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | Functional | P0 | | | | | | {{observed}} | Passed | Automated | AI Agent | | `evidence/TC-001/` |

## Deviations from Plan

| Test ID | Planned | Actual | Why |
|---|---|---|---|
| TC-00# | Automated / AI Agent | Manual Only / QA Human | {{missing test id, unstable interface…}} |

## Automation Notes

- **Reused from existing suite:** {{page objects, helpers, fixtures}}
- **Newly written:** {{files}}
- **Not automated and why:** {{case ids — cost, stability, missing hook}}
- **Flake signals:** {{cases that failed then passed on isolated rerun}}

## Environment Issues

{{instability, downtime, access or data problems — these explain Blocked rows and are not product defects}}

<!-- Shared footer — every phase artifact ends with this block (guardrail 4). -->

## Confidence & Residual Risk

- **Confidence:** `High` | `Medium` | `Low`
- **Basis:** {{what this rests on — source quality, coverage achieved, evidence collected}}
- **Residual risk:** {{what remains uncertain or untested after this phase, and the impact if wrong}}
- **What would raise confidence:** {{the specific missing answer, access, data, or run}}
