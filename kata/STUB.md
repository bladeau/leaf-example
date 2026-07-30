# STUB.md — the pointer block

Kata's equivalent of Bootstrap's `<link>` tag. Install in three steps:

1. Copy `kata/` unmodified into the project root.
2. Paste the block below, verbatim, into `CLAUDE.md` (or `root.md` / `AGENTS.md`). It should be the first substantive section.
3. New project: write `PROJECT.kata.md`. Existing project: follow `kata/ADOPTION.md`.

---

Paste everything between the markers:

<!-- kata-stub-begin -->
## Kata

This project is governed by the Kata layer in `./kata/` (kata-version: 0.3.2).

Read in this order before acting; stop and report if any file is missing:

1. `kata/KATA.md` — grammar and cascade rules
2. `kata/tokens.kata.md` — shared tokens
3. `kata/base.kata.md` — universal base layer
4. `kata/PROTOAGENT.md` — the agent constitution; binds every AI acting on this project, including you
5. `kata/packs/*.kata.md` — only packs declared in `PROJECT.kata.md`
6. `kata/traits/*.kata.md` — only traits composed by entities in play
7. `PROJECT.kata.md` — this project's stylesheet
8. `tasks/<active>.kata.md` — the active task only

Resolve the cascade into a computed contract (KATA.md §15) before acting.

`*.kata.md` files are normative for authority, scope, and verification; prose documents are normative for rationale. Overrides only via `set` / `add` / `narrow` / `replace` — silent replacement is invalid. Unresolvable conflict escalates to the human.
<!-- kata-stub-end -->

---

Keep the stub under fifteen lines. Everything else belongs in the layer or the project stylesheet, not the pointer.
