---
name: qa-analyze
description: Phase 1 — analyze a Jira issue into a structured understanding: all issue fields, what changed and why, expected behavior, who uses it, success and failure paths, blast radius, plus testable requirements, acceptance criteria and open questions. Use when the user says /qa-analyze or asks to analyze, break down, or assess a ticket for QA.
---

# Phase 1 — Analyze

Input: `qa-runs/<KEY>/00-source.md`. Output: `qa-runs/<KEY>/01-analysis.md` from
`templates/analysis.md`. If the source snapshot is missing, stop and say Phase 0 must run first —
do not re-fetch Jira yourself.

**Guardrail 1 governs this phase.** Extract; do not invent. Everything you write is either quoted
from the issue or explicitly marked `derived`, and every `derived` item becomes an open question.

## 1. Issue intake

Record every field from the snapshot: key, type, summary, description, acceptance criteria,
comments (especially decisions buried in discussion), attachments, linked / parent / sub issues,
labels, components, priority, sprint, and any custom fields in `qa.config.json`.

Note absences as findings, not as blanks: no ACs, no design link, an attachment you cannot open, a
comment that contradicts the description. A contradiction between the description and a comment is
an open question, never a silent pick.

## 2. Answer the six questions

The heart of the phase. Each answer cites its source field.

- **What changed** — the concrete delta in behavior, data, or interface. New / modified / removed.
- **Why** — the business or user problem. If the issue never says, that is an open question, not a
  guess.
- **Expected behavior** — how the system should behave after the change, in observable terms.
- **Who uses it** — roles, permissions, personas, internal vs external, entry points.
- **Success and failure paths** — the happy path, plus every way it can fail: invalid input, empty
  state, permission denied, timeout, downstream error, concurrent edit, partial save.
- **Blast radius** — what else this touches: shared components, APIs, data migrations, jobs, feature
  flags, integrations, existing behavior at risk of regression.

## 3. Requirements and acceptance criteria

- **Requirements** `REQ-001`… — atomic and testable, one behavior each. Split compound statements
  ("user can filter and export") into separate requirements. Quote the source excerpt.
- **Acceptance criteria** `AC-001`… — each mapped to a `REQ-`. Keep the author's wording and mark it
  `stated`; anything you inferred is `derived` and feeds the open questions.
- **Out of scope** — what the issue excludes, plus adjacent behavior you are choosing not to cover,
  so the boundary is on record.

## 4. Open questions

Anything that blocks or weakens testing: missing ACs, ambiguous wording ("fast", "should handle"),
undefined boundaries, unstated roles, missing error behavior, environment or data unknowns, absent
definition of done.

Classify each `BLOCKER` | `IMPORTANT` | `NICE_TO_HAVE`, and for each give the **proposed default** —
the assumption you will otherwise proceed on. That makes Phase 4 cheap to clear: the human can reply
"defaults are fine" and the record shows exactly what that meant.

Do **not** stop for answers here. Questions travel to the Phase 4 Review gate, which is the single
consolidated sign-off. The one exception: if the issue is so thin that no meaningful strategy is
possible (`NOT_TESTABLE`), say so, set the blocker in `state.json`, and let the orchestrator stop.

## 5. Testability verdict

`TESTABLE` | `TESTABLE_WITH_ASSUMPTIONS` | `NOT_TESTABLE`, with the reason and the assumption count.

## Footer

Close with the Confidence & Residual Risk block (guardrail 4): your confidence in this reading of
the issue, its basis, and what remains uncertain. Low confidence here is useful information — say it.
