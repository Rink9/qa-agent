---
name: qa-review
description: Phase 4 — the consolidated human review gate. Presents requirement understanding, test strategy, test cases, coverage, risks, open questions and manual-only tests in one packet, then stops for the human to approve, edit, add, remove, or supply missing information. Use when the user says /qa-review or asks to review or sign off on the QA plan for a ticket.
---

# Phase 4 — Review ★ HUMAN GATE

Inputs: `01-analysis.md`, `02-test-strategy.md`, `03-test-plan.md`. Output:
`qa-runs/<KEY>/04-review.md` from `templates/review.md`.

This is the single consolidated sign-off. Everything before it is a proposal; nothing after it
starts until a human clears this gate. **No test code is written before Review clears.**

## Build the packet

Summarize — do not re-paste whole documents. The human should be able to read this in a few minutes
and know exactly what they are approving. Seven sections:

1. **Requirement understanding** — what changed, why, expected behavior, who uses it, success and
   failure paths, blast radius, in ~10 lines. Mark every `derived` item so the human can correct
   your reading before it becomes a test contract. This is where invented requirements get caught.
2. **Strategy** — the Test Type / Required? / Reason table verbatim (it is short and it is the
   decision), plus the risk ranking and what is deliberately under-tested.
3. **Test cases** — the case index: `TC-` id, title, type, priority, `Covers`, Automation Status,
   Execution Owner. Not the full steps; link to `03-test-plan.md` for those.
4. **Coverage** — AC-by-AC: covered by which cases, or **not covered** with the reason. Lead with
   the gaps, not the coverage.
5. **Risks** — product risk from the strategy plus risks to the test effort (env, data,
   dependencies), each with its mitigation.
6. **Open questions** — every unresolved question from Phase 1, `BLOCKER` first, each with its
   proposed default. Number them `Q-###` so the human can answer by id.
7. **Manual-only tests** — every `QA Human` / `Shared` case called out separately with the effort
   implied and why it cannot be automated. The human is committing their own time here; make that
   cost visible rather than burying it in a table.

## The gate

After writing the file:

- Set `gates.REVIEW.status = "open"`, `status = "awaiting_human"` in `state.json`.
- In chat, print: headline counts, blocker questions with defaults, uncovered ACs, and the manual
  workload. Keep it short enough to read without scrolling.
- Offer the four actions explicitly: **approve** / **edit** / **add** / **remove** / **supply info**.
- **End the turn.**

Do not proceed on silence, on an encouraging remark, or because the defaults look obviously fine.
Approval must be explicit and about this gate.

## Handling the response

Record it in `## Human Response` with a UTC timestamp and who gave it, then route the changes to the
phase that owns them — never patch the review packet and call it done:

| Response | Action |
|---|---|
| Approve | Clear the gate, advance to Phase 5. |
| Answers to questions | Update `01-analysis.md` (promote to `REQ-`/`AC-`), then re-run any phase whose input changed. |
| Edit strategy | Re-run Phase 2, then Phase 3, then re-review. |
| Add / remove / edit cases | Re-run Phase 3 (appending new ids, never renumbering), then re-review. |
| Supply missing info | Treat as answers; note the source so it is traceable. |

An answered question is marked `RESOLVED`; one the human declines to answer is `DEFERRED` and
**stays a risk** — carry it into the plan and into the Phase 6 residual risk. A deferred `BLOCKER`
means the eventual verdict cannot be `QA Approved` without a documented exception (guardrail 3).

If the changes are substantial, re-run the affected phases and present the packet again rather than
treating a partial approval as full sign-off.

## Footer

Confidence & Residual Risk, stated *before* the human answers — it tells them where to look hardest.
