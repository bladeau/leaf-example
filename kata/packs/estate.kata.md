# Pack: estate

The one-person software estate: AIs deliberate and labor; every
consequential action passes through the Chair. One sentence governs
everything — **authority flows down through gates, evidence flows up
through stamps, and no layer both decides and executes.**

Optional, like every pack — but a project declaring it accepts the
standing rules below as protected law. The registry schema
(`packs/registry.kata.md`) and the dispatch tiers
(`packs/tiers.kata.md`) accompany this pack; declaring `estate`
without them is a lint defect, not a smaller estate.

Enable in the project stylesheet:

```
project#example {
  packs: estate, registry, tiers;
}
```

Loads at the root layer, immediately after `base.kata.md`.

```
/* Kata pack: estate — v0.4.0
   The standing rules (Estate Rev-3, ratified 2026-08-11). */

:kata {
  /* Rev-3 §5, landed as law. Protected: overriding any of these
     requires an @amendment with expiry, per KATA.md §12. */
  protect authority-down-evidence-up: true;      /* rule 1 */
  protect no-layer-decides-and-executes: true;   /* rule 1 */
  protect never-raw: true;                       /* rule 3: nothing
       dispatch-capable faces the open internet */
  protect auditor-blocks-never-approves: true;   /* rule 4 */
  protect auditor-decorrelated: true;            /* rule 6: the
       auditor's endpoint never equals the generator's model */

  --estate-home: C:/Ichiryu;                     /* B5: the capital.
       The kata repo is law's upstream, not the home. */
  --estate-registry: C:/Ichiryu/state/registry.json;
  --estate-execution-owner: paseo;               /* exactly one */
}

/* Rule 2: rooms are places; seats are brains. */

room {
  is: a-place-work-happens-in;      /* a workspace, a worktree */

  must:
    belong-to-one-registered-project;

  must-not:
    hold-estate-scope;              /* only the estate seat's room may */
}

seat {
  is: a-brain-a-harness-runs;       /* a native CLI as subprocess */

  must:
    inherit-the-repo-kata-stub,     /* law travels with the repo */
    leave-lane-records;

  must-not:
    own-dispatch-authority;         /* dispatch is the Chair's, or the
                                       trivial tier's — see tiers */
}

/* Rule 5: surfaces are replaceable; state lives in git, MDs, and
   native sessions. */

surface {
  is: a-replaceable-window;

  must:
    attach-only;                    /* anything that spawns or owns
                                       sessions is a second control
                                       plane — a defect, not a surface */

  must-not:
    own-sessions,
    spawn-backends,
    dispatch,
    be-load-bearing;                /* the fallback drill (Rev-3 C5)
                                       must pass without it */

  owes-no:
    diff-review;                    /* the Chair, 2026-08-11: the IDE
                                       is the diff surface */
}

auditor {
  may:
    block;

  must-not:
    approve,                        /* no approve path exists at all */
    share-model-family-with-generator;
}

/* The estate's evidence discipline, shared by every project that
   declares this pack. */

evidence {
  must:
    carry-sources-hashes-timestamps,
    be-stamped,                     /* sha over the body */
    be-loud-when-stale;

  written-by:
    clerk;                          /* a derivation — no model, no
                                       clock, no network */
}
```

## Where the estate lives

The capital is `C:/Ichiryu` (the Boardroom venture): the runbook, the
registry instance, the recorded dispatch lane, and the hall. This pack
is the estate's law abstracted upstream; the capital's own documents
(`docs/agent-runbook.md` there) are its practice. A fresh reader who
knows only this repo finds the estate by the two tokens above.
