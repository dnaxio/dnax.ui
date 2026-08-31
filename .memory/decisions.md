# Décisions d'architecture / d'API (tag: decisions)

## QDialogHeader/Footer = barres d'app avec QToolbar embarqué — 2026-08-31

`QDialogHeader` et `QDialogFooter` rendent désormais des barres type `q-header`/
`q-footer` : `<div.q-dialog__header>` (sticky, bordure basse, fond hérité)
contenant un **`<q-toolbar>` embarqué** (min-height 50px, padding 0 12px) qui
porte le padding — plus de `display: flex`/`padding: 16px` sur les conteneurs.

- Header : titre/description à gauche, `<q-space/>`, bouton fermer à droite,
  slot défaut en fin de toolbar
- Footer : actions embarquées dans le toolbar, alignées à droite
  (`.q-dialog__footer .q-toolbar { justify-content: flex-end }`)
- Imports explicites `QToolbar`/`QSpace` (pas d'auto-import interne dans
  `packages/ui/components/`)
- Safe-area : `--maximized`/`--top` → inset top sur le header ; `--maximized`
  ajoute gauche/droite (paysage) ; `--maximized`/`--bottom` → inset bottom sur
  le footer — miroir de `QHeader`/`QFooter`
- Shell dialog = flex-column (header/content/footer) ; `QDialogContent`
  `scrollable` → corps qui défile entre les deux barres fixes

## QBottomSheetHeader/Footer = mêmes barres toolbar — 2026-08-31

Étendu à la famille bottom sheet pour la cohérence dialog ↔ sheet :
`QBottomSheetHeader` (titre + `q-space` + fermer dans `<q-toolbar>`) et
`QBottomSheetFooter` (actions dans `<q-toolbar>`, alignées à droite via
`.q-bottom-sheet__footer .q-toolbar { justify-content: flex-end }`).

- `padding: 0` sur header/footer (délégué au toolbar) ; bordure basse ajoutée au
  header, bordure haute au footer (`--dark` → `rgb(255 255 255 / 0.12)`)
- Safe-area bottom toujours portée par `.q-bottom-sheet__panel` (le footer se
  cale au-dessus) ; pas d'inset top (sheet ancré en bas)
- Docs `bottom-sheet.vue` : notes header/footer à jour. Build ✅.

## QDialogHeader/Footer = barres d'app avec QToolbar embarqué — 2026-08-31

`QDialogHeader` et `QDialogFooter` rendent désormais des barres type `q-header`/
`q-footer` : `<div.q-dialog__header>` (sticky, bordure basse, fond hérité)
contenant un **`<q-toolbar>` embarqué** (min-height 50px, padding 0 12px) qui
porte le padding — plus de `display: flex`/`padding: 16px` sur les conteneurs.

- Header : titre/description à gauche, `<q-space/>`, bouton fermer à droite,
  slot défaut en fin de toolbar
- Footer : actions embarquées dans le toolbar, alignées à droite
  (`.q-dialog__footer .q-toolbar { justify-content: flex-end }`)
- Imports explicites `QToolbar`/`QSpace` (pas d'auto-import interne dans
  `packages/ui/components/`)
- Safe-area : `--maximized`/`--top` → inset top sur le header ; `--maximized`
  ajoute gauche/droite (paysage) ; `--maximized`/`--bottom` → inset bottom sur
  le footer — miroir de `QHeader`/`QFooter`
- Shell dialog = flex-column (header/content/footer) ; `QDialogContent`
  `scrollable` → corps qui défile entre les deux barres fixes

## Icônes : @iconify/vue plutôt que @lucide/vue — 2026-08-28

Toutes les icônes passent par **Iconify** (300 000+ icônes, SVG à la demande).
Les props d'icônes publiques sont des **strings** (noms Iconify `lucide:…`) —
aligné sur l'API Quasar où `icon` est une chaîne. `@lucide/vue` supprimé du projet
(le crash accordéon `useLucideProps` est éliminé par construction).

## QSyntax : Shiki v3 avec moteur JavaScript — 2026-08-28

Choix du moteur **JS** (`createJavaScriptRegexEngine`) plutôt que WASM : zéro
configuration (pas de fetch wasm, pas de MIME), rendu client-side. La doc étant
`ssr: false`, pas besoin du rendu SSR des blocs de code.

## Docs : pages statiques par composant + familles groupées — 2026-08-28

- Un fichier `.vue` par composant/famille dans `docs/app/pages/docs/components/`
  (généré par `scripts/gen-menu.ts`), éditable à la main
- **Familles** (Accordion, Bottom Sheet, Bubble, Card, Carousel, Dialog,
  Message Scroller, Nav Menu, Sidebar) : une seule entrée de menu + une page qui
  documente toutes les parties — les sous-composants (Trigger, Content…) n'ont pas
  d'entrée séparée
- Menu : Getting Started (guides) + Components + Plugins API

## Module @dnax/ui : sous-chemin runtime — 2026-08-28

Ajout de `"./runtime": "./index.ts"` aux exports du package : l'app docs importe
`@dnax/ui/runtime` (Nuxt interdit l'import direct de l'entrée de module depuis le
code de l'app).

## QConfigProvider : mode dark intégré au thème — 2026-08-28

Le mode `light|dark|system` fait partie de `QTheme` (pas de prop `dark` séparée).
`system` par défaut. La classe `.dark` est posée sur `<html>` (global) pour couvrir
les overlays téléportés.

## QSidebar : props height/maxHeight/style — 2026-08-28

Ajout de `height`, `maxHeight` et `style` (le composant a deux racines → les attrs
class/style ne passent pas en multi-racines, il faut des props explicites).

## QCollapse : iconLeft / iconRight — 2026-08-28

L'ancienne prop `icon` (gauche) renommée `iconLeft` + nouvelle prop `iconRight`
(avant le chevron). Aucune utilisation externe de `icon` → renommage sans casse.
