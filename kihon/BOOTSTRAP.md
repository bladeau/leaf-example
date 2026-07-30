# BOOTSTRAP — day zero

Version: 0.1.1 (versioned with the Kihon layer)

How to seed a new project with Kihon — written for the solo founder
starting a repository with an AI harness as the build crew.

---

## 1. Install the layer (five minutes)

1. `git init` (or open the existing repository).
2. Copy `kihon/` — unmodified — into the project root.
3. Paste the pointer block from `kihon/STUB.md` into `CLAUDE.md` /
   `AGENTS.md`. Create the file if it doesn't exist; the stub can be
   its first section.
4. Commit: `Adopt Kihon 0.1.0`.

## 2. Declare the ground rules (one conversation)

Tell the agent — or write directly into `CLAUDE.md` beneath the stub —
the project's local physics. At minimum:

- **The decisive measurement.** The one number or event that means the
  project is working (first paying user; the pipeline running
  end-to-end; the artifact a real person used). Every consequential
  round gets weighed against it (`AGENT.md` §6).
- **The live environment.** Which ports, processes, and data are
  *yours* — the agent never touches them (K4). Name the proof ports
  and the throwaway state location while you're at it.
- **The landing word.** Whatever phrase you'll use ("land it" works).
  The agent treats it as the only landing signal (K1).
- **The stack and its gates.** Test runner, typechecks, linters — the
  deterministic gate set every round must pass (K9).

## 3. Set up the skeleton (first round)

Run the first round *as a round* — contract, red, build, verify, prove,
trace, land — even though it's only scaffolding. It should produce:

- the test runner wired with one real test;
- **mock mode** for every external provider the project will call —
  deterministic, offline, marked in provenance (K9). Build this before
  building the features that need the providers: every later round
  proves itself against it;
- an append-only event log if the product has any runtime behavior
  worth recording (K5);
- `adrs/`, `traces/`, `tasks/` directories, seeded from
  `kihon/templates/`;
- ADR-001: why this project adopted Kihon, in your own words.

The first round landing cleanly is the fresh-reader test passing in
practice.

## 4. Grow by rounds

From here the project is a sequence of rounds. Practical notes from the
project this layer was distilled from:

- **One directive, one round.** When a second ask arrives mid-round,
  it joins as a second commit only if it belongs; otherwise it queues.
  Rounds stay small enough that a bad one is cheap to discard.
- **Write the doctrine before the feature.** When a feature needs a
  model to behave a certain way, write the document first (K6), then
  the engine that seats it, then the test that proves the document
  reaches the call.
- **Consolidate on the third duplication.** The first two similar
  roles can stand alone; the third triggers the Proto pattern
  (`PROTO.md`). Same for prompts, mocks, and page templates.
- **Enrich never-fatal from day one** (K8). The first version of any
  advisory layer ships with its failure path tested.
- **Let the record compound.** ADRs cite earlier ADRs; traces cite the
  contract; commit messages tell the story. Six months in, the record
  is the project's memory — and any fresh model's onboarding.

## 5. Composing with a product-side constitution

If the project also adopts a product governance layer (such as Kata —
entities, authority cascade, computed contracts), install both and keep
the division written down where both are declared:

> The product layer governs *who may do what*; Kihon governs *how the
> AI works*. Authority questions resolve to the product layer; practice
> questions resolve to Kihon; a conflict neither owns escalates to the
> human.

The layers are designed not to overlap: Kihon never grants authority,
and a product constitution never defines the round.

## 6. Upgrading the layer

Kihon follows semver. To upgrade: replace `kihon/` wholesale with the
new version, diff `CHANGELOG.md`, update the version in the stub, and
re-run the fresh-reader test. Never patch the layer in place — local
needs go in your own documents, composed on top (K7), so the next
upgrade stays a folder swap.
