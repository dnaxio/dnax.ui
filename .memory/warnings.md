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

## QDialog/QBottomSheet : le slot par défaut ne monte que si ouvert

QDialog et QBottomSheet rendent leur contenu dans un overlay téléporté gardé par
`v-if="open"` → **le slot par défaut n'existe pas dans le DOM quand le composant est
fermé**. Conséquences pour les triggers :

- `QDialogTrigger` (injecte `qDialogKey`) placé dans le slot par défaut n'est visible
  QUE lorsque le dialog est déjà ouvert → clic = `setOpen(true)` no-op. Il ne peut pas
  servir d'ouvreur depuis une page fermée ; l'ouverture se fait par `v-model` + bouton.
  (QDialog n'a PAS de slot `#trigger`.)
- `QBottomSheet` a bien un slot `#trigger` rendu **hors** du teleport (toujours
  visible) : c'est le pattern canonique pour ouvrir. `QBottomSheetTrigger` est
  l'alternative composant (dans `#trigger` ou dans un sheet ouvert, ex. imbriqué).
- Documenté dans les pages docs dialog.vue / bottom-sheet.vue (2026-08-28).

## Crash lucide `useLucideProps` (résolu par migration)

« Cannot destructure property 'size' of 'useLucideProps(...)' as it is undefined »
dans l'accordéon — non reproductible en SSR isolé (contexte client/bundle).
Éliminé par le passage à `@iconify/vue`.

## Zed : état LSP corrompu sur un fichier pourtant valide

Après une série d'éditions, vtsls/Volar peut rester sur un snapshot corrompu d'un
`.vue` : diagnostics absurdes (ex. « Cannot find module 'vu' », tokens fusionnés
comme `constDémo`, props fantômes sur le composant) alors que le fichier est valide
(octets propres, diff git propre, et une **copie du fichier sans aucune erreur**).
Fix : forcer la relecture du fichier — copie le contenu puis restaure-le (aller-retour
d'édition trivial), ou recrée le fichier. Diagnostic : `cp` le fichier sous un autre
nom pour distinguer état serveur vs vrai problème de contenu. (2026-08-29, tabs.vue
docs : `:script` ajoutés aux démos).
