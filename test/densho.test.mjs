// This leaf's own test. It proves the property that makes a leaf a leaf.
//
// Ichiryū law 6: a leaf must run without the foundry. Nothing in a leaf's
// runtime may require the transmission system to exist. So this file imports
// nothing but Node's standard library — no YAML parser, no schema validator, no
// helper borrowed from the foundry. If reading its own birth record required a
// dependency, the leaf would have acquired one in order to prove it has none.
//
// Everything below is readable with the standard library alone, which is the
// real reason the records are shaped the way they are.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DENSHO = '.densho';
const manifest = JSON.parse(readFileSync(join(DENSHO, 'last-cut.json'), 'utf8'));

/** The one line of YAML reading this test does, and it does it with a regex. */
const field = (file, name) => {
  const text = readFileSync(join(DENSHO, file), 'utf8');
  const match = new RegExp(`^\\s*${name}:\\s*(.+)$`, 'm').exec(text);
  return match ? match[1].trim().replace(/^'(.*)'$/, '$1') : null;
};

test('.densho/ holds records, not machinery', () => {
  // A single .mjs in here and the leaf would have started depending on the
  // foundry's shape. The check is on extensions rather than content because
  // "no code" has to be decidable without reading intent.
  const walk = (dir) => readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
  const files = walk(DENSHO);
  assert.ok(files.length > 0, '.densho/ is empty');
  for (const file of files) {
    assert.doesNotMatch(file, /\.(m?js|cjs|ts|sh|ps1|bat|py)$/, `${file} is executable content in a data directory`);
  }
  assert.deepEqual(
    files.map((f) => f.replace(/\\/g, '/')).sort(),
    ['.densho/last-cut.json', '.densho/lock.yaml', '.densho/origin.yaml', '.densho/ownership.yaml'],
  );
});

test('nothing outside .densho/ refers to the foundry', () => {
  // The failure this catches is a helpful import creeping into the leaf's own
  // code — the point at which "usable without the foundry" quietly stops being
  // true and no test notices.
  const walk = (dir) => readdirSync(dir).flatMap((entry) => {
    if (entry === 'node_modules' || entry === '.git' || entry === DENSHO) return [];
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
  const suspects = walk('.')
    .filter((f) => /\.(m?js|cjs|ts|json)$/.test(f) && f !== 'package-lock.json')
    .filter((f) => /kaiden\/tools|bladeau\/Kaiden|\.\.\/\.\.\/tools/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(suspects, []);
});

test('the records agree with each other', () => {
  assert.equal(field('origin.yaml', 'cut'), manifest.cut.id);
  assert.equal(field('lock.yaml', 'name'), manifest.recipe.name);
  // The lock must pin the same grammar the manifest was cut against, or a recut
  // would compare this leaf against rules it never received.
  assert.equal(field('lock.yaml', 'commit'), manifest.ichiryu.commit);
});

test('every file the cut claims is present, and unmodified', () => {
  // Checksums are over LF-NORMALISED bytes. This test is the reason: on Windows
  // this working tree has CRLF endings and the archive it came from had LF, and
  // a naive comparison would report all 29 files as changed.
  const normalised = (bytes) => {
    const binary = bytes.includes(0);
    const content = binary
      ? bytes
      : Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
    return createHash('sha256').update(content).digest('hex');
  };

  // `heldBack` names the paths a recut did NOT apply, with the checksum this
  // leaf kept instead. Those are the declared divergences.
  const held = new Map((manifest.heldBack ?? []).map((h) => [h.path, h.sha256]));

  const missing = [];
  const wrong = [];
  const diverged = [];
  for (const file of manifest.files) {
    if (!existsSync(file.path)) { missing.push(file.path); continue; }
    const now = normalised(readFileSync(file.path));
    if (now === file.sha256) continue;
    if (held.has(file.path)) {
      // Declared. It must be exactly what the record says it is, or the record
      // is describing a file that no longer exists in that form.
      if (held.get(file.path) !== now) wrong.push(file.path);
    } else {
      diverged.push(file.path);
    }
  }

  assert.deepEqual(missing, [], 'the manifest claims files this leaf does not have');
  assert.deepEqual(wrong, [], 'heldBack records a checksum this file no longer has');

  // AN EDITED CARRIED FILE IS NOT AN ERROR. Cultivation is the point of a leaf,
  // and a recut reports such a file rather than overwriting it. An earlier
  // version of this test asserted `diverged` was empty, which amounted to
  // asserting that nobody had ever worked here.
  if (diverged.length > 0) {
    console.log(`  note: ${diverged.length} carried file(s) edited here — a recut will report, not overwrite:`);
    for (const path of diverged) console.log(`    ${path}`);
  }
});

test('ownership covers every carried file', () => {
  // An unclassified path would fall to `local` and silently never be updated
  // again. Ichiryū law 4 makes that the safe failure, not an acceptable one.
  for (const file of manifest.files) {
    assert.ok(file.ownership, `${file.path} has no ownership class`);
  }
  const classes = new Set(manifest.files.map((f) => f.ownership));
  for (const c of classes) {
    assert.ok(['generated', 'mergeable', 'local', 'advisory'].includes(c), `unknown class ${c}`);
  }
});
