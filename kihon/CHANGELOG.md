# Changelog — the Kihon layer

All notable changes to this layer. Semver; consuming projects declare
the version they cascade from in their pointer stub.

## 0.1.0 — 2026-07-26

Initial distillation. The layer as extracted from its source project:

- `KIHON.md` — the round model and the ten laws (K1–K10).
- `AGENT.md` — the conduct floor: identity honesty, invocation
  priority, the three currencies, evidence discipline, authority,
  bounded engagement, scope, refusals.
- `CADENCE.md` — the round step by step, with the field-notes appendix
  (the untracking, stale-process, immutable-cache, and
  racing-assertion traps).
- `RECORD.md` — append-only records, additive contracts, deterministic
  gates, honest failure, provenance of decisions.
- `PROTO.md` — the Proto pattern, composed modules,
  doctrine-as-documents, the remix law, the homage law.
- `STUB.md`, `BOOTSTRAP.md`, `templates/` (quality contract, trace,
  ADR, task).

## 0.1.1 — 2026-07-26

Patch. One rule added to `RECORD.md`; no law renumbered, nothing removed.
`kihon-version` moves, so STUB.md is re-pasted in consuming projects.

- `RECORD.md` §4 — **a gate with known findings carries a baseline.** A
  reporting gate that exits non-zero on findings you have read and accepted
  cannot sit in a composite chain: the chain then fails forever, and a gate
  that always fails teaches people to ignore gates. Such a gate declares the
  count it expects and the reason it is accepted. Exceeding the baseline
  fails. Coming in *under* it fails too — a baseline that drifts down
  silently stops being a ratchet, and the next regression hides in the slack.
  Lowering it is a deliberate edit, recorded in the round's trace.

  *Receipt: a consuming project ran `typecheck && lint && test && kata-lint`
  as its composite gate for sixteen rounds. kata-lint exits non-zero on three
  documented findings, so the composite had never once passed — while each
  gate was reported green individually and honestly. The defect was in the
  chain, not in any gate, and nothing in this layer had named it.*

## 0.1.2 — 2026-07-30

Patch. Adds `kaiden.yaml`, this pack's own manifest, so a foundry can compose
it without knowing anything about it in advance. No teaching changed.

The manifest declares that this repository composes `kihon/` to `kihon/` in a
leaf — one directory, same name — and names the five doctrine files downstream
may rely on.

The version moves because the content moved: the school's cut tool refuses to
publish a pack whose files changed while its version did not, and that refusal
is the mechanism that makes a cut reproducible. A manifest is content.

## 0.1.3 — 2026-07-30

Patch. One bullet in `AGENT.md` §4 Evidence, and it was paid for twice.

**A green gate proves nothing until you know what it ran.** Exit code zero and
"no tests were found" are the same colour.

The receipt: a test command was written as `node --test <dir>`. On one version of
the runtime that expands to the files inside; on another it is resolved as a
module and fails outright. The first fix replaced it with a quoted glob, which
was worse — it matched the files on the newer runtime and matched *nothing* on
the older one, so the gate went green having executed no tests at all. The same
defect was then reintroduced in a second repository after the lesson had already
been learned, because the local machine and the runner disagreed and only the
local machine was consulted.

§4 already said "count the tests". It did not say to count them **where the gate
runs**, and that is the half that was missing.

## 0.1.4 — 2026-07-30

Patch, correcting 0.1.3. No teaching changed.

0.1.3 bumped `KIHON.md` and left `kaiden.yaml` declaring 0.1.2, so the release
carried a manifest that disagreed with its own version. The foundry's validator
refused it — *"a pack whose manifest disagrees with its own release is not
reproducible"* — which is the refusal working, and the reason this correction is
a release of its own rather than a quiet edit: 0.1.3 was published, and a
published version is never rewritten.

Both files now say 0.1.4. This is the second receipt for the bullet 0.1.3 added:
the version lives in two places, and only one of them was checked.

## 0.1.5 — 2026-07-30

Patch. One more bullet in `AGENT.md` §4, and this one is about the shape of the
hole rather than any particular tool.

**A tool that worked once has not been verified.** The second call in the same
environment runs against state the first one left behind, and that is where the
untested branch lives.

The receipt: a tool that clones a repository if absent and fetches it if present
was exercised in a job where every clone was absent. It passed. The next step in
the same job found them all present, took the fetch branch, and failed on
credentials the clone had supplied for itself. Both branches were written at the
same time; only one had ever run.

This is not the same lesson as the bullet above it. That one says read the gate's
output. This one says the gate may not have reached the code at all — first-run
and second-run are different programs, and a suite that only ever starts from
nothing tests half of what was written.
