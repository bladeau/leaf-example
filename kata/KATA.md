# Kata

**Constitutional cascade language for AI-assisted systems.**

Version: 0.4.0 (see CHANGELOG.md)
Status: proto-specification
Root file of the drop-in `kata/` layer.

A kata is a standardized form practiced across a discipline until it holds under pressure. This folder is the form. Every project performs the same kata; each project refines it without breaking it.

---

## 0. Using this folder

### 0.1 What is here

```
kata/
├── KATA.md                  ← this spec: the grammar and cascade rules (prose, normative for the language)
├── base.kata.md             ← the universal base layer every project cascades from
├── tokens.kata.md           ← shared tokens referenced across all layers
├── PROTOAGENT.md            ← the agent constitution — the floor beneath every seat (bound via base.kata.md)
├── STUB.md                  ← the exact pointer block to paste into CLAUDE.md / root.md
├── ADOPTION.md              ← the autotune protocol for bringing an existing project under Kata
├── CHANGELOG.md             ← semver history of this layer
├── traits/
│   ├── generator.kata.md    ← the proposing side of an exchange
│   ├── verifier.kata.md     ← the attacking side of an exchange
│   ├── clean-room.kata.md   ← perishable independence for reviewing seats
│   ├── read-only.kata.md
│   ├── reviewer.kata.md
│   ├── implementation-agent.kata.md
│   └── typescript.kata.md
├── packs/
│   └── hexagonal.kata.md    ← optional pack: ports, adapters, implementations
├── examples/
│   └── computed-contract.md ← a worked §15 resolution — the fresh-reader test's reference answer
└── tools/
    └── kata-lint.ts         ← the §17 linter, reference implementation (single file, zero deps)
```

### 0.2 Installing

New project: copy `kata/` unmodified into the project root, paste the pointer block from `STUB.md` into `CLAUDE.md` (or `root.md` / `AGENTS.md`), then write `PROJECT.kata.md`.

Existing project: copy `kata/` in, paste the stub, then follow `ADOPTION.md`. Adoption is additive — existing documents are referenced, not rewritten.

Never edit files inside `kata/` from within a consuming project. Changes to the layer itself happen upstream and arrive as a new version.

### 0.3 Enforcement honesty

Version 0.x is enforced primarily by reading discipline: any agent operating in a Kata project is bound to resolve the cascade as this spec describes before acting. A reference linter ships in `tools/kata-lint.ts` (run: `npx tsx kata/tools/kata-lint.ts <project-root>`; `contract <entity>` emits a §15 computed contract mechanically). The linter checks the mechanical subset of §17; the spec remains the authority — where the linter and this prose disagree, the prose wins and the linter has a defect.

The acceptance test — for this notation, and for every adoption — is the **fresh-reader test**: a cold model, given only the pointer stub, this folder, the project stylesheet, and one task file, must produce a computed contract (§15) that the human confirms correct. The linter's `contract` output is a legitimate starting point; confirming it still takes a reader — the test is of the stylesheets, not of typing. If a fresh reader cannot do it, the stylesheets are wrong, not the reader.

### 0.4 Normative boundary

`*.kata.md` files are normative for **authority, scope, and verification**.
Prose documents (constitutions, ADRs, working agreements, reviews) are normative for **rationale and intent**.

Where both speak to a permission, the Kata layer governs. Where Kata is silent, prose guides but does not grant authority.

One sanctioned exception: a `.kata.md` declaration may **incorporate a prose document by reference**, making that prose binding —

```
agent {
  constitution: kata/PROTOAGENT.md;
  constitution-binding: verbatim;
}
```

The authority still flows from the declaration; the prose carries the content. `PROTOAGENT.md` is bound this way for every agent. Incorporated documents load verbatim, fail loudly if missing, and sit at the layer of the declaration that binds them.

### 0.5 File convention

`*.kata.md` — normative stylesheet, written in the syntax defined below.
`*.md` — prose. Markdown tooling renders both.

### 0.6 Versioning

This layer follows semver. Every `PROJECT.kata.md` must declare the version it cascades from:

```
project#example {
  kata-version: 0.4.0;
}
```

On upgrading the layer in a project: diff `CHANGELOG.md` across versions, update the declaration, and re-run the fresh-reader test.

---

## 1. Foundational idea

Kata treats an AI-assisted software system as a hierarchy of governed entities.

```
Kata (root)
  └── Project
       ├── Domain
       ├── Architecture
       ├── Agent
       │    └── Task
       └── Object
```

(Packs may extend the hierarchy — e.g. `packs/hexagonal.kata.md` adds Port, Adapter, Implementation.)

General principles cascade downward. Specific entities may refine inherited rules, but they may not silently contradict them.

```
Effective Contract =
    inherited declarations
  + composed traits
  + local declarations
  + authorised exceptions
  - expired exceptions
```

Kata defines:

- what an entity must achieve;
- how it may interact;
- what authority it possesses;
- what it must preserve;
- how its work is verified;
- how it may evolve.

---

## 2. Core contract categories

Every declaration belongs to one of three primary contract families.

### 2.1 Outcome contracts

Outcome contracts define what must become true.

```
@outcome document-created {
  requires: valid-title;
  ensures: retrievable-document;
  preserves: repository-consistency;
  evidence: contract-test;
}
```

They may specify: objectives; observable behaviour; invariants; acceptance criteria; failure semantics; required evidence.

### 2.2 Collaboration contracts

Collaboration contracts define how entities may interact.

```
@collaboration document-reader {
  accepts: document-id;
  returns: document | not-found;
  authority: read-document;
  denies: write-document, delete-document;
}
```

They may specify: inputs and outputs; dependencies; permitted operations; information visibility; error semantics; capability restrictions.

### 2.3 Evolution contracts

Evolution contracts define how change may occur.

```
@evolution repository-contract {
  compatibility: backward;
  amendment: explicit;
  migration-required: breaking-change;
  approval: human;
}
```

They may specify: compatibility; migration; amendment procedures; protected identity; review requirements; rollback expectations.

---

## 3. Entity selectors

Kata rules target governed entities through selectors.

### 3.1 Root selector

```
:kata {
  human-authority: final;
  evidence-required: true;
  default-change-mode: incremental;
}
```

`:kata` is the universal root. Every entity inherits from it unless explicitly declared external. The root layer is shipped as `base.kata.md` plus `tokens.kata.md`.

### 3.2 Entity types

Core entity types:

```
project { }
domain { }
architecture { }
agent { }
task { }
object { }
```

Packs may add entity types. `packs/hexagonal.kata.md` adds `service`, `port`, `adapter`, `implementation`.

Example:

```
agent {
  self-authorisation: denied;
  completion-claims: evidence-required;
}
```

### 3.3 Named entities

```
project#combatos {
  purpose: governed-knowledge-workspace;
}

agent#architect {
  role: architecture-reviewer;
}

task#document-file-store {
  objective: create-durable-document-storage-port;
}
```

### 3.4 Traits

Traits behave like reusable CSS classes. They are defined only in `traits/*.kata.md` and apply only when composed.

```
.read-only {
  authority: read;
  denies: create, update, delete;
}
```

An entity may compose multiple traits:

```
agent#architecture-reviewer {
  composes:
    .read-only,
    .reviewer,
    .typescript;
}
```

### 3.5 Relationship selectors

Rules may target entities according to their position.

```
project agent {
  inherits: project-constitution;
}

agent > task {
  scope-must-be-subset-of: parent-agent-scope;
}
```

Interpretation: `project agent` means agents inside a project; `agent > task` means tasks directly delegated by an agent.

### 3.6 Attribute selectors

```
agent[mode="review"] {
  write-access: denied;
}

task[risk="high"] {
  approval-required: human;
  rollback-plan: required;
}
```

### 3.7 What does NOT apply: selector specificity

Kata borrows CSS syntax, not CSS resolution. **CSS selector specificity does not exist here.** A more specific selector carries no extra weight by virtue of its form. Conflicts resolve only through layer order (§6), the four cascade operations (§6.1–6.4), and the conflict rules (§16). A reader who imports CSS specificity rules is resolving the cascade incorrectly.

---

## 4. Tokens and variables

Shared concepts are declared once as tokens, in `tokens.kata.md`:

```
:kata {
  --authority-model: smallest-sufficient;
  --change-mode: incremental;
  --external-trust: none;
  --completion-standard: evidence;
  --final-authority: human;
  --minimum-evidence: tests + typecheck;
}
```

Rules reference them:

```
agent {
  final-approval: var(--final-authority);
  authority-model: var(--authority-model);
}
```

Tokens reduce semantic drift. They should represent durable concepts rather than volatile implementation details.

---

## 5. Standard properties

Kata defines a small vocabulary of standard properties.

### 5.1 Identity
```
purpose:
role:
identity:
extends:
composes:
scope:
packs:
kata-version:
processor:
```

`processor:` names the code artifact that enforces an entity's contract when the entity does not enforce it by reading (§13.1).

### 5.2 Outcome
```
objective:
requires:
ensures:
preserves:
acceptance:
failure:
```

### 5.3 Authority
```
may:
must:
must-not:
authority:
denies:
approval:
escalates-to:
```

### 5.4 Collaboration
```
accepts:
returns:
depends-on:
exposes:
hides:
emits:
consumes:
```

### 5.5 Evolution
```
compatibility:
change-mode:
amendment:
migration-required:
rollback:
expires:
```

### 5.6 Verification
```
evidence:
verification:
tests:
typecheck:
build:
review:
completion:
```

### 5.7 Trust and validation
```
trust:
validate:
runtime-validation:
error-mapping:
sanitise:
```

---

## 6. Cascade order

Kata uses a deterministic cascade. Rules are applied in this order:

```
 1. Kata root            (base.kata.md + tokens.kata.md + enabled packs)
 2. Project constitution (PROJECT.kata.md)
 3. Architecture
 4. Domain or subsystem
 5. Entity type
 6. Composed traits
 7. Named entity
 8. Task-local contract
 9. Authorised temporary exception
10. Direct human instruction
```

Later layers do not automatically replace earlier layers. Every declaration has one of four operations: `set`, `add`, `narrow`, `replace`.

### 6.1 Set

Defines a value when no inherited value exists.

```
agent {
  set authority-model: smallest-sufficient;
}
```

### 6.2 Add

Adds another requirement without removing inherited requirements.

```
task#storage {
  add verification: filesystem-contract-tests;
}
```

### 6.3 Narrow

Restricts an inherited capability.

```
agent#reviewer {
  narrow authority: repository-read-only;
}
```

Narrowing is always permitted unless it makes the assigned outcome impossible.

### 6.4 Replace

Overrides an inherited declaration. Replacement must be explicit and justified.

```
task#migration {
  replace storage-policy: temporary-legacy-access {
    reason: migrate-existing-documents;
    approved-by: human;
    scope: migration/**;
    expires: task-completion;
  }
}
```

**Silent replacement is invalid.** A declaration that contradicts an inherited value without an explicit `replace` block is a defect in the stylesheet, not an override.

---

## 7. Protected rules

Constitutional rules may be protected.

```
:kata {
  protect human-final-authority: true;
  protect evidence-before-completion: true;
  protect no-self-expansion-of-authority: true;
}
```

Protected rules cannot be overridden by normal child documents. They require an amendment:

```
@amendment amend-001 {
  target: human-final-authority;
  reason: autonomous-sandbox-experiment;
  scope: isolated-sandbox;
  approved-by: human;
  expires: 2026-12-31;
}
```

There is no unrestricted equivalent of CSS `!important`. The closest construct is `protect`, and only constitutional layers may use it. Every amendment must carry an expiry.

---

## 8. Inheritance

Properties are classified by inheritance behaviour.

### 8.1 Automatically inherited
- purpose constraints
- protected invariants
- trust rules
- authority ceilings
- verification minimums
- human approval requirements

### 8.2 Explicitly inherited
- implementation preferences
- technology choices
- naming conventions
- file organisation
- recommended workflows

### 8.3 Never inherited
- temporary permissions
- secrets
- credentials
- task-specific exceptions
- incident overrides
- one-time migration authority

Example:

```
task {
  inherit:
    project.invariants,
    architecture.dependencies,
    agent.authority;

  do-not-inherit:
    parent.temporary-exceptions;
}
```

---

## 9. Scope

Every non-universal rule should declare its scope.

```
@scope document-storage {
  matches:
    src/domain/document/**,
    src/application/document/**,
    src/adapters/storage/**;
}
```

Rules may then target the scope:

```
@scope document-storage {
  implementation {
    file-extension: ".combatos";
    runtime-validation: required;
  }
}
```

A declaration outside its scope has no effect. An agent cannot expand a scope it inherited.

---

## 10. Contextual rules

Kata borrows conditional blocks from CSS media queries.

```
@when environment = production {
  [boundary="external"] {
    mock-data: denied;
    destructive-operation: human-confirmation;
  }
}

@when risk >= high {
  task {
    review: mandatory;
    rollback: required;
    evidence: tests + typecheck + build + human-review;
  }
}
```

Conditional rules refine behaviour for a context without modifying the base contract.

---

## 11. Capability interfaces

Interfaces are treated as grants of authority.

```
@capability document-reader {
  may:
    list-documents,
    read-document;

  must-not:
    write-document,
    delete-document,
    access-arbitrary-files;
}

@capability document-writer {
  may:
    write-document;

  requires:
    validated-document,
    valid-document-path;

  preserves:
    atomic-write,
    existing-data-on-failure;
}
```

An agent or object receives capabilities explicitly:

```
agent#document-importer {
  capabilities:
    document-reader,
    document-writer;

  denies:
    arbitrary-filesystem;
}
```

Possessing a low-level tool does not grant access to all underlying platform methods. Only the granted capability surface is available.

---

## 12. Packs

Packs are optional, opinionated modules. The core spec stays generic; anything that presumes an architectural style, a language, or a team shape belongs in a pack.

- A pack may **add** entity types, traits, capabilities, and rules.
- A pack may **set** defaults for the entities it introduces.
- A pack may not weaken protected rules or narrow another layer's authority silently.
- Packs load at the root layer, immediately after `base.kata.md` and `tokens.kata.md`.

A project enables packs in its stylesheet:

```
project#example {
  packs: hexagonal;
}
```

Only declared packs are loaded. Shipped packs:

- `packs/hexagonal.kata.md` — ports-and-adapters vocabulary (`service`, `port`, `adapter`, `implementation`) and their rules.

---

## 13. Agent contracts

Every agent — any AI acting on the project, inside it or on it from above — is bound to the Protoagent constitution (`kata/PROTOAGENT.md`) through the base layer's `constitution:` declaration. The constitution is the shared floor; seats derive from it by composing traits and narrowing. The asymmetries between seats (`.generator` vs `.verifier`, `.clean-room`) are load-bearing and are never flattened into one behavior — an exchange between two identical seats has one seat and no value.

```
agent {
  constitution: kata/PROTOAGENT.md;
  constitution-binding: verbatim;
  authority-model: smallest-sufficient;
  self-authorisation: denied;
  parent-contract-reading: required;
  protected-invariant-preservation: required;
  completion: evidence-required;
}
```

### 13.1 Processor-bound entities

Not every governed entity reads its own contract. A prompt-bound seat in a
multi-model system, a generation pipeline, a templated worker — their
contracts are enforced by code that assembles their context, not by their
own reading of this layer. Declare that code:

```
agent#advisor-seat {
  composes: .reviewer;
  processor: server/engine/turns.ts;   /* the code that builds this seat's context */
}
```

Three consequences, all load-bearing:

- The declaration describes **what the processor builds**, so a fresh reader
  can compute the entity's contract without reading the processor's source.
- **Divergence is a code defect**: if the processor and the declaration
  disagree, the stylesheet governs and the processor is wrong — never the
  reverse, and never silently.
- A trait composed onto a processor-bound entity binds **only what the
  processor implements**. Composing a trait the processor has no stages for
  is itself a divergence; either extend the processor first or defer the
  composition. Adoption records should note deferrals explicitly.

An entity without `processor:` is presumed reading-bound — the acting agent
enforces its own contract, which is the default throughout this spec.

A specialised agent:

```
agent#developer {
  composes:
    .typescript,
    .implementation-agent;

  role:
    implement-bounded-task;

  may:
    edit-task-scope,
    add-tests,
    run-verification;

  must:
    preserve-public-contracts,
    report-unresolved-risk,
    stop-at-task-boundary;

  must-not:
    rewrite-unrelated-modules,
    amend-constitution,
    claim-unverified-completion;

  evidence:
    diff,
    tests,
    typecheck,
    build;
}
```

---

## 14. Task contracts

```
task#document-file-store-contract {
  extends:
    project#combatos,
    architecture#core,
    agent#developer;

  objective:
    define-application-facing-document-storage-port;

  scope:
    src/application/ports/document-file-store.ts,
    tests/contracts/document-file-store.contract.ts;

  must:
    use-plain-typescript,
    define-application-level-errors,
    support-list-read-write-delete;

  must-not:
    import-capacitor,
    implement-filesystem-storage,
    alter-domain-document-shape;

  acceptance:
    interface-compiles,
    reusable-contract-tests-exist,
    forbidden-dependencies-absent;

  evidence:
    tests,
    typecheck,
    reviewed-diff;
}
```

The task becomes a computed local contract rather than an isolated prompt.

---

## 15. Computed contract

Before an agent acts, the cascade is resolved into a flat effective contract.

Suggested generated file (per project, per task): `generated/COMPUTED_CONTRACT.md`

```
@computed task#document-file-store-contract {
  source-chain:
    :kata
    -> project#combatos
    -> architecture#core
    -> agent#developer
    -> task#document-file-store-contract;

  effective-purpose:
    define-durable-application-storage-contract;

  effective-scope:
    src/application/ports/document-file-store.ts,
    tests/contracts/document-file-store.contract.ts;

  effective-authority:
    read-project,
    edit-declared-scope,
    add-tests,
    run-verification;

  effective-denials:
    amend-constitution,
    import-capacitor,
    edit-unrelated-files,
    merge-code;

  effective-invariants:
    dependency-inversion,
    plain-typescript-core,
    human-final-authority;

  effective-evidence:
    tests,
    typecheck,
    reviewed-diff;
}
```

This is the Kata equivalent of a browser's Computed Styles panel. The agent operates from the computed contract rather than repeatedly interpreting the entire document hierarchy. Until tooling exists (§0.3), the computed contract is produced by hand by the acting agent, and checking it is the fresh-reader test.

---

## 16. Conflict resolution

When declarations conflict, Kata applies these rules in order:

1. Protected rules cannot be silently contradicted.
2. Narrower authority wins over broader authority.
3. Explicit denial wins over permission.
4. Explicit scope wins over inferred scope.
5. Runtime safety wins over convenience.
6. Evidence requirements accumulate.
7. Local implementation preferences may replace general preferences.
8. Local rules may not weaken protected invariants.
9. Temporary exceptions must be approved and expire.
10. Unresolvable conflict escalates to human authority.

Example:

```
agent {
  may: write-files;
}

agent#reviewer {
  denies: write-files;
}
```

Computed result:

```
agent#reviewer {
  effective-write-files: denied;
}
```

The more restrictive capability wins.

---

## 17. Validation rules (roadmap)

A Kata linter — when it exists — should reject:

- silent overrides
- undeclared scopes
- circular extension
- unknown properties
- self-granted capabilities
- unapproved protected-rule changes
- exceptions without expiry
- tasks broader than their parent agent
- implementations without verification
- external boundaries without runtime validation
- completion declarations without evidence
- processor-bound declarations whose named processor artifact does not exist (§13.1)

Example diagnostic:

```
KATA-E104

task#storage-migration requests capability "arbitrary-filesystem".
Parent agent#developer does not possess this capability.

Resolution:
- narrow the task;
- delegate to an authorised migration agent; or
- create an explicit human-approved exception.
```

A reference implementation ships in `tools/kata-lint.ts` covering the mechanical subset (`npx tsx kata/tools/kata-lint.ts <project-root>`; `contract <entity>` resolves §15 mechanically). This checklist remains normative: items the linter cannot check are still the review checklist a human or reviewing agent applies by hand, and where linter and checklist disagree, the checklist wins.

---

## 18. The base layer

The normative base layer does not live in this spec. It ships as `base.kata.md` (entity minimums, protected rules, attribute rules) and `tokens.kata.md` (shared tokens), with traits in `traits/`. The spec explains; the base layer governs. If this section and `base.kata.md` ever disagree, `base.kata.md` wins — it is the stylesheet.

---

## 19. File structure

The layer itself (dropped in unmodified):

```
kata/
├── KATA.md
├── base.kata.md
├── tokens.kata.md
├── PROTOAGENT.md
├── STUB.md
├── ADOPTION.md
├── CHANGELOG.md
├── traits/
│   ├── generator.kata.md
│   ├── verifier.kata.md
│   ├── clean-room.kata.md
│   ├── read-only.kata.md
│   ├── reviewer.kata.md
│   ├── implementation-agent.kata.md
│   └── typescript.kata.md
└── packs/
    └── hexagonal.kata.md
```

A consuming project:

```
<project-root>/
├── CLAUDE.md                ← contains the pointer block from STUB.md
├── kata/                    ← this folder, unmodified
├── PROJECT.kata.md          ← the project stylesheet
├── tasks/
│   └── <task>.kata.md       ← bounded task contracts
├── generated/
│   └── COMPUTED_CONTRACT.md ← per-task computed contract
└── (existing prose docs: CONSTITUTION.md, ARCHITECTURE.md, ADRs, ...)
```

---

## 20. Processing model

A Kata processor would perform five phases:

1. **Discover** — locate root and relevant descendant stylesheets.
2. **Parse** — convert declarations into a contract graph.
3. **Cascade** — apply inheritance, packs, traits, scopes and contextual rules.
4. **Validate** — detect conflicts, excessive authority and missing evidence.
5. **Compute** — produce the effective contract for the target entity.

Conceptually:

```
const computedContract = kata.compute({
  target: "task#document-file-store-contract",
  context: {
    environment: "development",
    runtime: "typescript",
    risk: "medium"
  }
});
```

Possible outputs: `COMPUTED_CONTRACT.md`, `computed-contract.json`, `agent-system-prompt.md`, `verification-checklist.md`.

This model is conceptual until tooling exists (§0.3). A reading agent performs the same five phases by hand.

---

## 21. Relationship to existing project documents

Kata does not replace prose documents. It provides the governing layer beneath them.

```
kata/KATA.md          defines the grammar
kata/base.kata.md     the universal base contract
PROJECT.kata.md       this project's normative overrides
CONSTITUTION.md       explains durable project principles (prose)
ARCHITECTURE.md       explains structural decisions (prose)
ADR files             record why decisions changed (prose)
tasks/*.kata.md       define bounded work
COMPUTED_CONTRACT.md  tells the active agent exactly what applies
```

The boundary rule (§0.4) governs: Kata files are normative for authority, scope, and verification; prose is normative for rationale. Kata supplies machine-resolvable governance. Markdown supplies human-readable explanation and reasoning. A fact stated in both places is a maintenance liability — state permissions once, in Kata, and reasons once, in prose.

---

## 22. Design principle

Kata follows one central rule:

> Inheritance may add context, narrow authority, and specialise behaviour. It may not silently weaken the system's constitution.

Its purpose is not to control every implementation detail. Its purpose is to create a stable field within which useful implementation can grow safely.

---

## 23. Compressed definition

Kata is a constitutional cascade language for AI-assisted systems. It allows durable principles, capabilities, constraints, and verification requirements to flow from a universal root into projects, agents, tasks, objects, and implementations.

More simply:

> CSS computes how an interface should appear. Kata computes how an AI participant should behave.

A kata is a form you practice until it holds under pressure. This is that form.
