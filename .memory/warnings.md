# Pièges rencontrés (tag: warnings)

## Nuxt : import de l'entrée d'un module interdit dans le code de l'app

`import("@dnax/ui")` depuis `app/` → erreur « Importing directly from module
entry-points is not allowed ». Nuxt matche le **spécificateur nu** (`entryPath`,
ex. `^@dnax/ui$`). Fix : sous-chemin (`@dnax/ui/runtime`). Ne jamais importer
l'entrée d'un module Nuxt depuis le code applicatif.

## Composants multi-racines : attrs class/style ignorés

QSidebar, QConfigProvider (et tout composant à plusieurs racines) **n'acceptent pas**
les attrs de repli `class`/`style` (dropped + warning Vue). Il faut des **props
explicites** (`style`, `height`…). Ex. : `class="!bg-red-400"` sur `<q-sidebar>`
ne s'applique pas — utiliser `:style` ou ajouter une prop.

## Import erroné shadow le composant global (auto-import)

Un binding `<script setup>` de même nom (ou camelCase correspondant) shadow le
composant global auto-importé : si l'import est erroné (`qConfigProvider` au lieu de
`QConfigProvider`), toute la complétion de props tombe et le typage disparaît.
**Ne jamais importer explicitement un composant Q\* auto-importé** ; balises
kebab-case.

## Zed + vtsls : tsconfig solution-style non suivi

Le tsconfig Nuxt (`files: []` + references) donne un programme TS **vide** dans
vtsls/Zed → pas de composants globaux ni de complétion. Fix : config autonome
(`extends: ./.nuxt/tsconfig.app.json`). Après tout changement de tsconfig, recharger
le workspace (`zed: reload workspace`) — les diagnostics de l'éditeur peuvent rester
périmés sinon.

## Harness de test Node : limitations

- Node n'importe pas les `.ts` ni les `.vue` → utiliser esbuild (bundle) pour les
  validations SSR ; alias/stub les deps (`@iconify/vue`, `cva`, `vue-sonner`)
- Les imports `~/*` et les composables auto-importés (`definePageMeta`, `useRoute`)
  doivent être stubés dans le harnais

## Filesystem : divergences entre outils

Le terminal sandbox et les outils fichiers peuvent voir des états différents
(l'utilisateur modifie des fichiers en parallèle : menu.ts, layouts…). Toujours
relire un fichier avant de l'éditer ; ne pas présumer de la stabilité.

## Crash lucide `useLucideProps` (résolu par migration)

« Cannot destructure property 'size' of 'useLucideProps(...)' as it is undefined »
dans l'accordéon — non reproductible en SSR isolé (contexte client/bundle).
Éliminé par le passage à `@iconify/vue`.
