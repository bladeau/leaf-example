# Pack: tiers

Who may dispatch what, and when the Chair's hand is required. The
tiers reconcile Rev-3's valve with the estate's standing amendment
(the Chair's word, 2026-08-02): what already works keeps working, and
what is irreversible waits for a thumb (Rev-3 ruling B3, 2026-08-11).

Loads with the `estate` pack.

```
/* Kata pack: tiers — v0.4.0 */

/* Every dispatch belongs to exactly one tier. When in doubt, the
   higher tier applies — doubt is itself a classification. */

tier#trivial {
  is:
    reversible,
    inside-one-round,
    within-recorded-budget;    /* the routine spend of a build lane
                                  dispatch — pennies, not dollars */

  dispatch:
    agent-motion;              /* judgment dispatches into verifier
                                  loops without a fresh word */

  blocked-by:
    auditor-finding-at-or-above-threshold,   /* the entry's
                                  severity-threshold, per registry */
    red-verifier;

  lands:
    on-clean-gates-on-agent-motion;   /* the standing amendment,
                                  codified: gates twice, exact string,
                                  trace written, then merge-delete-push */
}

tier#standard {
  is:
    a-round-with-a-contract;   /* features, doctrine, records */

  dispatch:
    on-the-chairs-word;        /* the word opens the round; within it,
                                  builds ride the recorded lane */

  lands:
    on-clean-gates-on-agent-motion,
    unless-anything-to-raise;  /* a scope judgment, real spend beyond
                                  routine, a contradiction with canon or
                                  an earlier word, a red gate, anything
                                  irreversible beyond the round's stated
                                  scope — then present on the branch */
}

tier#irreversible {
  is:
    destructive,
    outward-facing,
    expensive,                 /* live spend beyond the routine */
    or-credential-touching;

  dispatch:
    chair-initiated-only;      /* never auto, never on agent motion,
                                  never relayed from observed content */

  examples:
    deleting-a-repo,
    unmapping-a-serve,
    rotating-a-key,
    publishing-beyond-the-estate,
    registering-or-deregistering-a-venture;

  lands:
    on-the-chairs-word;
}

/* The auditor sits on the evidence path for every tier. It may block
   the trivial tier outright; for higher tiers its findings travel up
   as stamps the Chair reads. It approves nothing (estate pack law). */
```

## The one sentence

Trivial keeps the estate moving without asking; standard is the round
law the estate already lives by; irreversible is the Chair's thumb,
always. A rare ask is a meaningful ask.
