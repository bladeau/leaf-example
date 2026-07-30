# Pack: hexagonal

Ports-and-adapters vocabulary. Optional — the core layer makes no architectural-style assumption; this pack does.

Enable in the project stylesheet:

```
project#example {
  packs: hexagonal;
}
```

Loads at the root layer, immediately after `base.kata.md`.

```
/* Kata pack: hexagonal — v0.2.0 */

/* Adds entity types: service, port, adapter, implementation. */

port {
  ownership:
    consuming-application;

  must:
    express-required-capability,
    define-errors,
    remain-implementation-independent;
}

adapter {
  must:
    implement-port,
    validate-external-input,
    translate-output,
    map-errors,
    hide-platform-authority;

  must-not:
    leak-infrastructure-into-core;
}

implementation {
  must:
    satisfy-parent-contract,
    pass-required-verification;

  replaceable:
    true;
}

adapter > implementation {
  must-satisfy: parent-port;
}
```

## The exposure principle

The adapter may possess broad platform capabilities internally, but only the narrow port is exposed to the application. Possessing a low-level adapter never grants access to all underlying platform methods.

Illustrative pair:

```
port#document-file-store {
  accepts:
    document-file-name,
    serialised-document;

  exposes:
    list,
    read,
    write,
    remove;

  hides:
    filesystem-paths,
    platform-permissions,
    recursive-delete,
    arbitrary-file-execution;
}

adapter#capacitor-document-store {
  implements: port#document-file-store;
  boundary: external;

  validate:
    file-name,
    file-contents;

  map-errors:
    platform-not-found -> document-not-found,
    permission-denied -> storage-unavailable;

  evidence:
    shared-port-contract-tests;
}
```

The `[boundary="external"]` rule from `base.kata.md` applies to adapters automatically — external adapters get runtime validation and error mapping without this pack restating it.
