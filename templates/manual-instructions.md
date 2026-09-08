# Phase 5b — Manual Test Instructions — {{JIRA_KEY}}

**Status:** `AWAITING_HUMAN` | `COMPLETE` · **Assigned:** {{UTC_TIMESTAMP}} · **Est. total:** ~{{time}}

Automation has already run; below is only what a machine could not do. Anything you do not run stays
`Not Run` — please do not mark a case `Passed` you did not execute.

## Environment

- **URL:** {{url}} · **Environment:** {{env}} · **Build:** {{sha}}
- **Account / role:** {{login}} · **Feature flags:** {{flag = state}}
- **Evidence goes in:** `qa-runs/{{KEY}}/05-execution/evidence/<TC-id>/`

## Shared Setup — do once

{{setup steps common to the group below}}

---

### TC-00# — {{title}}  ·  {{P#}}  ·  {{Execution Owner}}  ·  ~{{time}}

- **Covers:** AC-00#
- **Preconditions:** {{exact state}}
- **Test data:** {{literal values}}
- **Test URL:** {{url}}

| # | Do this | You should see |
|---|---|---|
| 1 | | |

- **Expected result:** {{the single outcome that decides pass/fail}}
- **Capture:** {{screenshot of X / console log / network response for Y}}

**Your result**
- **QA Status:** `Passed` / `Failed` / `Blocked` / `Not Run` / `Requires Human Validation`
- **Actual:** {{required unless Passed}}
- **Evidence:** {{paths}}

---

## Anything Else You Noticed

{{exploratory observations outside the scripted steps — these often become the best bugs}}

## Blockers Encountered

{{what stopped you, so `Blocked` rows are explained in the report}}
