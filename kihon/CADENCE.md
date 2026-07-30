# CADENCE — the round, step by step

Version: 0.1.1 (versioned with the Kihon layer)

The round is Kihon's unit of work: the atomic cycle of trustworthy
delivery. This file is the mechanical walk-through. The laws it
enforces are stated in `KIHON.md`; where this file and the laws pull
apart, the laws win and this file has a defect.

---

## 0. The word (open)

A round begins on the human's word — a request, a directive, a spec
sheet. Before any tool runs, the agent restates the round's objective in
one or two sentences and names anything it will *not* do. If the word is
ambiguous in a way that changes what gets built, ask once, precisely;
otherwise state the assumption and proceed.

## 1. Branch

One branch per round, named for the round. The mainline is never worked
on directly. If a second directive arrives mid-round and belongs with
the first, it becomes a second commit on the same branch; if it doesn't
belong, it becomes its own round.

## 2. Contract

Copy `templates/quality-contract.yaml`; fill it **before building**:
objective, what must be preserved (the human's intent, explicit
constraints, verified facts, the honest record), required checks,
budgets, risk, ambiguity. Thin is fine — a contract is a page, not a
project plan. The point is that "done" is defined before the work
exists, by someone not yet attached to the work.

## 3. Red

Write the tests that specify the round — and run them to watch them
fail. The red run is evidence the tests test something. Rules:

- New behavior: a new failing case, as narrow as the claim it makes.
- Changed behavior: the old test updated **with its justification
  stated in place** — a comment naming the decision (and its ADR, if
  one exists) that made the old expectation wrong.
- Sentinel inputs (distinctive markers threaded through fixtures) beat
  broad assertions: they prove *your* data flowed, not just *some* data.

## 4. Build

The smallest implementation that turns the red green, written in the
project's own idiom. Doctrine that models must follow goes into
documents, seated by thin prompts (K6, `PROTO.md`) — never inlined.
Optional layers are wired never-fatal from the first draft (K8): the
failure path is written before the success path is polished.

## 5. Verify

Run everything, deterministically, offline (K9):

- the full test suite — not just the new cases;
- every typecheck the project declares;
- every linter the project declares.

All of it green before proof. A pre-existing failure discovered here is
reported, not absorbed: it belongs to its own round unless the human
folds it into this one.

## 6. Prove

Stand up the **isolated proof stack** and exercise the round end-to-end
as the user would experience it:

- **Own ports.** The proof stack runs on ports reserved for proof,
  never the human's live ones. An orphan process on a proof port may be
  killed by port; a process on any other port is never touched.
- **Throwaway state.** A fresh state directory per proof, discarded
  after. The human's data is never the fixture.
- **Mock providers by default.** Deterministic, networkless, free.
  Live-provider proof happens only when the round is *about* the live
  provider, and only with the human's word.
- **Evidence, not invitation.** The agent drives the interface itself —
  requests, clicks, reads — and captures the evidence. "It should work
  now, try it" is a violation; "here is the record showing it working"
  is the standard.
- Tear the stack down when done.

## 7. Trace

Copy `templates/trace.yaml`; record what was done, the evidence used,
the assumptions made, issues detected and corrected, final metrics, and
**exactly one stop reason** — `quality_contract_satisfied`, `budget
exhausted`, `escalated to human`, or `blocked`. One stop reason forces
one honest sentence about why the work stopped.

If the round decided something a future reader will wonder about, file
an ADR (`templates/adr.md`) — the decision, its context, and its
consequences, in the round's own words.

## 8. Commit

One commit per round (plus one per mid-round directive that joined it),
message written as the story of the round: what changed, why, and any
contract addition flagged (K5). The diff is reviewed before committing —
the agent reads its own change the way a verifier would.

## 9. The word (land)

The finished round waits on its branch — built, verified, proven,
traced, committed — until the human says the word. Then, and only then:

```
checkout mainline → fast-forward merge → delete branch → push
```

Fast-forward only: the mainline's history is the sequence of rounds,
linear and legible. If the mainline has moved, rebase the round and
re-run step 5 before landing. After landing, tell the human what — if
anything — they must restart, and what the next unlanded work is.

---

## Appendix — field notes

Scars this cadence carries, so consuming projects don't re-earn them:

- **The untracking trap.** Untracking a file on a branch deletes it
  from the working tree when the branch merges. Untrack on the
  mainline, or restore from the object store. Gitignore generated
  artifacts the moment the generator lands, not after the first
  accidental commit.
- **The stale-process trap.** A proof stack that outlives its round
  holds its port and fails the next round with a bind error. Tear down
  in the same turn as the proof; kill by port only on proof ports.
- **The immutable-cache trap.** Generated artifacts served under
  reused filenames plus aggressive caching show the user the *previous*
  round's output. Stamp generated filenames with time and serial;
  nothing overwrites, so URLs are always fresh — and the record stays
  append-only for free (K5).
- **The racing-assertion trap.** Asserting on in-flight state after a
  near-zero mock delay races the event loop. Assert inside the mocked
  call, or on the settled record — never on a timer.
