# CHANGELOG

Semver for the Kata layer itself. Consuming projects declare the version they cascade from (`kata-version:` in `PROJECT.kata.md`) and re-run the fresh-reader test on every upgrade.

## 0.4.0 — 2026-08-11

The Estate. Lands the Rev-3 standing rules as law (ESTATE REV-3 HANDOFF, ratified with rulings by the Chair 2026-08-11; the ratification record is Boardroom Round 274).

- New pack `packs/estate.kata.md` — the standing rules as protected law: authority down through gates, evidence up through stamps, no layer both decides and executes; never-raw; the auditor may block and never approve, decorrelated from the generator. Entities: `room` (a place), `seat` (a brain), `surface` (a replaceable, attach-only window that owes no diff review — the IDE is the diff surface), `auditor`, `evidence`. Estate tokens: `--estate-home` (the capital, C:/Ichiryu — ruling B5), `--estate-registry`, `--estate-execution-owner: paseo`.
- New pack `packs/registry.kata.md` — the registry's schema and law, with the instance deliberately OUTSIDE the law (ruling B2: schema in law, instance in Chair-declared state). Protected: the registry owns identity. Entry schema: id, path, aliases, law, verifier required; brief, workspace, severity-threshold, decisions, starred optional. Birth registers (ruling B1): the ceremony writes the entry, the Chair runs the ceremony, the first landed round proves it.
- New pack `packs/tiers.kata.md` — dispatch tiers reconciling Rev-3's valve with the standing amendment of 2026-08-02 (ruling B3): trivial auto-dispatches into verifier loops and is blocked by auditor findings at or above the entry's threshold; standard is the round law as lived; irreversible/expensive/credential-touching is Chair-initiated only.
- New trait `traits/driver.kata.md` — the dumb valve, written and bound to NOTHING (Rev-3 §6 deferral): relay verbatim, dispatch-is-ask, zero write tools, no delegation, never touch what you can't identify. Carries its harness-half requirement (law here, enforcement in the binding harness's own permission layer) and gate GA.
- New example `examples/paseo.json` — the estate drop-in for a venture's planning seats (commands as strings; keys never in the file).
- Packs remain optional and additive; no core, base, token, or PROTOAGENT change. Declaring `estate` without `registry` and `tiers` is a lint defect by declaration in the pack's prose.

## 0.1.0 — 2026-07-22

Initial release. Derived from the ProtoCSS draft specification, renamed **Kata**, with these structural changes:

- Core/pack split: `port`, `adapter`, `implementation`, `service` moved out of the core entity types into the optional `packs/hexagonal.kata.md`. Core stays architecture-agnostic.
- Base layer extracted from the spec into `base.kata.md`; tokens extracted into `tokens.kata.md`; traits extracted into `traits/*.kata.md`. The spec explains; the stylesheets govern.
- Tokens canonicalized to one set (`--authority-model` replaces the duplicate `--preferred-authority`; `--minimum-evidence` retained).
- Enforcement honesty (§0.3): v0.x is enforced by reading discipline; the **fresh-reader test** is the acceptance criterion; the linter (§17) is roadmap.
- Explicit rule (§3.7): CSS selector specificity does not apply — resolution is layer order + operations + conflict rules only.
- Normative boundary (§0.4): `*.kata.md` governs authority/scope/verification; prose governs rationale.
- Versioning (§0.6): the layer is semver'd; `kata-version:` declaration required in every project stylesheet.
- Added `STUB.md` (the canonical pointer block) and `ADOPTION.md` (the additive autotune protocol, itself expressed as `task#adopt-kata`).
- File convention: `*.kata.md` = normative stylesheet; plain `.md` = prose. The `.css.md` double extension is retired.

## 0.2.0 — 2026-07-22

The Protoagent. Consolidates the architect constitution, the consultant constitution, and THE-EXCHANGE playbook into one constitutional floor beneath every agent.

- New: `PROTOAGENT.md` — the shared floor: invocation priority, the three currencies (defects, measurements, evidenced artifacts), anchoring, mechanical-before-conceptual verification, silence audit, provenance tracking (a model's suggestion is not the human's decision; settled is settled), the exchange floor (answer every objection, concede by name, report three, restate whole, end at physical evidence), bounded engagement with the twin stop conditions (design-is-sufficient / closed-until-trigger), decisive-measurement re-pinning, scope and increment discipline, refusals, drift check, and a portable compact summon block.
- Binding mechanism: incorporation by reference (KATA.md §0.4) — `agent { constitution: kata/PROTOAGENT.md; constitution-binding: verbatim; }` in `base.kata.md`. Jurisdiction is the stub: any AI acting on the project, in it or above it, enters as `agent` and inherits the floor.
- Base `agent` block extended: anchor-claims-to-artifacts, answer-raised-objections, track-decision-provenance, close-own-engagement-at-convergence; must-not claim-instance-continuity or manufacture-findings.
- New traits carrying the load-bearing seat asymmetries: `.generator`, `.verifier`, `.clean-room`. The floor holds what the seats share; the traits hold what makes them different — flattening them is defined as a defect, not a simplification.
- Stub load order gains `PROTOAGENT.md` (step 4); `kata-version` bumped to 0.2.0 throughout.
- Seat-specific constitutions (the summoning files) remain seat-level documents, loaded at the named-entity layer on top of the floor — the Protoagent replaces none of them.

## 0.3.0 — 2026-07-22

The linter arrives, and the first consumer pays its debt upstream. Every
change in this release carries a receipt from real adoption (a Chair-gated
multi-model meeting room; its ADR-012/ADR-013/ADR-014).

- New: `tools/kata-lint.ts` — the §17 linter's reference implementation, a
  single dependency-free TypeScript file that ships inside the layer (run
  via `npx tsx kata/tools/kata-lint.ts <project-root>`). Checks the
  mechanical subset: malformed blocks and unknown operations, circular
  extension, unresolvable `composes`/`extends`/`packs` references,
  scope-not-subset (E104), silent overrides, protected-rule modification,
  missing `kata-version`, and missing processor artifacts. The `contract
  <entity>` subcommand resolves the cascade in §15 order and emits the
  computed contract mechanically. §0.3 and §17 updated accordingly: the
  checklist stays normative; the linter is its instrument. *Receipt: §17
  named the linter as roadmap; the first adoption hand-compiled two
  computed contracts.*
- New: `processor:` standard property (§5.1) and §13.1 — processor-bound
  entities, whose contracts are enforced by named code rather than their
  own reading. Declares that divergence between stylesheet and processor is
  a code defect, and that composing a trait the processor has no stages for
  is itself a divergence to defer explicitly. *Receipt: the first adoption
  had to invent exactly this rule in prose, twice (its ADR-012
  classification note and ADR-013's deferred composition).*
- New: `examples/computed-contract.md` — a worked §15 resolution with a
  grading checklist, so the fresh-reader test has a reference answer.
  *Receipt: two hand compilations with no model answer to grade against.*
- New §17 checklist line: processor-bound declarations whose named
  processor artifact does not exist.
- `kata-version` bumped to 0.3.0 throughout; STUB.md re-paste required in
  consuming projects on upgrade (§0.6).

## 0.3.1 — 2026-07-26

Patch. The instrument is fixed, and the version declarations are made to agree
with the layer they claim to track. The grammar is unchanged, so no stylesheet
needs editing — but `kata-version` moves, so STUB.md is re-pasted on upgrade
(§0.6).

The question 0.3.0 left to the Chair is answered: `tools/kata-lint.ts` ships
inside `kata/`, so the tool is versioned with the layer.

- Fix: `tools/kata-lint.ts` deleted the body of every nested block, including
  the contextual rules §10 documents. `parseBody` flattened all braces with
  `body.replace(/\{[^{}]*\}/g, " ")` — right for the justification block in
  `replace x: y { reason: …; }`, wrong for a nested selector.

  Two consequences, and the second is the serious one. The bare selector left
  behind — `task`, `[boundary="external"]` — was reported as `KATA-E001`, a
  false positive against the spec's own worked examples. And **every
  declaration inside a `@when` block was silently dropped from the contract
  graph**, so `@when risk >= high { task { review: mandatory; } }` never
  reached a computed contract at all. The noise was visible; the hole was not.

  The two shapes are now told apart by what precedes the brace: a
  justification always follows a `prop: value` pair, a nested selector never
  does. Declarations from a nested selector are parsed into the block and
  carry an optional `within` field naming the selector they came from —
  additive, so existing readers are unaffected.

  *Receipt: found by the first consuming project to write a `@when` block.
  Running the shipped linter over KATA.md §10's own two examples produced two
  E001s; the same input is clean after the fix. On that project's real
  stylesheet, findings went 3 → 1, and the survivor is a genuine E109.*

- Fix: version declarations that claimed to track the layer and did not.
  `PROTOAGENT.md` read `Version: 0.2.0 (versioned with the Kata layer)` while
  the layer was 0.3.0. `ADOPTION.md` and `README.md` still showed
  `kata-version: 0.2.0;` in the block they tell adopters to copy, and
  KATA.md §0.6's own example showed 0.3.0. All four now read 0.3.1.

  Both prior releases state that `kata-version` was "bumped throughout", and
  both times it was not. The claim is dropped from this entry in favour of
  naming the files, because a sweep that is asserted rather than listed is a
  sweep nobody can check. *Receipt: found while cutting a bundle, by grepping
  every version declaration across five seeds rather than trusting the note.*

## 0.3.2 — 2026-07-26

The linter's documentation rule now recognises every kata layer directory,
not only the project's own. The instrument changed: `tools/kata-lint.ts`,
plus the version lines in `KATA.md`, `STUB.md`, `PROTOAGENT.md`,
`ADOPTION.md`, and `README.md`, and a regression test in
`tools/kata-lint.test.ts`.

- Fix: the layer test was `rel.startsWith("kata/")` — the project's own
  prefix only. A pack shipped in another layer's kata bridge — the
  semantic-signal harness ships `semantic-harness/bridges/kata/` — was read
  as a declaration instead of documentation, and a consuming project that
  vendored the harness layer verbatim paid for it twice: KATA-E103 (the
  usage example's `packs:` line "activates" a pack that was never installed)
  and KATA-E108 (the example block "declares no kata-version"). The rule now
  matches a `kata` path segment anywhere in the relative path, which is what
  the intent comment always said: pack usage examples are documentation,
  never declarations. Regression test added.

  *Receipt: found by the Boardroom audit (its Round 20). The venture
  restored the two bridge files its harness layer was missing, and its kata
  gate reported two findings against doctrine it was carrying, not
  adopting. The layer was verbatim; the tool was wrong. Sent upstream per
  the standing law, and it comes back as this version.*

## 0.3.3 — 2026-07-30

Patch. Adds `kaiden.yaml`, this pack's own manifest, so a foundry can compose
it without knowing anything about it in advance. No teaching changed.

The manifest records one thing a foundry could not otherwise know: only
`kata/` travels. This repository's own `docs/` and `tools/` are how the pack is
maintained, not what it teaches, and a composer given the repository root would
have carried both into every leaf.

The version moves because the content moved: the school's cut tool refuses to
publish a pack whose files changed while its version did not, and that refusal
is the mechanism that makes a cut reproducible. A manifest is content.
