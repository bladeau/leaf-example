# ADOPTION.md — bringing an existing project under Kata

This is the "autotune" protocol. It is **additive**: existing documents are inventoried, classified, and referenced — never rewritten, never deleted. The project bends toward the form; its history stays intact.

Give this file, plus the installed `kata/` folder, to the agent performing the adoption. The agent's own contract is §7 below.

---

## Step 0 — Install

Copy `kata/` unmodified into the project root and paste the pointer block from `STUB.md` into `CLAUDE.md` / `root.md`. Do not proceed until the stub is in place — adoption is performed *under* the layer, not before it.

## Step 1 — Inventory

List every governance-bearing document in the project: constitutions, manifests, working agreements, agent kernels, architecture docs, ADRs, reviews, seeds, task/leaf specs. Produce an inventory table: path, one-line role, date if known.

## Step 2 — Classify

Map each inventoried document to a Kata layer. Typical mapping:

| Existing document                            | Kata layer     | Action |
|----------------------------------------------|----------------|--------|
| CONSTITUTION.md, PROJECT-MANIFEST.md         | project        | Reference from `PROJECT.kata.md`; extract authority, invariants, verification as declarations |
| ARCHITECTURE.md                              | architecture   | Reference; extract must / must-not |
| WORKING-AGREEMENTS.md, agent kernel docs     | agent          | Become agent contracts and trait compositions |
| Leaf specs, task files                       | task           | Translate to `tasks/*.kata.md` on demand as each becomes active — not in bulk |
| ADRs, dated reviews                          | prose          | Remain prose, untouched; they are rationale |
| Method docs (seeds, unit rules, protocols)   | prose          | Remain prose; do not duplicate their rules into declarations unless the project chooses to make them normative |

Rule of thumb: a sentence that grants, denies, scopes, or verifies becomes a declaration. A sentence that explains *why* stays where it is.

## Step 3 — Generate the project stylesheet

Write `PROJECT.kata.md` at the project root. It **references** existing prose and expresses only authority, scope, and verification. Every divergence from the base layer uses an explicit operation. Skeleton:

```
/* <project> stylesheet — cascades from kata/base.kata.md */

project#<slug> {
  kata-version: 0.3.2;
  packs: <none | hexagonal>;

  purpose: <one line>;

  references:
    <CONSTITUTION.md>,
    <ARCHITECTURE.md>,
    <WORKING-AGREEMENTS.md>;

  add protected-invariants:
    <invariant-1>,
    <invariant-2>;

  set verification-minimum: <tests + typecheck + ...>;
}

agent#<role> {
  composes: .<trait>, .<trait>;
  narrow authority: <...>;
}
```

## Step 4 — Conflict pass

Compare the existing documents against `base.kata.md` and `tokens.kata.md`. For each contradiction, exactly one of:

- **narrow** the project side (preferred — the base stays intact);
- an explicit `replace ... { reason; approved-by: human; }` block in `PROJECT.kata.md`;
- an `@amendment` with expiry, if the contradiction touches a protected rule;
- a change to the prose document, if the prose is simply out of date (this is the one case where prose may be edited — with the human's approval, recorded in the adoption ADR).

Silent divergence is a failed adoption, not a style choice.

## Step 5 — One adoption ADR

Record a single ADR: "Adopted Kata <version>." It lists the inventory, the classification decisions, every `replace` and `@amendment` from Step 4, and anything deliberately left outside the layer. Future deviations get their own ADRs; adoption gets exactly one.

## Step 6 — Fresh-reader test

Acceptance is KATA.md §0.3: hand a cold model only the pointer stub, `kata/`, `PROJECT.kata.md`, and one representative task file. It must produce a computed contract (§15) that the human confirms correct — right scope, right authority, right denials, right evidence. If it can't, fix the stylesheets and re-run. Do not declare adoption complete on reading-feel; declare it on this test.

## Step 7 — Done, and after

Adoption is complete when: the stub is installed, `PROJECT.kata.md` exists and hand-compiles, no silent contradictions remain, the adoption ADR is recorded, and the fresh-reader test has passed.

Afterwards: new bounded work is written as `tasks/*.kata.md`; layer upgrades follow KATA.md §0.6 (diff CHANGELOG, bump `kata-version`, re-run the fresh-reader test).

---

## §7 — The adopting agent's own contract

Adoption is itself a Kata task. The agent performing it operates under this contract — which is also the first computed-contract exercise for the project:

```
task#adopt-kata {
  extends: :kata;

  objective:
    bring-an-existing-project-under-the-kata-layer;

  scope:
    root-pointer-block,
    PROJECT.kata.md,
    adoption-adr,
    generated/COMPUTED_CONTRACT.md;

  must:
    inventory-existing-governance-docs,
    classify-each-doc-against-kata-layers,
    reference-existing-docs-rather-than-rewrite,
    declare-all-divergence-explicitly,
    record-deviations-in-one-adoption-adr,
    run-fresh-reader-test;

  must-not:
    modify-kata-folder-contents,
    delete-or-rewrite-existing-prose-docs,
    weaken-protected-rules,
    silently-replace-inherited-declarations;

  acceptance:
    pointer-stub-installed,
    project-stylesheet-hand-compiles,
    no-silent-contradictions-remain,
    fresh-reader-test-passed;

  evidence:
    inventory-table,
    diff,
    sample-computed-contract,
    human-confirmation;
}
```
