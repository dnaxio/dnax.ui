/**
 * Porte la documentation de `ddocs/content/` (Docus) vers `docd/content/` (Docd),
 * en réécrivant la syntaxe MDC propre à chaque thème :
 *
 *   ::dnax-demo   -> ::prose-show-case   (onglets Preview / Code, Preview par défaut)
 *   ::note        -> ::prose-callout{variant="note"}
 *   i-lucide-*    -> lucide:*            (icônes de navigation Docd)
 *
 * Usage : bun docd/scripts/port-from-ddocs.mjs
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "../..");
const SRC = join(ROOT, "ddocs/content");
const DEST = join(ROOT, "docd/content");

/** Dossiers source à ignorer (vestiges Docus sans contenu réel). */
const SKIP_DIRS = new Set(["docs/2.essentials"]);

/** Fichiers gérés à la main (voir content/index.md et content/docs/index.md). */
const SKIP_FILES = new Set(["index.md", "getting-started.md", "docs/index.md"]);

function transform(markdown) {
  let out = markdown;

  // 1. Icônes de navigation : `i-lucide-x` -> `lucide:x`.
  out = out.replaceAll("i-lucide-", "lucide:");

  // 2. Blocs MDC : Docus -> Docd.
  out = out.replaceAll("::dnax-demo", "::prose-show-case");
  out = out.replaceAll("::note", '::prose-callout{variant="note"}');

  return out;
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(absolute);
      continue;
    }

    const rel = relative(SRC, absolute).split("\\").join("/");
    if (SKIP_FILES.has(rel)) continue;
    if (SKIP_DIRS.has(dirname(rel))) continue;

    const target = join(DEST, rel);
    mkdirSync(dirname(target), { recursive: true });

    if (entry.name.endsWith(".md")) {
      writeFileSync(target, transform(readFileSync(absolute, "utf8")), "utf8");
      continue;
    }

    // `.navigation.yml` et autres métadonnées : copiés tels quels.
    writeFileSync(target, readFileSync(absolute));
  }
}

// Repart d'une arborescence propre (les pages sont régénérées à l'identique).
if (statSync(DEST, { throwIfNoEntry: false })) {
  rmSync(join(DEST, "docs"), { recursive: true, force: true });
}

walk(SRC);
console.log(`✓ Docd content ported from ddocs/content -> docd/content`);
