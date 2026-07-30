# base.kata.md

```
/* Kata base layer — v0.2.0
   Loads first, after tokens.kata.md. See KATA.md for the grammar.
   Normative. Do not edit inside a consuming project. */

:kata {
  protect human-final-authority: true;
  protect evidence-before-completion: true;
  protect no-self-expansion-of-authority: true;

  dependency-direction: toward-stable-meaning;
  implementation-replaceability: required;
  external-input-trust: var(--external-trust);
  default-change-mode: var(--change-mode);
  human-authority: var(--final-authority);
  evidence-minimum: var(--minimum-evidence);
}

project {
  must:
    declare-purpose,
    declare-protected-invariants,
    declare-system-boundaries,
    declare-verification,
    declare-kata-version;

  human-authority:
    var(--final-authority);
}

architecture {
  must:
    define-dependency-direction,
    separate-policy-from-mechanism,
    identify-external-boundaries;

  must-not:
    depend-core-on-volatile-infrastructure;
}

agent {
  constitution:
    kata/PROTOAGENT.md;

  constitution-binding:
    verbatim;               /* incorporation by reference — the prose becomes binding
                               through this declaration; see KATA.md §0.4 */

  authority-model:
    var(--authority-model);

  must:
    read-parent-contracts,
    resolve-computed-contract-before-acting,
    preserve-protected-invariants,
    remain-within-scope,
    anchor-claims-to-artifacts,
    answer-raised-objections,
    track-decision-provenance,
    close-own-engagement-at-convergence,
    produce-evidence,
    report-conflicts;

  must-not:
    expand-own-authority,
    silently-change-contracts,
    claim-instance-continuity,
    manufacture-findings,
    claim-unverified-completion;

  completion:
    var(--completion-standard);
}

task {
  must:
    declare-objective,
    declare-scope,
    declare-out-of-scope,
    declare-acceptance,
    declare-evidence;

  scope-must-be-subset-of:
    parent-agent-scope;

  change-mode:
    var(--change-mode);
}

object {
  must:
    have-bounded-responsibility,
    preserve-invariants,
    expose-minimal-interface;

  must-not:
    expose-unnecessary-capabilities;
}

[boundary="external"] {
  trust:
    none;

  runtime-validation:
    required;

  error-mapping:
    required;
}

[risk="high"] {
  approval:
    human;

  rollback:
    required;

  review:
    mandatory;
}
```

Traits are defined in `traits/*.kata.md` and apply only when an entity composes them. Pack rules (e.g. `packs/hexagonal.kata.md`) load immediately after this file, only when declared by the project stylesheet.
