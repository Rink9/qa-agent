# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A **QA agent**: a human-in-the-loop pipeline that turns a Jira issue into requirement analysis, a
test strategy, a test plan, executed tests, a test report, and reviewed bug reports.

There is no application code here. The "product" is the set of skills in `.claude/skills/` plus the
run artifacts they produce under `qa-runs/`. Treat the skills as the source of truth for behavior —
when the process changes, edit the skill, not just the output.

## GUARDRAILS — these override everything below

1. **Never invent requirements.** Every requirement, AC, and expected result traces to the Jira
   issue or to a recorded human answer. An inference is labelled `derived` and is a question for
   Review, not a fact.
2. **Jira is READ-ONLY. Never write to Jira — ever.** No creating issues, no comments, no status
   transitions, no field edits, no links. Fetching the issue in Phase 0 is the only Jira interaction
   this pipeline performs. Bug reports are **deliverables written to disk**, never tickets this agent
   files. Phase 8 approval means "these drafts are final and ready to hand over" — it authorizes a
   local export, not a Jira write. If a human wants a bug in Jira, a human creates it from the
   markdown. Never call `mcp__claude_ai_Atlassian__createJiraIssue`, `addCommentToJiraIssue`,
   `editJiraIssue`, `transitionJiraIssue`, `createIssueLink`, or any other Atlassian write tool.
3. **Never mark "QA Approved"** while any required test is `Blocked`, `Not Run`,
   `Requires Human Validation`, or while an open question is unanswered — unless a
   human-approved exception is documented in `state.json.exceptions` with who approved it, when, and
   what risk they accepted.
4. **Always state confidence level and residual risk.** Every phase artifact ends with the
   Confidence & Residual Risk footer (`High`/`Medium`/`Low` + basis + what remains uncertain).
5. **Never fabricate a result.** A status you did not observe is `Not Run`. Silence from a human is
   not approval, and a passing sibling case is not evidence.

## Commands

There is no build step. Work happens through skills:

```
/qa-agent <JIRA-KEY>                 # start or resume the full pipeline
/qa-agent <JIRA-KEY> --status        # print phase, gate state, artifact checklist; changes nothing
/qa-agent <JIRA-KEY> --phase <N>     # re-run one phase, overwriting that phase's artifact
/qa-agent <JIRA-KEY> --to <N>        # run forward until phase N completes or a gate blocks
```

Each phase skill can also be invoked directly with a `<JIRA-KEY>` for rework loops:
`/qa-analyze`, `/qa-test-strategy`, `/qa-test-plan`, `/qa-review`, `/qa-execute`,
`/qa-test-report`, `/qa-bug-report`, `/qa-bug-review`.

Automation commands live in `qa.config.json` (`automation.commands`) so the harness is swappable.
Read that file before running anything; never hardcode a runner.

```
# whatever qa.config.json says, e.g.
npx playwright test qa-runs/<KEY>/05-execution/tests/            # full generated suite
npx playwright test qa-runs/<KEY>/05-execution/tests/TC-004.spec.ts   # single case
```

## Workflow (state machine)

State is persisted in `qa-runs/<JIRA-KEY>/state.json` — always read it before acting, write it after.

```
Phase 0  INIT                                            → 00-source.md
Phase 1  ANALYZE            qa-analyze                   → 01-analysis.md
Phase 2  STRATEGY           qa-test-strategy             → 02-test-strategy.md
Phase 3  TEST_PLAN          qa-test-plan                 → 03-test-plan.md
Phase 4  REVIEW          ★  qa-review                    → 04-review.md
Phase 5a EXECUTE_AUTOMATED   qa-execute                  → 05-execution/{tests,evidence,results.json}
Phase 5b EXECUTE_MANUAL   ★  qa-execute                  → 05-execution/manual-instructions.md
                                                         → 05-execution/results.md
Phase 6  TEST_REPORT        qa-test-report               → 06-test-report.md
Phase 7  BUG_REPORT         qa-bug-report                → 07-bug-reports/
Phase 8  BUG_REVIEW      ★  qa-bug-review                → 08-bug-review.md
         DONE
```

### The three ★ gates are hard stops

At a gate: write the artifact, set `state.status` to `awaiting_human`, print exactly what you need
as a numbered list, and **end the turn**. Do not advance on your own judgment, do not infer approval
from silence or from an unrelated message. A gate clears only on an explicit response, recorded in
the artifact's `## Human Response` section with a UTC timestamp and the person's role.

- **Phase 4 Review** — the single consolidated sign-off. The human sees requirement understanding,
  strategy, cases, coverage, risks, open questions, and manual-only tests in one place, and can
  approve / edit / add / remove / supply missing information. No test code is written before this
  clears.
- **Phase 5b Manual delegation** — automation runs first; then the agent hands the QA human precise
  manual instructions and *waits*. Manual outcomes are never predicted.
- **Phase 8 Bug review** — every drafted bug needs per-bug human approval before it is filed.

## Output structure

One directory per Jira issue. Filenames are fixed — downstream skills read them by name.

```
qa-runs/<JIRA-KEY>/
├── state.json                  # phase, status, gates, exceptions, history
├── 00-source.md                # raw Jira snapshot, never hand-edited
├── 01-analysis.md              # issue fields + what changed/why/who/paths/blast radius
├── 02-test-strategy.md         # Test Type | Required? | Reason  (+ risk, envs, exit criteria)
├── 03-test-plan.md             # the 13-column case table, Actual/QA Status blank
├── 04-review.md                # consolidated review packet + human decision
├── 05-execution/
│   ├── tests/                  # generated automation, one file per case id
│   ├── evidence/               # screenshots, video, logs, traces, API responses, console errors
│   ├── manual-instructions.md  # precise delegation to the QA human
│   ├── results.json            # normalized machine-readable results
│   └── results.md              # the plan table, filled: Actual + QA Status
├── 06-test-report.md           # totals, coverage, failures, regression, env, evidence index
├── 07-bug-reports/
│   └── BUG-<KEY>-<n>.md        # one file per defect
└── 08-bug-review.md            # per-bug approval decisions + filed Jira keys
```

Templates for every artifact are in `templates/`. Render from them so every run looks the same; do
not improvise a layout.

### The test plan table (fixed columns)

`03-test-plan.md` and `05-execution/results.md` share one column set, in this order:

`Test ID | Test Type | Priority/Risk | Preconditions | Test Data | Steps | Test URL | Expected |
Actual | QA Status | Automation Status | Execution Owner | Notes`

- **QA Status:** `Passed` · `Failed` · `Blocked` · `Not Run` · `Requires Human Validation`
- **Automation Status:** `Automated` · `Manual Only` · `Candidate` · `Blocked`
- **Execution Owner:** `AI Agent` · `QA Human` · `Shared`

The plan is written with `Actual` and `QA Status` empty (`Not Run`); Phase 5 produces the filled
copy at `05-execution/results.md`. The plan itself is frozen once Review clears — rework means
re-running Phase 3, not editing results into the approved plan.

### Stable IDs

`TC-001`… assigned in Phase 3 are the join key across plan, tests, `results.json`, report and bugs.
**Never renumber an existing case — append.** Requirements are `REQ-001`…, acceptance criteria
`AC-001`…, bugs `BUG-<JIRA-KEY>-<n>` (each citing its `TC-`).

## Skill architecture

`qa-agent` is the orchestrator and the only skill that writes `state.json.currentPhase`. It reads
state → runs the one skill for the next phase → verifies the artifact landed → advances or halts at
a gate. It does not do the analysis itself.

Phase skills are single-purpose: each reads prior artifacts by filename, writes exactly one artifact
(Phase 5 writes one directory), and reports back. A phase skill whose input is missing must stop and
name the phase that has to run first — never reconstruct the input.

## Configuration

`qa.config.json` holds everything environment-specific: Jira source, automation framework and
commands, environment URLs, and the controlled vocabularies (test types, statuses, severity,
priority, execution owners). Skills read it; they never assume a stack. If a needed key is missing,
ask the user once and write the answer back to the file.

## Jira access

Preferred: the Atlassian MCP connector (`mcp__claude_ai_Atlassian__*`). It needs auth — if calls
fail, run its `authenticate` tool and tell the user to complete it. Fallback: ask the user to paste
the issue. Either way the raw issue is snapshotted to `00-source.md` first, so later phases are
reproducible and don't re-fetch.

**Read-only. Full stop.** The only Atlassian tools this pipeline may call are read tools —
`getJiraIssue`, `search`, `searchJiraIssuesUsingJql`, `fetch`, `getJiraProjectIssueTypesMetadata` and
the like. **Every Atlassian write tool is forbidden**, including `createJiraIssue`,
`addCommentToJiraIssue`, `editJiraIssue`, `transitionJiraIssue`, `createIssueLink`,
`addWorklogToJiraIssue` and the Confluence write tools. This is not a "get approval first" rule — it
is a prohibition. See guardrail 2.

Everything this pipeline produces is a **markdown file under `qa-runs/<JIRA-KEY>/`**. That is the
deliverable. Bug reports in `07-bug-reports/` are written so a human can paste them straight into a
Jira ticket, but the agent never creates that ticket, and never asks to.

## Conventions

- **Traceability is the point.** Every case cites its `AC-`/`REQ-`; every bug cites its `TC-`; the
  report reconciles counts against the plan. A requirement with no case is called out loudly, not
  quietly dropped.
- **Evidence over assertion.** Any `Passed`/`Failed` traces to `results.json` or a human entry, with
  an evidence path where the harness produced one.
- **Artifacts are append-friendly.** Re-running a phase overwrites only its own artifact and appends
  a dated entry to `state.json.history`. A regenerated artifact that invalidates downstream ones gets
  a `> ⚠️ Superseded <timestamp>` banner on those.
