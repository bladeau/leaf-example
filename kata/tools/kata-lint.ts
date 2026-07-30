/**
 * kata-lint — reference implementation of the KATA.md §17 validator.
 *
 * Single file, zero dependencies, ships inside the layer so it travels with
 * every adoption. The §17 checklist remains normative: this tool covers the
 * mechanical subset, and where tool and spec disagree, the spec wins and
 * the tool has a defect.
 *
 *   Lint:     npx tsx kata/tools/kata-lint.ts <project-root>
 *   Contract: npx tsx kata/tools/kata-lint.ts <project-root> contract task#name
 *
 * Exit code 1 when any diagnostic is emitted, 0 otherwise.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

// --- model ------------------------------------------------------------------

export interface Decl {
  op: "" | "set" | "add" | "narrow" | "replace" | "protect";
  prop: string;
  values: string[];
  file: string;
  /**
   * The nested selector this declaration came from, when it sits inside a
   * contextual rule — e.g. `task` in `@when risk >= high { task { … } }`
   * (KATA.md §10). Absent for a block's own declarations.
   */
  within?: string;
}

export interface Block {
  selector: string;
  /** "kata-root" | entity type ("agent", "task", …) | "trait" | "at" | "other" */
  kind: string;
  /** for `type#name` selectors */
  name?: string;
  /** for `@evolution x` / `@amendment x` blocks */
  atRule?: string;
  decls: Decl[];
  file: string;
}

export interface Diagnostic {
  code: string;
  message: string;
  file: string;
}

export interface ComputedContract {
  entity: string;
  sourceChain: string[];
  purpose: string;
  scope: string[];
  authority: string[];
  musts: string[];
  denials: string[];
  invariants: string[];
  evidence: string[];
  text: string;
}

const OPS = new Set(["set", "add", "narrow", "replace", "protect"]);

/** Properties that accumulate down the cascade (§16 rule 6 and kin); a
 *  re-declaration is layering, not an override. Scalar props outside this
 *  set are override-checked (E106). `constitution`/`playbook` layer by
 *  design: seat documents load on top of the floor (layer CHANGELOG 0.2.0). */
const ACCUMULATIVE = new Set([
  "must", "must-not", "may", "denies", "evidence", "verification", "scope",
  "composes", "extends", "packs", "protected-invariants", "targets",
  "references", "constitution", "playbook", "inherit", "do-not-inherit",
  "matches", "executes", "proposes", "accepts", "returns", "depends-on",
  "exposes", "hides", "emits", "consumes",
]);

// --- parsing ----------------------------------------------------------------

function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, " ");
}

function fencedCode(markdown: string): string {
  const out: string[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) out.push(line);
  }
  return out.join("\n");
}

function classify(selector: string): { kind: string; name?: string } {
  if (selector === ":kata") return { kind: "kata-root" };
  if (selector.startsWith("@")) return { kind: "at" };
  if (selector.startsWith(".")) return { kind: "trait", name: selector };
  const named = selector.match(/^([a-z-]+)#([A-Za-z0-9-]+)$/);
  if (named) return { kind: named[1], name: selector };
  if (/^[a-z-]+$/.test(selector)) return { kind: selector };
  return { kind: "other" }; // relationship / attribute selectors — parsed, not resolved
}

/** Parse the kata source of one file into blocks. Malformed structure is
 *  reported as KATA-E001/E002 diagnostics rather than thrown. */
export function parseKataSource(markdown: string, file: string, diags: Diagnostic[] = []): Block[] {
  const source = stripComments(fencedCode(markdown));
  const blocks: Block[] = [];
  let i = 0;

  while (i < source.length) {
    const open = source.indexOf("{", i);
    if (open === -1) break;
    const selector = source.slice(i, open).trim().replace(/\s+/g, " ");
    // find matching close brace (replace blocks nest one level)
    let depth = 1;
    let j = open + 1;
    while (j < source.length && depth > 0) {
      if (source[j] === "{") depth++;
      else if (source[j] === "}") depth--;
      j++;
    }
    if (depth !== 0) {
      diags.push({ code: "KATA-E001", message: `unbalanced braces after "${selector}"`, file });
      break;
    }
    const body = source.slice(open + 1, j - 1);
    if (selector) {
      const meta = classify(selector);
      const atName = selector.startsWith("@") ? selector.split(/\s+/)[1] : undefined;
      const block: Block = { selector, kind: meta.kind, name: meta.name, atRule: atName, decls: [], file };
      parseBody(body, block, diags);
      blocks.push(block);
    }
    i = j;
  }
  return blocks;
}

/**
 * Split a block body into its own declarations and any nested selector blocks.
 *
 * Two different things wear the same braces:
 *
 *   replace storage-policy: temporary-legacy-access { reason: …; }   justification
 *   task { review: mandatory; }                                       nested selector
 *
 * The first is metadata attached to a declaration and is flattened away. The
 * second is a contextual rule (KATA.md §10) whose declarations must survive.
 *
 * They are told apart by what precedes the brace: a justification always
 * follows a `prop: value` pair; a nested selector never does.
 */
function splitBody(body: string): { flat: string; nested: { selector: string; body: string }[] } {
  const nested: { selector: string; body: string }[] = [];
  let flat = "";
  let i = 0;

  while (i < body.length) {
    if (body[i] === "{") {
      let depth = 1;
      let j = i + 1;
      while (j < body.length && depth > 0) {
        if (body[j] === "{") depth++;
        else if (body[j] === "}") depth--;
        j++;
      }
      const inner = body.slice(i + 1, j - 1);
      const cut = flat.lastIndexOf(";") + 1;
      const preceding = flat.slice(cut).trim();

      if (preceding.includes(":")) {
        flat += " "; // justification — the declaration keeps its meaning without it
      } else {
        nested.push({ selector: preceding, body: inner });
        flat = flat.slice(0, cut); // a bare selector is not a malformed declaration
      }
      i = j;
      continue;
    }
    flat += body[i];
    i++;
  }

  return { flat, nested };
}

function parseBody(body: string, block: Block, diags: Diagnostic[]): void {
  const { flat, nested } = splitBody(body);
  parseDecls(flat, block, diags, undefined);
  for (const sub of nested) parseDecls(sub.body, block, diags, sub.selector || undefined);
}

function parseDecls(
  source: string,
  block: Block,
  diags: Diagnostic[],
  within: string | undefined,
): void {
  for (const raw of source.split(";")) {
    const decl = raw.trim();
    if (!decl) continue;
    const colon = decl.indexOf(":");
    if (colon === -1) {
      diags.push({ code: "KATA-E001", message: `declaration without ":" in ${block.selector}: "${decl.slice(0, 40)}"`, file: block.file });
      continue;
    }
    let prop = decl.slice(0, colon).trim().replace(/\s+/g, " ");
    let op: Decl["op"] = "";
    const space = prop.indexOf(" ");
    if (space !== -1) {
      const head = prop.slice(0, space);
      if (OPS.has(head)) {
        op = head as Decl["op"];
        prop = prop.slice(space + 1).trim();
      } else {
        diags.push({ code: "KATA-E002", message: `unknown operation "${head}" in ${block.selector}`, file: block.file });
        continue;
      }
    }
    const values = decl
      .slice(colon + 1)
      .split(",")
      .map((v) => v.trim().replace(/\s+/g, " "))
      .filter(Boolean);
    block.decls.push(within ? { op, prop, values, file: block.file, within } : { op, prop, values, file: block.file });
  }
}

// --- project loading --------------------------------------------------------

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "coverage", ".vite", "sessions", "briefs",
  "distilled", "generated", "quests", "packages",
]);

function kataFiles(root: string): string[] {
  const found: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(full);
      } else if (entry.name.endsWith(".kata.md")) {
        found.push(full);
      }
    }
  };
  walk(root);
  return found.sort();
}

export interface Project {
  root: string;
  blocks: Block[];
  /** named entities and traits, keyed by selector (`agent#x`, `.trait`) */
  registry: Map<string, Block[]>;
  activePacks: string[];
  diags: Diagnostic[];
}

/** A file is "in a kata layer directory" when any path segment is `kata`:
 *  the project's own kata/ dir, or a kata bridge shipped inside another
 *  layer (e.g. semantic-harness/bridges/kata/). `project#…` blocks there are
 *  pack usage examples — documentation, never declarations. */
const inKataLayer = (rel: string): boolean => /(^|\/)kata\//.test(rel);

export function loadProject(root: string): Project {
  const diags: Diagnostic[] = [];
  const layerDir = join(root, "kata");
  const files = kataFiles(root);

  // First pass: which packs does the project declare?
  const allBlocks = new Map<string, Block[]>();
  for (const file of files) {
    const rel = relative(root, file).split(sep).join("/");
    allBlocks.set(rel, parseKataSource(readFileSync(file, "utf8"), rel, diags));
  }
  // Project semantics live outside the layer: a `project#…` block inside a
  // kata layer directory is documentation (pack usage examples), never a
  // declaration — whatever layer ships the file.
  const activePacks: string[] = [];
  for (const [rel, blocks] of allBlocks) {
    if (inKataLayer(rel)) continue;
    for (const block of blocks) {
      if (block.kind !== "project") continue;
      for (const decl of block.decls) {
        if (decl.prop !== "packs") continue;
        for (const pack of decl.values) {
          if (pack === "none") continue;
          activePacks.push(pack);
          if (!existsSync(join(layerDir, "packs", `${pack}.kata.md`)))
            diags.push({ code: "KATA-E103", message: `declared pack "${pack}" has no kata/packs/${pack}.kata.md`, file: block.file });
        }
      }
    }
  }

  // Second pass: assemble active blocks — everything except inactive packs.
  const blocks: Block[] = [];
  for (const [rel, parsed] of allBlocks) {
    const packMatch = rel.match(/^kata\/packs\/(.+)\.kata\.md$/);
    if (packMatch && !activePacks.includes(packMatch[1])) continue; // shipped but undeclared: inactive, not an error
    const inLayer = inKataLayer(rel);
    blocks.push(...parsed.filter((b) => !(inLayer && b.kind === "project")));
  }

  const registry = new Map<string, Block[]>();
  for (const block of blocks) {
    if (!block.name) continue;
    const existing = registry.get(block.name) ?? [];
    existing.push(block);
    registry.set(block.name, existing);
  }
  return { root, blocks, registry, activePacks, diags };
}

// --- helpers over the model -------------------------------------------------

function declsOf(project: Project, selector: string): Decl[] {
  return (project.registry.get(selector) ?? []).flatMap((b) => b.decls);
}

function typeDefaults(project: Project, type: string): Decl[] {
  return project.blocks.filter((b) => b.kind === type && !b.name).flatMap((b) => b.decls);
}

function tokenTable(project: Project): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const block of project.blocks) {
    if (block.kind !== "kata-root") continue;
    for (const decl of block.decls) if (decl.prop.startsWith("--")) tokens.set(decl.prop, decl.values.join(", "));
  }
  return tokens;
}

function resolveVars(value: string, tokens: Map<string, string>): string {
  return value.replace(/var\((--[a-z0-9-]+)\)/gi, (_m, name: string) => tokens.get(name) ?? name);
}

/** Split a resolved value into atomic entries: lists came in comma-split;
 *  `a + b` conjunctions and `a | b` enumerations open into their parts. */
function atoms(value: string): string[] {
  return value.split(/\s*[+|]\s*/).map((v) => v.trim()).filter(Boolean);
}

function scopeMatches(pattern: string, path: string): boolean {
  if (pattern === path) return true;
  if (pattern.endsWith("/**")) return path.startsWith(pattern.slice(0, -2));
  if (pattern.endsWith("/")) return path.startsWith(pattern);
  if (pattern.includes("*")) {
    const rx = new RegExp("^" + pattern.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*") + "$");
    return rx.test(path);
  }
  return false;
}

// --- lint -------------------------------------------------------------------

export function lintProject(root: string): Diagnostic[] {
  const project = loadProject(root);
  const diags = [...project.diags];
  const protectedNames = new Set<string>();
  for (const block of project.blocks)
    if (block.kind === "kata-root") for (const d of block.decls) if (d.op === "protect") protectedNames.add(d.prop);

  const named = project.blocks.filter((b) => b.name && b.kind !== "trait");

  // E101 / E102 / E109 / E107 / E108 per entity
  for (const block of named) {
    for (const decl of block.decls) {
      if (decl.prop === "extends") {
        for (const ref of decl.values)
          if (ref.includes("#") && !project.registry.has(ref))
            diags.push({ code: "KATA-E101", message: `${block.selector} extends unknown entity "${ref}"`, file: block.file });
      }
      if (decl.prop === "composes") {
        for (const trait of decl.values)
          if (!project.registry.has(trait))
            diags.push({ code: "KATA-E102", message: `${block.selector} composes unknown trait "${trait}"`, file: block.file });
      }
      if (decl.prop === "processor") {
        for (const artifact of decl.values)
          if (!existsSync(join(root, artifact)))
            diags.push({ code: "KATA-E109", message: `${block.selector} names processor "${artifact}" which does not exist (§13.1)`, file: block.file });
      }
      if (protectedNames.has(decl.prop) && block.kind !== "kata-root")
        diags.push({ code: "KATA-E107", message: `${block.selector} touches protected rule "${decl.prop}" outside an amendment (§7)`, file: block.file });
    }
    if (block.kind === "project" && !block.decls.some((d) => d.prop === "kata-version"))
      diags.push({ code: "KATA-E108", message: `${block.selector} declares no kata-version (§0.6)`, file: block.file });
  }

  // E105 circular extends
  for (const block of named) {
    const seen = new Set<string>();
    const walk = (selector: string): boolean => {
      if (seen.has(selector)) return true;
      seen.add(selector);
      for (const decl of declsOf(project, selector)) {
        if (decl.prop !== "extends") continue;
        for (const ref of decl.values) if (ref.includes("#") && project.registry.has(ref) && walk(ref)) return true;
      }
      seen.delete(selector);
      return false;
    };
    if (block.name && walk(block.name))
      diags.push({ code: "KATA-E105", message: `circular extends chain through ${block.selector}`, file: block.file });
  }

  // E104 task scope must be a subset of the parent agent's scope
  for (const block of named) {
    if (block.kind !== "task") continue;
    const scope = block.decls.filter((d) => d.prop === "scope").flatMap((d) => d.values);
    if (!scope.length) continue;
    const parents = block.decls.filter((d) => d.prop === "extends").flatMap((d) => d.values).filter((r) => r.startsWith("agent#"));
    for (const parent of parents) {
      const parentScope = declsOf(project, parent).filter((d) => d.prop === "scope").flatMap((d) => d.values);
      if (!parentScope.length) continue; // agent without declared scope is unrestricted
      for (const entry of scope) {
        const path = entry.replace(/\/$/, "");
        if (!parentScope.some((pattern) => scopeMatches(pattern, path) || scopeMatches(pattern, entry)))
          diags.push({ code: "KATA-E104", message: `${block.selector} scope "${entry}" is outside ${parent}'s scope (§9, §17)`, file: block.file });
      }
    }
  }

  // E106 silent override: a scalar re-declared bare/set across the named extends chain
  for (const block of named) {
    const ancestors = block.decls.filter((d) => d.prop === "extends").flatMap((d) => d.values).filter((r) => project.registry.has(r));
    if (!ancestors.length) continue;
    for (const decl of block.decls) {
      if (decl.op !== "" && decl.op !== "set") continue;
      if (ACCUMULATIVE.has(decl.prop) || decl.prop.startsWith("--")) continue;
      if (decl.values.length !== 1) continue;
      for (const ancestor of ancestors) {
        const prior = declsOf(project, ancestor).find(
          (d) => d.prop === decl.prop && d.values.length === 1 && d.values[0] !== decl.values[0] && (d.op === "" || d.op === "set"),
        );
        if (prior)
          diags.push({
            code: "KATA-E106",
            message: `${block.selector} silently overrides ${decl.prop} ("${prior.values[0]}" → "${decl.values[0]}") inherited from ${ancestor}; use an explicit replace block (§6.4)`,
            file: block.file,
          });
      }
    }
  }

  return diags;
}

// --- computed contract (§15) ------------------------------------------------

export function computeContract(root: string, entity: string): ComputedContract {
  const project = loadProject(root);
  if (!project.registry.has(entity)) throw new Error(`unknown entity "${entity}" — expected e.g. task#name declared in a *.kata.md file`);
  const tokens = tokenTable(project);

  // §15 chain: :kata first, then ancestors as declared, entity last.
  const chain: string[] = [];
  const addToChain = (selector: string): void => {
    if (chain.includes(selector)) return;
    for (const decl of declsOf(project, selector))
      if (decl.prop === "extends") for (const ref of decl.values) if (project.registry.has(ref)) addToChain(ref);
    chain.push(selector);
  };
  addToChain(entity);

  /** decls in cascade order: root, entity-type defaults, composed traits, the named entity — per chain member */
  const layered: Decl[] = project.blocks.filter((b) => b.kind === "kata-root").flatMap((b) => b.decls);
  for (const member of chain) {
    const memberBlocks = project.registry.get(member) ?? [];
    const type = memberBlocks[0]?.kind ?? "";
    layered.push(...typeDefaults(project, type));
    for (const decl of declsOf(project, member))
      if (decl.prop === "composes") for (const trait of decl.values) layered.push(...declsOf(project, trait));
    layered.push(...declsOf(project, member));
  }

  const gather = (...props: string[]): string[] => {
    const out: string[] = [];
    for (const decl of layered)
      if (props.includes(decl.prop))
        for (const value of decl.values) for (const atom of atoms(resolveVars(value, tokens))) if (!out.includes(atom)) out.push(atom);
    return out;
  };

  const purpose =
    [...layered].reverse().find((d) => (d.prop === "objective" || d.prop === "purpose") && d.values.length)?.values.join(", ") ?? "";
  const scope = declsOf(project, entity).filter((d) => d.prop === "scope").flatMap((d) => d.values);
  const authority = gather("may");
  const musts = gather("must");
  const denials = gather("must-not", "denies");
  const evidence = gather("evidence", "evidence-minimum", "verification");
  for (const decl of layered)
    if (["tests", "typecheck", "build", "review"].includes(decl.prop) && decl.values.join() === "required" && !evidence.includes(decl.prop))
      evidence.push(decl.prop);

  const invariants: string[] = [];
  for (const block of project.blocks)
    if (block.kind === "kata-root") for (const d of block.decls) if (d.op === "protect" && !invariants.includes(d.prop)) invariants.push(d.prop);
  for (const value of gather("protected-invariants")) if (!invariants.includes(value)) invariants.push(value);
  for (const block of project.blocks) {
    if (block.atRule === undefined || !block.selector.startsWith("@evolution")) continue;
    const compat = block.decls.find((d) => d.prop === "compatibility")?.values[0];
    if (!compat) continue;
    for (const target of block.decls.filter((d) => d.prop === "targets").flatMap((d) => d.values)) {
      const entry = `${target}-${compat}`;
      if (!invariants.includes(entry)) invariants.push(entry);
    }
  }

  const sourceChain = [":kata", ...chain];
  const replaces = layered.filter((d) => d.op === "replace").length;
  const amendments = project.blocks.filter((b) => b.selector.startsWith("@amendment")).length;

  const list = (items: string[]): string => items.map((v) => `    ${v}`).join(",\n") || "    (none)";
  const text = [
    `@computed ${entity} {`,
    `  source-chain:`,
    `    ${sourceChain.join("\n    -> ")};`,
    ``,
    `  effective-purpose:`,
    `    ${purpose || "(none declared)"};`,
    ``,
    `  effective-scope:`,
    `${list(scope)};`,
    ``,
    `  effective-authority:`,
    `${list(authority)};`,
    ``,
    `  effective-denials:`,
    `${list(denials)};`,
    ``,
    `  effective-invariants:`,
    `${list(invariants)};`,
    ``,
    `  effective-evidence:`,
    `${list(evidence)};`,
    ``,
    `  notes:`,
    `    ${replaces} replace block(s) and ${amendments} @amendment(s) active in the chain;`,
    `    machine-resolved by kata-lint — a human confirms before acting (§0.3, §15);`,
    `}`,
  ].join("\n");

  return { entity, sourceChain, purpose, scope, authority, musts, denials, invariants, evidence, text };
}

// --- CLI --------------------------------------------------------------------

const invokedDirectly = (() => {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  try {
    return pathToFileURL(argv1).href.toLowerCase() === import.meta.url.toLowerCase();
  } catch {
    return false;
  }
})();

if (invokedDirectly) {
  const [, , rootArg, command, entityArg] = process.argv;
  const root = rootArg ?? ".";
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    console.error(`kata-lint: "${root}" is not a directory`);
    process.exit(2);
  }
  if (command === "contract") {
    if (!entityArg) {
      console.error("kata-lint: usage — kata-lint.ts <root> contract <type#name>");
      process.exit(2);
    }
    console.log(computeContract(root, entityArg).text);
    process.exit(0);
  }
  const diags = lintProject(root);
  for (const diag of diags) console.error(`${diag.code}  ${diag.file}\n  ${diag.message}\n`);
  console.log(diags.length ? `${diags.length} diagnostic(s)` : "kata-lint: clean");
  process.exit(diags.length ? 1 : 0);
}
