# RECORD — the honest record

Version: 0.1.1 (versioned with the Kihon layer)

A Kihon project's record is its most valuable artifact — more than the
code, which the record can regenerate, and more than any session, which
the record outlives. This file defines what the record contains and the
laws that keep it honest.

---

## 1. What the record is

The record is everything written down as it happened:

- **The event log** — the project's own transcript of what it did:
  append-only, one entry per event, never edited.
- **Traces** — one per round: evidence, assumptions, corrections, one
  stop reason (`templates/trace.yaml`).
- **Contracts** — one per round, filled before the work
  (`templates/quality-contract.yaml`).
- **ADRs** — one per decision a future reader will wonder about
  (`templates/adr.md`): status, date, the human's words where they
  drove it, the decision, the consequences.
- **Commit history** — linear, one round per commit, each message the
  story of its round.

A newcomer — human or model — must be able to reconstruct *why the
project is the way it is* from the record alone. That is the record's
acceptance test.

## 2. Append-only (K5)

Entries are written once. A wrong entry is corrected by a **new entry
that supersedes it**, stating what it supersedes — never by editing the
original. Applied everywhere it matters:

- Event logs append; nothing is deleted or rewritten.
- Variants accumulate: a regenerated artifact is a *new* artifact
  beside the old one, not a replacement over it.
- "Clearing" is archival: hidden, never destroyed, always
  recoverable.
- Mainline git history is fast-forward only; force-push to the
  mainline does not happen.

Rationale: an append-only record can be trusted *because* it cannot be
retouched. The first silent edit costs more than every megabyte the
policy will ever spend.

## 3. Additive contracts (K5)

Data contracts — event schemas, API shapes, file formats — grow by
**addition within a version**: new optional fields, never repurposed or
redefined ones. Every additive change is flagged in the commit that
makes it, so a reader of history can find every shape the contract has
ever had. Old entries stay readable forever; new readers tolerate the
absence of new fields. Breaking changes are a version bump and a
migration, never a quiet mutation.

## 4. Deterministic gates (K9)

The record is only as honest as the gates that feed it:

- Every gate — tests, typechecks, linters — runs offline and returns
  the same answer twice. A flaking gate is fixed with the same priority
  as a product defect, because a gate nobody trusts is a gate nobody
  reads.
- The mock mode is a first-class deliverable: deterministic stand-ins
  for every external provider, faithful in shape, marked in provenance
  (a mocked result says so). The whole system must be exercisable
  without a network or a bill.
- Provenance rides with results: which model, which latency, which
  token spend, mock or live. Cost is part of the record.
- **A gate with known findings carries a baseline, and the baseline is
  a ratchet.** Some gates report rather than pass — a linter with a
  defect of its own, a check whose findings are real but belong to
  someone else to fix. Chaining such a gate raw produces a composite
  that can never pass, and a gate that always fails is worse than no
  gate: it is read as noise from the second run onward. Give it a
  number, print the reason beside it every run, and fail when the count
  EXCEEDS it. Fail when it comes in *under* it too — a baseline that
  drifts down silently stops being a ratchet, and the next regression
  hides in the slack.

A composite gate that has never once passed is not a strict project.
It is an unread gate wearing a green name, and it hides the next real
failure. Run the chain, not only its links.

## 5. Honest failure

The record shows failures as failures:

- A failed enrichment is a log line and an absent field — never a
  fabricated success, and never a hidden retry loop.
- A gate that failed is reported with its output, not summarized into
  softness.
- A skipped step is named as skipped.
- Abnormal completions (truncation, filtering, provider errors) are
  rejected honestly by the code that receives them: one bounded retry
  where a retry is cheap, then a plain refusal on the record —
  never a silently shortened artifact shipped as whole.

## 6. Provenance of decisions

Decisions belong to the human; the record proves it:

- ADRs quote the human's words when the human drove the decision.
- A model's suggestion is recorded as a suggestion until the human
  ratifies it (see `AGENT.md` §5).
- Settled decisions carry their date and source, so precedence is
  resolvable by reading, not by memory.
