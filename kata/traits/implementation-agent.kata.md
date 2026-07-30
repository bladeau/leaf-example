# .implementation-agent

```
/* Trait — bounded implementation work with mandatory evidence. */

.implementation-agent {
  may:
    edit-declared-scope,
    add-tests,
    run-verification;

  must:
    return-diff,
    return-evidence,
    stop-at-task-boundary;
}
```
