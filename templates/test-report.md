# Phase 6 — Test Report — {{JIRA_KEY}}: {{TITLE}}

## Verdict: `QA Approved` | `QA Approved with Exceptions` | `Not Approved` | `Incomplete`

{{one paragraph justifying the verdict against the exit criteria}}

> **Guardrail 3:** `QA Approved` is not permitted while any required case is `Failed`, `Blocked`,
> `Not Run`, or `Requires Human Validation`, or while a BLOCKER question is unanswered — unless a
> documented human-approved exception exists, in which case the verdict is
> `QA Approved with Exceptions` and the exception is named below.

**Exception applied:** {{none | exception id — approved by {{who}} at {{when}} — risk accepted: {{what}}}}

**Environment:** {{env}} · **Build/commit:** {{sha}} · **Run window:** {{start}} → {{end}}
**Framework:** {{fw}} · **Manual executor:** {{name}}

## 1. Totals by Status

| QA Status | Count |
|---|---|
| Passed | |
| Failed | |
| Blocked | |
| Not Run | |
| Requires Human Validation | |
| **Planned total** | |
| **Executed** | |
| **Pass rate (of executed)** | {{passed}}/{{executed}} = {{%}} |

## 2. Exit Criteria

| Criterion (from strategy) | Met | Evidence |
|---|---|---|
| | ✅ / ❌ | |

## 3. Automation vs Manual Coverage

| Execution Owner | Planned | Executed | Passed | Failed | Pass rate |
|---|---|---|---|---|---|
| AI Agent | | | | | |
| QA Human | | | | | |
| Shared | | | | | |

**Planned as automated but not delivered:** {{TC ids}} — {{Manual Only / Candidate / Blocked, and why}}

## 4. Critical & High Failures

| Bug | Test ID | Priority | Symptom | Affected area |
|---|---|---|---|---|
| BUG-{{KEY}}-1 | TC-004 | P0 | | |

## 5. Regression Concerns

| Existing behavior | Test ID | Status | Consequence |
|---|---|---|---|

## 6. Environment Issues

Not product defects — do not file these as bugs.

| Issue | Cases affected | Impact on results |
|---|---|---|

## 7. Missing Requirements & Coverage Gaps

| AC / REQ | Cases | Status | Gap |
|---|---|---|---|
| AC-00# | — | uncovered | {{why}} |

**Unanswered questions still open:** {{Q ids — severity}}

## 8. Per-Test Evidence

| Test ID | Title | Covers | Owner | QA Status | Actual | Evidence |
|---|---|---|---|---|---|---|

## 9. Recommendation

- **Shipping now means:** {{concrete consequence}}
- **Blockers to release:** {{bug ids or "none"}}
- **Retest scope after fixes:** {{case ids}}

<!-- Shared footer — every phase artifact ends with this block (guardrail 4). -->

## Confidence & Residual Risk

- **Confidence:** `High` | `Medium` | `Low`
- **Basis:** {{what this rests on — source quality, coverage achieved, evidence collected}}
- **Residual risk:** {{what remains uncertain or untested after this phase, and the impact if wrong}}
- **What would raise confidence:** {{the specific missing answer, access, data, or run}}
