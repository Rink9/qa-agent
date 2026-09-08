# Phase 1 — Analysis — {{JIRA_KEY}}: {{TITLE}}

**Source:** `00-source.md` · **Analyzed:** {{UTC_TIMESTAMP}}
**Testability verdict:** `TESTABLE` | `TESTABLE_WITH_ASSUMPTIONS` | `NOT_TESTABLE` — {{reason}}

## 1. Issue Intake

| Field | Value |
|---|---|
| Key / Type | {{KEY}} / {{Story, Bug, Task…}} |
| Summary | |
| Priority | |
| Status | |
| Sprint | |
| Components | |
| Labels | |
| Parent / Sub-tasks | |
| Linked issues | {{key — link type}} |
| Attachments | {{name — reviewed? }} |
| Custom fields | |

**Description:** {{verbatim or "empty — see Q-###"}}

**Acceptance criteria as stated:** {{verbatim, or "none stated — see Q-###"}}

**Comments of consequence:** {{decisions or contradictions buried in discussion, with author}}

**Notable absences:** {{no ACs / no design link / unopenable attachment / description contradicted by comment}}

## 2. Understanding

| Question | Answer | Source |
|---|---|---|
| **What changed** | {{new / modified / removed behavior, data, interface}} | |
| **Why** | {{business or user problem — or "not stated, see Q-###"}} | |
| **Expected behavior** | {{observable post-change behavior}} | |
| **Who uses it** | {{roles, permissions, personas, entry points}} | |
| **Success path** | {{the happy path}} | |
| **Failure paths** | {{invalid input, empty state, permission denied, timeout, downstream error, concurrency, partial save}} | |
| **Blast radius** | {{shared components, APIs, migrations, jobs, flags, integrations, regression surface}} | |

## 3. Requirements

| ID | Requirement | Source excerpt | Notes |
|---|---|---|---|
| REQ-001 | {{one atomic testable behavior}} | {{field: "quote"}} | |

## 4. Acceptance Criteria

| ID | Covers | Criterion | Origin |
|---|---|---|---|
| AC-001 | REQ-001 | Given … when … then … | `stated` \| `derived` |

## 5. Out of Scope

- {{item}} — {{why}}

## 6. Open Questions → Phase 4 Review

| ID | Severity | Question | Blocks | Proposed default | Status |
|---|---|---|---|---|---|
| Q-001 | `BLOCKER` | | AC-00# | {{assumption if unanswered}} | `OPEN` |

Severity: `BLOCKER` (no meaningful plan without it) · `IMPORTANT` (known hole) · `NICE_TO_HAVE`.

<!-- Shared footer — every phase artifact ends with this block (guardrail 4). -->

## Confidence & Residual Risk

- **Confidence:** `High` | `Medium` | `Low`
- **Basis:** {{what this rests on — source quality, coverage achieved, evidence collected}}
- **Residual risk:** {{what remains uncertain or untested after this phase, and the impact if wrong}}
- **What would raise confidence:** {{the specific missing answer, access, data, or run}}
