/**
 * Pré-génère le manifest de métadonnées des composants (props/slots/events)
 * HORS du build Nuxt — les workers Docd échouent sur ~52 composants pendant
 * `nuxt build` alors qu'ils passent en isolation. Le build relit ensuite le
 * manifest pré-généré (hash identiques → aucun cache miss → API complètes).
 * Usage : bun docs/scripts/pregen-component-meta.ts
 */
import { resolve } from "node:path";
import {
  discoverProjectComponentApiPaths,
} from "../node_modules/@baybreezy/docd/utils/component-api-discovery";
import {
  generateProseComponentMeta,
  resolveProseComponentPaths,
} from "../node_modules/@baybreezy/docd/utils/generate-prose-component-meta";

const rootDir = resolve(import.meta.dir, "..");
const layerRoot = resolve(rootDir, "node_modules/@baybreezy/docd");
const contentDir = resolve(rootDir, "content");
const { outputFile, cacheDir } = resolveProseComponentPaths({ rootDir, layerRoot });

const discovery = await discoverProjectComponentApiPaths({ rootDir, layerRoot, contentDir });
const manifest = await generateProseComponentMeta({
  rootDir,
  layerRoot,
  outputFile,
  cache: true,
  cacheDir,
  additionalComponents: discovery.components,
});

console.log(
  `✓ ${Object.keys(manifest.components).length} composants dans ${outputFile} (${discovery.components.length} découverts)`,
);
