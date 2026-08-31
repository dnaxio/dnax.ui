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

## Reset Preflight manquant → scroll horizontal (box-sizing)

dnax UI n'incluait PAS le reset Preflight (`box-sizing: border-box` global). Sans lui,
`q-container` / `q-btn--stretch` / `q-toolbar` / `q-footer` / `q-tabs`
(`width: 100%` + padding en `content-box`) débordent du viewport → scroll horizontal.
Fix à la racine en tête de `packages/ui/styles/main.css` :

```css
*,
::before,
::after {
  box-sizing: border-box;
}
html {
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
}
body {
  margin: 0;
  line-height: inherit;
}
```

Reset volontairement minimal (pas de `margin: 0` sur h1–h6/p ni `border: 0` sur les
boutons) pour ne pas casser les marges des pages docs existantes. (2026-08-31)

## QPage : offset auto sous les barres fixed (q-header / q-back-header)

Quand un `q-header fixed` / `q-back-header fixed` précède `q-page` dans le même
parent, la barre sort du flux (position: fixed) → le contenu de la page passait
dessous. Nouveau mécanisme dans `lib/fixedLayout.ts` (composable `useFixedBarOffset`) :

- `mode: "page"` (QPage) : `padding-top` = hauteur cumulée des barres fixed frères
  précédentes (sélecteur `FIXED_BAR_SELECTOR` = `.q-header--fixed,
.q-back-header--fixed`) + variable `--q-page-offset` posée sur la page
- `mode: "bar"` (QHeader / QBackHeader, activé seulement si `props.fixed`) :
  `top` = hauteur cumulée des barres fixed précédentes → empilement automatique
  quand on combine back-header + header
- Hauteurs suivies via ResizeObserver + resize (contenu, safe-area)
- `watch(enabled)` efface l'offset quand `fixed` bascule à false

Pièges : ref fonctionnel sur `q-virtual-scroll` (composant) → lire `.$el` (pas un
HTMLElement direct) ; la landing (index.vue `.hero`) et le mockup compensaient le
header fixed manuellement (`padding: 150px/124px`) → ramenés à 100px/74px pour ne
pas double-compenser (l'offset est désormais automatique). Le footer fixed était
déjà géré en CSS pur via `.q-app:has(.q-footer--fixed) .q-page` (padding-bottom
50px + safe-area) — pattern cohérent. (2026-08-31)

## Config Provider : déplacé dans Layouts + page docs manuelle

`QConfigProvider` retiré du groupe Components du menu → groupe **Layouts > Page**
(gen-menu.ts LAYOUTS + CUSTOM_PAGES "config-provider"). La page docs
(docs/app/pages/docs/components/config-provider.vue) est désormais écrite à la
main et documente : (1) la bonne pratique d'initialisation — app shell canonique
`<q-config-provider><q-app><q-back-header fixed/><q-header fixed/><q-page><q-container/></q-page><q-footer/></q-app></q-config-provider>` avec l'empilement auto des barres ; (2) les **patterns de structure** de chaque famille
(dialog, bottom sheet, action sheet, sidebar, field pickers sheet/modal/dialog,
providers programmatiques) via q-syntax copy ; (3) une démo theming live (mode +
radius via componentProps.default.radius). Piège : `</script>` dans un template
literal du bloc script ferme prématurément le SFC → échapper `</script>` en
`<\/script>` (idem `$q` est OK). llms.txt : Config Provider déplacé de Components
vers Layouts avec description des patterns. Build ✅. (2026-08-31)

Ordre du groupe Layouts réordonné (gen-menu.ts LAYOUTS) : **Config Provider**
(configuration) → **Page Layout** (disposition) → Header Layout → Footer Layout →
Sidebar Layout. llms.txt mis en miroir. Build ✅. (2026-08-31)

## QSelect multiple + use-chips : texte en double

Avec `multiple` + `use-chips`, le template rendait les chips ET le span
`.q-select__display` (texte joint « Red, Green, Blue ») → le libellé apparaissait
deux fois. Fix dans QSelect.vue : computed `showDisplay` =
`!(multiple && useChips) || selectedOptions.length === 0` — le display texte est
masqué quand les chips sont affichés, mais reste pour le placeholder si vide.
Build ✅. (2026-08-31)

Suite : les chips n'étaient PAS conditionnés sur `multiple` → un select simple avec
`use-chips` affichait chip + texte en double. Fix : `v-if="multiple && useChips"`
sur le v-for des chips (comportement Quasar : `use-chips` ignoré en non-multiple,
on affiche le texte du display). Build ✅. (2026-08-31)
