---
name: qa-bug-review
description: Phase 8 — present each drafted bug report for per-bug human approval, then finalize the approved ones as handover-ready markdown under 07-bug-reports/. Read-only with respect to Jira; nothing is ever created there. Use when the user says /qa-bug-review or asks to review or approve the bugs found for a ticket.
---

# Phase 8 — Bug Review ★ HUMAN GATE

Input: `07-bug-reports/*.md`. Output: `qa-runs/<KEY>/08-bug-review.md` from `templates/bug-review.md`.

This gate exists because of guardrail 2: **every bug draft needs explicit human approval, per bug,
before it is finalized as a deliverable.** Approval of one bug is not approval of the batch.

**Jira is read-only for this entire pipeline.** Approval here does **not** mean "file it" — it means
the draft is final and ready to hand to a human. Never call any Atlassian write tool. If the user
asks you to create the ticket, say that the pipeline is read-only by design and point them at the
markdown file, which is written to be pasted straight into Jira.

## Present the batch

Write the review sheet — one row per draft — and print the same in chat:

| Bug | Severity | Priority | Title | From | Affected area | Decision |
|---|---|---|---|---|---|---|
| BUG-KEY-1 | Critical | P1 | | TC-004 | | pending |

Then, for each bug, give two or three lines: the symptom, the evidence you have, and anything you
are unsure about — a severity you would defend weakly, a grouping that could go either way, a
suspected flake. Surface your own doubts here rather than letting them be discovered after filing.

Separate sections for:

- **Product defect drafts** — awaiting approval to file.
- **Test / environment failures** — not bugs; proposed as test-suite follow-ups, listed so the human
  can overrule you if one is really a product defect.
- **Requires Human Validation** — cases still needing a judgment call before they could become bugs.

Set `gates.BUG_REVIEW.status = "open"`, `status = "awaiting_human"`, and **end the turn.**

## Decisions

Per bug, the human can: **approve** (finalize as drafted) · **edit** (change fields, then finalize) ·
**merge** into another bug · **split** · **reject** (not a defect, or won't report) · **defer**.
Record every decision with a timestamp and who made it — including rejections and the reason, since
that record is what stops the same non-bug being re-raised next run.

## Finalizing (never filing)

Only for bugs explicitly approved. For each:

1. Set the draft's header to `APPROVED — ready to file (not filed by agent)` with the approver and a
   UTC timestamp.
2. Apply any edits, merges or splits the human asked for, then re-read the file to confirm it stands
   on its own for a reader who has never seen this repo.
3. Update the review sheet row to `Approved — handover ready`, and record the decision, approver and
   timestamp for every draft including rejections and deferrals.

**Never create a Jira issue, comment, link, or transition — under any circumstance, including an
explicit request.** There is no code path in this pipeline that writes to Jira. A bug that a human
later files in Jira can have its key pasted back into the draft header by that human; the agent does
not go looking for it.

For rejected drafts, keep the file and mark it `REJECTED` with the reason. Deleting it loses the
record that stops the same non-bug being re-raised next run.

## Finish

Set the phase to `DONE` and report: approved drafts with their severities and file paths, rejected
drafts with reasons, deferred items, and the run directory. State plainly that nothing was created in
Jira and that the markdown files are the handover. Restate the Phase 6 verdict with its confidence level and residual
risk, so the last thing the user sees is what is actually known — and note explicitly if the verdict
is `QA Approved with Exceptions` and which exception carried it.
