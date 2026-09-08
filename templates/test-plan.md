# Phase 3 — Test Plan — {{JIRA_KEY}}: {{TITLE}}

**Status:** `AWAITING_REVIEW` | `APPROVED` · **Written:** {{UTC_TIMESTAMP}} · **Environment:** {{env}} — {{base url}}

`Actual` and `QA Status` stay empty here. Phase 5 writes the filled copy to
`05-execution/results.md`; this approved plan is never edited with results.

## Summary

| Metric | Count |
|---|---|
| Total cases | |
| Automated / Manual Only / Candidate / Blocked | / / / |
| AI Agent / QA Human / Shared | / / |
| P0 / P1 / P2 / P3 | / / / |
| AC coverage | {{covered}} / {{total}} |

**By test type:** Functional {{n}} · API {{n}} · … (only types the strategy marked `Required? = Yes`)

**Uncovered ACs:** {{ids or "none"}} — {{reason}}

## Test Cases

| Test ID | Test Type | Priority/Risk | Preconditions | Test Data | Steps | Test URL | Expected | Actual | QA Status | Automation Status | Execution Owner | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | Functional | P0 / HIGH | {{state, role, flags}} | {{literal values}} | 1. {{action}}<br>2. {{action}} | {{url}} | {{exact observable result}} | | Not Run | Automated | AI Agent | Covers AC-001 · {{why this owner}} |

QA Status: `Passed` · `Failed` · `Blocked` · `Not Run` · `Requires Human Validation`
Automation Status: `Automated` · `Manual Only` · `Candidate` · `Blocked`
Execution Owner: `AI Agent` · `QA Human` · `Shared`

## Traceability

| AC / REQ | Covered by | Depth |
|---|---|---|
| AC-001 | TC-001, TC-002 | happy + boundary |

<!-- Shared footer — every phase artifact ends with this block (guardrail 4). -->

## Confidence & Residual Risk

- **Confidence:** `High` | `Medium` | `Low`
- **Basis:** {{what this rests on — source quality, coverage achieved, evidence collected}}
- **Residual risk:** {{what remains uncertain or untested after this phase, and the impact if wrong}}
- **What would raise confidence:** {{the specific missing answer, access, data, or run}}
