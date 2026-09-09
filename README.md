# QA Agent

This repo turns a Jira issue into a full QA cycle — understanding the requirement, planning tests,
running them, and reporting the results — with an AI agent doing the work and you making the calls
that actually need a human. This guide explains how to use it, step by step.

## Requirements

- Claude Code, opened in this repo.
- Node.js + npm (for the generated Playwright tests): run `npm install` once.
- Your Jira instance connected to Claude Code (the Atlassian connector). The agent will tell you if
  it needs you to log in.

## The big picture

You give it a Jira key. It works through 8 phases on its own, and pauses for you at 3 points where
a human genuinely has to decide something. Everything it produces is saved as markdown files in
`qa-runs/<JIRA-KEY>/`, so you can always go back and read exactly what it did and why.

```
Jira issue
   │
   ▼
1. Analyze          → what does this issue actually ask for?
2. Test Strategy     → which kinds of testing does this need?
3. Test Plan         → the actual list of test cases
4. ★ REVIEW           → you check the plan before anything runs
5. Execute            → runs what it can, then hands you what it can't
   ★ MANUAL STEP      → you run the cases that need a login / human judgment
6. Test Report        → pass/fail totals and a verdict
7. Bug Report         → drafts a bug for anything that failed
8. ★ BUG REVIEW        → you approve each bug draft before it's "final"
```

★ = it stops and waits for you here. Nothing after a ★ happens until you respond.

## Getting started — your first run

1. Open this repo in Claude Code.
2. Type:
   ```
   /qa-agent PROJ-123
   ```
   (use your real Jira key, or paste the full Jira URL)
3. Watch it go. It will fetch the issue, read it, and produce a short summary after each phase —
   you don't need to do anything until it stops and asks you something.
4. When it stops, read what it's asking for (see "The 3 stop points" below), answer, and it
   continues automatically.
5. At the end, it tells you the run folder, the verdict, and exactly which files you can hand off.

That's the whole workflow. Everything below explains each part in more detail.

## The 3 stop points — what to do

### 1. Review (after the plan is written, before any test is run)

You'll see a packet summarizing: what the agent understood the requirement to be, the testing
approach it chose, the list of test cases, any coverage gaps, risks, and open questions.

**What to do:**
- Read it — a few minutes is usually enough, it's written to be skimmable.
- Reply `approve` if it looks right.
- Or point out anything wrong: `edit: ...`, `add case: ...`, `remove TC-004: ...`, or answer any
  open questions it listed (`Q-001: ...`).
- **No test code is written until you approve.** This is the point where you catch a
  misunderstanding before it turns into 20 wasted test cases.

### 2. Manual execution (after automation runs)

The agent runs whatever it can — anything that doesn't need a login and is safe/deterministic to
automate. Then it hands you a file: `qa-runs/<KEY>/05-execution/manual-instructions.md`, with
precise steps for everything else (things that need a real login, a judgment call, or access the
agent doesn't have).

**What to do:**
- Open that file. Each case has numbered steps and an exact expected result.
- Run it, then fill in that case's **QA Status** (`Passed` / `Failed` / `Blocked` /
  `Not Run` / `Requires Human Validation`), what you actually saw, and where you saved any
  screenshot.
- You can either edit the file yourself, or just tell the agent your results in chat — both work.
- **Only fill in what you actually ran.** Anything you skip should just stay `Not Run` — that's a
  real, honest result, not something to guess at.

### 3. Bug review (before any bug is "final")

For every test case that failed, the agent drafts a bug report — title, repro steps, expected vs.
actual, severity, evidence.

**What to do:** approve, edit, merge two bugs together, split one, reject (if it's not really a
bug), or defer, one at a time. Nothing is filed anywhere automatically.

> **Important:** this agent never writes to Jira. It only ever *reads* the issue. Approving a bug
> here means "this draft is done" — filing it in Jira is a manual copy-paste, by you.

## The skills (what each one does)

You normally never call these directly — `/qa-agent` calls them for you in order. But if you want
to redo just one step, you can invoke it directly.

| Command | What it does | When you'd run it yourself |
|---|---|---|
| `/qa-agent <KEY>` | Runs the whole pipeline, or resumes where it left off | Almost always start here |
| `/qa-agent <KEY> --status` | Shows where a run stands — changes nothing | Checking progress without touching anything |
| `/qa-agent <KEY> --phase <N>` | Redoes just phase N, overwriting that file | You got new info and want to fix one step |
| `/qa-agent <KEY> --to <N>` | Runs forward until phase N or a stop point | You want to fast-forward to a specific phase |
| `/qa-analyze` | Reads the Jira issue and figures out the real requirements | Rework after the ticket changed |
| `/qa-test-strategy` | Decides *which kinds* of testing this needs (and which it doesn't) | You disagree with the testing approach |
| `/qa-test-plan` | Writes the actual list of test cases | You want to add/remove cases |
| `/qa-review` | Presents everything for your sign-off (★ stop point) | — |
| `/qa-execute` | Runs the automated tests, then hands you the manual ones (★ stop point) | Re-running after a fix |
| `/qa-test-report` | Totals up pass/fail and gives a verdict | Check current status any time, even mid-run |
| `/qa-bug-report` | Drafts a bug report for each failed case | — |
| `/qa-bug-review` | Your final approval on each bug draft (★ stop point) | — |

## Reading the results

Everything for one ticket lives in `qa-runs/<KEY>/`:

```
qa-runs/<KEY>/
├── 00-source.md            the raw Jira issue, as fetched
├── 01-analysis.md          what the agent understood the requirement to be
├── 02-test-strategy.md     which testing types, and why
├── 03-test-plan.md         the full list of test cases (approved, frozen)
├── 04-review.md            your sign-off record
├── 05-execution/
│   ├── manual-instructions.md   your to-do list
│   ├── results.md               the plan, filled in with real results
│   └── evidence/<TC-id>/        screenshots, video, logs per case
├── 06-test-report.md       the verdict
├── 07-bug-reports/         one file per bug, ready to paste into Jira
└── 08-bug-review.md        your approval record per bug
```

If you only read one file, read **`06-test-report.md`** — it opens with the verdict, then backs it
up with totals, evidence, and what's still missing.

### What "QA Status" means

| Status | Meaning |
|---|---|
| `Passed` | Ran, worked as expected |
| `Failed` | Ran, did not match the expected result — becomes a bug draft |
| `Blocked` | Couldn't run at all — environment issue, missing access, etc. (not a product bug) |
| `Not Run` | Nobody has run it yet |
| `Requires Human Validation` | Ran, but the result needs a person's judgment (visual/UX calls) |

### The verdict, in `06-test-report.md`

- **QA Approved** — everything required passed.
- **QA Approved with Exceptions** — a human explicitly accepted a known risk (named in the report).
- **Not Approved** — something required failed.
- **Incomplete** — not enough has been run yet to say either way. This is the honest answer when
  cases are still sitting at `Not Run` — the agent will never round that up to a pass.

## Configuration

`qa.config.json` holds the environment-specific stuff: which test framework to use, your
environment URLs, and the vocabulary (statuses, severities, priorities) the whole pipeline uses. If
something needed is missing, the agent will ask you once and save the answer there for next time.

## Notes for a fresh clone

`qa-runs/` is not committed — it's generated per run.
