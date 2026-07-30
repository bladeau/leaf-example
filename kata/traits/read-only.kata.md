# .read-only

```
/* Trait — compose to strip all mutating authority. */

.read-only {
  authority:
    read;

  denies:
    create,
    update,
    delete,
    merge;
}
```
