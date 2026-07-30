# task — <round name>

> The human's words, verbatim, that opened this round. Quoting them here
> keeps the round anchored to the ask, not to the agent's paraphrase.

## Objective

One line: the state of the world when this round is done.

## Scope

The files and surfaces this round may touch. Anything not listed is a
question, not a permission.

## Must

- The behaviors this round guarantees, one line each — these become the
  red tests (K2).

## Must not

- The exclusions, one line each — re-read before finishing (AGENT.md §7).

## Acceptance

- red-first cases green
- full suite green, typechecks and lint clean (K9)
- end-to-end proof on the isolated stack (K4)

## Evidence

Contract: `traces/qc-<round-name>.yaml` · Trace: `traces/<round-name>.trace.yaml`
