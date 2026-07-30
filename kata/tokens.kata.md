# tokens.kata.md

```
/* Kata shared tokens — v0.2.0
   Loads before base.kata.md. Durable concepts only —
   never volatile implementation details. */

:kata {
  --authority-model: smallest-sufficient;
  --change-mode: incremental;
  --external-trust: none;
  --completion-standard: evidence;
  --final-authority: human;
  --minimum-evidence: tests + typecheck;
}
```

A project may `add` tokens in `PROJECT.kata.md` (prefix them with the project slug, e.g. `--combatos-schema-version`) but may not redefine root tokens without an explicit `replace` block.
