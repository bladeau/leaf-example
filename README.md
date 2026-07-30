# leaf-example

A leaf. It was grown from a cut of the `practice-only` recipe and it exists to
prove one claim: **a leaf is a normal repository.**

Nothing here imports, executes, or depends on the foundry that made it. Clone
this, delete every other repository in the school, disconnect the network, and
`npm test` still passes. That is not a nice property; it is Ichiryū law 6, and
it is the difference between a transmission system and a dependency.

## What is in here

| Path | What it is | Who owns it |
|---|---|---|
| `kihon/` | How the agent works. Carried from the Kihon pack. | `generated` |
| `kata/` | Who may do what. Carried from the kata pack. | `generated` |
| `.densho/` | Where this leaf came from. **Data only.** | the foundry writes it |
| everything else | This leaf's own. | `local` |

`generated` means the foundry may replace a file *when this leaf has not touched
it*. Edit one and a recut will report the conflict instead of overwriting your
work — see `.densho/ownership.yaml`, which you are free to narrow.

## Where it came from

Read `.densho/origin.yaml`. It names the recipe and the cut, and it is written
once at birth and never rewritten; a recut updates `.densho/lock.yaml` and
`.densho/last-cut.json` instead.

`last-cut.json` is the full cut manifest: every file this leaf received, with a
sha256 over LF-normalised bytes and its ownership class. That is what lets a
recut work out what changed upstream, what changed here, and what it may safely
propose — without asking the foundry anything.

## The test

`npm test` checks that `.densho/` is inert: no code in it, the records agree
with each other, and every file the manifest claims is actually present and
unmodified. It uses nothing but Node's standard library — deliberately, because
a leaf that needed a YAML library to read its own birth record would have
acquired a dependency to prove it has none.

## What this leaf is for

It is disposable. It exists so the recut path can be proven against a real
repository — a real checkout, real line endings, real git — rather than a
fixture that agrees with whatever the tool does.
