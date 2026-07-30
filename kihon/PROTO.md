# PROTO — one constitution, many instances

Version: 0.1.1 (versioned with the Kihon layer)

The Proto pattern is how a Kihon project keeps many AI roles coherent
without duplicating their law, and how it keeps all doctrine portable
across models. It was proven in practice twice — once for a family of
writing agents, once for a family of visual agents — before it was
written down here.

---

## 1. The pattern

When several roles share a craft, the craft is written **once**:

```
PROTO<CRAFT>.md          ← the constitution: the shared craft, stated once
   ├── instance A       ← role mechanics only (a paragraph, not a page)
   ├── instance B       ← role mechanics only
   └── instance C…      ← role mechanics only
```

- The **constitution** carries everything the roles have in common:
  the craft, the quality gate, the priorities, the refusals.
- An **instance** = constitution + role mechanics + registers (the
  local flavor of this seat). Instances declare procedure; they never
  contradict the craft.
- Where an instance pulls against the constitution, the constitution
  wins. Where the constitution pulls against a document it declares as
  its axioms, the axioms win. The chain of authority is written in the
  documents themselves, so any reader can resolve it.

The symptom that calls for the pattern: the same guidance pasted into a
third prompt. The result of applying it: role prompts shrink to
mechanics, quality becomes uniform, and improving the craft in one file
improves every seat at once.

## 2. Composed modules

Constitutions grow by **composing modules, by declaration only**:

```
## Instance model
- Composed modules (declared here, duplicated nowhere):
  <MODULE-A> (what it binds) and <MODULE-B> (what it binds).
  Each module's own document is its law; this constitution only
  seats them.
```

A module is a self-contained document of doctrine — a character system,
an orchestration mode, a domain rulebook. The constitution *names* it
and states its jurisdiction; it never paraphrases its content. One
source of truth per module, referenced everywhere it binds.

## 3. Documents are the law (K6)

The load-bearing corollary of the whole pattern:

- All doctrine rides as documents in the repository. Code loads them
  verbatim and delivers them to whichever model holds a seat; prompts
  contribute only identity and mechanics ("you are the X; the law
  below is your craft").
- **No model is load-bearing.** Swap every model in the system and the
  behavior survives, because the law was never in the weights. Model
  choice becomes an operational parameter — latency, cost, filter
  temperament — not an architectural one.
- **The spec-sheet law.** A document the human supplies is installed
  **verbatim** — not summarized, not "improved," not reformatted. The
  human's document is the law; the system adapts around it. If the
  document seems wrong, that is a question for the human, never a
  silent edit.

## 4. The remix law (K7)

One authoritative producer per kind of artifact — one root. Variation
is applied to the root's output, never grown as a sibling pipeline:

- Another rendering of the same source in another register is a
  **remix of the root**, appended beside the original (K5), never a
  second producer.
- A restyled version of a finished artifact is a **filter over the
  root's output** — the original as sole reference, the variation
  recorded with its lineage (what it was made from, what was applied).
- New voices, styles, and worlds join as instances, registers, and
  filters. The day a "second author" seems necessary is the day the
  constitution is missing a module — write the module.

This is what keeps a growing creative system coherent: every variant
traces to one root, every root to one producer, every producer to one
constitution.

## 5. The homage law

Registers and filters may be *labeled* by their inspiration — a
creator's name, a work, a movement — because labels are honest
provenance for the human choosing them. But the prompt lines and the
outputs never claim the identity: they borrow the **shape** (what the
narrator notices, where the tension lives, how the light falls), state
"in the manner of, without ever claiming to be," and never reproduce a
franchise's protected figures, emblems, or costumes. Distilling a
style into an explicit description of its features — rather than an
invocation of its owner — is both the legal posture and, it turns out,
the better prompt.

## 6. Worked example (genericized)

```
characters/
├── PROTOWRITER.md      ← every writing seat: structure, scene, voices,
│                          style discipline, quality gate
├── PROTOARTIST.md      ← every visual seat: the base style law and a
│                          single PINNED STYLE LINE the engine reads
├── <AXIOMS>.md         ← the human's root doctrine (verbatim install),
│                          declared as the constitutions' axioms
└── <MODULE>.md         ← composed modules, seated by declaration
```

The engine reads these files at startup and delivers them to seats.
Tests assert the *documents* reach the calls (a sentinel line from the
constitution appearing in the system prompt), so the law's presence is
itself gated (K9).
