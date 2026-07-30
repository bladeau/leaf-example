# Worked example — a §15 computed contract

A real resolution, lightly genericized, from the first project to adopt this
layer (a Chair-gated multi-model meeting room). Use it as the reference
answer for the fresh-reader test (ADOPTION.md §6): a cold reader given the
stub, this folder, the project stylesheet, and one task file should produce
something of this shape — the same source chain, the same accumulation of
denials and evidence, the same absence of surprises.

The task under resolution: let the project's human archive a meeting out of
a sidebar and back — hide, never delete.

```
@computed task#archive-meetings {
  source-chain:
    :kata                              /* tokens.kata.md + base.kata.md; packs: none */
    -> project#meeting-room            /* PROJECT.kata.md */
    -> agent#implementer               /* composes .implementation-agent, .typescript */
    -> task#archive-meetings;          /* tasks/archive-meetings.kata.md */

  effective-purpose:
    let-the-human-archive-a-meeting-out-of-the-sidebar-and-back;

  effective-scope:
    server/types.ts,
    server/store.ts,
    server/index.ts,
    viewer/index.html,
    viewer/src/main.ts,
    viewer/src/style.css,
    tests/archive-meetings.test.ts;

  effective-authority:
    read-project,
    edit-declared-scope,               /* .implementation-agent */
    add-tests,
    run-verification;

  effective-denials:
    delete-or-rewrite-any-transcript,  /* task + protected append-only-record */
    change-exported-output-format,     /* task + @evolution exported-contracts */
    edit-kata-folder-contents,         /* agent#implementer */
    expand-own-authority,              /* base agent layer */
    claim-unverified-completion;

  effective-invariants:
    human-final-authority,             /* :kata protect */
    evidence-before-completion,        /* :kata protect */
    no-self-expansion-of-authority,    /* :kata protect */
    append-only-record,                /* project protected-invariants */
    output-format-additive-only;       /* @evolution: the archive flag must be additive */

  effective-evidence:
    tests,                             /* :kata minimum + .implementation-agent */
    typecheck,                         /* .typescript: required */
    reviewed-diff;                     /* task */

  notes:
    tests-before-code applies (agent#implementer must);
    scope is a subset of agent scope — no KATA-E104 condition present;
    no replace blocks and no @amendments are active anywhere in the chain.
}
```

What to check when you grade one of these (§16, §17):

1. **The chain is complete** — every layer between `:kata` and the task
   appears, in cascade order, with nothing skipped.
2. **Denials and evidence accumulated** — nothing inherited was dropped;
   evidence requirements only grow down the chain (§16 rule 6).
3. **Scope is a subset of the parent agent's scope** — otherwise E104.
4. **Every effective line is traceable** — a reader can point each entry at
   the declaration that produced it (the comments here do exactly that).
5. **Silence is honest** — if no replace blocks or amendments are active,
   the contract says so; an empty section that merely went unmentioned is
   the classic hand-compilation defect.

Mechanical starting point: `npx tsx kata/tools/kata-lint.ts . contract task#archive-meetings`
— then a human confirms it, which is the actual test.
