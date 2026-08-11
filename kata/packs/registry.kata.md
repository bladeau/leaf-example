# Pack: registry

The schema and law of the estate's project registry. **The registry
owns identity; each repository owns law** (the frozen birth doctrine,
Boardroom Round 260). This pack is the schema; the living instance is
Chair-declared state at `var(--estate-registry)` — never a file in
this repo, never versioned with the law (Rev-3 ruling B2, 2026-08-11).

Loads with the `estate` pack.

```
/* Kata pack: registry — v0.4.0 */

registry {
  protect registry-owns-identity: true;   /* a project not in the
       registry does not exist to the estate, however much code it has */

  instance:
    var(--estate-registry);

  instance-is:
    chair-declared-state;       /* gitignored, machine-local, edited by
                                   the Chair's hand or the birth ceremony
                                   the Chair runs — never by a surface */

  must:
    be-the-single-index,        /* no second registry, ever — a reverse
                                   pointer in a venture's law never grows
                                   into one */
    be-discoverable-by-surfaces;

  must-not:
    hold-law,                   /* the repository owns law */
    be-written-by-surfaces;     /* surfaces discover — they do not define */
}

/* One entry per project. The schema each entry satisfies: */

registry > entry {
  must:
    declare-id,                 /* lowercase, one word */
    declare-path,               /* the repo's absolute path */
    declare-aliases,            /* what people actually say */
    declare-law,                /* the law files, in read order */
    declare-verifier;           /* the exact command whose last line is
                                   the exact string "gates: all clean" */

  may:
    declare-brief,              /* briefId: the current BRIEF, null between */
    declare-workspace,          /* the Paseo room convention */
    declare-severity-threshold, /* auditor findings at or above block the
                                   trivial tier (see packs/tiers.kata.md) */
    declare-decisions,          /* where briefs land */
    declare-starred;
}

/* Birth registers (Rev-3 ruling B1, the Chair's word, 2026-08-11):
   the birth ceremony writes the entry — the Chair runs the ceremony,
   so the instance remains Chair-declared. The mutual-recognition test
   (four recognitions + one execution proof) still gates the birth:
   registration is written at birth and PROVEN by the first landed
   round. */

registry < birth-ceremony {
  writes: entry;
  run-by: chair;
  proven-by: first-landed-round;
}
```

## Resolution

An alias resolves by scanning the instance's entries: exact id first,
then aliases, case-insensitive. A directory resolves to the entry
whose normalized path equals it or prefixes it (never a bare prefix —
`C:/Ichiryu2` is not `C:/Ichiryu`). Both rules are implemented in the
capital's clerks; this pack is why they behave that way.
