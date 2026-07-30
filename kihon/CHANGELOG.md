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
