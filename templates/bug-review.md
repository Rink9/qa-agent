# Phase 8 — Bug Review — {{JIRA_KEY}}

**Status:** `AWAITING_HUMAN` | `COMPLETE` · **Prepared:** {{UTC_TIMESTAMP}}

★ No bug draft is finalized without explicit per-bug approval. Approving one is not approving the batch.
★ **This pipeline never writes to Jira.** Approval finalizes the markdown for handover; a human files
it if they want it in Jira.

## Product Defect Drafts

| Bug | Severity | Priority | Title | From | Affected area | Decision | Handover file |
|---|---|---|---|---|---|---|---|
| BUG-{{KEY}}-1 | Critical | P1 | | TC-004 | | pending | — |

### BUG-{{KEY}}-1
- **Symptom:** {{2 lines}}
- **Evidence held:** {{screenshot, trace, log}}
- **I am unsure about:** {{severity call / grouping / possible flake — or "nothing"}}

## Test / Environment Failures — not proposed as bugs

| Test ID | Cause | Proposed follow-up | Override? |
|---|---|---|---|

## Requires Human Validation

| Test ID | What needs your judgment | Evidence |
|---|---|---|

## Human Response

> Per bug, reply: `approve BUG-{{KEY}}-1` · `edit BUG-{{KEY}}-1: {{change}}` ·
> `merge BUG-{{KEY}}-2 into BUG-{{KEY}}-1` · `split BUG-{{KEY}}-1: {{how}}` ·
> `reject BUG-{{KEY}}-3: {{reason}}` · `defer BUG-{{KEY}}-4`

<!-- On response, append per bug:
- BUG-{{KEY}}-1 → `APPROVED` by {{who}} at {{UTC_TIMESTAMP}} → finalized at `07-bug-reports/BUG-{{KEY}}-1.md` (not filed — pipeline is read-only)
- BUG-{{KEY}}-3 → `REJECTED` by {{who}} at {{UTC_TIMESTAMP}} — reason: {{why}}
-->

## Handover Log

Nothing is created in Jira by this pipeline. These are the files to hand over.

| Draft | Status | Handover file | Finalized at |
|---|---|---|---|

## Run Close-out

- **Phase 6 verdict:** {{verdict}} {{+ exception if any}}
- **Approved (handover ready):** {{n}} · **Rejected:** {{n}} · **Deferred:** {{n}} · **Filed to Jira: 0 — by design**

<!-- Shared footer — every phase artifact ends with this block (guardrail 4). -->

## Confidence & Residual Risk

- **Confidence:** `High` | `Medium` | `Low`
- **Basis:** {{what this rests on — source quality, coverage achieved, evidence collected}}
- **Residual risk:** {{what remains uncertain or untested after this phase, and the impact if wrong}}
- **What would raise confidence:** {{the specific missing answer, access, data, or run}}
