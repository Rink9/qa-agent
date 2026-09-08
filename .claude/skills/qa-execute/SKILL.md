---
name: qa-execute
description: Phase 5 — automate and execute the approved test plan. Writes automation for high-value and high-risk cases first, runs it, captures screenshots, video, logs, traces, API responses and console errors, then delegates the manual cases to a QA human with precise instructions and waits for their results. Use when the user says /qa-execute or asks to run, automate, or execute the tests for a ticket.
---

# Phase 5 — Automation & Execution

Input: an **approved** `03-test-plan.md`. Outputs under `qa-runs/<KEY>/05-execution/`:
`tests/`, `evidence/`, `results.json`, `manual-instructions.md`, `results.md`.

**Precondition:** `gates.REVIEW.status` must be `cleared`. If it is not, stop. Code written against
an unapproved plan is waste, and it bypasses the gate that catches invented requirements.

Two sub-phases: **5a automated**, then **5b manual delegation** (a ★ gate). Automation runs first so
the human is only asked for what a machine genuinely cannot do.

## 5a — Automation

### Setup

Read `qa.config.json` → `automation`. If `framework` or `commands` are empty, ask once — framework,
install, run-all, run-one — and write the answers back so later runs are non-interactive. Do not
infer a stack from whatever file extensions happen to be lying around.

**Before writing anything new, read the existing suite** (`automation.existingSuitePath`, or search
the repo/path the user names). Reuse its page objects, API clients, fixtures, helpers, selectors and
naming. Extending existing tests beats writing new ones; a parallel set of helpers is a defect, not
a deliverable. Say what you reused.

### Order of work

Highest value and highest risk first: `P0`/`HIGH` cases, then down. If time or stability runs out,
what remains unautomated must be the least consequential — and it becomes `Candidate`, reassigned to
`QA Human`, and named in the report.

**Never automate for coverage vanity.** A test that asserts nothing meaningful, or that costs more
than it returns, does not get written. A smaller honest suite beats a large decorative one.

### Writing tests

One file per case, named for the id (`TC-004.spec.ts`), so a failure maps to a case without
interpretation. Each file:

- Header comment: `TC-###`, title, `Covers` ids, test type.
- Explicit setup for its own preconditions. No dependence on another test having run. Tests pass in
  any order and in isolation.
- Assertions matching the plan's Expected **exactly** — the specific message, status, count. A test
  asserting less than the plan says is a false pass, which is worse than no test.
- Deterministic waits on real conditions. No sleeps, no retry-until-green, no `try/catch` wrapped
  around an assertion.
- Cleanup of data it created.

**Never weaken a test to make it pass.** If a case cannot be automated as written — missing hook or
test id, unstable interface, unavailable dependency — do not fake it. Leave it out, record the case
as `Blocked` with the reason in `results.json`, and flip it to `QA Human` for 5b.

### Executing and capturing

Run with the configured command. Re-run each failure once in isolation to separate a real defect
from cross-test interference, and record which it was.

Capture per case, into `evidence/<TC-id>/`: screenshots, video, logs, traces, API request/response
pairs, console errors. Phase 7 bug reports are only as good as this evidence, so capture on pass
too where it is cheap — a passing baseline screenshot makes the next regression obvious.

### `results.json`

Normalize the runner output to exactly this shape:

```json
{
  "issueKey": "PROJ-123",
  "framework": "playwright",
  "command": "npx playwright test qa-runs/PROJ-123/05-execution/tests",
  "environment": "staging",
  "buildRef": "",
  "startedAt": "2026-09-04T10:00:00Z",
  "finishedAt": "2026-09-04T10:04:12Z",
  "results": [
    {
      "caseId": "TC-004",
      "qaStatus": "Failed",
      "executionOwner": "AI Agent",
      "durationMs": 5010,
      "actual": "Shows 'Invalid input' instead of the range message",
      "error": "Expected 'Range must be 90 days or fewer', received 'Invalid input'",
      "isolatedRerun": "Failed",
      "evidence": ["05-execution/evidence/TC-004/screenshot.png", "05-execution/evidence/TC-004/trace.zip"]
    }
  ]
}
```

`qaStatus` ∈ `Passed` | `Failed` | `Blocked` | `Not Run` | `Requires Human Validation`. Every
automated case in the plan gets a row, including ones you never reached (`Not Run`). Use
`Requires Human Validation` when the assertion passed but the outcome needs human judgment (visual
fidelity, copy, UX) — do not launder that into `Passed`.

## 5b — Manual delegation ★ HUMAN GATE

Write `manual-instructions.md` from `templates/manual-instructions.md` covering every `QA Human` and
`Shared` case, plus anything automation left `Blocked`.

Precise means executable by someone who has not read this repo: environment and URL, account and
role, exact preconditions and setup data, numbered steps with literal values, the exact expected
result, what evidence to capture and where to put it (`evidence/<TC-id>/`), and how long it should
take. Order by priority, and group cases that share a setup so the human does that setup once.

Then: set `gates.EXECUTE_MANUAL.status = "open"`, `status = "awaiting_human"`, tell the user the
file path, offer to take results dictated case-by-case in chat as an alternative, and **end the turn**.

**Wait.** Never predict, assume, or "expect" a manual outcome (guardrail 5). Anything not reported
back is `Not Run` — which is a real result that shows up as a coverage gap in Phase 6, not a
rounding error to be smoothed into `Passed`.

## `results.md`

When manual results are in, merge automated and manual into `results.md`: the plan's full table with
`Actual` and `QA Status` filled, plus an evidence path per row. This is the frozen record Phase 6
reads. The approved `03-test-plan.md` is **not** edited — results live here.

Close with Confidence & Residual Risk and report totals by status to the orchestrator.
