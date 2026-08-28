# Connaissances & bonnes pratiques (tag: knowledges)

## Migration icônes lucide → Iconify — 2026-08-28

`@lucide/vue` a été remplacé par `@iconify/vue` dans TOUS les composants de
`packages/ui` (corrige au passage le crash accordéon `useLucideProps`).

- `packages/ui/lib/icons.ts` : constantes `icons` = noms Iconify (famille `lucide:`),
  source unique des icônes internes par défaut
- Toutes les props publiques d'icônes passent de `Component` à `string` (nom Iconify) :
  `icon`, `iconRight`, `expandIcon`, `backIcon`, `checkedIcon`, `dropdownIcon`,
  `ActionSheetOption.icon`, `LoadingOptions.icon`, `NotifyOptions.icon`, `QIcon.name`…
- Rendu : `<Icon :icon="…">` de `@iconify/vue`, classes CSS existantes conservées
- Pattern : prop optionnelle → `:icon="prop || icons.xxx"` ; garde `v-if` si aucune
  valeur par défaut (ex. QFabAction)
- Comportement `@iconify/vue` 5 : sans prop `ssr`, pas de rendu SVG au SSR
  (placeholder vide puis rempli à l'hydratation) — pas de mismatch

## QSyntax — bloc de code Shiki — 2026-08-28

`packages/ui/components/QSyntax.vue` : coloration syntaxique Shiki v3.

- Props : `code` (ou slot), `lang` (défaut text), `theme` (défaut `github-dark-default`),
  `filename`, `copy`
- Moteur **JavaScript** (`shiki/engine/javascript`) → pas de WASM, client-side
- 17 langages pré-chargés + `loadLanguage` à la demande, repli `text`
- Highlighter singleton (`createHighlighter`) ; fallback code brut avant highlight
- Thème `github-dark-default` (fond `#0d1117` — matche le cadre du composant)

## QConfigProvider — mode dark light|dark|system — 2026-08-28

- `QTheme.mode?: "light" | "dark" | "system"` (défaut system) ; prop `theme` accepte
  aussi une string (`theme="dark"`)
- `isDark` réactif : `system` → `matchMedia("(prefers-color-scheme: dark)")` + listener
- Classe `.dark` appliquée sur le conteneur **et** sur `<html>` (les overlays
  téléportés au body — dialog, sheets — passent aussi en sombre) + `color-scheme`
- Tokens sémantiques ajoutés : `--background`, `--foreground`, `--card`, `--muted`,
  `--border` (clair + `.dark`), `--q-translucent-bg` sombre
- Contexte enrichi : `{ theme, isDark }` (consommé par QDialogProvider/BottomSheetProvider/useComponentProps)

## Autocomplétion composants dnax.ui dans Zed (vtsls) — 2026-08-28

Deux correctifs cumulés :

1. **tsconfig solution-style non suivi par vtsls** : `docs/tsconfig.json` Nuxt
   (`files: []` + references) donnait un programme TS vide → aucun composant global.
   Fix : config autonome `{ "extends": "./.nuxt/tsconfig.app.json",
"files": ["./nuxt.config.ts"] }` (+ import explicite `defineNuxtConfig`).
   `nuxt prepare` ne touche pas au tsconfig racine.
2. **Import erroné shadow le composant global** : `import { qConfigProvider }` (mauvais
   casse) dans app.vue masquait la résolution → plus de props. Ne jamais importer un
   composant Q\* auto-importé ; utiliser les balises kebab-case.

## Stack docs app

- Nuxt 4, `ssr: false`, modules `@nuxt/fonts`, `@dnax/ui`, `@nuxtjs/tailwindcss`
- Composables docs : `useComponentDocs` (chargement `@dnax/ui/runtime` + props runtime),
  `useThemeMode` (localStorage `dnax-ui-theme-mode`, cycle light→dark→system)
- `ThemeToggle` dans les headers (default + docs)

## Pages docs manuelles — pattern accordion (canonique) — 2026-08-28

Les pages générées (`DocsComponentPage`) peuvent être remplacées par des pages
manuscrites pour des docs riches. Template canonique :
`docs/app/pages/docs/components/accordion.vue` (structure reproductible).

- `<script setup>` : `useComponent(() => "QXxx")` + `componentSource("QXxx")` +
  `componentTag("QXxx")` ; extraits de code en template literals (⚠ jamais de
  backtick ni de `${` dans les snippets) ; refs pour l'état des démos
- `<template>` : `div.doc > div.doc-head (h1.doc-title + code.doc-tag)` +
  `p.doc-lead` + sections `.doc-section` (h2) contenant `<docs-demo>` (Preview/Code,
  slot = démo live, `:code` = extrait affiché), `<q-syntax>` (bloc statique) et
  `<docs-api :comp :source />` (Props/Slots/Events/Methods auto)
- `<style scoped>` : bloc copié de accordion.vue, classes de démo renommées
  (ex. `.demo-row` pour aligner des boutons)
- Icônes Iconify `lucide:` ; contenu des pages en anglais
- Pages converties : btn, badge, chip, icon, toolbar, syntax, separator, dialog,
  bottom-sheet, action-sheet (2026-08-28)
- Familles multi-composants = une section `.doc-section` par composant, chacune avec
  démo + `<h3 class="doc-h3">API</h3>` + `<docs-api>` (dialog : 5 sections ;
  bottom-sheet : 5 sections)
