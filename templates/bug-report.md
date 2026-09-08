# BUG-{{JIRA_KEY}}-{{n}} — {{[Affected area] Observable problem under condition}}

**Status:** `DRAFT — not filed` | `Filed as {{BUG-KEY}}` · **Drafted:** {{UTC_TIMESTAMP}}

> Draft only. Not created in Jira until Phase 8 human approval (guardrail 2).

| Field | Value |
|---|---|
| **Related Test ID** | TC-00# {{, TC-00# if grouped}} |
| **Jira link** | {{PARENT-KEY}} — {{url}} |
| **Affected area** | {{component / module / service}} |
| **Severity** | Blocker / Critical / Major / Minor / Trivial |
| **Priority** | P0 / P1 / P2 / P3 |
| **Reproducibility** | Always / Intermittent (n/m) / Once |
| **Isolated rerun** | Failed (consistent) / Passed (possible flake) |
| **Type** | New defect / Regression |
| **Found by** | {{AI Agent via TC-00# / QA Human — name}} |

## Environment

- **URL:** {{exact page or endpoint}}
- **Environment / build:** {{env}} · {{sha}}
- **Browser / device / OS:** {{...}}
- **Account / role:** {{...}} · **Feature flags:** {{flag = state}}

## Preconditions

{{exact state required before step 1}}

## Steps to Reproduce

1. {{minimal step with literal data}}
2.
3.

## Expected

{{quoted from the test plan's Expected}} — per AC-00#

## Actual

{{observed behavior, with exact error text / status code / rendered state}}

## Evidence

- Screenshot: `05-execution/evidence/TC-00#/…`
- Video / trace: · API response: · Assertion diff:

## Logs

```
{{relevant excerpt only — console error, server log, failed request. Not a full dump.}}
```

## Notes

- **Workaround:** {{if any}}
- **Hypothesis (unverified):** {{only with evidence; label as hypothesis, never as diagnosis}}

<!-- Shared footer — every phase artifact ends with this block (guardrail 4). -->

## Confidence & Residual Risk

- **Confidence:** `High` | `Medium` | `Low`
- **Basis:** {{what this rests on — source quality, coverage achieved, evidence collected}}
- **Residual risk:** {{what remains uncertain or untested after this phase, and the impact if wrong}}
- **What would raise confidence:** {{the specific missing answer, access, data, or run}}
