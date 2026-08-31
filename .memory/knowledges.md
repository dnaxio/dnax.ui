# Connaissances & bonnes pratiques (tag: knowledges)

## Icône gauche des champs : icon-left + espacement — 2026-08-31

- `icon-left` ajouté à `QSelect` et `QAutocomplete` (QInput l'avait déjà) —
  rendu `<Icon class="q-field__icon">` dans `.q-field__control`, remplacé par
  le slot `#prepend` s'il est fourni
- Espacement : `.q-field__icon { margin-right: 2px }` → icône → valeur =
  gap 6px du control + 2px = 8px (l'icône n'est plus collée au texte)
- `#prepend` partagé entre les trois champs (même sémantique que Quasar)
- Build ✅. (2026-08-31)

## QAutocomplete — modes modal / sheet — 2026-08-31

`QAutocomplete` étendu avec `mode: "inline" | "modal" | "sheet"` (miroir de
QSelect) :

- Panneau téléporté (Teleport body) : overlay + sheet (header titre + fermer,
  champ de recherche interne lié au même `query`, liste scrollable)
- Props : `mode`, `width` (panneau), `height` (liste), `title` (défaut label →
  placeholder)
- **Focus** : en mode panneau, `openPopup` focus l'input du panneau (nextTick) ;
  `onBlur` du champ ne ferme PAS (l'input du panneau prend le relais) — le
  commit de validation ne tourne qu'en inline
- Fermeture : backdrop (`@mousedown.self`), ×, Échap, sélection,
  `useOverlayBack` (retour navigateur) ; `onDocMousedown` vérifie aussi
  `sheetRef` (téléporté hors de rootEl)
- Verrou scroll body en mode panneau (comme QSelect) ; safe-area bottom sur
  `.q-autocomplete__sheet--sheet` ; transitions réutilisent `q-sheet-pop-*`
- Piège TS : computed d'objet avec branche vide → initialiser `{}` puis
  assigner (l'union `{ height?: undefined }` casse `Record<string, string>`)
- Largeur : quand `width` est fourni, poser `width` ET `maxWidth` (sinon le
  `max-width: 640px` du CSS plafonne) → `width="100%"` = pleine largeur
  (miroir du sheetWidthStyle de QSelect)
- **sheetOptions / modalOptions** (`QAutocompleteModeOptions`) : réglages par
  mode — `width`, `height`, `title`, `style`, `class`, `searchPlaceholder` —
  qui surchargent les props directes (pattern `modeOptions?.x ?? props.x`,
  comme QSelect). `:sheet-options="{ width: '100%' }"` = sheet pleine largeur
- **Défaut mobile** : écran < md (767px) → le sheet est 100% de largeur par
  défaut (`@media (max-width: 767px) .q-autocomplete__sheet--sheet { width:
100%; max-width: 100% }`) — un width fourni (inline) prime (miroir du
  `@media` de QSelect pour le modal 90%)
- Racine `v-bind="$attrs"`. Démo docs « Sheet & modal modes » (selecteur de
  mode inline/modal/sheet). Build ✅.
- Flèche dropdown dans le champ (`.q-autocomplete__arrow`, chevron-down,
  rotation 180° à l'ouverture) — visible dans tous les modes, y compris sheet
  (2026-08-31)

## Règle : v-bind="$attrs" sur la racine de TOUT composant — 2026-08-31

Pattern obligatoire : la racine de chaque composant passe `v-bind="$attrs"`
(positionné APRÈS `:class`/`:style` — class/style fusionnent, les autres attrs
sont appliqués) pour accepter `class`/`style`/`id`/`data-*` de l'appelant
(ex. `<q-dialog-footer class="p-2">`).

- En mono-racine, Vue hérite déjà les attrs automatiquement — l'explicite
  désactive l'héritage auto et garantit le comportement (dont multi-racines
  comme `QPage` v-if/v-else : poser sur CHAQUE branche)
- Appliqué à la famille barres/layout : QDialogHeader/Footer/Content,
  QBottomSheetHeader/Footer, QHeader, QFooter, QToolbar, QSpace, QBackHeader,
  QContainer, QPage (branches normal + virtual)
- Ne pas oublier `ref` : il n'est pas dans `$attrs` (séparé) — conserver
  `ref="rootEl"` à côté de `v-bind="$attrs"`
- Cas non couverts : composants multi-racines structurels (QSidebar,
  QConfigProvider) → props explicites (déjà documenté en warnings)
- ⚠️ Piège d'édition : ne JAMAIS faire un batch d'edits multi-fichiers dans un
  seul edit_file (un copier-coller de classe erroné a corrompu QDialogFooter
  → toujours un edit_file par fichier)
- Build ✅. (2026-08-31)

## QBackHeader — page docs manuelle — 2026-08-31

Page `docs/app/pages/docs/components/back-header.vue` convertie en page manuelle
riche (Basic, Actions, Back button, Styles, Title slot, API).

- **Piège gen-menu** : `back-header` n'était PAS dans `CUSTOM_PAGES` (seul
  `back-top` y était) → la page était régénérée. Ajouté à `CUSTOM_PAGES`
  (scripts/gen-menu.ts) pour la protéger.
- Props documentées : `title` (+ slot `#title`), `show-back`, `back-icon`
  (Iconify), `back-label`, `fixed`, `dark`, `translucent` (bool | number),
  event `@back`, slot défaut (actions à droite)
- Piège type : `translucent="50"` (attribut string) → erreur TS sur la prop
  `boolean | number` → `:translucent="50"` dans les démos live ET les snippets
- Démo fixed : `:deep(.q-back-header--fixed) { position: absolute }` dans une
  scène relative (comme footer.vue) pour ne pas coller au viewport de la doc
- Build ✅ après gen-menu (page intacte).

## QContainer — glass, image de fond glassmorphisée, Ken Burns — 2026-08-31

Trois nouvelles props sur `QContainer` :

- `glass` : glassmorphism du conteneur (fond translucide + `backdrop-filter`
  blur + bordure claire + ombre) — vars `--q-container-glass-bg/border/blur`,
  variante `.dark`
- `background-image` : URL rendue en couche `<img.q-container__img>`
  (absolute inset 0, object-fit cover, z-index 0, pointer-events none). Pose
  aussi `q-container--bg` → `position: relative; overflow: hidden` (clippe
  l'image aux coins arrondis) + le sélecteur de lift du contenu exclut
  désormais `.q-container__img`
- `background-animated` : Ken Burns indéterminé — keyframes
  `q-container-kenburns` (24s, ease-in-out, `infinite alternate` : zoom 1.06→
  1.22 + translations ±2% qui alternent) ; glassmorphisée seule :
  `filter: blur(14px) saturate(1.4)` + `transform: scale(1.15)` (masque les
  bords du blur)
- `background-image-size` : `cover`/`contain`/`fill`/`none`/`scale-down` →
  `object-fit` (var `--q-container-img-fit`) ; valeur CSS libre ("50%",
  "400px") → `.q-container__img--sized` : boîte `--q-container-img-size`
  centrée via la propriété `translate` (compose avec le `transform` du Ken
  Burns, pas d'écrasement) + `object-fit: contain`
- `background-animation-direction` (alternate défaut / alternate-reverse /
  normal / reverse) + `background-animation-duration` (défaut 24s) → vars
  `--q-container-kenburns-direction/duration` dans le shorthand animation
- Piège : `--animated` anime `transform` → écrase le scale statique de
  `--glass` ; les keyframes partent de scale ≥1.06 pour rester au-dessus du
  seuil de masquage du blur dans les deux cas
- reduced-motion → kenburns coupé. Démo docs : sections « Glass » et
  « Image background » (Unsplash). Build ✅.

## QTabs — mode collapse-inactive (icône seule, actif étendu) — 2026-08-31

Nouvelle prop `collapse-inactive` sur `QTabs` (pattern mobile bottom-nav) :

- Les tabs inactifs n'affichent que l'icône ; le tab actif s'étend (icône +
  label) avec une largeur animée
- CSS : label `max-width: 0 → 999px` + `opacity` + `white-space: nowrap` — la
  largeur utilisée = min(naturelle, max) → le label se déplie jusqu'à sa largeur
  réelle et le tab (flex auto) suit ; le gap du contenu passe 0 → 6px sur le
  tab actif. **Sans `overflow: hidden`** : le texte n'est jamais tronqué →
  apparition en FONDU (opacity), pas de glissement clippé (retiré 2026-08-31)
- QTab : en collapse, forcer `q-tab--inline-label` (label à droite de l'icône)
  et ne PAS poser `q-tab--stacked-icon` — évite le padding stacked ET le
  fallback `:has()` (qui exige `:not(.q-tab--inline-label)`) de spécificité
  (0,4,0) qui aurait écrasé le padding 0
- **Indicateur** : la mesure nextTick tombe pendant la transition max-width
  (largeur repliée) → écouteur `transitionend` (filtré sur `max-width`, posé
  une fois sur la racine — l'événement bulle depuis le label) qui re-mesure à
  la fin de l'expansion/retombée. Combinable avec `animated` + presets
  (l'indicateur suit le tab qui grandit puis spring à sa place)
- **Crossfade** : inactif s'estompe pendant que l'actif apparaît en fondu,
  simultanément (opacity 0.25s des deux côtés). En mode collapse, les
  animations d'entrée du tab (pop/rise) sont neutralisées
  (`animation: none` sur spring/elastic/smooth) pour ne pas geler le fade du
  label entrant — l'indicateur garde son spring
- **inactive-color** : nouvelle prop `inactive-color` sur QTabs (token ou hex)
  → var `--q-tabs-inactive-color` sur le conteneur ; `.q-tab` base
  `color: var(--q-tabs-inactive-color, inherit)` (fallback hérité = inchangé) ;
  `.q-tab--active` prime par ordre de source (même spécificité). Démo docs
  « Colors » (active/inactive selects)
- **transition-duration** : prop `transition-duration` (ms) sur QTabs → var
  `--q-tabs-duration` posée sur le conteneur. Consommée par : transition de
  l'indicateur (base 0.25s + presets animated 0.45/0.5/0.6s), transitions du
  label collapse (max-width 0.3s / opacity 0.25s), animations pop (0.3s) et
  rise (0.32s) — chaque point d'usage a son fallback `var(--q-tabs-duration,
…)`, donc non défini = comportement par défaut. Démo docs Animated : select
  duration (100-800ms)
- reduced-motion → transition 0s (layout instantané → mesure correcte sans
  transitionend)
- Démo docs `tabs.vue` : section « Collapse inactive » combinée à animated.
  Build ✅.

## QTabs — transitions animées (animated + transition) — 2026-08-31

`QTabs` dispose d'un système de transitions au changement de tab :

- `animated` = interrupteur (appui tactile scale(0.94) + entrée du tab actif)
- `transition` = preset d'easing de l'indicateur : `spring` (défaut,
  `cubic-bezier(0.34,1.56,0.64,1)` back-out, pop du tab), `smooth`
  (`cubic-bezier(0.16,1,0.3,1)` expo-out 0.5s + `q-tab-rise` du contenu),
  `elastic` (`cubic-bezier(0.68,-0.55,0.27,1.55)` 0.6s, rebond marqué)
- Classes : `q-tabs--anim-spring|smooth|elastic` (posées seulement si animated) ;
  le pop est scopé spring/elastic (pas smooth qui a son rise)
- `prefers-reduced-motion: reduce` → transitions 0s + animations coupées
- L'indicateur utilise `transform: translateX/translateY` + width → transitionner
  transform/width (pas left/top, qui causent du jank)
- Démo docs `tabs.vue` : section « Animated transitions » (q-select de preset).
  Build ✅.

## fixedLayout — offset des barres fixed haut ET bas — 2026-08-31

`lib/fixedLayout.ts` gère les barres fixed dans tout `.q-app`
(`compareDocumentPosition` + ResizeObserver + MutationObserver) :

- Sélecteurs séparés : `FIXED_TOP_SELECTOR` (`.q-header--fixed`,
  `.q-back-header--fixed`) et `FIXED_BOTTOM_SELECTOR` (`.q-footer--fixed`) ;
  `FIXED_BAR_SELECTOR` = les deux (observation)
- `fixedBarsHeightBefore(el)` → barres HAUT avant el (padding-top du q-page,
  top des barres) ; `fixedBarsHeightAfter(el)` → barres BAS après el
  (padding-bottom du q-page, bottom des footers)
- `useFixedBarOffset` modes : `"page"` (padding-top + padding-bottom + vars
  `--q-page-offset`/`--q-page-offset-bottom`), `"bar"` (top, empilement haut),
  `"bar-bottom"` (bottom, empilement des footers depuis le bas)
- QFooter fixed → `useFixedBarOffset(rootEl, "bar-bottom", () => props.fixed)` ;
  le q-page qui précède reçoit le padding-bottom mesuré (remplace le fallback CSS
  50px `.q-app:has(.q-footer--fixed)`). `DOCUMENT_POSITION_PRECEDING` =
  barre APRÈS el (l'inverse de FOLLOWING). Build ✅.

## $q.platform — détection de plateforme (API Quasar complète) — 2026-08-31

`packages/ui/lib/platform.ts` : singleton statique SSR-safe `platform` branché sur
`$q.platform` (`lib/q.ts`) — API alignée sur
https://quasar.dev/options/platform-detection.

- `is.*` : `mobile`/`tablet`/`desktop`, `nativeMobile`, `nativeMobileWrapper`
  (string `'cordova'|'capacitor'`), `ios`/`android`/`iphone`/`ipad`/`ipod`,
  `mac`/`win`/`linux`, `cros` (Chromebook — UA `CrOS`), `blackberry`/`winphone`/
  `silk`, navigateurs `chrome`/`firefox`/`safari`/`edge`/`opera`/`vivaldi`/`ie`,
  `webkit`, wrappers `cordova`/`capacitor`/`electron`/`bex`, `touch`, `mouse`
- `is.name`/`is.version`/`is.versionNumber` (navigateur) + `is.platform` (nom OS :
  `mac`/`win`/`linux`/`ios`/`android`/`cros`…) — `detectBrowser()` par spécificité
  (vivaldi > edge > opera > chrome > firefox > ie > safari)
- `has.touch` / `has.webStorage` ; `within.iframe` ; `isServer`/`isClient`
- SSR-safe : branche serveur = booléens false, chaînes vides, versionNumber -1
- Page docs : `docs/app/pages/docs/plugins/platform.vue` (live demo « Your device »
  - tableau API) — menu Plugins API (`scripts/gen-menu.ts` PLUGINS + `llms.txt`)

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
