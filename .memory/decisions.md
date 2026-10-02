# Décisions d'architecture / d'API (tag: decisions)

## docs → ddocs : migration de la doc vers Docus (Nuxt Content / MDC) — 2026-09-10

L'app docs historique (`docs/`, pages Vue + démos live) est portée dans un site
**Docus** : `ddocs/`, contenu Markdown MDC. Les 107 pages sont converties
(84 composants, 5 layouts, 3 styles, 7 plugins, 6 directives, 2 guides) et le build
prérend 109 routes sans erreur.

- **Structure** : `ddocs/content/docs/{1.getting-started,2.layouts,3.styles,4.components,5.plugins,6.directives}`
  (préfixes numériques = ordre du menu, retirés de l'URL → `/docs/components/<slug>`).
- **API par composant** : composant `<DnaxApi name="QXxx" />` — Props depuis le
  runtime (`useComponent`), Slots/Events/Methods/valeurs depuis une méta générée AU
  BUILD par `ddocs/scripts/dnax-ui-meta.ts` (module Nuxt) → `#build/dnax-ui-meta.mjs`.
  **Jamais de glob `?raw` eager sur les SFC** : inliner ~140 SFC dans un module casse
  l'analyseur CJS de Rollup au prerender (`Expected ',', got 'undefined'`).
- **Démos** : blocs `::dnax-demo` → **onglets Preview / Code, Preview actif par
  défaut** (composant `app/components/DnaxDemo.vue`, tabs de la lib) ; slot défaut =
  live, `#code` = snippet exact du source. Démos statiques inlinées ; démos avec état
  regroupées dans UN composant par page `app/components/demos/DnaxDemo<Page>.vue`
  (prop `demo`), styles de page en `<style scoped>` (jamais `main.css`).
- **⚠ Piège MDC** : une balise auto-fermante `<q-btn … />` n'est PAS fermée (parse5)
  → elle avale la suite (slot `#code`, contenu après `<DnaxApi/>`). Utiliser l'inline
  `:dnax-api{name="…"}` ou fermer explicitement ; `scripts/fix-mdc-self-closing.mjs`
  corrige un lot de façon idempotente.
- **Providers `$q.*`** : Docus n'a pas de `<q-config-provider>` racine →
  `app/plugins/dnax-providers.client.ts` monte dialog/bottom-sheet/notify/loading/
  image-preview dans une app Vue DÉTACHÉE (hors QConfigProvider, pour ne pas combattre
  le mode sombre de Docus).
- **Fix bibliothèque** : `packages/ui/module.ts` enregistre désormais les directives
  aussi côté serveur (plugin universel, plus `mode: "client"`) — sinon tout rendu
  SSR/SSG d'une page utilisant `v-touch-*`/`v-intersection`/`v-close` crash
  (`Cannot read properties of undefined (reading 'getSSRProps')`).
- **Monorepo** : `ddocs/` ajouté aux workspaces racine (`@dnax/ui: workspace:*`) et
  `tailwindcss@~3.4.17` ajouté aux devDeps de `docs/` — sans ce pin, le Tailwind v4
  apporté par Docus est résolu par `@nuxtjs/tailwindcss` et le build `docs/` casse.
- **Outillage** : `ddocs/scripts/validate-content.mjs` (contrôle des pages),
  `fix-mdc-self-closing.mjs`, `gen-llms.mjs` → `ddocs/public/llms.txt`.
  Contrat complet de conversion : `ddocs/CONVERSION.md`.

## QBtnActions/QBtnDropdown : position + offset du panneau — 2026-09-09

Le popup peut s'ouvrir de chaque côté du déclencheur : prop `position`
(`DropdownPosition`, type exporté de QBtnActions.vue) + prop `offset` (distance
panneau ↔ déclencheur en px, défaut 4). Ajoutées au MOTEUR partagé QBtnActions,
pas seulement à QBtnDropdown (le wrapper ne fait que les transmettre).

- Valeurs : `bottom-{start,end}` (défaut effectif `bottom-end`), `top-{start,end}`,
  `left/right-{start,end}` (start = haut, end = bas) et les variantes centrées sans
  suffixe (`bottom`, `top`, `left`, `right` — centre sur l'axe croisé). Le suffixe
  s'applique TOUJOURS sur l'axe perpendiculaire au côté.
- `align` conservé en alias de compat : `"left"` = bottom-start, `"right"` =
  bottom-end. `position` prioritaire quand les deux sont fournis. Aucun changement
  du défaut ni des usages existants (démo table etc.).
- Algorithme d'ancrage « point + translate % » : top/left = point d'ancrage du
  panneau (fixed) ; décalage par `translate(tx, ty)` en 0 / -50% / -100% de la
  taille du panneau → alignement bord-à-bord ou centrage SANS mesurer le panneau
  (voir knowledges). Pas de flip/contrainte viewport : placement manuel assumé.
- Caret du déclencheur : `margin-left: auto` sur `.q-btn-actions__caret`
  (styles/main.css) → sur un déclencheur plus large que son contenu (stretch ou
  largeur fixe), la flèche se colle au bord DROIT du bouton au lieu de rester à
  côté du label ; sans espace libre (bouton à taille naturelle), aucun effet.
- Docs : section « Popup placement & offset » ajoutée à btn-dropdown.vue ; notes
  btn-actions.vue + entrées llms.txt (Button Actions / Button Dropdown) à jour.

## QBreadcrumbs + QBreadcrumbsEl : famille fil d'ariane — 2026-09-09

Nouveaux composants `QBreadcrumbs` (conteneur, QBreadcrumbs.vue) + `QBreadcrumbsEl`
(miette) — API Quasar, rendu shadcn-vue (`nav > ol > li`, `aria-current="page"` sur
la page courante). Docs : page custom `breadcrumbs.vue` (CUSTOM_PAGES) + entrée menu
régénérée + llms.txt à jour.

- Conteneur : insère **automatiquement** un séparateur entre les miettes du slot par
  défaut et colore la DERNIÈRE (page courante) avec `active-color` (primary) + poids
  600 — l'utilisateur n'écrit jamais de séparateur (contrairement à shadcn). Props :
  `separator` (texte `"/"` par défaut, ou icône Iconify — détection par préfixe
  `prefixe:` ex. `lucide:chevron-right` ; `separator=""` désactive), `separator-color`,
  `color` (miettes non courantes), `gutter` (`"8px"`), `align` (left/center/right),
  `dense`. Pas de prop `dark` : les gris passent par les tokens (vars CSS + `.dark`).
- Miette `QBreadcrumbsEl` : `label`/`icon` (Iconify) + slot défaut qui remplace le
  label ; `to` (lien routeur push/replace, routeur optionnel → dégrade en `<span>`),
  `href`/`target` (`_blank` → `rel="noopener"` auto), `disable`. Pas de `exact`
  (aucun état actif par route : la page courante = dernière miette).
- **Intercaler les séparateurs entre les vnodes du slot est impossible en template
  pur.** `defineRender` (macro Vue 3.4+) écartée : non typée par vtsls (Cannot find
  name 'defineRender'). Solution retenue : helper interne
  `components/internal/RenderNodes.vue` — petite fonction de rendu qui re-affiche des
  vnodes bruts passés en prop ; les `rows()` (crumb + isLast) sont calculées dans le
  template (1 appel de slot par rendu, pas de computed sur les slots).
- CSS BEM dans `styles/main.css` (bloc inséré avant QSeparator) : vars
  `--q-breadcrumbs-{gutter,color,sep-color,active-color}`, `.dark` re-déclare les deux
  gris. Pas de safe-area (élément non plaqué aux bords).
- Événement `change` sur le conteneur : délégation de clic DOM sur le `<nav>` (le
  clic remonte du lien QBreadcrumbsEl, l'émission Vue ne bulle pas) — émis quand une
  miette qui n'est PAS la dernière (page courante) est cliquée. Payload
  `(index, event)` (0-based, calculé sur les `.q-breadcrumbs__item` du `<ol>`).
- Générateurs : exports (`generate-exports.ts`) ET menu (`gen-menu.ts`) ignorent
  désormais les fichiers préfixés « \_ » (privés, ex. `_QBtnActionsLegacy.vue`) → non
  exportés / non listés dans le menu / pas de page générée.

## QBtnDropdown : items à icônes gauche + droite — 2026-09-09

Nouveau composant `QBtnDropdown` (QBtnDropdown.vue) : déclencheur QBtn + caret,
menu data-driven — API Quasar « QBtnDropdown ».

- Prop `items: DropdownItem[]` ({ label, value?, leftIcon?, rightIcon?, color?,
  description?, separator?, disable?, onClick? }) — chaque item porte une icône
  GAUCHE (`leftIcon`) et/ou DROITE (`rightIcon` : check, chevron, lien externe…).
- Événement `select` émis au clic (payload = `value`, sinon l'item).
- Implémentation = wrapper fin de QBtnActions (moteur partagé : teleport fixed,
  clavier, séparateurs) : mapping `leftIcon/rightIcon` → `icon/iconRight` et
  `select` → re-émission. Zéro duplication de logique/CSS.
- Mapping des deux API : QBtnActions (`actions`, `icon`/`iconRight`,
  `select-action`) = menu d'actions ; QBtnDropdown (`items`,
  `leftIcon`/`rightIcon`, `select`) = dropdown générique Quasar.
- Docs : page `btn-dropdown.vue` custom (slug dans CUSTOM_PAGES) + llms.txt.

## QBtnActions : bouton-dropdown piloté par données — 2026-09-09

Nouveau composant `QBtnActions` (QBtnActions.vue) : un déclencheur QBtn + menu
intégré, piloté par une prop `actions: BtnAction[]` ({ label, value?, icon?,
iconRight?, color?, description?, separator?, disable?, onClick? }) — équivalent
data-driven d'un QBtnDropdown Quasar (pas de QMenu/QList à composer).

- Déclencheur : API QBtn (flat/dense/round/color/size…) transmise ; icône seule si
  pas de label (défaut « … » lucide:ellipsis) ; flèche caret uniquement avec un
  label (masquable par `noCaret`).
- Événement `select-action` émis au clic (payload = `value` de l'action, ou
  l'action si pas de value) — le `onClick` de l'action s'exécute avant.
- `align` (right par défaut, pour les menus de fin de rangée/table), `menuWidth`,
  `separator` au-dessus de l'action, `color` (ex. "negative" pour Supprimer).
- Panneau TÉLÉPORTÉ dans <body> en `position: fixed` (z-index 3000) avec position
  recalculée à l'ouverture/resize/scroll → visible depuis une cellule sticky de
  table ou un container overflow (jamais clippé par un contexte d'empilement).
  Alignement via translateX(-100%) pour `align="right"` ; animation = fade seul
  (pas de conflit transform avec le translate).
- Comportement : fermeture clic extérieur/Échap ; clavier Arrow/Home/End dans le
  menu ; panel claire CSS `.dark .q-btn-actions__panel` ; ne s'ouvre pas si
  `actions` vide ou disable/loading.
- `separator` : soit posé sur l'action (trait au-dessus du bouton), soit en entrée
  seule `{ separator: true }` → trait seul SANS bouton (isSeparatorOnly) — jamais
  de bouton vide entre le trait et l'action suivante.
- Docs : page `btn-actions.vue` auto-générée (gen-menu) + entrée llms.txt.

## QSidebarMenuButton : props to / exact (activation route automatique) — 2026-09-09

`QSidebarMenuButton` accepte désormais `to` (RouteLocationRaw), `exact` et `replace`
(pattern QRouteTab) :

- Avec `to` : rend un `<a href>` (href résolu par le routeur), navigue au clic
  (`router.push`, `replace` si demandé) et **l'état actif suit la route** — la
  classe `q-sidebar__menu-button--active` (texte/icône couleur primaire) s'applique
  seule. `exact` : match path + hash ; sinon préfixe de segment (même logique que
  QRouteTab).
- Sans `to` : comportement historique conservé (`active` manuel + `href` natif ou
  bouton). `active` est ignoré quand `to` est fourni.
- Router optionnel : `useRouter`/`useRoute` en try/catch → sans router installé,
  `to` dégrade en bouton qui émet `@click` (le parent navigue). `@click` est
  toujours émis après la navigation (ne pas rappeler un goTo quand on passe `to`).
- Usage : `<q-sidebar-menu-button :to="item.to" :exact="item.exact" label icon />`
  — inutile de calculer `:active` + `@click` manuels.

## Champs (input/select) : `.q-field__bottom` toujours réservé — 2026-09-09

Convention de la famille « field » : le bloc `.q-field__bottom` (min-height 20px,
main.css) est TOUJOURS rendu, avec error/hint conditionnels à l'intérieur — jamais
`v-if` sur le bloc lui-même.

- Même empreinte verticale pour tous les champs (40px contrôle + 20px réserve)
  → un q-input et un q-select sans hint/error ont des hauteurs identiques et leurs
  fonds s'alignent dans une même rangée ; pas de saut de layout quand une erreur
  ou un hint apparaît.
- C'est aussi le défaut Quasar (d'où la prop d'opt-out `hide-bottom-space`) et le
  comportement majoritaire de la lib.
- Corrigé sur QSelect, QAutocomplete, QDatePicker (rendaient le bloc seulement si
  error/hint) pour les aligner sur QInput, QInputOtp, QInputTag, QFilePicker,
  QImagePicker.
- Opt-out compact éventuel (à faire si demandé) : prop Quasar-compatible
  `hide-bottom-space` sur les composants de la famille.

## QDialog : transitions sheet-up / sheet-down — 2026-09-05

Deux nouvelles valeurs pour la prop `transition` de `QDialog` : `sheet-up` et
`sheet-down` — même glissement plein écran que `slide-up` / `slide-down`, mais
l'OUVERTURE décélère en fin de course (« pose » type sheet natif) ; la fermeture
reste identique à slide.

- Implémentation CSS (`styles/main.css`) : classes overlay
  `q-dialog-sheet-{up,down}-{enter,leave}-active` qui réutilisent les keyframes
  de slide (`q-dialog-slide-{up,down}-in/out`) avec une courbe d'entrée
  `cubic-bezier(0.32, 0.72, 0, 1)` (défaut 0.3s, pilotable par
  `transition-duration` via `--q-dialog-duration-enter`)
- Type de la prop `transition` élargi dans `QDialog.vue` ; liste `transitions`
  et snippets des démos docs `dialog.vue` (Transitions + Maximized) à jour
- Keyframes partagées → zéro duplication de mouvement ; aucune nouvelle
  dépendance

## QDialog : props transition-easing-enter / transition-easing-leave — 2026-09-05

Réglage fin des courbes d'ouverture/fermeture de TOUTES les transitions de
`QDialog`, sans toucher au CSS :

- Props : `transitionEasingEnter` / `transitionEasingLeave` (string CSS —
  `"cubic-bezier(…)"`, `"ease-out"`, `"linear"`…), posées en variables CSS
  `--q-dialog-easing-enter/leave` sur l'overlay (computed `transitionStyle`,
  ex-durationStyle étendu)
- CSS (`styles/main.css`) : sélecteur d'attribut
  `.q-dialog__overlay[style*="--q-dialog-easing-enter"] .q-dialog__content`
  avec `animation-timing-function: var(--q-dialog-easing-enter)` — les courbes
  par défaut de chaque transition (ease, ease-in-out, cubic-bezier de
  sheet/swipe…) restent intactes tant que la prop n'est pas fournie
  (override par spécificité, longhand `animation-timing-function`)
- Portée = TOUTES les transitions de QDialog : le panneau (zoom, slide-_,
  sheet-_, swipe-_, défaut selon position) via `animation-timing-function`, ET
  le fondu de l'overlay/backdrop via `transition-timing-function` ciblée par
  `[class_="-enter-active"]`/`[class*="-leave-active"]`(couvre aussi`fade`, qui n'anime que l'overlay) (2026-09-05)
- La prop n'est appliquée QUE si elle est définie ; durée toujours pilotée par
  `transition-duration` (--q-dialog-duration-enter/leave)

## $q.localStorage / $q.sessionStorage — plugin stockage web — 2026-09-03

Nouveau plugin web storage (page docs `docs/plugins/web-storage`, entrée menu
dans la liste `PLUGINS` de `scripts/gen-menu.ts` — titre « Web Storage »).

- Implémentation : `packages/ui/lib/storage.ts` — usine `init("local" | "session")`,
  export `localStorage` / `sessionStorage` + type `QWebStorage` (index.ts)
- API Quasar complète (miroir de `LocalStorage.js` upstream) : `has`/`hasItem`,
  `getLength`, `getItem`, `getIndex`, `getKey`, `getAll`, `getAllKeys`,
  `set`/`setItem`, `remove`/`removeItem`, `clear`, `isEmpty`
- Sérialisation typée par préfixes `__q_date|`, `__q_expr|`, `__q_numb|`,
  `__q_bool|`, `__q_strn|`, `__q_objt|` — format **identique à Quasar** : clés
  écrites par une app Quasar lisibles par dnax.ui et inversement (migration sans casse)
- Types non supportés (undefined, null, bigint, symbol, fonction) → string
  (comportement Quasar) ; `getItem` d'une clé absente → `null` ; payload
  `__q_objt|` corrompu → valeur brute (pas de throw)
- Piège RegExp : l'encode ne garde que `.source` — les flags (`/i`…) sont perdus
  au round-trip (parité Quasar, assumé)
- SSR-safe : côté serveur / Web Storage bloqué (privé, iframe sandbox…) →
  instance no-op (miroir `getEmptyStorage` de Quasar) — jamais de throw
- Docs : démo live sous clés préfixées `ws:demo:` — **jamais de `clear()` global
  dans la page docs** (détruirait `dnax-ui-theme-mode` du ThemeToggle)

## QDialogHeader/Footer = barres d'app avec QToolbar embarqué — 2026-08-31

`QDialogHeader` et `QDialogFooter` rendent désormais des barres type `q-header`/
`q-footer` : `<div.q-dialog__header>` (sticky, bordure basse, fond hérité)
contenant un **`<q-toolbar>` embarqué** (min-height 50px, padding 0 12px) qui
porte le padding — plus de `display: flex`/`padding: 16px` sur les conteneurs.

- Header : titre/description à gauche, `<q-space/>`, bouton fermer à droite,
  slot défaut en fin de toolbar
- Footer : actions embarquées dans le toolbar, alignées à droite
  (`.q-dialog__footer .q-toolbar { justify-content: flex-end }`) ; modifier
  `no-padding` (`.q-dialog__footer--no-padding .q-toolbar { padding: 0 }`)
  pour coller les actions aux bords (2026-08-31)
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
- Modifier `no-padding` sur TOUTES les barres (dialog + bottom sheet header/
  footer) : `.q-{dialog,bottom-sheet}__{header,footer}--no-padding .q-toolbar
{ padding: 0 }` ; `QFooter` : `.q-footer--no-padding { padding: 4px 0 }` +
  safe-area re-déclarées (ne JAMAIS zéroter les insets) (2026-08-31)
- Docs `bottom-sheet.vue` : notes header/footer à jour. Build ✅.

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

## ddocs — titres des sections API — 2026-09-10

Dans les pages MDC de `ddocs/content/docs/4.components/` :

- Page **mono-composant** : la section finale est `## API` + `<DnaxApi name="QXxx" />`
  (on normalise, même si la source historique titrait `## QXxx API`) — aligné sur
  l'exemplaire canonique `btn.md`.
- Page **famille** (plusieurs `docs-api`) : une section `## <Part>` par composant
  (titre repris de la source) + `<DnaxApi name="…" />`, avec un sous-titre `### API`
  quand la source en avait un sous chaque partie (bottom-sheet, breadcrumbs).

Batch converti le 2026-09-10 : back-top, badge, bar, board, bottom-sheet, breadcrumbs
(6 pages + composants de démo `DnaxDemoBackTop/Badge/Bar/Board/BottomSheet/Breadcrumbs.vue`).

## ddocs — balises childless en syntaxe MDC inline — 2026-09-10

Sur demande explicite, les composants sans enfant des pages MDC s'écrivent en
**syntaxe MDC inline** (idiomatique, cf. CONVERSION.md) plutôt qu'en balise kebab
explicite :

- `:dnax-api{name="QMarquee"}` (jamais `<dnax-api … />`)
- `:dnax-demo-marquee{demo="basic"}` (jamais `<dnax-demo-marquee … />`)

Le balisage avec enfants/slots garde la balise kebab explicite
(`<q-marquee …></q-marquee>`). Vérif : parseur `createMarkdownParser` de
`@nuxtjs/mdc/runtime` — dans un `::code-preview`, le nœud `template v-slot:code`
doit être **frère** du composant de démo.

## ddocs — composant de démo pour démos sans état — 2026-09-10

Un composant `DnaxDemo<Page>.vue` est créé même quand la démo n'a **pas d'état**
lorsque (a) le markup live contient un **binding** non évaluable en MDC
(`:text="NEWS"`, `:src="img1"`, `:height="300"`) ou (b) il faut des **styles
scoped** page-spécifiques (`.demo-nav`, `.demo-scroller`, `.demo-parallax`…)
impossibles à poser en Markdown sans éditer `app/assets/css/main.css`.

Batch converti le 2026-09-10 : marquee, message-scroller, nav-menu, pagination,
parallax, pull-to-refresh (6 pages + `DnaxDemoMarquee/MessageScroller/NavMenu/Pagination/Parallax/PullToRefresh.vue`).
Cas particulier : dans `pull-to-refresh.vue`, `usageBasic` embarque déjà son
`<script setup>` ; le `#code` MDC recompose l'SFC à partir de `scriptBasic` +
template pour éviter un double bloc script.

## docd — second site de doc, sur le layer Docd (UI Thing) — 2026-09-10

Un **second site de documentation** rend le même contenu que `ddocs/` avec un
autre thème : `docd/`, basé sur le layer Nuxt **Docd** (`@baybreezy/docd`,
s'appuie sur Nuxt Content + UI Thing, cf. https://docd.uithing.com).

- **Contenu généré** : `docd/content/docs/**` est produit depuis
  `ddocs/content/**` par `docd/scripts/port-from-ddocs.mjs` (idempotent, repart
  d'une arborescence propre). Seuls `docd/content/index.md` (landing
  `::landing-hero`) et `docd/content/docs/index.md` (hub) sont écrits à la main.
- **Réécritures** : `::dnax-demo` → `::prose-show-case` (bloc Preview/Code natif
  de Docd, **Preview actif par défaut**), `::note` →
  `::prose-callout{variant="note"}`, `i-lucide-x` → `lucide:x`, `2.essentials`
  ignoré. Tout le reste (frontmatter, prose, `#code`, `<dnax-api>`,
  `<dnax-demo-*>` explicites **et** inline `:dnax-api{}` / `:dnax-demo-*{}`) est
  copié **tel quel**.
- **API** : on réutilise nos `<DnaxApi>` / `<DnaxPropsTable>` (identiques à
  `ddocs/`) alimentés par `scripts/dnax-ui-meta.ts` → le mécanisme natif
  `componentApi` du layer Docd n'est **pas** utilisé (il exigerait des chemins de
  composants sous `rootDir`).
- **Monorepo** : `docd/` ajouté aux workspaces racine, `@dnax/ui: workspace:*`
  (les sources `packages/ui` sont utilisées, pas le paquet npm publié).
- **Contrat complet** : `docd/CONVERSION.md`.

Vérification : `cd docd && bun run generate` → **443 routes prérendues**, 0 `[500]`
ni `[404]`, `llms.txt` + `llms-full.txt` générés, aucune balise `dnax-*`/`prose-*`
non résolue dans le HTML, tables d'API présentes dès le prerender.

## QBtnActions/QBtnDropdown/QBtnGroup : `stretch` = racine pleine largeur — 2026-09-10

`filename: packages/ui/styles/main.css`, `packages/ui/components/QBtnActions.vue`

**Convention** : `stretch` signifie « 100 % de la largeur du conteneur », à tous les
niveaux de la famille bouton :

- `QBtn` → `.q-btn--stretch { width: 100%; align-self: stretch }` (inchangé) ;
- `QBtnActions` / `QBtnDropdown` → classe racine `q-btn-actions--stretch` posée par
  QBtnActions quand `stretch` est vrai (QBtnDropdown ne fait que transmettre) →
  `.q-btn-actions--stretch { width: 100% }` ;
- `QBtnGroup` → `.q-btn-group--stretch { width: 100% }` (les boutons se partagent la
  largeur via `flex: 1 1 auto`, règle déjà présente).

Même schéma que `QTabs` (`.q-tabs--stretch { width: 100% }`). Conséquence : le
contournement consommateur `class="w-full"` n'est plus nécessaire.

Docs mises à jour (site `docd/`) : `btn-dropdown` (démo « Full-width trigger » dans un
conteneur `.pos-full` + note), `btn-actions` (nouvelle section `## Stretch`),
`btn-group` (`## Stretch` reformulé). Vérif : `cd docd && bun run generate` →
`q-btn-actions--stretch` / `q-btn-group--stretch` + `q-btn--stretch` dans le HTML et
règles `width:100%` dans le CSS ; `bun test packages/ui/lib` → 41/41.

## v-ripple — directive onde « material ripple » — 2026-09-10

`filename: packages/ui/lib/ripple.ts`, `packages/ui/module.ts`, `packages/ui/styles/main.css`

Nouvelle directive globale **`v-ripple`**, parité Quasar
(https://quasar.dev/vue-directives/material-ripple).

- **API** : valeur `Boolean | Object` (`false` désactive), argument couleur
  (`v-ripple:primary`), modifiers `.center` / `.early` / `.stop`, options
  `{ early, stop, center, color, keyCodes }`. Défauts repris de Quasar sauf
  `keyCodes` : `[13, 32]` (Entrée + Espace) au lieu de `13` seul.
- **Couleur** : `colorValue()` de `lib/colors.ts` → token dnax.ui = `var(--token)`,
  sinon couleur CSS passée telle quelle ; défaut = `currentColor` (donc la couleur
  du label sur un QBtn plein).
- **Géométrie** : diamètre = diagonale de l'hôte (`hypot(w, h)`), départ au point
  d'interaction (ou centre), transform final centré → l'onde couvre toujours tout
  l'élément (reprise de l'algo Quasar, animations CSS `.q-ripple__inner--enter` /
  `--leave`).
- **Hôte** : conteneur `.q-ripple` injecté (`position: absolute`, 100 %×100 %,
  `overflow: hidden`, `border-radius: inherit`) → le consommateur n'a PAS besoin de
  `overflow: hidden` ; en revanche si `position` calculée vaut `static`, la
  directive pose `position: relative` et **restaure** la valeur inline au
  démontage.
- **Enregistrement** : export `vRipple` (+ types `RippleOptions`, `RippleValue`)
  ajouté aux `manualExports` de `scripts/generate-exports.ts` (sinon perdu à la
  prochaine régénération de `index.ts`) et au plugin UNIVERSEL
  `dnax-ui-directives.mjs` de `module.ts` (`directive("ripple", vRipple)`).
- **Docs** : `docd/content/docs/6.directives/ripple.md` + démo
  `docd/app/components/demos/DnaxDemoRipple.vue` (4 démos : basic, position,
  color, options). Cf. l'entrée `knowledges` « ajouter une directive ».
- Vérif : `cd docd && bun run generate` → page
  `/docs/directives/ripple` prérendue, 0 erreur ; le bundle expose
  `vueApp.directive("ripple", Nu)` et la démo compile en
  `resolveDirective("ripple")` + `withDirectives`.

## QBtnActions/QBtnDropdown : prop `fit` (panneau ≥ largeur du déclencheur) — 2026-09-10

`filename: packages/ui/components/QBtnActions.vue` (+ `QBtnDropdown.vue`)

Le panneau pouvait être plus étroit que son déclencheur (cas d'un bouton
`stretch` / pleine largeur). Nouvelle prop **`fit`**, nom repris de Quasar
`QMenu.fit` (« Allows the menu to match **at least** the full width of its
target ») : le nom `popup` (suggéré) a été écarté — il dit ce qu'est l'élément
(tout est « popup » ici) et non ce qu'il fait, alors que `fit` complète le
vocabulaire Quasar déjà utilisé (`position`, `offset`, `menu-width`, `align`).

- **Défaut `true`** (demandé) — divergence assumée avec Quasar (défaut `false`) :
  un menu plus étroit que son bouton est visuellement cassé.
- **Sémantique = plancher, pas largeur exacte** : `min-width: max(menu-width,
largeurMesuréeDuDéclencheur)`. Le `max()` est calculé **par le CSS** (pas de
  parsing de `menu-width`, qui peut rester `"16rem"` / `"40%"`) ; un item plus
  large peut donc encore élargir le panneau (pas de troncature de libellé).
  Pour une largeur strictement égale il faudrait un mode dédié (`fit="exact"`)
  qui poserait aussi un `max-width` — non retenu par défaut.
- **Mesure** : `triggerWidth` est rafraîchi dans `placePanel()` (donc à
  l'ouverture ET sur resize/scroll via le tracking `position: fixed` déjà en
  place) ; `fit: false` restaure l'ancien comportement (`menu-width` seul).
- Docs : `btn-dropdown.md` → nouvelle section « Panel width — `fit` » + démo
  `demo="fit"` (deux déclencheurs `stretch` côte à côte, `fit` par défaut vs
  `:fit="false"`) ; `btn-actions.md` → mention dans la section `## Stretch` et
  dans la liste des options du panneau.
- Vérif : `cd docd && bun run generate` → 0 erreur ; `fit` présent dans la table
  d'API ; logique compilée relue (`minWidth = menuWidth ? max(menuWidth,
Npx) : Npx`). L'effet visuel (panneau ouvert) n'est pas vérifiable au
  prerender — la démo est le contrôle.

## QBtnActions/QBtnDropdown : `content-class` / `content-style` — 2026-09-10

`filename: packages/ui/components/QBtnActions.vue` (+ `QBtnDropdown.vue`)

Le panneau du menu est **téléporté dans `<body>`** et rendu par le moteur partagé
`QBtnActions` : impossible de le cibler depuis le composant consommateur (ni par
`class` — qui va sur le déclencheur — ni par les styles scoped, car l'élément porte
le scope id du moteur, pas celui de l'appelant). D'où deux props reprises de Quasar
`QBtnDropdown` (desc : « Class/Style definitions to be attributed to the menu ») :

- `contentClass?: string` (défaut `""`) — fusionnée avec `cn("q-btn-actions__panel",
props.contentClass)` (`cn` = clsx + tailwind-merge : une classe Tailwind du
  consommateur prime sur celle du moteur) ;
- `contentStyle?: StyleValue` (défaut `""`) — appliquée **APRÈS** le style calculé :
  `:style="[panelStyle, contentStyle]"` → elle peut donc surcharger `top`/`left`/
  `transform`/`min-width`, ce qui est la façon de forcer une **largeur exacte**
  (`content-style="min-width: 420px; max-width: 420px"`) sans ajouter un mode
  `fit="exact"`.

Conventions reprises de `QDialog.vue` (`contentClass` string + `contentStyle:
StyleValue`, `import type { StyleValue } from "vue"`). Les deux props sont
transmises par `QBtnDropdown` (déclarées, donc pas de fall-through d'attribut).
Docs : `btn-dropdown.md` → section « Panel classes & styles » + démo
`demo="content"` ; `btn-actions.md` → mention dans la liste des options du panneau.
Vérif : compile relue (`class: normalizeClass(panelClasses.value)`, `style:
normalizeStyle([panelStyle.value, contentStyle])`), `contentClass`/`contentStyle`
présents dans les tables d'API, 6 démos sur la page dropdown, `bun test
packages/ui/lib` → 41/41.

## QSelect mode inline : direction (haut/bas), écart adaptatif et hauteur bornée — 2026-09-10

`filename: packages/ui/components/QSelect.vue` (+ `styles/main.css`)

En mode `inline`, le popup était **toujours** sous le champ (`position: absolute;
top: calc(100% + 4px)`, `max-height: 240px` figés en CSS) → il pouvait dépasser le
bord bas de la fenêtre sur un champ en bas de page. Désormais le placement est
calculé à l'ouverture (**et** sur `resize` / `scroll` tant qu'il est ouvert) :

- **Direction** : sous le champ si l'espace bas ≥ `POPUP_MIN_SPACE` (96px) **ou**
  s'il est plus grand qu'au-dessus ; sinon bascule au-dessus (`popupDirection`).
- **Écart adaptatif** : `gap = clamp(0, offset, available - POPUP_MIN_SPACE)` (la
  constante `POPUP_GAP (4)` a depuis été remplacée par la prop `offset`, passée de
  4 à **8** par défaut — voir plus bas)
  → l'écart se réduit (jusqu'à 0) quand la place manque, au profit de la liste.
- **Hauteur** : `max-height = clamp(0, available - gap, POPUP_MAX_HEIGHT (240))`.
  Le plafond historique de 240px est conservé, mais l'espace réellement disponible
  prime → jamais de débordement, la liste scrolle à l'intérieur.
- **Animation** : `--up` (classe `q-select__popup--up`) rejoue `q-popup-in-up`
  (entrée depuis le bas) au lieu de `q-popup-in`.
- **Seam** : `inlineOptions.style` est appliqué **après** le style calculé
  (`:style="[popupStyle, inlineOptions?.style]"`) → le consommateur peut épingler
  librement (`maxHeight`, `top`/`bottom`) sans nouveau prop.

**Alternative écartée** : mesurer la hauteur réelle du popup après rendu puis
flipper. Plus « juste » mais impose un double rendu (le popup est monté avec une
animation d'entrée) → saut visuel. Le seuil déterministe (96px) est prévisible et
sans flash ; la mesure du contenu n'est pas nécessaire puisque `max-height` est de
toute façon borné à la place disponible.

Docs : `select.md` → section « Inline popup placement » (tableau des cas + exemple
`inline-options.style`). Vérif : `cd docd && bun run generate` → 0 erreur ; CSS
`.q-select__popup--up` + `@keyframes q-popup-in-up` dans le bundle ; logique
compilée relue (`below >= 96 || below >= above`, `gap = max(0, min(4, available -
96))`, `maxHeight = max(0, min(240, available - gap))`).

**Correctif suivant (même jour) — popup « trop loin du champ »** : le décalage ne
venait PAS du gap (4px) mais de **l'ancre**. Le popup était ancré au bas de la
**racine** `.q-select` (`top: calc(100% + 4px)`), or `.q-field__bottom` est
**toujours rendu** et réserve ~24px même vide (`min-height: 20px` +
`padding: 4px 12px 0`) → distance réelle ≈ 28px. Réduire le gap n'aurait rien
réglé (26px). Correctif : l'ancre est le **`.q-field__control`** quand aucun
hint/erreur n'est affiché, sinon la racine (pour ne pas recouvrir le texte) :
`anchor = (!el.querySelector(".q-field__hint, .q-field__error") && control ?
control : el).getBoundingClientRect()`. La position est alors posée en **px
relatifs à la racine** (`popupTop = anchor.bottom - rect.top + gap`,
`popupBottom = rect.bottom - anchor.top + gap`) au lieu de `calc(100% + gap)` ;
`popupTop`/`popupBottom` sont `null` avant mesure → repli sur `calc(100% + 4px)`.
Gap conservé à 4px (standard) : la distance passe de ~28px à 4px.

Reste à faire (non demandé) : `QAutocomplete` a le même popup inline
(`.q-autocomplete__popup`, même `q-popup-in`) et n'a pas encore ce traitement —
il a donc le même décalage de ~28px.

## QSelect : les 3 modes (inline / modal / sheet) documentés et démoés — 2026-09-10

`filename: docd/content/docs/4.components/select.md`, `docd/app/components/demos/DnaxDemoSelect.vue`

`QSelect` supportait déjà `mode="inline" | "modal" | "sheet" | "dialog"` **côté
composant**, mais sa page de doc ne **démontrait** aucun mode (contrairement à
`autocomplete.md` qui a une section « Sheet & modal modes » + démo `panel`).

- Démo `demo="panel"` ajoutée à `DnaxDemoSelect.vue` : un `q-select` (options
  primitives `['inline','modal','sheet']`, outlined, dense) sert de sélecteur de
  mode, puis un `q-select` « Country » avec `emit-value`, `use-search`,
  `:sheet-options="{ width: '100%', searchPlaceholder: … }"` et
  `:modal-options="{ height: '360px' }"` ; styles scoped `.demo-select-panel`
  (`min-height: 320px`, comme la démo autocomplete, pour que le popup inline ne
  soit pas coupé).
- Section `## Modes — inline, modal, sheet` dans `select.md` (avant « Inline
  popup placement ») : prose (rôle du panneau, titre = `label` du champ, fermeture
  backdrop / × / Esc / retour navigateur, `dialog` = plein écran) + `#code`
  complet. `dialog` est cité en prose mais pas dans le sélecteur de la démo (évite
  un plein écran dans l'aperçu).
- À noter : `QSelectModeOptions` n'a **pas** de `title` (contrairement à
  `QAutocompleteModeOptions`) — le titre du panneau vient du `label` du champ.
- Vérif : `cd docd && bun run generate` → 0 erreur ; DOM relu : 6 démos sur la
  page (5 `demo-field` + 1 `demo-select-panel`), sélecteur de mode affichant
  « inline », `q-field__bottom` rendu, `<teleport>` en place.

## QSelect : `offset` + `position` (géométrie du popup inline) — 2026-09-10

`filename: packages/ui/components/QSelect.vue`

L'écart entre le champ et le popup inline était la constante `POPUP_GAP = 4`
(non configurable). Nom repris de notre propre famille `QBtnActions` /
`QBtnDropdown` (`offset`, en px) plutôt que de Quasar : `QSelect.json` n'expose
**aucun** prop d'offset (seul `menu-shrink` existe côté menu).

- Prop **`offset?: number`** (défaut **`8`**, ramené de `4` le même jour sur demande)
  - **`QSelectModeOptions.offset`** pour la
    surcharge par mode (`inline-options="{ offset: 8 }"`), via
    `popupOffset = computed(() => modeOptions?.offset ?? props.offset)`.
- La constante `POPUP_GAP` est **supprimée** (une seule source de vérité : le
  défaut de la prop) ; `popupOffset` sert au calcul du gap, au `popupTop`/
  `popupBottom` et au repli CSS (`calc(100% + Npx)`).
- L'écart reste un **point de départ** : il est borné par
  `clamp(0, offset, available - 96)`, donc il se réduit près d'un bord de fenêtre.
  `0` colle le popup au champ.
- **Doc corrigée** : l'exemple de `select.md` qui épinglait la position via
  `inline-options.style: { top: 'calc(100% + 2px)' }` était devenu **faux** depuis
  le passage à une position calculée en **px** (il réintroduisait l'ancre sur la
  racine, donc les ~28px). Remplacé par `offset` + note « le style passe après le
  style calculé, mais la position est en px : utilisez `offset` ».
- Démo `demo="offset"` ajoutée à `DnaxDemoSelect.vue` (3 champs : `offset 0`,
  `offset 8 (default)`, `offset 16`) + sous-section `### Offset` dans `select.md`.
  Le défaut de `offset` (8px) est aussi celui du repli CSS
  `.q-select__popup { top: calc(100% + 8px) }` — garder les deux alignés.
- Vérif : `cd docd && bun run generate` → 0 erreur ; 7 démos sur la page ;
  `offset` présent dans la table d'API ; logique compilée relue
  (`popupOffset = modeOptions?.offset ?? props.offset`) ; `diagnostics` sur
  `QSelect.vue` → 0 erreur / 0 warning ; `bun test packages/ui/lib` → 41/41.

### `position` — direction forcée (vocabulaire `DropdownPosition`) — 2026-09-10

Ajout de **`position?: SelectPopupPosition`** (défaut `"auto"`) +
**`QSelectModeOptions.position`** (`inline-options="{ position: 'top' }"`), résolu
par `popupPlacement = modeOptions?.position ?? props.position`. Type exporté depuis
le bloc `<script lang="ts">` de `QSelect.vue` :

```ts
export type SelectPopupPosition =
  | "auto"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "top"
  | "top-start"
  | "top-end";
```

- Même vocabulaire que `DropdownPosition` (QBtnActions) **moins les placements
  latéraux** (`left`/`right`/`left-end`…) : un popup de sélection s'ouvre toujours
  au-dessus ou au-dessous de son champ.
- `auto` = comportement précédent (bascule selon la place). `top`/`bottom`
  **forcent** le côté : `down = !placement.startsWith("top")`, donc **pas de
  bascule** ; si la place manque, c'est le `max-height` qui se réduit (la liste
  scrolle) — un côté forcé ne se retourne jamais.
- Suffixes `-start` / `-end` = **ancre horizontale**. Le popup garde par défaut la
  largeur du champ (`width: 100%`), donc `-start`/`-end` sont alors sans effet
  visible ; ils deviennent utiles dès qu'on donne une largeur au popup
  (`inline-options.width`, jusqu'ici **ignoré** pour le mode inline — corrigé au
  passage) : `left: 0` (start) ou `right: 0` (end).
- Un `watch([popupPlacement, popupOffset], onPopupViewportChange)` repositionne le
  popup immédiatement si la valeur change pendant qu'il est ouvert.
- Docs : `select.md` → sous-section `### Direction` (tableau des valeurs + démo
  `demo="direction"` avec sélecteur de placement et `inline-options.width: '240px'`
  pour rendre l'ancrage visible).
- Vérif : `cd docd && bun run generate` → 0 erreur ; 8 démos sur la page
  (`demo-field` ×5, `demo-select-panel` ×2, `demo-select-offset` ×1) ; `position`
  dans la table d'API ; logique compilée relue (`placement === "auto" ? (below >=
96 || below >= above) : !placement.startsWith("top")`).

## QTable : réordonnancement des lignes (`reorderableRows`) — 2026-09-10

`filename: packages/ui/components/QTable.vue` (+ `styles/main.css`)

Nouvelle prop **`reorderableRows`** : une gouttière (28px) apparaît à gauche, avec une
poignée à glisser. Le déplacement **agit sur `rows`** → émet `update:rows`
(compatible `v-model:rows`, convention déjà utilisée par `QSpreadsheet`) **et**
`row-reorder` (`{ rows, row, from, to }`, indices **source**).

- **Identité d'objet, pas de clé** : `sourceIndexOf(row) = props.rows.indexOf(row)`.
  `sortedRows` (`[...rows].sort`) et `pagedRows` (`slice`) conservent les mêmes
  références → le déplacement marche sans `rowKey` unique, sous tri, avec
  pagination et en virtual scroll. La cible est la ligne survolée : insertion
  **avant** ou **après** selon la moitié haute/basse (`dropTargetAt`).
- **Drag & drop** : `pointerdown` sur la poignée → `elementFromPoint` +
  `closest("tr[data-qrow]")` (les `<tr>` portent `:data-qrow="index visible"`).
  Indicateurs : `.q-table__row--dragging` (source) et `--drop-before` /
  `--drop-after` (ligne d'insertion en `box-shadow: inset`). `touch-action: none`
  sur la poignée pour que le geste ne devienne pas un scroll tactile.
- **Clavier** : `@keydown.alt.up` / `.alt.down` sur la poignée → `nudgeRow(±1)`
  (le handle est un `<button>` avec `title` + `aria-label`).
- **Colonne épinglée** : la gouttière est posée AVANT la colonne de sélection, donc
  `pinnedLeftOffset = gutterW + (selection ? 36 : 0)`, la colonne de sélection
  reçoit `selectionPinnedStyle` (`left: gutterW`) et `colspan` inclut la gouttière.
- **API exposée** : `reorderRows(from, to)` (indices source) via `defineExpose` —
  pour des boutons « monter / descendre ».
- **Fix attenant** : le `<thead>` n'avait pas de `<th>` pour `selection="single"` →
  en-tête décalé d'une colonne ; ajouté (même classes + `selectionPinnedStyle`).
- Docs : `table.md` → section `### Reorderable rows` + démo `demo="reorder"`
  (`DnaxDemoTable.vue`, tableau `rows` PROPRE à la démo pour ne pas perturber les
  autres variantes) ; `reorderableRows` + `update:rows` / `row-reorder` visibles
  dans les tables d'API.
- Vérif : `cd docd && bun run generate` → 0 erreur ; DOM relu (en-tête : `th`
  gouttière puis colonnes ; lignes : `tr[data-qrow]` + `td` poignée + cellules) ;
  handlers compilés relus (`withKeys(withModifiers(fn, ["alt","prevent","stop"]),
["up"|"down"])`) ; `diagnostics` sur `QTable.vue` → 0 erreur / 0 warning ;
  `bun test packages/ui/lib` → 41/41.

## QSpreadsheet : clé de ligne `_key` injectée automatiquement — 2026-09-10

`filename: packages/ui/components/QSpreadsheet.vue`

Chaque ligne reçoit une propriété **`_key`** (uuid) si elle n'en a pas : identité
stable à travers tri, filtre, réorganisation, édition (toutes ces opérations
passent par des copies `{ ...row }`), snapshots undo/redo et aller-retour
`toJSON()` → `loadDocument()` (les clés exportées sont réutilisées telles quelles).

- **`ROW_KEY = "_key"`** + `newRowKey()` (`globalThis.crypto.randomUUID()` si
  disponible — https/localhost — sinon repli `row-<base36>-<random>` pour le SSR ou
  un http non sécurisé) + `ensureRowKeys(rows)` (mutatif : injecte `_key` uniquement
  si elle est absente — `undefined` / `null` / `""` — et **conserve toute valeur déjà
  présente**, même un nombre ou un identifiant métier ; aucun dédoublonnage).
- **Points d'entrée couverts** : watcher de `props.rows` (avant la copie interne →
  parent ET état partagent les mêmes clés, sans emit supplémentaire),
  `loadSheetIntoEngine` (donc `sheets` + `loadDocument`), `importCsv`, et
  `blankRow()` (donc `addRow` / `insertRowAt` / nouvelle feuille via la toolbar).
  Les autres `state.value = …` sont dérivés de lignes déjà clées (spread/copie).
- **Hors export** : CSV (`getCsv`) et presse-papiers (`copySelection`/`pasteValues`)
  n'itèrent que sur les colonnes déclarées → `_key` n'y apparaît jamais ; en
  revanche `buildDocument` sérialise les lignes telles quelles, donc `_key` est dans
  le JSON exporté (voulu : identité stable après rechargement).
- **SSR/hydratation** : l'injection tourne aussi côté serveur → clefs différentes
  entre SSR et client. Sans impact sur le rendu du tableur, mais si le consommateur
  **affiche** une `_key`, il doit l'entourer d'un `<ClientOnly>` (fait dans la démo
  `inline` de `DnaxDemoSpreadsheet.vue`) sous peine d'écart d'hydratation.
- Docs : `spreadsheet.md` → sous-section `#### Row key — _key` dans « Rows — how
  values are stored » + ligne « Injected row key » dans la démo `inline` (sous
  `ClientOnly`).
- Vérif : `cd docd && bun run generate` → 0 erreur ; logique compilée relue
  (`lr="_key"`, `ur()` → `randomUUID` sinon repli, `dr(e)` → injecte si absent,
  `watch(props.rows)` → `dr(e)` puis copie) ; aucun `_key` injecté dans le HTML
  prérendu (seuls le `buildId` de Nuxt et l'exemple de la doc contiennent un uuid) ;
  `diagnostics` sur `QSpreadsheet.vue` → 0 erreur / 0 warning ; `bun test
packages/ui/lib` → 41/41.

## QSpreadsheet : badge « + » sur les icônes d'ajout de ligne / colonne — 2026-09-10

`filename: packages/ui/components/QSpreadsheet.vue`, `packages/ui/styles/main.css`

**Retour** : `lucide:rows-3` seul (bouton « Add row » de la toolbar) n'est pas
parlant — il se lit comme « des lignes existantes », pas comme « ajouter une
ligne ».

**Choix** : garder les glyphes `rows-3` / `columns-3` (ils donnent l'**axe**) et
ajouter un **badge `plus`** en bas à droite (il donne l'**action**) — plutôt que de
changer d'icône, car les candidats Lucide sont trompeurs :

- `table-rows-split` / `table-columns-split` = icônes Lucide de **scission** d'une
  ligne/colonne (action d'éditeur) → sémantique fausse ;
- `between-horizontal-end` / `between-vertical-end` = famille « espacement » (deux
  blocs + un écart + flèche d'espacement) → se lit comme un réglage de marge ;
- `list-plus` = « ajouter un item de liste » (pas de pendant vertical) ;
- `grid-2x2-plus` = ajout générique (ne distingue pas ligne / colonne) ;
- `arrow-down-to-line` / `arrow-right-to-line` = « insérer une ligne en dessous /
  à droite » (fidèle au comportement `addRow()` / `addColumn()` qui ajoutent en
  fin) mais ne dit pas _quoi_ on ajoute.

**Implémentation** : un second `<Icon :icon="icons.plus"
class="q-spreadsheet__tool-badge">` dans les deux boutons ;
`.q-spreadsheet__tool { position: relative }` et
`.q-spreadsheet__tool .q-spreadsheet__tool-badge { position: absolute; right/bottom:
1px; font-size: 11px; padding: 1px; border-radius: 50%; background:
var(--q-spreadsheet-bg, #fff); color: var(--primary); box-shadow: 0 0 0 1px
var(--q-spreadsheet-border) }`. ⚠️ La règle doit venir **après**
`.q-spreadsheet__tool .iconify { font-size: 17px }` (même spécificité `0,2,0` →
l'ordre dans le fichier tranche). `background: var(--q-spreadsheet-bg)` couvre le
clair (`#fff`) et le sombre (`var(--card)`, redéfini par `.q-spreadsheet--dark` et
`.dark .q-spreadsheet`).

Vérif : `bun run generate` → 0 erreur ; 2 `<svg>` par bouton d'ajout (glyphe +
badge) et 26 badges sur la page démo ; CSS du bundle relu. Les boutons de
SUPPRESSION (`minus` / `x`) n'ont pas été touchés (hors demande).

## Fermeture au clic extérieur : listeners en phase de CAPTURE — 2026-09-10

`filename: packages/ui/components/{QBtnActions,QSelect,QAutocomplete,QDatePicker,QCountryPicker,QNavMenu,QFab,QSwipeCell,QSpreadsheet,QTiptap (supprimé le 2026-09-28)}.vue`

Demande : « si on clique outside le popup ou le bouton ça doit fermer » pour
`q-btn-actions` / `q-btn-dropdown`, `q-select`, `q-autocomplete`, `q-date-picker`
(inline). Ces composants avaient **déjà** le listener `document.addEventListener(
"mousedown", …)` : le problème était ailleurs (cf. warnings « Popup qui ne se ferme
pas au clic extérieur » → `@mousedown.stop` sur `.q-dialog__content`).

Décision : **tous les listeners « extérieur → fermer » passent en phase de capture**
(3ᵉ argument `true`, add ET remove) : la capture descend de `window` vers la cible
avant les `stopPropagation` de la bulle, donc la fermeture fonctionne aussi dans un
`<q-dialog>`, un `QDataGrid`, un éditeur, etc. Les listeners clavier restent en bulle.

Ops concernés (de nature identique, traités en un lot) : `QBtnActions` (→
`QBtnDropdown`), `QSelect`, `QAutocomplete`, `QDatePicker`, `QCountryPicker`,
`QNavMenu`, `QFab`, `QSwipeCell`, `QSpreadsheet` (menu contextuel / filtre /
suggestions) et `QTiptap` (supprimé le 2026-09-28 ; palette de couleurs).

Vérif : `bun run generate` → 0 erreur ; `diagnostics` projet → 0 erreur /
0 warning ; `bun test packages/ui/lib` → 41/41. Le comportement (fermeture) se
vérifie à la souris, pas au prerender.

## `QSpreadsheetCellOption.label` accepte les nombres — 2026-09-10

`filename: packages/ui/components/QSpreadsheet.vue`

Le type déclarait `label: string` alors que le runtime doit accepter un nombre :
`options: [{ value: 1, label: 1 }]` (note, niveau, priorité…) est un usage courant,
et c'est exactement ce qui a produit les deux crashes `.trim()` / `toLowerCase()`
(cf. warnings). Le linter l'a confirmé : la démo `rating` (labels numériques),
ajoutée comme garde-fou, remontait « Type 'number' is not assignable to type
'string' ».

**Décision** : élargir à `label: string | number` (API publique) et normaliser côté
composant — **toutes** les lectures de `opt.label` passent par `String(...)`
(`cellTitle`, `cellContent` via `cellText`, `badgeOf`, `copySelection`, `findTextOf`,
`filterValueItems`, `sortByColumn`, `selectOptions`, `coerceValue`, `pickOption`,
`startEdit`). L'alternative (interdire les labels numériques et forcer
`String(o.value)`) a été écartée : elle aurait cassé des usages légitimes et
contraint le consommateur à normaliser lui-même.

Vérif : `diagnostics` → 0 erreur / 0 warning ; colonne `Rating` rendue dans la démo ;
`bun run generate` → 0 erreur.

## Démo Nav Menu : sous-menu « Charts » (Line / Bar) — 2026-09-10

`filename: docd/app/components/demos/DnaxDemoNavMenu.vue`, `docd/content/docs/4.components/nav-menu.md`

Demande : « un menu Charts avec un sous-menu Line, Bar ». Le seul pattern du repo qui
fait **menu + sous-menu** est `q-nav-menu` : `<q-nav-menu-trigger>` = le groupe (avec
`name` unique, `label`, `icon`), `<q-nav-menu-content>` = le panneau déroulant,
`<q-nav-menu-item>` = une entrée (`label`, `icon`, `active`). Ajouté à la démo
`dropdowns` (trigger `name="charts"`, `icon="lucide:chart-line"`, items `Line` et
`Bar`, entre `Products` et `Resources`) + au `#code` de la page avec un commentaire
expliquant le mapping trigger/content.

Alternative écartée : un groupe « Charts » dans la **sidebar** (`q-sidebar-menu`) —
`QSidebarMenuItem` est un simple `<li>` et les démos sidebar sont plates : il n'y a
pas de sous-menu natif (il faudrait une primitive repliable type `q-collapse`).

Vérif : `bun run generate` → 0 erreur ; DOM relu (trigger `Charts` avec son icône +
`content` contenant `Line` puis `Bar`) ; `#code` présent dans `_payload.json` ;
`bun test packages/ui/lib` → 41/41.

**Correction (même jour)** : la demande portait sur la **doc**, pas la démo — « je ne
vois le menu Charts, ça doit venir components ». Section `Charts` créée **dans
Components** :

- `docd/content/docs/4.components/charts/.navigation.yml` (`title: Charts`,
  `icon: lucide:chart-line`) → le groupe apparaît dans la barre latérale **entre
  Carousel et Checkbox** (tri alphabétique du dossier, comme les pages) ;
- `index.md` (page du groupe, route `/docs/components/charts`) + `1.line.md` +
  `2.bar.md` (préfixes numériques → ordre Line puis Bar ; routes
  `/docs/components/charts/{line,bar}`). Pages **minimales** (« Documentation coming
  soon ») : aucun composant de chart créé (consigne explicite : « crée juste le menu
  et laisse comme ça »).
- L'ajout à la démo nav-menu est conservé (inoffensif) — à retirer si besoin.

> **Suivi (2026-09-14)** : cette section imbriquée a été **promue en section de
> premier niveau** (`5.charts/`, routes `/docs/charts/*`) — voir l'entrée
> « Doc : « Charts » promu en section de premier niveau » plus bas.

## QChart : graphique ECharts piloté par des marks « Observable Plot » — 2026-09-14

`filename: packages/ui/components/QChart.vue`, `packages/ui/lib/plot.ts`

Demande : « utilise echart pour faire q-chart avec props marks=[] qui suit les mêmes
API qu'Observable Plot ».

- **`lib/plot.ts`** : fabriques `barY/barX/lineY/lineX/areaY/areaX/dot/ruleY/ruleX/text`
  - namespace `Plot` (`Plot.barY(data, { x, y })`, comme Plot) et `plotToECharts()` qui
    traduit les marks en option ECharts. Canaux : `x/y/x1/x2/y1/y2/fill/stroke/
strokeWidth/opacity/r/title/text/name/z/stack`. Les 3 formes de Plot sont gérées
    (nom de champ, valeurs explicites, fonction d'accès) **plus** l'identité pour les
    données primitives (`Plot.ruleY([0])`). Une chaîne de `fill`/`stroke` est une
    couleur si elle en a l'air, sinon un nom de champ.
- **`QChart.vue`** : props `marks`, `x`, `y`, `height`, `title`, `colors`, `legend`,
  `tooltip` + `options` (fusion ECharts brute en dernier). ECharts est chargé
  **dynamiquement** dans `onMounted` (`echarts/core` + charts/components/renderers,
  `use()` une seule fois) → **rien d'ECharts en SSR** ; le conteneur (hauteur +
  `aria-label`) sort dès le prerender, le canvas arrive à l'hydratation. Tokens CSS
  relus via `getComputedStyle` à chaque rendu + `MutationObserver` sur
  `<html class|data-theme>` → le mode sombre suit ; `ResizeObserver` pour le
  responsive ; instance exposée (`defineExpose({ chart, refresh })`).
- **Choix** : `z` = une série + une entrée de légende par valeur (plutôt qu'un `name`
  par série) ; orientation imposée par la première marque (`barX`/`lineX`/`areaX`
  inversent les axes) ; `stack` → `stack: "total"` ; paires `[catégorie, valeur]`
  (inversées si horizontal) → compatibles axe catégorie **et** axe valeur.
- **ECharts plutôt que Highcharts** : `highcharts-vue` traîne en orphelin dans
  `packages/ui/node_modules` (absent de `package.json` et de `bun.lock`) et Highcharts
  est sous licence CC BY-NC (payant en usage commercial) ; `echarts@^6.1.0` est déclaré
  et sous Apache-2.0.
- Docs : `charts/line` + `charts/bar` remplis (démo `DnaxDemoChart`, `#code`, `## API`).
- Vérif : traducteur testé hors navigateur (`bun .tmp-plot-check.ts`) — line+dot+ruleY :
  séries `line/scatter` + `markLine [{yAxis: 0}]`, axe `category` `["Jan","Feb"]`,
  données `[["Jan",42]]` ; `z` + `stack` : 2 séries empilées `boundaryGap: true`,
  `yMin: 0` ; `barX` : axes inversés (`xAxis: value`, `yAxis: category`) et données
  `[[20,"Jan"]]`. Build docd 0 erreur, `q-chart` + `aria-label` dans le prerender,
  ECharts bundlé en chunks, `diagnostics` 0 erreur, `bun test packages/ui/lib` 41/41.

> **Suivi (même jour)** : l'API `Plot.*` décrite ci-dessus a été **remplacée** par des
> marks littéraux `{ type: 'line', … }` — voir l'entrée « QChart : marks = objets
> littéraux » plus bas.

## Doc : « Charts » promu en section de premier niveau (2026-09-14)

tag: `decisions` — `namespace: dnax.ui` — `worktree: /Volumes/D/PKG/dnax.ui` —
`filename: docd/content/docs/5.charts/`

Demande : « C'est mieux de sortir charts du menu Components et créer un menu spécial
Charts avec ses sous-items Line, Bar, comme pour Styles. »

- Le menu de docd est **piloté par la structure des dossiers** (pas de config de
  navigation) : un dossier de premier niveau sous `docd/content/docs/` = une section
  dans la barre latérale ; le préfixe numérique `N.` donne l'**ordre** et est **retiré
  de la route** ; `.navigation.yml` (`title`, `icon`) fournit titre + icône.
- Move : `4.components/charts/` → **`5.charts/`** (garde son `.navigation.yml`
  `title: Charts` / `icon: lucide:chart-line` et son `index.md`), puis renumérotation
  `5.plugins` → `6.plugins` et `6.directives` → `7.directives` (sans impact sur les
  routes, le préfixe étant ignoré).
- Routes : `/docs/charts`, `/docs/charts/line`, `/docs/charts/bar` (les anciennes
  `/docs/components/charts/*` disparaissent). Liens internes mis à jour dans
  `5.charts/index.md` et `5.charts/2.bar.md`.
- Ordre final de la barre latérale : Getting Started, Layouts, Styles, **Components,
  Charts**, Plugins, Directives.
- Vérif : `bun run generate` → EXIT 0, **459 routes prerendues**, 0 `[404]`/`[500]` ;
  routes `charts{,/line,/bar}` présentes et anciennes absentes du log ; HTML de
  `/docs/charts` relu → entrée `Charts` (icône `chart-line`) entre `Components` et
  `Plugins`.

## QChart : marks = objets littéraux `{ type, … }` (fin de l'API Plot) — 2026-09-14

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/lib/chart.ts`

Demande : « je veux pas de plot dans marks. On doit avoir par exemple `[{type:'line'}]`
et les autres éléments. »

- **Une marque est un objet littéral plat** : `{ type, data, x, y, fill, … }`. Fini
  les fabriques `Plot.lineY(data, { … })` et le namespace `Plot` (supprimés, avec
  `barY/barX/lineY/lineX/areaY/areaX/dot/ruleY/ruleX/text`). Rien à importer pour
  écrire un graphique.
- **`lib/plot.ts` → `lib/chart.ts`** (renommage) : `plotToECharts` →`chartToECharts`,
  types `PlotMark/PlotAxis/PlotChannel/PlotChartConfig` → `QChartMark/QChartAxis/
QChartChannel/QChartConfig` (+ `QChartMarkType`, `QChartOrientation`, `COLOR_TOKENS`).
- **Types de marques** : `line`, `area`, `bar`, `dot`, `text`, `rule` (l'orientation
  n'est plus dans le nom du type). `orientation: 'horizontal'` inverse les axes ; les
  canaux gardent le **même sens** (`x` = abscisse/catégorie, `y` = mesure) — c'était
  l'inverse avant (`barX` attendait la mesure en `x`), d'où un axe catégorie perdu en
  horizontal. `{ type: 'rule', y: [0] }` = repère horizontal, `{ y: … }` absent →
  repère vertical sur `x`.
- **Couleurs** : `COLOR_TOKENS` = `primary secondary accent info positive warning
negative dark`. `QChart` relit ces 8 tokens sur l'élément (`getComputedStyle`) et
  les passe à `chartToECharts({ tokens })` → `stroke: 'primary'` donne la couleur du
  **thème hôte** (avant, la chaîne `'primary'` partait telle quelle dans ECharts,
  qui ne sait pas la résoudre : les couleurs des séries étaient perdues). Repli
  `TOKEN_FALLBACKS` si l'hôte ne définit pas le token.
- **Canal couleur** : ordre de résolution désormais **token → champ de données →
  couleur littérale** (avant : « ressemble à une couleur » → traité comme un nom de
  champ, donc `stroke: 'primary'` renvoyait `undefined` sur des lignes objets).
  Un champ de données donne une couleur **par point**.
- **Vérif** : `chartToECharts` exercé hors navigateur (line+dot+rule, `z`+`stack`,
  horizontal, repli de tokens, couleurs par point, primitives, `text`, `area`) →
  options conformes ; `bun test packages/ui/lib` 41/41 ; build docd EXIT 0.

## QChart : style de l'info-bulle « carte de verre » — 2026-09-14

tag: `decisions` — `filename: packages/ui/lib/chart.ts`

Demande : appliquer un style d'info-bulle translucide (`backgroundColor: rgba(255,
255,255,.7)`, `textStyle #333`, bordure `rgba(0,0,0,.1)`, `border-radius: 3px`,
`backdrop-filter: blur(10px)`, ombre `0 4px 20px rgba(0,0,0,.1)`, `padding: 8px 12px`).

- Le _style_ est repris tel quel via `tooltipStyle(theme)` : `borderWidth: 1`, les
  `extraCssText` (blur + `-webkit-` + radius + shadow + padding), et les couleurs
  fournies en **repli** (`#333`, `rgba(0,0,0,.1)`).
- **Couleurs rendues dépendantes du thème** : fond
  `color-mix(in srgb, var(--card, #ffffff) 70%, transparent)` — `var()` est résolu au
  calcul sur le nœud DOM de la bulle (ECharts écrit la chaîne telle quelle dans
  `style.backgroundColor`), donc le mode sombre suit sans parsing de `oklch()` en JS ;
  bordure = `theme.grid` (`--border`), texte = `theme.text` (`--foreground`).
- **`trigger: 'axis'` conservé** (le snippet proposait `'item'`) : avec plusieurs
  séries / `z`, l'axe montre toutes les séries d'une catégorie. Passer à `'item'` =
  une ligne (`trigger`), ou surcharge complète via la prop `options`.
- Vérif : options générées relues hors navigateur (avec/sans thème, `tooltip: false`)
  ; `bun test packages/ui/lib` 41/41 ; build docd EXIT 0, 0 `[404]`/`[500]`.

## Skill `echarts` — référence ECharts pour les agents — 2026-09-14

tag: `decisions` — `filename: .agents/skills/echarts/SKILL.md`

Demande : « écris-moi le skill de echarts » (https://echarts.apache.org/en/index.html).

- Fichier de 370 lignes (frontmatter `name` + `description` riches, puis 8 sections) :
  1. le **contrat dnax.ui** (fichiers, API de `<q-chart>`, marks littéraux, 6 règles d'or) ;
  2. l'**import tree-shaké** (`echarts/core` + `use([...])` **avant** `init()`) avec ce qui
     est déjà enregistré et un tableau « besoin → import à ajouter » ;
  3. la table **marque → série ECharts** produite par `chartToECharts` ;
  4. le cycle de vie (`init`/`setOption`/`resize`/`dispose`/`setTheme`) ;
  5. sept **recettes** (nouvelle marque, famille hors axes, option ponctuelle, événement,
     export image, aria, SVG) ;
  6. dix **pièges** ; 7. la **méthode de vérification** ; 8. les **ressources**.
- Choix : documenter l'**API réelle du projet** (marks littéraux, tokens, `notMerge`,
  MutationObserver de thème) plutôt qu'un tutoriel ECharts générique, et renvoyer vers
  l'**index Markdown officiel `https://echarts.apache.org/en/llms.txt`**
  (`llms-documents/option-parts/option.series-bar.md`, `api-parts/api.echartsInstance.md`…)
  — bien plus court et fiable que le site HTML pour un agent.
- Les faits d'API cités viennent de la doc officielle relue (handbook import/SSR/aria/
  canvas-vs-svg/dataset/event/chart-size, guide de migration v5→v6, `api.echarts.md`,
  `api.echartsInstance.md`) : `init(dom, theme?, opts?)`, `use()` avant `init()`,
  `setOption(option, { notMerge, replaceMerge, lazyUpdate, silent })`, `setTheme()` (v6),
  `getDataURL({ type: 'png'|'jpg'|'svg', pixelRatio, backgroundColor })`, `on(evt, query, h)`,
  `dispatchAction`, `getZr()`, `AriaComponent` + `aria.show`, `renderToSVGString()`
  (SSR, `ssr: true` + `renderer: 'svg'` + taille obligatoire).
- Point de vigilance v6 consigné : **thème par défaut changé** et **légende par défaut
  en bas** → notre traducteur fixe `legend.top/left`, à ne pas retirer.
- `.agents/` est **gitignoré** (`.gitignore`) : le skill reste local, non versionné.
- Reste : `name: echarts-skill` alors que les autres skills ont `name` = nom du dossier
  (`danxui`, `quasar`, `shadcnvue`) — harmonisable en `echarts`.
- Vérif : frontmatter parsé avec `yaml` (cf. avertissement `: ` → YAML invalide) ;
  `grep -c '^```'` pair (blocs de code tous fermés) ; 8 sections.

## QChart : palette de séries en tokens `--chart-N` — 2026-09-14

tag: `decisions` — `filename: packages/ui/lib/chart.ts`, `packages/ui/styles/main.css`

Bug remonté : « en dark et light, quand je survole un chart line, on ne voit plus la
line » (cf. l'avertissement « un token de SURFACE n'est pas une couleur de série »).

- **La palette** (`DEFAULT_COLORS`, utilisée par les marks sans couleur et par le canal
  `z`) n'est plus `primary/secondary/accent/info/positive/warning` mais
  **`chart-1 … chart-6`** : convention `--chart-N` de shadcn, définie par les thèmes de
  `docd` **et** désormais par dnax (`styles/main.css`, `@layer dnax-tokens`, valeurs de
  la palette Material). Un hôte qui définit `--chart-N` pilote donc les séries ; sinon
  les valeurs Material servent de repli (`TOKEN_FALLBACKS`).
- **`COLOR_TOKENS`** (tokens relus par `QChart`) = `primary`, `info`, `positive`,
  `warning`, `negative`, `dark`, `chart-1…6` — **`secondary` et `accent` en sont exclus** :
  chez un hôte shadcn-vue ce sont des **surfaces** (`--secondary` ≈ blanc en clair, ≈ noir
  en sombre), pas des couleurs ; une série de leur couleur serait invisible. Ils gardent
  la valeur Material de dnax (teal / violet) et restent utilisables dans `stroke`/`fill`.
- Conséquence assumée : dans `docd`, `<q-btn color="secondary">` prend la surface du thème
  Docd (gris clair) alors qu'un `stroke: 'secondary'` de graphique prend le teal Material.
  C'est le prix du conflit de noms ; la recommandation documentée est d'utiliser
  **`primary`** (couleur de marque chez les deux) ou **`chart-N`** (couleurs de séries).
- Doc mise à jour : `5.charts/1.line.md` gagne une section **Series colors** (table des
  tokens), `2.bar.md` renvoie à la palette, la démo `DnaxDemoChart` passe la 2ᵉ courbe à
  `stroke: 'chart-2'`.
- Vérif : `chartToECharts` exercé hors navigateur avec un **hôte hostile** (`secondary` =
  `oklch(96.7%…)`) → `primary` suit l'hôte, `secondary` = `#26a69a`, `chart-2` suit
  l'hôte, `chart-3` non défini retombe sur `#9c27b0`, palette auto = `--chart-1/-2` de
  l'hôte ; `bun test packages/ui/lib` 41/41 ; build docd EXIT 0.

## Doc : la page d'accueil `5.charts/index.md` documente `<q-chart>` — 2026-09-14

tag: `decisions` — `filename: docd/content/docs/5.charts/index.md`

Demande : « c'est ici que tu dois parler de q-chart et de l'API QChart (marks) avec les
props `options` » — la page d'index ne contenait qu'un « Charts. » + deux liens.

- La page est devenue la **vue d'ensemble du composant** : lead (marks = données, pas
  d'arbre de composants, rendu canvas client-only) + démo live, table des **marks**,
  canaux (3 formes), table des **props** (`marks`, `x`/`y`, `height`, `title`, `colors`,
  `legend`, `tooltip`, `options`), événement `ready` / `chart` / `refresh()`,
  section « The `options` escape hatch » (`options` fusionné **en dernier**, exemple
  `dataZoom`, callout `warning` sur les modules ECharts à enregistrer), `:dnax-api`,
  puis deux `::prose-card` vers Line et Bar.
- Callout important : les props `x`/`y`/`title` configurent le **graphique** (axes, titre)
  alors que, dans une marque, `x`/`y`/`title` sont des **canaux** (mapping, info-bulle).
- Nouvelle démo `demo="overview"` dans `DnaxDemoChart.vue` (bar + line + rule, trois
  marques qui se superposent) — les pages Line et Bar gardent leurs démos dédiées.
- Vérif : `bun run generate` → EXIT 0, 0 `[404]`/`[500]` ; HTML relu : h2 Marks/Props/
  « The options escape hatch »/API/Chart types, table des props (`QChartMark[]`,
  `--chart-1…6`, « Raw ECharts options »), 2 callouts, 4 cartes, canvas `q-chart` présent.

## QChart : normalisation des couleurs relues sur le DOM — 2026-09-14

tag: `decisions` — `filename: packages/ui/components/QChart.vue`, `packages/ui/lib/chart.ts`

Suite du bug « au survol l'élément disparaît » (cf. l'avertissement « zrender ne sait pas
relire `oklch()` ») :

- `QChart.vue` expose `normalizeColor(value)` — un canvas 2D mémoïsé convertit **toute**
  couleur CSS (`oklch()`, `color-mix()`, `rgb(0 0 0 / .5)`) en `#rrggbb`/`rgba()`, la forme
  que le parseur de zrender accepte (deux sentinelles `#010203`/`#040506` pour détecter une
  valeur invalide). `themeOf()` l'applique aux 3 couleurs de thème et à chaque token.
- `chartToECharts` reçoit `normalizeColor` (optionnel) et l'applique à **toutes** les
  couleurs qu'il écrit : tokens résolus, palette (`DEFAULT_COLORS`/`colors`), couleurs
  littérales des marks (`stroke: 'oklch(…)'`), axes/labels/grille, `markLine`. Hors
  navigateur l'option est absente → couleurs telles quelles (SSR et tests inchangés).
- Effet : au survol ECharts reçoit de nouveau une couleur qu'il peut éclaircir
  (`liftColor` → +10 %) → la barre/la ligne reste visible et se met en valeur.
- Vérif : stub de normalisation en bun → série, palette, littéraux et thème normalisés ;
  sans normalizer → valeurs brutes (non-régression) ; `liftColor('oklch(…)')` = `undefined`
  vs `liftColor('#123456')` = `rgba(19,57,94,1)` ; `bun test packages/ui/lib` 41/41 ;
  build docd EXIT 0, 0 `[404]`/`[500]`.

## Doc : page « Rule » (repères) + sémantique horizontale par défaut — 2026-09-14

tag: `decisions` — `filename: docd/content/docs/5.charts/3.rule.md`,
`packages/ui/lib/chart.ts`

Demande : « après Line, Bar écris la page charts “rule” ».

- **Nouvelle page `3.rule.md`** (route `/docs/charts/rule` ; ordre de la barre latérale
  Line → Bar → Rule, donné par les préfixes numériques) : lead (« un `rule` n'est pas une
  série » — dessiné au-dessus des autres marques, absent de la légende), démo live
  `demo="rule"`, formes horizontales (`y: 50`, `y: [0, 25, 50]`, `data: [...]`),
  verticales (`x: [0]`, **nom de catégorie** `x: ['Apr']`), table de style (`stroke`,
  `strokeWidth`, clés ignorées), `:dnax-api{name="QChart"}`.
- Carte « Rule » ajoutée aux cartes _Chart types_ de `index.md` (`lucide:minus`).
- **Sémantique clarifiée** dans `chartToECharts` :
  `vertical = m.x !== undefined && m.y === undefined`. Un repère est donc **horizontal
  par défaut** (valeurs sur l'axe Y, comme `Plot.ruleY`) au lieu de `m.y === undefined`,
  qui rendait `{ type: 'rule', data: [25] }` vertical par accident. Aucun usage existant
  n'en dépendait (toutes les occurrences du repo passent `y` explicitement).
- `strokeWidth` est maintenant appliqué aux repères (canal partagé qui était ignoré).
- Vérif hors navigateur : options produites pour les 7 formes (`y` scalaire/tableau,
  `data`, `x` index/catégorie, `stroke` + `strokeWidth`) ; **rendu SVG** (`ssr: true`) :
  repère horizontal y=50 tracé à `M29.4 74.5` (axe 0→80 → correct) et repère vertical
  `x: ['Apr']` à `x=178`, soit le centre de la bande d'avril (centres de bandes =
  29.4 + (i+0.5)×42.4) → ECharts **résout bien le nom de catégorie** ; `bun test
`packages/ui/lib`41/41 ; build docd EXIT 0,`/docs/charts/rule` prerendue, ordre
  Line → Bar → Rule et 3 cartes confirmés dans le HTML.

## Doc : page « Dot » (nuages de points & bulles) — 2026-09-14

tag: `decisions` — `filename: docd/content/docs/5.charts/4.dot.md`,
`packages/ui/lib/chart.ts`

Demande : « Fait type “dot” » avec la référence https://observablehq.com/plot/marks/dot
(la page Plot est derrière un checkpoint Vercel — API reprise de la connaissance de Plot :
`x`, `y`, `r`, `fill`, `stroke`, `strokeWidth`, `symbol`, `title`, `z`).

- **Nouvelle page `4.dot.md`** (route `/docs/charts/dot` ; ordre Line → Bar → Rule → Dot) :
  lead (un point par ligne, deux axes de valeurs, info-bulle par point), démo
  `demo="dot"` (graphique à bulles), sections _Radius — bubbles_, _Colour and outline_,
  _Shape_, _Tooltips_, `:dnax-api{name="QChart"}`.
- **Mark `dot` enrichi** dans `chartToECharts`, aligné sur Plot :
  - `r` devient **par point** (`item.symbolSize`, `r * 2 + 2`) quand c'est un canal →
    graphique à bulles (avant : le rayon était lu sur le premier point du groupe) ;
  - `symbol` (nouveau) : forme des points (`circle` par défaut, `rect`, `triangle`,
    `diamond`, `pin`, `none`…) ;
  - `fill` = remplissage, `stroke` + `strokeWidth` = **contour** — appliqué seulement si
    `fill` est aussi donné ; un `stroke` seul continue de colorer le point
    (rétrocompatible : aucun usage existant de `stroke` sur un `dot`) ;
  - `title` par point alimente l'info-bulle.
- **Info-bulle** : `trigger` = `'axis'` dès qu'une série `line`/`bar` existe, sinon
  `'item'`. Sans cette règle, un graphique de points restait en `axis` et le `title` par
  point n'était jamais affiché.
- Carte « Dot » (`lucide:chart-scatter`) ajoutée à l'index ; tables des marks mises à jour
  (`index.md`, `1.line.md`).
- Vérif hors navigateur : options produites (bulles `symbolSize` 18 puis 30, `symbol:
diamond`, `borderColor`/`borderWidth`, `stroke` seul → couleur du point, `trigger`
  selon les séries : points → `item`, avec ligne/barre → `axis`) ; `bun test
packages/ui/lib` 41/41 ; build docd EXIT 0, `/docs/charts/dot` prerendue, ordre
  Line → Bar → Rule → Dot et 4 cartes confirmés dans le HTML.

## Doc : page « Image » (une image par point) — 2026-09-14

tag: `decisions` — `filename: docd/content/docs/5.charts/5.image.md`,
`packages/ui/lib/chart.ts`

Demande : « tu fais “image” » avec la référence https://observablehq.github.io/plot/marks/image
(page accessible, contrairement à observablehq.com).

- **Nouvelle marque `image`** : `{ type: 'image', data, x, y, src, width, height, r,
rotate, title }` → série `scatter` avec `symbol: 'image://<url>'`,
  `symbolKeepAspect: true`, `symbolSize: [w, h]` (défaut 16, ou `2r`), `symbolRotate`,
  `opacity` par défaut à **1** (les 0.8 par défaut de `scatter` délavaient les images).
- Règles reprises de Plot : `src` est **constante** si elle commence par `.`, `/` ou un
  protocole, sinon c'est un **canal** (un champ de données → une image par point) ;
  `width` xor `height` → l'autre suit ; taille ≤ 0 → non dessiné ; `r` = raccourci carré.
- **Écart assumé avec Plot** : `r` ne découpe **pas** l'image en cercle. ECharts ne sait
  pas clipper un symbole ; la voie pattern (`symbol: 'circle'` +
  `itemStyle.color.image`) a été essayée et échoue (zrender exige une position/taille
  explicites par point, que l'option ne connaît pas : erreur « Image width/height must
  been given explictly in svg-ssr renderer »). Documenté : utiliser une image déjà ronde.
  Idem `preserveAspectRatio`/`imageRendering` : sans équivalent.
- Sécurité du survol : `createSymbol` passe par `graphic.makeImage` qui produit un
  **`ZRImage`** (et non un `Path`) — `createEmphasisDefaultState` (`states.js`) ne
  s'applique qu'aux `Path` → pas de `liftColor` sur les images, donc pas de risque de
  disparition au survol (contrairement aux séries colorées).
- Démo `demo="image"` : **5 photos Unsplash** fournies par l'utilisateur (ids conservés).
  Les URLs sont livrées en **carré 200×200 centré sur les visages**
  (`?q=80&w=200&h=200&fit=crop&crop=faces&auto=format`) au lieu du `w=1470` d'origine :
  une page de doc ne doit pas charger plusieurs Mo pour des vignettes de 44 px.
  Vérifié en HTTP : les 5 répondent `200 image/jpeg`, ~9–11 Ko, **200×200** (donc pas de
  letterboxing, l'aspect étant préservé par `symbolKeepAspect`). Une des photos vit sur
  `plus.unsplash.com` (premium) → URL complète dans la démo, les autres via un helper
  `photo(id)`. Le carré servi est aussi le conseil donné dans la page (_Size_), puisque
  `symbolKeepAspect` fait tenir l'image dans la boîte au lieu de la rogner.
- Vérif hors navigateur : `src` en canal → `data[i].symbol` par point et **3 `<image>`**
  dans le SVG SSR (taille `2 × 2` mise à l'échelle par `matrix(18,0,0,18,…)` = 36 px pour
  `r: 18`, `symbolKeepAspect` actif) ; `src` constante → `symbol` au niveau de la série ;
  `width`/`height`/`rotate` appliqués ; `bun test packages/ui/lib` 41/41 ; build docd
  EXIT 0, `/docs/charts/image` prerendue, ordre Line → Bar → Rule → Dot → Image et
  5 cartes confirmés.

## Doc : marque `text` (Plot.text) + couleurs oklch normalisées par lecture de pixel — 2026-09-15

tag: `decisions` — `filename: packages/ui/lib/chart.ts`, `packages/ui/lib/color.ts`,
`docd/content/docs/5.charts/6.text.md`

Demande : « dans charts components ajoute text comme https://observablehq.github.io/plot/marks/text ».

- **Marque `text` complète** (elle existait mais ne dessinait qu'un `label.position: 'top'`
  sans contenu par défaut) : `text` (canal ; défaut = la ligne si primitive, sinon l'index,
  comme Plot), `textAnchor` (`start|middle|center|end` → `label.align`) et `lineAnchor`
  (`top|middle|bottom` → `label.verticalAlign`), **centré par défaut**, `dx`/`dy` (canaux),
  `fontSize` (11 par défaut, canal), `fontWeight`/`fontFamily`/`fontStyle`/`lineHeight`,
  `lineWidth` (ems → `width` + `overflow: 'break'`), `textOverflow` (`ellipsis` → « … »,
  `clip` → coupe net), `rotate` (horaire : **signe inversé**, `label.rotate` d'ECharts est
  anti-horaire), `fill` = couleur du texte, `fill` + `stroke` + `strokeWidth` (3 par défaut)
  = **halo** (`label.textBorderColor`), `title` = info-bulle par point.
- Le point d'ancrage est un symbole `size 1` transparent avec **`itemStyle.opacity: 1`** :
  sinon le label hérite des 0.8 par défaut d'une série `scatter`
  (`defaultOpacity` du symbole, `lib/chart/helper/Symbol.js`) et le texte sort délavé.
- **Données en paires** `[[x, y], …]` quand ni `x` ni `y` n'est donné (raccourci Plot,
  utile à `text` comme à `dot`/`line`).
- **Correctif du bug de survol** (voir `.memory/warnings.md`) : `lib/color.ts` peint la
  couleur sur un canvas 1×1 et relit le pixel (`getImageData`) — `ctx.fillStyle` conservant
  l'espace colorimétrique, l'ancienne normalisation laissait passer les `oklch()` du thème
  docd, donc `liftColor()` → `undefined` → marque qui disparaît au survol. Reproduit et
  vérifié en Chromium headless (barre survolée : `fill="none"` avant, `rgb(255,81,0)` après).
- Tests : `packages/ui/lib/chart.test.ts` (marque `text`, 13 cas) et `color.test.ts`
  (6 cas, dont la conservation d'oklch) → **62/62**. Champs `x1/x2/y1/y2` de `QChartMark`
  supprimés : jamais lus par le traducteur (et retirés des listes de canaux de la doc).
- Docs : page `6.text.md` (position, ancres, contenu, police, wrap/troncature, couleur et
  halo, tooltips, écarts avec Plot), démo `demo="text"` (barres étiquetées), `index.md`
  (ligne + carte), `1.line.md`. Build docd EXIT 0, 475 routes prerendues.

## Doc : l'API de chaque marque en plus de celle de `<q-chart>` — 2026-09-15

tag: `rules` — `filename: packages/ui/lib/chart.ts`, `docd/scripts/mark-parse.ts`,
`docd/app/components/DnaxMarkApi.vue`

Demande : « chaque mark doit avoir son api et ses options en plus de l'api q-chart comme rappel ».

- **`MARK_OPTIONS`** dans `lib/chart.ts` = **source de vérité** des options acceptées par
  chaque marque (`line`, `area`, `bar`, `dot`, `image`, `text`, `rule`), contrainte par
  `satisfies Record<QChartMarkType, readonly (keyof QChartMark)[]>`.
- `docd/scripts/mark-parse.ts` l'analyse au build (comme `component-parse.ts` pour les SFC)
  avec le **JSDoc de `QChartMark`** (type + description + valeurs littérales) → export `marks`
  du module virtuel `#build/dnax-ui-meta.mjs` → `markMeta()` (`useComponentDocs.ts`) →
  composant **`DnaxMarkApi.vue`**, utilisé dans les pages via `:dnax-mark-api{mark="bar"}`.
- Chaque page `/docs/charts/<marque>` se termine par **`## <Mark> options`** (Line options,
  Bar options, Rule options, Dot options, Image options, Text options) suivi de
  `:dnax-mark-api{mark="<marque>"}`. Précision apportée ensuite : l'API de `<q-chart>`
  (props/events/methods) est **retirée** des pages de marque — elle ne vit que sur
  `5.charts/index.md`, avec un lien depuis chaque page.
- Conséquences : un canal sans JSDoc s'affiche sans description, et une option absente de
  `MARK_OPTIONS` n'apparaît pas → les deux se mettent à jour **dans `chart.ts`** (aucune
  table manuelle en markdown à maintenir).

## Marques `pie` et `heatmap` + légende positionnable — 2026-09-15

tag: `decisions` — `filename: packages/ui/lib/chart.ts`, `packages/ui/components/QChart.vue`,
`docd/content/docs/5.charts/{7.pie,8.heatmap}.md`

Demandes : « crée la mark pie », « implémente heatmap », puis « dans les charts les légendes
sont proches de la chart il faut mettre un offset et aussi on doit pouvoir mettre la
position où doit se trouver les légendes ».

- **`pie`** (camembert / anneau) : `x` = libellé de la part, `y` = valeur, une part par
  ligne ; `radius` (défaut `70%`), `innerRadius` (→ anneau), `startAngle`, `labels`
  (`name` défaut / `value` / `percent` / `name-value` / `name-percent` / `false`), `fill`
  (couleur constante ou canal), `title` (info-bulle par part), `name` (légende = les parts).
  **Famille hors axes** : le traducteur n'émet `grid`/`xAxis`/`yAxis` que si une série
  cartésienne existe (`bar`/`line`/`scatter`/`heatmap`) — sinon ECharts laissait un cadre
  fantôme et décalait le titre. `charts.PieChart` ajouté à `use([...])`.
- **`heatmap`** (carte de chaleur) : `x` = colonne, `y` = ligne — **deux axes catégories**
  (nouveaux `rowCategories` + `yAxis` catégorie + `splitArea`), `fill` = la **valeur** de la
  cellule (canal numérique → rampe = palette ; couleur → rampe dégénérée cachée), `labels:
true` → valeur imprimée dans la cellule, `title`/`opacity`/`name`. ECharts **exige** un
  `visualMap` (cf. `warnings.md`) : il est toujours émis, visible seulement si la valeur est
  numérique (30 px réservés sous l'axe). Une carte de chaleur ne se mélange pas à une
  série à axe de valeurs (`line`/`bar`/`dot`) — documenté.
- **Légende** : la prop `legend` accepte `boolean | { position, offset, align }`
  (`QChartLegend`). La **place est réservée dans le `grid`** : `grid.top = 26 (titre) + 14 +
offset` quand elle est en haut, `grid.bottom += 14 + offset` en bas (+ 30 px si une
  échelle de couleurs visible), `grid.left/right += 90 + offset` sur les côtés (légende
  verticale). Avant : `top: 0` avec `grid.top: 16` → légende collée au graphique.
- Docs : pages `7.pie.md` / `8.heatmap.md` (+ démos `demo="pie"` et `demo="heatmap"`),
  lignes et cartes dans `index.md`, section « Legend » dans `index.md`.
- Vérifications : **76/76** tests (`chart.test.ts` : 7 cas `pie`, 5 `heatmap`, 2 légende) ;
  rendu SVG SSR (cellules colorées par la rampe, valeurs imprimées `12/21/26…`, anneau,
  visualMap) ; pages servies en dev (`table:1`, 0 mot français) et **captures Chromium** de
  `/docs/charts/{bar,pie,heatmap}` relues : légende détachée du graphique, donut + %,
  carte de chaleur alignée avec son échelle de couleurs.

## Marque `image` : option `round` (pastilles rondes) — 2026-09-15

tag: `decisions` — `filename: packages/ui/lib/chart.ts`,
`docd/content/docs/5.charts/5.image.md`

Demande : « pour la mark image ajoute des exemple avec image avec border radius tout en rond ».

- **`round: true`** sur la marque `image` : l'image est peinte **en motif**
  (`itemStyle.color = { image: src, repeat: 'no-repeat' }`, posé **par point** puisqu'un
  `src` peut être un canal) dans un symbole `circle` — zrender ne sait pas découper un
  symbole, c'est le seul rendu circulaire possible. `image://` (défaut) reste inchangé :
  symbole image, `symbolKeepAspect`, pas de découpe.
- **Anneau** : `stroke` + `strokeWidth` (2 px par défaut) → `borderColor`/`borderWidth` de
  l'`itemStyle`. `fill` retiré des options documentées de la marque (inerte sur une image).
- **Contrainte vérifiée** : le motif est peint à la **taille native** de l'image, ancré en
  haut à gauche du marqueur → servir l'image **carrée, au format du marqueur**
  (`r: 22` → `&w=44&h=44&fit=crop`) ; une source plus grande est rognée sur son coin
  haut-gauche (vérifié : une source 200 px dans une pastille de 44 px ne montre qu'un
  fragment zoomé). Les options `width`/`height` du motif (documentées pour
  `label.backgroundColor`) **n'ont aucun effet** sur `itemStyle.color.image` (captures
  byte-identiques).
- **Doc** : section « Round markers » dans `5.image.md` (démo live + code + tableau des
  deux contraintes), démo `demo="image-round"` dans `DnaxDemoChart.vue` (les mêmes
  portraits servis en 44 px), note « `image://` ne découpe pas » corrigée pour renvoyer vers
  `round`.
- **Vérifications** : 80/80 tests (`chart.test.ts` : 4 cas `image`, dont pastille ronde +
  anneau) ; rendu réel en Chromium (canvas, vraies photos Unsplash) : pastilles rondes avec
  anneau bleu, cadrage correct quand la source fait la taille du marqueur, rognage constaté
  sinon — captures relues à l'œil.

## Interaction : trois primitives (`group`, `@pick`, `selected`) plutôt qu'un orchestreur

Décision : ne pas créer de composant « dashboard » qui coordonnerait les charts. `<q-chart>`
expose trois primitives indépendantes, et l'application les compose.

- `group="…"` — liaison native (`echarts.connect`) : survol/curseur d'axe, info-bulle et les
  autres actions partageables. Zéro code applicatif ; chaque chart garde ses marks et options.
- `@pick` — clic sur un élément → payload normalisé `QChartPick`
  (`pickFromEvent()` dans `lib/chart.ts`, fonction pure testée) : `{ name, value, seriesName,
seriesIndex, seriesType, dataIndex, componentType }`, clés absentes omises pour rester
  comparable/sérialisable. C'est l'**intention**, pas le comportement.
- `selected` — l'**état** sélectionné (`QChartPick | null`) : le chart met en évidence
  (`highlight`) tous les éléments portant ce `name`, dans toutes ses séries. Indispensable car
  `highlight` n'est pas une action partageable (cf. warnings.md) ; et un chart piloté par
  `selected` suit un autre chart même **sans** partager son groupe (chart ↔ tableau, filtre…).

Corollaire d'API : `group`, `selected` et `@pick` vivent sur `<q-chart>` — pas de props
globales, pas de store interne, pas de dépendance de l'app envers un contexte de dashboard.

## Cross-filtering : jointure déclarée par mark (`link` + `selection`)

Décision : le filtrage entre graphiques n'est **pas** un composant orchestrateur ni un store —
c'est une **jointure déclarée par marque**, façon Mongo (`localField`/`foreignField`), appliquée
dans le traducteur.

- **`mark.link`** : `'month'` (raccourci de `{ localField: 'month' }`) ou
  `{ localField, foreignField }` quand les deux graphiques nomment leurs champs autrement.
- **`QChartConfig.selection`** : la sélection partagée (le `@pick` d'un graphique, ou un état
  applicatif). `QChart` y passe `props.selected`.
- **Résolution de la clé** (`linkValue`) : `pick.data[foreignField]` → `pick[foreignField]` →
  `pick.name` → scalaire. D'où `QChartPick.data` (la ligne brute) dans le payload.
- **Point d'application unique** : `dataOf(m)` = `linkedRows(m.data, chartLink(m.link), selection)`
  → toutes les familles de marques en héritent sans code par marque.
- **Garde-fous** : sans sélection → tout est affiché ; si aucune ligne ne porte le `localField`
  → la marque garde ses données (une clé mal orthographiée ne vide pas un graphique).
- **L'axe est l'union des marques** : une marque liée seule garde l'axe complet (une seule
  barre) ; il faut lier **toutes** les marques pour que le graphique rétrécisse à la clé.
- **`legend.action: 'select'`** : un clic sur la légende émet `@pick` au lieu de masquer la
  série (ECharts bascule la visibilité et n'émet aucun clic de graphique sur la légende). Le
  composant rétablit l'état puis émet ; un second clic sur le même nom émet `null` (efface).

## Re-clic = désélection, la même règle pour la légende et pour les éléments

Décision : cliquer **deux fois** sur le même élément (`sameSelection`) relâche la sélection —
donc les filtres croisés — exactement comme un re-clic sur une entrée de légende.

- `sameSelection(current, candidate)` compare d'abord le **`name`** (la clé partagée entre
  graphiques : re-cliquer « Fév » dans une autre marque, c'est la même sélection), sinon la
  **position** (`markIndex` + `dataIndex`).
- Les deux signaux partent ensemble : `@unpick` porte l'élément lâché, `@pick` porte l'état
  (`null`) — un seul drapeau aurait obligé chaque application à l'interpréter.
- `@unpick` n'est **jamais** émis quand c'est l'application qui remet `selected` à `null`
  (pas d'écho, pas de boucle).
- Un clic qui ne vise aucune donnée (fond du graphique, axe) n'émet **rien**.

## `pick.data` est toujours VOTRE ligne, jamais la forme interne du moteur

Mesuré au navigateur : sur un clic d'élément, le moteur transmet
`value: ['Jan', 42]` (la paire) et `data: { value: ['Jan', 42] }` — donc **pas** la ligne
d'origine `{ month: 'Jan', revenue: 42 }`, ce qui cassait silencieusement les jointures
`link.foreignField` (documentées comme lisant la ligne).

Correctif : le composant relit la ligne dans `props.marks` par son **nom** (`legendPickOf`,
avec l'index de marque du clic en indice) et recompose le pick champ par champ — `origin` reste
celui du moteur (`mark`), `value` devient la vraie valeur (42), `data` la ligne d'origine.
Règle : la fusion se fait **explicitement**, jamais par `{ ...a, ...b }` (l'ordre des spreads a
déjà écrasé `origin: 'mark'` en `'legend'`).

## Marque `table` : une marque comme les autres, rendue en HTML

Décision : la table est une **marque** (`{ type: 'table', data, columns, link }`), pas un
composant `QTable` à côté — mêmes `data`, même `link`, même `selected`, même `@pick`, même
`@unpick`. C'est ce qui la rend pilotable et pilotante dans l'interaction (`chart ↔ table`).

- `columns` : `'month'` ou `{ field, label, align, format }` ; **déduites des clés des lignes**
  si absent (ordre d'apparition).
- `tableModel(mark, selection)` (pure, testée, `lib/chart.ts`) : lignes **jointes** via
  `linkedRows` (la table filtre exactement comme un graphique lié) + colonnes résolues.
- Clé de ligne = le `link.localField`, sinon le **premier champ de la première colonne** : une
  ligne se désigne donc par le **même `name`** que les autres marques (sélection partagée,
  `highlight`, re-clic qui désélectionne).
- `chartToECharts` **ignore** les marques `table` (aucune série) et la déduction d'orientation /
  de catégories les saute : une table ne produit rien sur le canvas.
- Rendu côté composant : `<div class="q-chart q-chart--table">` + `<table>` (en-tête collant,
  `font-variant-numeric: tabular-nums`, ligne sélectionnée marquée par un liseré `--primary`) et
  `height` devient un **`max-height`** (la table défile).
- Une table **remplace le tracé** de son `<q-chart>` : ne pas mélanger avec une marque de série
  dans le même composant (documenté + garde dans `render()` : l'instance est libérée).

## Cross-filter : deux rendus possibles, `filter` (défaut) ou `dim`

Décision : la **réaction** à la sélection est configurable par une prop de **chart**, tandis que
la **jointure** reste par **mark** (`link`) — deux questions différentes.

- `<q-chart link-mode="filter" | "dim" dim-opacity="0.25">` (props) → `QChartConfig.linkMode`
  / `dimOpacity`. Défaut `filter` = comportement historique (non cassant).
- `filter` : les lignes non jointes sont **retirées**, l'axe se recale sur la sélection.
- `dim` : tout est **dessiné**, les éléments non liés passent à `dimOpacity`.
- Implémentation `dim` (aucun masque par point, donc aucun risque de désynchronisation avec les
  branches du traducteur) : en fin de `chartToECharts`, chaque série reçoit
  `selectedMode: 'single'`, `itemStyle.opacity = dimOpacity` (+ `lineStyle.opacity` pour les
  traits), et `select.itemStyle.opacity = 1`. ECharts n'a pas d'« état non sélectionné » : on
  baisse le **style par défaut** et l'état `select` relève la sélection.
- Conséquence côté composant : en mode `dim`, `applySelection()` pilote **`select`/`unselect`**
  (au lieu de `highlight`/`downplay`) — l'emphase et l'estompage sont le même mécanisme.
- Piège TDZ reproduit au passage (encore !) : `instance.dispatchAction({ type: dim ? … })` écrit
  **avant** `const dim = …` → déclarer les locales avant tout usage.

## Marque `table` : séparateurs, et suivi du mode `dim` — 2026-09-15

`filename: packages/ui/lib/chart.ts, packages/ui/components/QChart.vue`

- Nouvelle option **par marque** : `separator: 'horizontal' | 'vertical' | 'grid' | 'none'`
  (défaut `horizontal`). Elle vit dans `MARK_OPTIONS.table` → elle apparaît **seule** dans la table
  d'API générée de la page Table (rien à écrire à la main).
- Rendue par une classe sur le `<table>` (`is-horizontal`…) + le CSS scoped du composant ; le `td`
  générique ne porte plus de bordure (elle vient du mode) et l'en-tête garde son trait.
- `tableModel(mark, selection, mode)` accepte le **mode de liaison** : `filter` (défaut — lignes non
  jointes retirées) ou `dim` (toutes les lignes conservées, c'est le rendu qui estompe les autres).
  Le composant passe `props.linkMode` : la table se comporte donc exactement comme une série.
- Lignes : `is-selected` pour la ligne choisie, `is-dimmed` + `opacity: dimOpacity` en style inline
  pour les autres (aucune variable CSS à propager).

## Tooltip : `trigger: 'axis'` par défaut sur tout graphique cartésien — 2026-09-15

`filename: packages/ui/lib/chart.ts`

- `axis` dès qu'une série `bar`/`line` existe (c'était **déjà** le cas, mesuré) **et** désormais
  pour un graphique de points seuls **sans** `title`. On reste en `item` si une marque déclare un
  `title` (il ne s'afficherait jamais dans un tooltip d'axe), pour un graphique d'étiquettes
  (`text`), une heatmap (cellule par cellule) et un camembert.
- Le prédicat **n'utilise pas** `cartesian` : celui-ci inclut la heatmap (il sert au `grid`).
- `axisPointer` rendu **explicite** : `{ type: 'shadow' }` dès qu'une barre est présente (bandeau
  sous la catégorie survolée), `{ type: 'line' }` sinon (curseur vertical).

## Lisibilité : marge des nombres de l'axe des ordonnées — 2026-09-15

- `axisLabel.margin` passe de 8 (défaut moteur) à **16** sur l'axe des valeurs, et devient réglable
  par axe (`QChartAxis.margin`, ex. `:y="{ margin: 24 }"`). Aucun ajustement du `grid` :
  `containLabel: true` réserve la place tout seul.

## QEditorJs supprimé du design system — 2026-09-17

`filename: packages/ui/components/QEditorJs.vue, packages/ui/index.ts, packages/ui/package.json, packages/ui/styles/main.css, docd/content/docs/4.components/editor-js.md, scripts/gen-menu.ts`

- Le composant **éditeur par blocs Editor.js** est retiré (demande utilisateur) : `QTiptap`
  couvre déjà l'édition riche dans le même design system, deux éditeurs faisaient doublon.
- Suppressions, toutes dans la même passe : `packages/ui/components/QEditorJs.vue`, l'export
  `QEditorJs` de `packages/ui/index.ts`, le bloc CSS `/* ===== QEditorJs … ===== */` de
  `packages/ui/styles/main.css` (94 lignes, rien d'autre ne référence `q-editor-js`),
  la page `docd/content/docs/4.components/editor-js.md` (route `/docs/components/editor-js`),
  la surcharge `QEditorJs: "Editor.js"` de `TITLE_OVERRIDES` dans `scripts/gen-menu.ts`, et
  les **8 dépendances `@editorjs/*`** de `packages/ui/package.json` (`bun install` régénère
  le lockfile — vérifier ensuite `grep -c editorjs bun.lock` = 0).
- À ne pas réintroduire sans demande : les données Editor.js sont du **JSON**
  (`{ time?, blocks: [{ type, data }], version? }`), pas du HTML — incompatible avec le
  `v-model` HTML de `QTiptap`, et le seul composant qui portait ce format.
  Mise à jour (2026-09-28) : QTiptap lui-même a été supprimé — le design system ne propose plus d'éditeur riche (voir l'entrée dédiée).

## QDatePicker : mode `popover` (+ `today-btn`, `month-dropdown`) — 2026-09-17

`filename: packages/ui/components/QDatePicker.vue, packages/ui/components/internal/QDateCalendar.vue, packages/ui/lib/datePicker.ts, packages/ui/styles/main.css`

- **5ᵉ mode** `mode="popover"` : panneau ancré sous le champ, **sans voile, sans scroll
  lock, sans retour navigateur** (les trois restent réservés à sheet/modal/dialog via un
  `isOverlayMode` distinct de `isPanelMode`). Il suit le champ (scroll/resize), bascule
  au-dessus quand la place manque, se recadre dans la fenêtre et se ferme au clic
  extérieur / Échap.
- **Placement = helper pur** `lib/datePicker.ts` (`placePopover`, exporté + 10 tests) :
  le SFC ne fait que mesurer (`getBoundingClientRect` du champ, pas de la racine — le
  `.q-field__bottom` réserve ~24px même vide) et sérialiser en `position: fixed`. Mêmes
  règles que le popup `inline` de QSelect : bascule, écart rogné, hauteur bornée.
- **La flèche (caret) est portée par le voile, pas par le panneau** : `.q-date-picker__sheet`
  est en `overflow: hidden` et rognerait un pseudo-élément débordant. Position en variable
  CSS `--q-date-picker-caret` (calculée par `placePopover`), peinte avant le panneau → seule
  la moitié dépassante reste visible.
- **Mesure après rendu** : le panneau est téléporté et sa largeur peut être en `%`/`vw`, donc
  `positionPopover()` n'est appelé qu'après `await nextTick()` ; tant qu'aucun placement
  n'existe, le style du voile est `visibility: hidden` (pas de flash au coin haut-gauche) et
  le dernier placement est **conservé à la fermeture** pour que l'animation de sortie ait un
  emplacement à animer.
- `today-btn` (raccourci « Today », désactivé si aujourd'hui est hors bornes/`disabled-dates`)
  et `month-dropdown` (libellé d'en-tête cliquable → pas-à-pas d'année + grille de 12 mois,
  qui remplace la grille des jours) vivent dans **QDateCalendar** mais valent pour **tous les
  modes** — démo et page : `date-picker.md` § Popover, `DnaxDemoDatePicker` branche `popover`.

## Alias Nuxt déclarés dans le tsconfig **racine** — 2026-09-23

tag: `decisions` — `filename: tsconfig.json`

Suite au build de production cassé (`Failed to resolve import source "#app"`, cf. l'avertissement
détaillé dans `warnings.md`) : le tsconfig racine porte désormais les `paths`
`"#app"` / `"#app/*"` → `./docui/node_modules/nuxt/dist/app(/ *)`, avec repli
`./node_modules/nuxt/dist/app(/ *)` (les deux layouts de hoisting bun). Corrigé le 2026-09-29 :
après le renommage `docd` → `docui`, le chemin `./docd/…` d'origine était périmé.

- Pourquoi **là** et pas dans `docd/tsconfig.json` : `@vue/compiler-sfc` résout les types avec
  `ts.findConfigFile(fichierCompilé)` ; les composants de la couche sont dans `node_modules`, donc le
  seul tsconfig atteignable en remontant est celui de la racine. Un `paths` dans `docd/` n'aurait
  aucun effet.
- Choix assumé plutôt que « épingler `@baybreezy/docd` » : `bun.lock` **n'est pas versionné** dans ce
  repo (`.gitignore`), la version résolue varie donc d'une machine à l'autre (`latest`) — la
  correction doit être robuste à la version, pas dépendante.
- Vérif : `ts.resolveModuleName` depuis le `realpath` d'un composant du layer → `index.d.ts` ;
  `bun run build` **EXIT 0** (0 erreur), `bun run generate` EXIT 0.

## Suppression de QVideo et de `@videojs/html` — 2026-09-23

tag: `decisions` — `filename: packages/ui/components/QVideo.vue`

Retrait **définitif** du composant **QVideo** et de sa dépendance **`@videojs/html`**
(framework HTML Video.js v10, qui embarque le custom element `mux-video`) : le design
system n'expose plus de lecteur vidéo. Aucun autre usage dans le repo.

- `packages/ui/components/QVideo.vue` supprimé + export `QVideo` retiré de
  `packages/ui/index.ts`.
- `packages/ui/module.ts` : la liste `VIDEOJS_CUSTOM_ELEMENTS` (`video-player`,
  `video-skin`, `youtube-video`, `hlsjs-video`, `mux-video`) et le hook
  `nuxt.options.vue.compilerOptions.isCustomElement` sont **supprimés** — ils
  n'existaient que pour QVideo (plus aucune balise non-Vue dans les composants).
- `packages/ui/package.json` : dépendance `@videojs/html` retirée. `bun.lock` n'étant
  pas versionné, la purge de `node_modules` se fera au prochain `bun install`
  (aucun `bun install` lancé ici, pas de build spontané — règle projet).
- Docs : `docd/content/docs/4.components/video.md` + `docd/app/components/demos/DnaxDemoVideo.vue`
  supprimés. Navigation MDC et `llms.txt` sont **générés depuis le contenu** → aucune
  liste à éditer ; `docd/.output/public/llms.txt` est un artefact **gitignoré**
  (régénéré au build). Le catalogue de la skill `.agents/skills/quasar/SKILL.md`
  n'est **pas** touché : il documente Quasar (où `QVideo` existe), pas dnax.ui.
- Vérif : `grep` de contrôle → 0 occurrence restante de `q-video`/`QVideo`/`videojs`/
  `mux-video` dans les sources (hors musique `.memory` historique et skill Quasar) ;
  `diagnostics` projet → 0 erreur.

## docui — docs migrées de `docd/`, section Layouts réordonnée + page App Layout — 2026-09-24

tag: `decisions` — `filename: docui/nuxt.config.ts`, `docui/content/docs/2.layouts/`

Le site de documentation vit maintenant dans **`docui/`** (copie du starter Docd, contenu
porté depuis `docd/`) ; le dossier `docd/` a été supprimé du disque.

- `docui/nuxt.config.ts` : `extends: ["@baybreezy/docd"]` + `modules: ["@dnax/ui",
`./scripts/dnax-ui-meta"]`(cf.`warnings.md`), `components: [{ path: "~~/components",
  pathPrefix: false }]`(les démos MDC sont appelées en kebab-case sans préfixe de
dossier :`<dnax-demo-…>`, `<dnax-api>`), `css: ["~~/assets/css/main.css"]`, port 2009.
- **Section Layouts** (`content/docs/2.layouts/`) : nouvelle page **App Layout**
  (`2.app-layout.md`) placée juste après Config Provider. Elle décrit la coquille
  assemblée (config provider → barres → tiroir → page) et le choix entre les deux
  shells : `<q-layout view="hHh LpR fFf">` (grille 3×3) vs `<q-app>` + barres `fixed`.
- Les pages suivantes ont été **renumérotées** : page → `3.`, header → `4.`, footer →
  `5.`, sidebar → `6.`, qlayout → `7.` Le préfixe numérique ne pilote que l'ordre de la
  sidebar et est retiré de l'URL → les routes `/docs/layouts/*` restent identiques
  (vérifié : les 7 routes répondent 200).
- Démo : `docui/app/components/demos/DnaxDemoAppLayout.vue` — `demo="shell"` (grille
  `container` + tiroir statique, `:breakpoint="0"`) et `demo="drawer"` (tiroir
  offcanvas ouvert par un `☰` du header : sans `show-if-above`, le panneau sort de la
  grille et recouvre la page).
- Vérif : serveur de dev déjà lancé sur 2009 → ordre sidebar Layouts = Config Provider →
  App Layout → Page → Header → Footer → Sidebar → QLayout ; les deux démos rendues en
  SSR (`class="q-layout"`, `q-sidebar--offcanvas` + backdrop).

## QPage — prop `padding` (modifier = 14px, valeur CSS) — 2026-09-24

tag: `decisions` — `filename: packages/ui/components/QPage.vue`, `packages/ui/lib/pagePadding.ts`

QPage accepte désormais un padding utilisateur : `<q-page padding>` (modifier, comme dans
Quasar) applique **14px** — 16px chez Quasar, valeur alignée ici sur le pas du design
system — et toute longueur CSS est acceptée : `padding="12px"`, `padding="2rem"`,
`padding="24px"` ; un nombre nu reçoit son unité (`padding="12"` → `12px`, sinon le
`calc()` de composition serait invalide).

- Type : `padding?: boolean | string | number` (défaut `false`) ; aucune valeur énumérée
  → rien à maintenir dans la table API auto-générée.
- Normalisation pure dans `packages/ui/lib/pagePadding.ts` (`resolvePagePadding`,
  `PAGE_PADDING = "14px"`), testée par `lib/pagePadding.test.ts`.
- Le composant pose la longueur en variable CSS `--q-page-padding` (inline, donc rendue en
  SSR) ; la composition avec les offsets de barres `fixed` et la safe-area est décrite
  dans `knowledges.md` (« `.q-page` — composer 3 paddings »).
- Docs : section « Padding » + `docui/app/components/demos/DnaxDemoPage.vue`
  (`demo="padding"` = 14px, `demo="custom"` = `padding="24px"`) sur la page
  `docui/content/docs/2.layouts/3.page.md`.
- Vérif : `bun test packages/ui/lib` → 162 pass / 0 fail (dont 5 nouveaux) ;
  `curl /docs/layouts/page` → 200 avec `--q-page-padding:14px` et `--q-page-padding:24px`
  dans le HTML SSR ; `diagnostics` QPage → 0 erreur.

## QPageContainer — structure Quasar `q-layout > q-page-container > q-page` — 2026-09-24

tag: `decisions` — `filename: packages/ui/components/QPageContainer.vue`, `packages/ui/styles/main.css`

Ajout du conteneur de page Quasar, pour que le markup Quasar fonctionne tel quel :

```vue
<q-layout view="hHh LpR fFf">
  <q-header>…</q-header>
  <q-sidebar side="left" show-if-above>…</q-sidebar>
  <q-page-container>
    <router-view />        <!-- la page rendue : <q-page padding>…</q-page> -->
  </q-page-container>
  <q-footer>…</q-footer>
</q-layout>
```

- **Aucun prop** (comme Quasar) : un `div.q-page-container` + `$attrs`. Il occupe la
  cellule « page » du QLayout via la règle existante `.q-layout > *` et sert de colonne
  flex (`display:flex; flex-direction:column; flex:1 1 auto; min-height:0`), donc le
  `<q-page>` qu'il contient remplit la cellule.
- **Optionnel dans dnax.ui** : `<q-page>` directement dans le layout continue de marcher
  (toutes les démos existantes) ; le conteneur devient utile dès que la cellule contient
  un `<router-view />` ou une page échangée à l'exécution.
- **Pas de `pageContainerKey`** (la clé Quasar qui interdit à QPage de vivre hors
  conteneur) : dnax.ui autorise `<q-page>` dans la coquille `<q-app>` + barres `fixed`,
  la contrainte Quasar n'a donc pas lieu d'être.
- **Non repris de Quasar** : la racine `<main>` de QPage (risque de `<main>` imbriqués
  dans un site qui a le sien) et le `min-height` calculé inline (dnax.ui remplit déjà la
  zone par la rangée `1fr` du QLayout et `flex: 1 1 auto` — forcer `100dvh` casserait les
  démos en mode `container` embarqué).
- Docs : section « Page container » dans `docui/content/docs/2.layouts/3.page.md` (démo
  `:dnax-demo-page{demo="container"}`) ; la coquille complète de la page App Layout
  utilise désormais le conteneur.
- Vérif : `bun run generate` → 140 exports (QPageContainer ajouté) ; `bun test
packages/ui/lib` 162/162 ; `curl /docs/layouts/page` et `/docs/layouts/app-layout` →
  `class="q-page-container"` rendu (aucune balise non résolue) ; `diagnostics`
  QPageContainer → 0 erreur.

## QMap — cartes MapTiler, section docs « Maps » — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QMap.vue`, `packages/ui/lib/map.ts`

Nouveau composant **`<q-map>`** : carte interactive basée sur le **SDK JS MapTiler v4**
(MapLibre GL JS), sur le modèle de `<q-chart>` (props → helpers purs → instance).

- **API** : `provider` (`maptiler` par défaut, `openstreetmap` = raster sans clé — alias
  `osm` / `openstreet` résolus par `providerOf`, valeur inconnue → `maptiler` + avertissement
  `isKnownProvider`), `api-key`,
  `map-style` (nom court `streets`, `dataviz`, `outdoor`… → `MapStyle.<KEY>` + variante
  `.DARK`), `center` (`[lng, lat]`, `"lng,lat"` ou `{ lng, lat }`), `zoom`, `height`
  (nombre = px), `marks`, contrôles (`navigation`, `geolocate`, `scale`, `fullscreen`),
  `terrain`, `projection`, `dark`, `label`, `options` (options brutes du SDK, fusionnées
  en **dernier**). Events `ready`, `pick`, `error` ; expose `map` + `refresh()`.
- **Marks** = objets littéraux plats (comme les marks de `<q-chart>`) : `type`
  `marker` | `popup`, `position`/`lng`+`lat`, `label` (échappé) ou `html` (brut),
  `color` (token dnax ou couleur CSS, normalisée par `lib/color.ts`), `open`, `offset`,
  `draggable`. Une marque sans position valide est ignorée.
- **Clé d'API** : prop `api-key` ou globalement `componentProps.QMap.apiKey` du
  `QConfigProvider` ; sans clé, repli **assumé** sur le raster OpenStreetMap +
  `console.warn` (le cadre n'est jamais vide) ; la doc utilise
  `NUXT_PUBLIC_MAPTILER_API_KEY` (déclarée dans `runtimeConfig.public` de `docui`).
- **Thème** : variante sombre du style suivie via la classe `.dark` du document
  (MutationObserver), bulles et contrôles rethémés par les tokens dans
  `styles/main.css` (`.q-map__popup .maplibregl-popup-content`, les 8 ancrages de la
  pointe, `.maplibregl-ctrl-group`, icônes SVG inversées en sombre).
- **CSS du SDK** : `@import "@maptiler/sdk/style.css"` en tête de `styles/main.css`
  (inliné au build — choisi plutôt qu'un `import()` dynamique de CSS, non vérifiable ici).
- **Docs** : nouvelle section `docui/content/docs/6.maps/` (`index.md` + `.navigation.yml`)
  → `6.plugins` devient `7.plugins` et `7.directives` devient `8.directives` (les routes
  `/docs/plugins/*`, `/docs/directives/*` sont inchangées, seul l'ordre change) ; démo
  `docui/app/components/demos/DnaxDemoMap.vue` (`basic`, `marks`). **Écart assumé** avec la
  règle des charts : la table des marques est écrite à la main dans `index.md` (pas de
  `mark-parse`/`:dnax-mark-api` généralisé pour un seul composant).
- Dépendance : `@maptiler/sdk@^4.1.0` (`bun install` racine **nécessaire** : `maplibre-gl`
  et `@maptiler/client` ont été résolus à l'installation).
- Vérif : `bun run generate` → 141 exports ; `bun test packages/ui/lib` 181/181 ;
  `diagnostics` QMap → 0 erreur ; **rendu réel** en Chromium headless (cf.
  `knowledges.md`) → `maplibregl-canvas`, 4 `maplibregl-marker`, 2 bulles
  `q-map__popup` ouvertes, attribution « OpenStreetMap », aucune surcouche d'erreur,
  aucun `[q-map]` dans la console.

## Maps — sous-menu par fournisseur + clé MapTiler de la doc — 2026-09-25

tag: `decisions` — `filename: docui/content/docs/6.maps/`, `docui/nuxt.config.ts`

La section **Maps** devient un menu à sous-pages, une par fournisseur :

- `6.maps/index.md` (vue d'ensemble : `q-map`, marks, deux cartes `::prose-card` vers les
  fournisseurs, styles/dark en résumé, API) ;
- `6.maps/01.maptiler.md` → **MapTiler** (fournisseur par défaut) : clé d'API et usage par
  session, tableau complet des styles nommés + variantes, styles personnalisés (ID/URL),
  terrain 3D et projection globe **réactifs**, contrôles, APIs clientes du SDK ;
- `6.maps/02.openstreetmap.md` → **OpenStreetMap** (`provider="openstreetmap"`, sans clé,
  repli automatique) : ce qu'on perd, l'attribution et la politique d'usage des tuiles.
- Démos ajoutées dans `DnaxDemoMap.vue` : `styles` (bascule live du style), `terrain`
  (terrain + globe), `openstreetmap`.

**Clé d'API** : `runtimeConfig.public.maptilerApiKey` de `docui/nuxt.config.ts` porte la clé
de démo (surchargée par `NUXT_PUBLIC_MAPTILER_API_KEY`). C'est une clé de **navigateur** :
elle part dans chaque requête de tuiles, donc dans le bundle client quoi qu'il arrive → à
restreindre par domaine dans la console MapTiler plutôt qu'à cacher (documenté dans
01.maptiler.md). `docui/.gitignore` couvre désormais `.env` (le dépôt ne suivait que
`.env.example`).

- Vérif : `/docs/maps`, `/docs/maps/maptiler`, `/docs/maps/openstreetmap` → 200 ; sous-menu
  présent dans la sidebar (Maps → MapTiler → OpenStreetMap) ; Chromium headless : les deux
  démos de la page MapTiler chargent le style MapTiler (`© MapTiler` ×2, canvas, 0 erreur
  console) ; `bun test packages/ui/lib` 181/181 ; `diagnostics` QMap / DnaxDemoMap → 0 erreur.
- **`map-style` et non `style`** : la prop de style de carte a été renommée après un échec
  de vérification de types (`style` est un attribut réservé par Vue — cf. `warnings.md`).
  L'option du SDK garde son nom (`style`) dans `lib/map.ts`.

## QMap — moteurs interchangeables : MapTiler + Leaflet, props `tiles` — 2026-09-25

tag: `decisions` — `filename: packages/ui/lib/mapEngine.ts`, `packages/ui/lib/mapLeaflet.ts`

`<q-map>` devient multi-moteurs : `provider` choisit un **moteur** derrière un contrat
commun (`lib/mapEngine.ts`), et le composant ne connaît plus que ce contrat.

- Contrat `MapEngine` : `native`, `setView`, `setStyle(style, dark?)`, `setRaster?`,
  `setMarks`, `setTerrain`, `setProjection`, `resize`, `destroy`, `onReady`. Ce qu'un
  moteur ne sait pas faire est un **no-op** (Leaflet : pas de style vectoriel, de relief
  ni de projection).
- Moteurs : `lib/mapMaptiler.ts` (SDK MapTiler v4 — sert `maptiler` **et**
  `openstreetmap` ; c'est lui qui résout les noms courts en `MapStyle`, variante `.DARK`
  comprise) et `lib/mapLeaflet.ts` (Leaflet 1.9). `createMapEngine()` importe le moteur
  **à la demande** : une carte Leaflet ne charge jamais le SDK MapTiler, et inversement.
- Dépendance : `leaflet@^1.9.4` (+ CSS `leaflet/dist/leaflet.css` en `@import` de
  `styles/main.css`). Le paquet ne publie pas de types → `declare module "leaflet"` dans
  `shims.d.ts` (le moteur le manipule en `any`, comme le SDK MapTiler).
- Nouveaux props **`tiles`** (gabarit XYZ) et **`attribution`** : utiles aux deux
  fournisseurs raster (`openstreetmap` et `leaflet`), défaut = tuiles OpenStreetMap.
- Leaflet : coordonnées en **`[lat, lng]`** converties par le moteur (`toLeaflet`),
  épingles en `divIcon` **SVG** (`q-map__pin`) pour honorer `color` (l'icône par défaut
  est une image), `options` → `L.map()`, `options.tileLayer` → `L.tileLayer()`.
- Robustesse (constatée au navigateur) : une erreur signalée **par le moteur** en cours de
  route (tuile manquante, quota…) n'affiche plus « Carte indisponible » — elle est
  journalisée (première seulement) et émise via `@error` ; la surcouche « Chargement… »
  tombe au plus tard après 8 s (`READY_TIMEOUT`) pour ne jamais bloquer un cadre. Seul
  l'échec de **construction** passe par la surcouche d'erreur.
- Docs : `6.maps/03.leaflet.md` + carte `::prose-card` dans `index.md` + démo
  `demo="leaflet"` ; `tiles`/`attribution` documentés dans `02.openstreetmap.md`.
- Vérif : `bun test packages/ui/lib` 194/194 ; `diagnostics` 0 erreur (hors
  `lib/chart.ts`, pré-existant) ; Chromium headless sur les 3 pages → aucune surcouche
  bloquée, `© MapTiler` sur la page MapTiler, tuiles + **3 épingles SVG** + bulle
  `q-map__popup` sur la page Leaflet, un seul avertissement console (non fatal) côté
  OpenStreetMap.

## QMap — provider `maplibre` (MapLibre GL JS seul) — 2026-09-25

tag: `decisions` — `filename: packages/ui/lib/mapMaplibre.ts`

Quatrième moteur : `provider="maplibre"` monte **MapLibre GL JS** directement
(`maplibre-gl@^5.24.0` en dépendance directe de `packages/ui` — même version que celle
amenée par le SDK MapTiler, donc un seul exemplaire installé).

- **Styles** : ni catalogue ni clé → `map-style` accepte `demotiles` (défaut, style de
  démonstration MapLibre), `openstreetmap` (le raster d'`osmStyle()`, `tiles`/`attribution`
  compris), une URL de style ou un objet ; un nom court inconnu (`topo`…) retombe sur le
  style de démo **avec un avertissement** (`maplibreStyle()` renvoie `known: false`), tandis
  que `streets` (défaut du design system) y retombe sans bruit.
- **Contrôles** : MapLibre n'en monte aucun de lui-même → le moteur les ajoute depuis
  `input.controls` (`navigation` et `geolocate` par défaut, `scale`/`fullscreen` sur
  demande). C'est pourquoi `MapEngineInput` porte désormais `controls`, avec
  `controlPosition()` partagé (`lib/mapEngine.ts`).
- **Partage de code** : `buildMapLibreMarks()` (`lib/mapEngine.ts`) construit les marques —
  le SDK MapTiler et `maplibre-gl` exposent les mêmes `Marker`/`Popup` : les deux moteurs
  l'utilisent (plus de duplication).
- **Capacités** : `projection` → `setProjection({ type })` ✔ ; `terrain` sans effet (pas de
  source DEM par défaut : `options.terrain` au constructeur). Les moteurs décident
  maintenant eux-mêmes de ce qu'ils savent faire (`setTerrain`/`setProjection` des moteurs
  raster sont des no-op) et le composant les appelle sans condition.
- **CSS** : pas de second `@import` — `@maptiler/sdk/style.css` **concatène déjà**
  `maplibre-gl/dist/maplibre-gl.css` (mêmes classes `.maplibregl-*`, même version).
- Docs : `6.maps/04.maplibre.md` + carte dans l'index + démo `demo="maplibre"` (globe +
  style de démonstration).
- Vérif : `bun test packages/ui/lib` 200/200 ; `tsc --noEmit` (packages/ui) → aucune erreur
  dans `lib/mapMaplibre.ts` / `mapEngine.ts` / `mapLeaflet.ts` ; Chromium headless sur
  `/docs/maps/maplibre` → canvas MapLibre, 24 groupes de contrôles, marqueur, attributions
  « MapLibre »/« OpenStreetMap », **aucune erreur console** (le `load` du style de démo peut
  être lent en headless : la surcouche tombe alors par `READY_TIMEOUT`, comportement prévu).

## QBottomSheet — points d'ancrage (`breakpoints`, style Ionic) — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QBottomSheet.vue`, `packages/ui/lib/bottomSheet.ts`

Le panneau peut se poser sur **plusieurs hauteurs** : `:breakpoints="[0.25, 0.5, 0.75]"`
(fractions de la hauteur de vue, comme le sheet modal d'Ionic), avec
`v-model:breakpoint` pour le point d'ancrage courant.

- Calculs purs dans `lib/bottomSheet.ts` (+ `bottomSheet.test.ts`, 16 tests) :
  `normalizeBreakpoints` (trie, dédoublonne, écarte `0` et le hors-bornes, accepte aussi
  `"0.25,0.5"`), `nearestBreakpoint`, `stepBreakpoint`, `clampRatio`,
  `ratioFromDrag(start, dy, hauteurDeVue)`, `releaseBreakpoint(ratio, liste, seuil)`.
- **On pilote la hauteur, pas un `translateY`** : le drag écrit la fraction courante
  (`--q-bs-breakpoint` → `height: calc(var(--q-bs-breakpoint) * 100dvh)`), le contenu se
  réagence et **reste défilable à chaque point d'ancrage** (c'est le `expandToScroll:
false` d'Ionic — seul comportement ici, donc pas de prop). Le drag n'agit que sur la
  **poignée** : le scroll ne déplace jamais le panneau.
- Le mode historique (sans `breakpoints`) est **inchangé** : `translateY` + fermeture
  au-delà de `drag-threshold`. `height` est ignoré en mode breakpoints.
- Fermeture : relâché à `0`, ou à plus de `dragThreshold` px sous le plus bas point
  d'ancrage → le panneau se ferme (Ionic, lui, désactive le swipe-to-close quand `0` n'est
  pas dans la liste — écart assumé, documenté).
- `v-model:breakpoint` passe par `applyBreakpoint()`, qui ne réémet que si la valeur
  **communiquée** change (`committedRatio`) — sans ça, un drag tombant pile sur un point
  d'ancrage ne prévenait pas le parent (bug trouvé au test navigateur).
- Poignée accessible quand `breakpoints` est utilisé : `role="button"`, `tabindex`,
  Entrée/Espace (Maj = cran précédent) ; `setBreakpoint()`, `stepBreakpoint()` et
  `breakpoint` sont exposés.
- `setPointerCapture` est tenté dans un **try/catch** (un pointeur déjà relâché faisait
  jeter le gestionnaire).
- Docs : `4.components/bottom-sheet.md` (§ Breakpoints) + démo `demo="breakpoints"`
  (liste longue, pour montrer le scroll à chaque point d'ancrage).
- Vérif : `bun test packages/ui/lib` 216/216 ; **pilotage CDP** (chrome-headless-shell +
  WebSocket bun, cf. `knowledges.md`) sur `/docs/components/bottom-sheet` : ouverture à
  0.25 (250 px pour 1000 px de vue), drag → hauteur qui suit le doigt (500 px), snap 0.5
  puis 0.75, description du parent suivant `v-model:breakpoint`, drag sous le plus bas →
  panneau fermé.

## QBottomSheet — prop `seamless` (panneau sans backdrop) — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QBottomSheet.vue`

`seamless` rend le panneau **sans backdrop** : `background-color: transparent` sur
l'overlay et `pointer-events: none` (le panneau repasse en `auto`). Le fond n'est donc ni
assombri ni bloqué, et — conséquence logique — **le clic à côté ne ferme plus** le
panneau : le `@click` de l'overlay est neutralisé par la prop. Échap, le bouton « retour »
(via `useOverlayBack`), le `v-model` et le bouton de fermeture restent les moyens de le
fermer (combinable avec `persistent`).

C'est le panneau **non modal** : barre de recherche, mini-lecteur, formulaire posé sur une
carte — à combiner avec `breakpoints` pour un panneau redimensionnable pendant que la page
reste vivante.

- Docs : paragraphe « Seamless (no backdrop) » + démo `demo="seamless"` (pleine largeur,
  coins carrés, `q-input` dans le corps).
- Vérif : `bun test packages/ui/lib` 216/216 ; **CDP** sur la page bottom-sheet →
  seamless : `background: rgba(0, 0, 0, 0)`, `pointer-events: none`, hit-test renvoyant un
  élément de la page (`hitIsOverlay: false`), panneau **toujours ouvert** après un clic
  extérieur ; témoin (mode normal) : `rgba(0, 0, 0, 0.5)`, hit-test sur l'overlay, panneau
  **fermé** par le même clic.

## QImagePicker — exemples « réels » de la doc + prop `capture` — 2026-09-25

tag: `decisions` — `filename: docui/content/docs/4.components/image-picker.md`,
`docui/app/components/demos/DnaxDemoImagePicker.vue`

La page Image Picker n'avait **qu'un exemple statique sans `v-model`** : on pouvait choisir
un fichier, rien ne s'affichait (le champ ne conserve rien par lui-même). Elle est refaite
autour de cinq démos vivantes et d'une section « Recipes » :

- **Single image (avatar)** — `v-model` simple + aperçu (URL d'objet créée/révoquée côté
  app), valeur du modèle affichée, `avatar = null` pour vider.
- **Gallery (multiple)** — `max-files`, compteur, `@add` / `@remove` / `@rejected` dans un
  journal, et vignettes cliquables ouvrant `$q.imagePreview` (les vignettes du champ ne sont
  pas cliquables : la visionneuse se construit à côté).
- **Validation** — `max-file-size` + `accept` + `max-files` : le refus n'entre jamais dans le
  modèle, il apparaît en message interne **et** via `@rejected (file, reason)`.
- **Camera (mobile)** — `capture="environment" | "user"`.
- **States** — `readonly` / `disable` avec un modèle pré-rempli de `File` fabriqués en SVG.
- **Recipes** — envoi `FormData`, images déjà en ligne (URLs) à afficher à côté du champ,
  règle « une URL d'objet, un propriétaire ».

Composant, deux ajouts que ces exemples rendaient nécessaires :

- **prop `capture`** (`boolean | "user" | "environment"`) → attribut `capture` de l'input
  (appareil photo sur mobile) ;
- **garde-fou** : si aucun `v-model` ni écouteur `@update:model-value` n'est fourni
  (`getCurrentInstance().vnode.props`), un `console.warn` explique que les fichiers choisis
  ne seront pas conservés — c'est exactement le piège de l'ancien exemple.

Vérif : `bun test packages/ui/lib` 216/216 ; `bun run generate` 141 exports ; **CDP** (dépôt
réel de fichiers dans les inputs, cf. `knowledges.md`) → avatar (1 vignette, `pixel.png ·
70 B`), galerie (`2/5 selected`, journal, 2 vignettes cliquables), validation (0 vignette,
« Type de fichier non accepté » + refus journalisés pour `.txt` et 1,4 Mo), capture
(`environment` → `user` après bascule), états (`readonly` : 2 vignettes, 0 bouton de
retrait ; `disable` : champ atténué, pas de tuile d'ajout).

## QInputCurrency — champ montant formaté, `v-model` numérique — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QInputCurrency.vue`,
`packages/ui/lib/currency.ts`, `docui/content/docs/4.components/input-currency.md`

Nouveau champ **`<q-input-currency>`** : le montant est formaté à la volée (groupement des
milliers, séparateur et décimales de la locale) et le `v-model` porte un **nombre**
(`number | null`) — jamais la chaîne affichée, jamais de parsing côté application.

- Calculs purs dans `lib/currency.ts` (+ `currency.test.ts`, 21 tests) :
  `currencyFormat` (séparateurs, décimale de la devise via `Intl`, **place du symbole** par
  `formatToParts`), `parseAmount` (brouillon : signe/entiers/décimales, l'autre séparateur
  accepté s'il est sans ambiguïté — coller `"$1,234.56"` en fr-FR ou `"1.234,56 €"` en en-US
  donne le bon montant), `draftValue`, `draftFromValue`, `formatDraft` (conserve le
  séparateur final pendant la frappe), `formatAmount`, `roundTo` (arrondi par exposant
  décimal — `1.005 → 1.01`), `applyLimits`, `stepValue`, `digitCountBefore` /
  `caretForDigitCount`.
- **Locale** : celle de la langue de `QConfigProvider` par défaut (`fr` → `fr-FR`,
  `en` → `en-US`) ; `currency` par défaut `"EUR"` ; `decimals` par défaut : celles de la
  devise (JPY → 0).
- **Le symbole est un décor** (`.q-field__currency--before|after`) : la valeur reste
  éditable et la place du symbole suit le marché (« 9 999,50 € », « $US 9 999,50 » en
  français, « €1,234.56 » en anglais).
- Bornes `min`/`max` et arrondi appliqués **au blur** (la frappe n'est jamais interrompue) ;
  `↑`/`↓` avancent de `step` (Maj ×10) ; `allow-negative` ouvre les avoirs.
- Un `name` ajoute un **input caché** avec la valeur brute : le formulaire envoie un nombre
  (`FormData.get("amount") === "49.9"`), pas un montant formaté.
- Docs : page `4.components/input-currency.md` (4 démos : basic, devise/locale, bornes,
  formulaire & états) + `DnaxDemoInputCurrency.vue`.
- Vérif : `bun test packages/ui/lib` 237/237 ; `bun run generate` 142 exports ; **CDP** →
  frappe `9876.54` → « 9,876.54 » (curseur après le 6ᵉ chiffre), `12abc3456` → 123456,
  `-12.34567` en 3 décimales → -12.345, ✕ → `null`, `5000` non borné pendant la frappe puis
  `1 000,00` au blur, `↓` → 990, USD → « $US » (convention fr-FR), JPY → « 10 000 » + modèle
  ramené à 10 000, FormData `amount = "49.9"`, états readonly/disable/error corrects.

## QBottomSheet — ombre paramétrable, adoucie en `seamless` — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QBottomSheet.vue`

Sans backdrop, l'ombre par défaut du panneau (`0 -4px 24px rgb(0 0 0 / 0.2)`) dessinait une
bande sombre sous la feuille : en `seamless` elle passe à `0 -2px 12px rgb(0 0 0 / 0.08)`.

- Nouvelle prop **`shadow`** (même forme que `rounded`) : `true` (défaut — le CSS choisit
  normal ou adouci selon `seamless`), `false` (aucune ombre), ou une valeur CSS telle quelle.
- Elle est posée en variable **`--q-bs-shadow`** (inline, avant `contentStyle` — surchargeable
  par l'application, en prop ou en CSS) et consommée par `box-shadow: var(--q-bs-shadow,
<défaut>)` ; le défaut « seamless » vit donc dans une seule règle CSS.
- Docs : la section « Seamless (no backdrop) » explique l'adoucissement et la prop, et la
  démo `demo="seamless"` propose **default / softer / none / strong**.
- Vérif : CDP sur `/docs/components/bottom-sheet` → seamless défaut
  `rgba(0,0,0,0.08) 0px -2px 12px`, `:shadow="false"` → `none`, valeur CSS → appliquée,
  panneau normal → `rgba(0,0,0,0.2) 0px -4px 24px` (défaut conservé).

## QQrcode — code QR en SVG, export PNG/SVG — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QQrcode.vue`, `packages/ui/lib/qrcode.ts`,
`docui/content/docs/4.components/qrcode.md`

Nouveau composant **`<q-qrcode>`** : encode n'importe quelle chaîne (URL, texte, vCard, wifi)
et la rend en **un seul chemin SVG**, encodable côté serveur.

- **Aucune dépendance ajoutée** : `qrcode@1.5.4` était déjà dans `packages/ui` (inutilisée) —
  elle fournit `create()` (matrice de modules, synchrone) et **rien d'autre** : le rendu, la
  mise à l'échelle, les couleurs et l'export sont ceux de dnax.ui. Types absents →
  `declare module "qrcode"` dans `shims.d.ts` (même situation que Leaflet).
- Pur dans `lib/qrcode.ts` (+ `qrcode.test.ts`, 12 tests) : `encodeQr` (jamais d'exception →
  `undefined`), `isDark`, `qrPath` (une sous-forme par plage horizontale), `qrTotalSize`,
  `qrViewBox`, `qrSize`, `svgEscape`, `qrSvg` (SVG sérialisé).
- Props : `value`, `size` (nombre → px, ou longueur CSS), `ecc` (`L|M|Q|H`, défaut `M`),
  `margin` (zone de silence en modules, **4** par défaut), `color` (`#000`), `background`
  (`#fff` — un QR doit être sombre sur clair), `label` (a11y, `role="img"`). Valeur vide ou
  trop longue → rien n'est rendu (+ `console.warn`).
- Expose **`svg()`** (markup complet : téléchargement, presse-papier, `img src`) et
  **`toDataURL({ pixelSize })`** (PNG dessiné depuis la matrice, navigateur uniquement).
- Docs : page `4.components/qrcode.md` (5 démos : contenu, tailles/zone de silence, couleurs,
  correction d'erreur + logo au centre, export) + `DnaxDemoQrcode.vue`, et une section
  « Recipes » (vCard/wifi, valeur réactive, a11y, impression).
- Vérif : `bun test packages/ui/lib` 249/249 ; `bun run generate` 143 exports ; **CDP** →
  `viewBox 0 0 33 33` pour un QR version 3 avec `margin=4`, rendu à exactement 160 px,
  `role="img"` + `aria-label`, 162 sous-formes, `fill` calculé au clic d'une couleur, `svg()`
  de 2 409 caractères, `toDataURL({ pixelSize: 4 })` → PNG **132 × 132** (IHDR relu) et
  l'aperçu `<img>` du SVG à 33 px de côté.

## QBottomSheet — prop `glass` (et `translucent` réparé) — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QBottomSheet.vue`

`glass` applique la recette glassmorphism du design system (celle de `q-header` / `q-footer` /
`q-card`) au panneau : fond `rgb(255 255 255 / 0.14)`, flou **20px** `saturate(1.6)` et
bordure claire `rgb(255 255 255 / 0.22)` (3 côtés — le bas de la feuille touche l'écran) ;
variante sombre `rgb(255 255 255 / 0.07)` + bordure `0.12`.

- Elle **prime sur `translucent`** (ordre des règles dans la section bottom-sheet) ; les
  deux sont réglables en CSS (`--q-glass-bg`, `--q-glass-blur`, `--q-translucent-bg`,
  `--q-translucent-blur`) — via `content-style`, puisque le panneau est téléporté.
- **`translucent` était cassé** : sa règle vivait dans le bloc partagé du haut de feuille,
  donc écrasée par `.q-bottom-sheet__panel { background-color: #fff }` (cf. `warnings.md`).
  Corrigé pour le bottom sheet **et** le `q-country-picker` (même piège).
- Docs : la section « Sizing & look » documente les trois surfaces (plain / translucent /
  glass) ; la démo `demo="variants"` propose un sélecteur plain / translucent / glass.
- Vérif : CDP sur `/docs/components/bottom-sheet` → plain `rgb(255,255,255)` + `backdrop: none` ;
  translucent `color(srgb 1 1 1 / 0.7)` + `blur(12px) saturate(1.4)` (donc **appliqué**) ;
  glass `rgba(255,255,255,0.14)` + `blur(20px) saturate(1.6)` + bordure `1px rgba(255,255,255,0.22)`.

## QNumericKeyboard — pavé numérique à l'écran — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QNumericKeyboard.vue`,
`packages/ui/lib/numericKeyboard.ts`, `docui/content/docs/4.components/numeric-keyboard.md`

Nouveau composant **`<q-numeric-keyboard>`** : pavé 3 × 4 (configurable) pour un code PIN, un
montant ou un numéro. La `v-model` est une **chaîne** — c'est ce qui garde les zéros de tête
d'un code (`0406`) et évite les arrondis flottants d'un montant ; l'affichage reste à
l'application (points d'un code, montant formaté…).

- Pur dans `lib/numericKeyboard.ts` (+ `numericKeyboard.test.ts`, 18 tests) : `keypadLayout`
  (les 12 touches, avec la case libre, la touche `C` ou le séparateur), `pressKey`/`pressKeys`
  (règles de saisie), `digitCount`, `decimalCount`.
- **Règles** : `maxLength` compte les **chiffres** (le séparateur ne compte pas) ;
  `maxDecimals` borne l'après-séparateur ; le séparateur ne s'insère qu'une fois (et « 0, »
  sur un champ vide, jamais en mode `numeric`) ; un `0` seul est **conservé** en `numeric`
  (code, téléphone) mais **remplacé** en `decimal` (façon calculatrice).
- Props : `modelValue`, `mode` (`numeric` | `decimal`), `maxLength`, `maxDecimals`,
  `decimalSeparator`, `clearable`, `columns`, `dense`, `dark`, `disable`, `label` (a11y).
  Events : `update:modelValue`, `press(key)` (chiffre, `separator`, `backspace`, `clear`),
  `complete(value)` (déclenché quand `maxLength` est atteint — validation automatique d'un
  code). Expose `press()`, `backspace()`, `clear()`, `value` (pour brancher un clavier
  physique ou une saisie programmée).
- `columns` passe par la variable `--q-nk-columns` (grid) ; les touches sont de vrais
  boutons (focus visible, état pressé, `touch-action: manipulation`, `aria-label` sur ⌫ et
  C) ; icône `backspace` ajoutée à `lib/icons.ts` (`lucide:delete`).
- La touche « tout effacer » n'apparaît que si une case est libre : en mode `decimal` le
  séparateur l'occupe (documenté — utiliser `clear()` ou un bouton à côté de l'affichage).
- Docs : page `4.components/numeric-keyboard.md` (3 démos : code PIN avec points et
  `@complete`, montant avec affichage `Intl`, variantes colonnes/dense/dark/disable) + une
  section Recipes (clavier physique via `press()`, accessibilité, touches mélangées).
- Vérif : `bun test packages/ui/lib` 267/267 ; `bun run generate` 144 exports ; **CDP** →
  6 touches → `040612` (zéro de tête conservé) + `@complete` « Code complet : 040612 », 7e
  touche ignorée, `1 2 , 5 0` → `12,50` (+ `⌫` → `12,5`), 4 colonnes → grille de 4 et la
  touche C vide la valeur, `dense` 42 px / normal 52 px, `dark` `rgb(31,31,31)`,
  `disable` → toutes les touches désactivées, séparateur « . ».

## QNumericKeyboard — points de progression (`show-dots`) & disposition aléatoire — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QNumericKeyboard.vue`,
`packages/ui/lib/numericKeyboard.ts`, `docui/content/docs/4.components/numeric-keyboard.md`

Deux ajouts au pavé :

- **`show-dots`** : rangée de points **au-dessus des touches** (dans la grille, `grid-column:
1 / -1`). Le total vient de, dans l'ordre : `dots` (nombre explicite) → `maxLength` → le
  nombre de chiffres saisis (« champ masqué » qui grandit). Chaque point qui se remplit joue
  un « pop » (classe `--pop` appliquée par un `watch` sur le remplissage, retirée après
  340 ms ; `prefers-reduced-motion` la neutralise). Les points sont `aria-hidden` ; une
  région `aria-live` (`.q-numeric-keyboard__sr`, masquée à l'œil) annonce « 3 sur 6 ».
- **`random`** : disposition aléatoire des **chiffres** — les touches d'édition (`separator`,
  `C`, `⌫`) ne bougent pas ; chaque touche insère toujours le chiffre qu'elle affiche.
  L'ordre est tiré **au montage côté client** et reste **stable** (jamais re-tiré à chaque
  touche, sinon la saisie serait impossible) ; `shuffle()` (exposé) en retire un nouveau
  (pattern : après `@complete` ou un bouton). Pur dans `lib/numericKeyboard.ts` :
  `shuffledDigits(rng?)` (Fisher–Yates, `rng` injectable) + `applyDigitOrder(keys, order)`.
- Variables CSS : `--q-nk-dot-size` (12 px, 10 px en `dense`) ; styles ajoutés **dans la
  section QNumericKeyboard** de `main.css` (pas de bloc partagé — cf. `warnings`).
- Docs : la page passe à 5 démos (`pin`, `dots`, `random`, `amount`, `states`) ; la recette
  « Shuffled keys » (qui disait « le composant n'a pas de prop `random` ») est remplacée par
  « Fresh layout per attempt » (`shuffle()`).
- Vérif : `bun test packages/ui/lib` **272/272** (+5 tests `disposition aléatoire`) ;
  **CDP** → 4 rangées de points (6 / 4 rempli 2 / 4 rempli 4 / 4 rempli 0) ; pavé `random`
  → `4687930215` (permutation, case 9 `empty`, case 11 `backspace`) ; « Mélanger » →
  ordre changé ; 4 touches → `@complete` → **ordre re-tiré** + annonce « 4 sur 4 » ; 3 clics
  sur le PIN → 3 points remplis + `--pop` ×3 + « 3 sur 6 » ; `aria-live=polite`, points
  `aria-hidden`, `sr` `clip-path: inset(50%)`, taille de point 12 px.

## QSpreadsheet — type `multiselect` (choix multiples, en plus de `select`) — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QSpreadsheet.vue`,
`docui/content/docs/4.components/spreadsheet.md`,
`docui/app/components/demos/DnaxDemoSpreadsheet.vue`

`QSpreadsheetCellType` gagne **`multiselect`** à côté de `select`. Réponses aux questions
récurrentes : « le `select`, c'est quoi ? » → **choix unique** rendu par une liste d'`options`
(éventuellement en badges `chip`) ; « comment sont stockées les valeurs ? » → dans la ligne,
clé = `column.name`, et la **forme dépend du `type`** :

| Type                                | Valeur stockée                                                              |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `string` / `text` / `email` / `url` | string                                                                      |
| `number` / `integer`                | number (entier tronqué pour `integer`)                                      |
| `boolean`                           | true / false                                                                |
| `date` / `datetime`                 | ISO `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm`                                       |
| `select`                            | le **`value`** d'une option (jamais le libellé) — `"high"`                  |
| `multiselect`                       | un **tableau** de `value`s — `["design","backend"]`, `[]` si vide           |
| toute                               | la **source** de la formule si elle commence par `=` (affichage = résultat) |

- Décision : `multiselect` stocke un **tableau** (et non une chaîne séparée par des virgules)
  → tableau vide = « vide » (pour `clearCell` / `clearSelection` / `required`), et le filtre
  peut compter **une valeur par élément** (ligne retenue si au moins une est autorisée).
- Lecture unique des libellés par `choiceText(col, raw)` + `multiValues` / `multiLabels` :
  copie (TSV), export CSV, find/replace, tri, `title`, filtre et affichage restent cohérents
  et montrent toujours les **libellés**, jamais les `value`s stockés.
- Édition : réutilise le panneau de `select` (`--select` + `--multi`) mais **chaque clic coche
  et écrit tout de suite** (l'éditeur reste ouvert, un `cell-change` par bascule) ;
  `commitEdit` **ne re-coerce pas** un `multiselect` (le champ n'est qu'une recherche).
- Docs : nouvelle section « Single & multiple choice » (démo `choice` : `select` + `multiselect`
  avec chip + `multiselect` sans chip) et tableaux « Data model » complétés.
- Vérif : `bun test packages/ui/lib` 272/272 (aucun test unitaire ajouté — le composant n'en a
  pas) ; **CDP** → voir `knowledges.md` (badges, coche/décoche live, `Enter`, scalaire du
  `select`, filtre par valeur).

## QNumericKeyboard — `dots-size`, `error` / `error-message`, retour à l'état initial — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QNumericKeyboard.vue`,
`docui/content/docs/4.components/numeric-keyboard.md`,
`docui/app/components/demos/DnaxDemoNumericKeyboard.vue`

- **`dots-size`** : nombre → px, chaîne prise telle quelle (`"1.2rem"`), publiée en
  `--q-nk-dot-size` **en style inline sur la racine** → prioritaire sur `dense` (qui pose 10 px
  par classe), le défaut (12 px) restant en CSS. `rootStyle` remplace l'ancien `:style` inline.
- **`error` + `error-message`** : classe `--error` sur la racine + `aria-invalid="true"`, points
  pleins en `var(--negative)` (bordures des points vides : `color-mix(negative 45%, transparent)`)
  et message en `role="alert"` **sous** le pavé (`grid-column: 1 / -1`, `color: var(--negative)`).
  Les règles d'erreur sont déclarées **après** les variantes `--dark` : à spécificité égale
  (0,2,0), l'ordre du fichier décide — l'erreur doit gagner (cf. `warnings`).
- **Retour à l'état initial** : l'erreur est remise à zéro **quand l'utilisateur vide le pavé**
  (`next === ""` dans `onKey`, donc aussi via `backspace()` / `clear()` exposés) → `errorReset`
  masque points rouges + message **sans dépendre du parent**, et `update:error(false)` est émis
  pour `v-model:error`. Une **nouvelle** erreur (la prop repasse à vrai) remet `errorReset` à faux.
  Décision : le reset se fait sur l'**effacement par l'utilisateur**, pas sur un changement de
  `modelValue` — un parent qui pose `error = true` **et** vide la valeur dans le même tick ne voit
  donc pas son erreur disparaître aussitôt.
- Docs : section « Error state » (démo `error` avec `v-model:error`) + `dots-size` documenté dans
  « Progress dots » ; la page passe à **6 démos**.
- Vérif : `bun test packages/ui/lib` 272/272 (le composant n'a pas de test unitaire) ; **CDP** →
  largeurs de points observées 12 / 18 / 10 (dense) / 16 px ; mauvais code → `--error`,
  `aria-invalid="true"`, message `role="alert"`, points `rgb(193, 0, 21)` (= `--negative`) ;
  tout effacer → plus de `--error`, message absent, `error = false` (via `v-model:error`) ;
  2ᵉ erreur → re-affichée ; `123456` → aucune erreur.

## Doc QSpreadsheet — tableau exhaustif des « Cell types » en tête de page — 2026-09-25

tag: `decisions` — `filename: docui/content/docs/4.components/spreadsheet.md`

Consigne utilisateur : « les cell types doivent être **tous** listés dans un tableau **avant** de
passer aux exemples ».

- La section `## Cell types` a été **remontée juste après l'intro** (elle est désormais la 1ʳᵉ
  section H2 de la page) et commence par un **tableau exhaustif** des 11 valeurs de
  `QSpreadsheetCellType` : `type` · **Editor** · **Stored value** · **Rendering / notes**.
  Deux règles transverses le suivent (valeur `=` = formule sauf `boolean` / `select` /
  `multiselect` ; cellule vide = `null`, `multiselect` vide = `[]`), puis la démo `types`
  d'origine, **déplacée avec la section** (un seul `demo="types"` dans la page).
- Le tableau « Column type | Stored value | Example » de « Data model → Rows » a été
  **supprimé** au profit d'un renvoi au tableau des types : une seule table de référence, pas de
  doublon (règle : une info, un endroit). Idem dans « Single & multiple choice » : son petit
  tableau redondant a été remplacé par deux puces qui apportent l'info **complémentaire** —
  l'éditeur (`select` : filtre + `Entrée` choisit et ferme ; `multiselect` : cases à cocher,
  écriture immédiate, `Entrée` ferme si le filtre est vide).
- L'intro n'énumère plus les types (elle renvoie au tableau) ; la ligne `type` du schéma des
  colonnes y renvoie aussi ; la doc de validation précise que sur un `multiselect` les règles
  s'appliquent **par valeur** et que `[]` vaut vide.
- Vérif (CDP, page réelle) : H2 dans l'ordre — Cell types, Inline editing, …, API ;
  `cellTypesIsFirstSection: true` ; en-têtes du tableau = `type, Editor, Stored value,
Rendering / notes` ; **11 lignes** = string, text, number, integer, email, url, boolean, date,
  datetime, select, multiselect ; la démo suit le tableau (10 colonnes) ; **aucune erreur
  console`. MDC équilibré (15 `::prose-show-case`/ 15`::`) ; le seul `<table>` restant dans la
  section « Single & multiple choice » est celui de la **grille** (QSpreadsheet est un tableau
  HTML) — aucun tableau Markdown.

## QSpreadsheet — suivi des modifications (`dirty` + `changes`) — 2026-09-25

tag: `decisions` — `filename: packages/ui/components/QSpreadsheet.vue`,
`packages/ui/lib/spreadsheetChanges.ts`, `docui/content/docs/4.components/spreadsheet.md`

**Concept** : un **delta** entre un état de **référence** (« chargé / enregistré ») et l'état
courant — `v-model:dirty` (l'indicateur) + `v-model:changes` (le détail, organisé en lignes et
feuilles ajoutées / modifiées / supprimées).

- **Architecture : diff de deux photographies, jamais un journal d'opérations.** Le composant
  photographie le document avec `buildDocument()` (exactement ce que renvoie `toJSON()`) et
  `diffDocuments()` (pur, `lib/spreadsheetChanges.ts`, 23 tests) le compare à la référence.
  Conséquences voulues : juste quels que soient les chemins de mutation (édition, collage,
  recopie, tri, réordonnancement, import CSV, `loadDocument`…) ; état **net** rapporté (retaper la
  valeur d'origine ⇒ rien) ; et « modifié » = littéralement « `toJSON()` a changé ».
- **Organisation par niveau** (comme le modèle de données) : `rows` (identité = `_key`) et
  `sheets` (identité = `key`), chacun en `added` / `updated` / `deleted`, plus `extras`
  (`formats`, `widths`, `rowHeights`, `filters`, `rules`, `merges`, `hiddenRows`, `hiddenCols`).
  Une feuille ajoutée **emporte ses lignes** dans `sheets.added` (pas de doublon dans `rows`) ;
  `active` (onglet courant) et `version` sont ignorés ; `count` = lignes + feuilles, **+1** si
  `extras` (l'indicateur reste parlant pour une mise en forme seule).
- **Règles de comparaison** : `null` / `undefined` / `""` équivalents (« vide ») ⇒ ajouter une
  colonne vide ne marque aucune ligne ; seules les colonnes du **schéma courant** sont comparées
  ⇒ supprimer une colonne ne produit pas une modification par ligne (c'est
  `sheets.updated[].changed = ["columns"]`) ; les tableaux (`multiselect`) sont comparés élément
  par élément.
- **Cycle de vie de la référence** : posée à `onMounted` ; **reposée** quand `rows` / `columns` /
  `sheets` sont remplacés **de l'extérieur** (le test d'écho existant `v !== state.value`,
  `v !== cols.value`, `v === localSheets.value` distingue un nouveau document de notre propre
  emit) et après `loadDocument()`. Méthodes exposées : `acceptChanges()` (nouvelle référence,
  après un save), `revertChanges()` (revient à la référence via `loadDocument` — l'historique
  undo/redo est donc réinitialisé), `getChanges()`.
- **Déclencheur** : un `watch` à `flush: "post"` sur `[state, cols, localSheets, cellFmt,
colWidths, rowHeights, filters, condRules, merges, hiddenRows, hiddenCols]` (tous **remplacés**,
  jamais mutés en place) ⇒ un seul diff par cycle, même pour un collage de 100 cellules. Le
  renommage de feuille (`s.name = …`, mutation en place) appelle `recomputeChanges()`
  explicitement. ⚠ `sheetMeta` est volontairement **hors** de la liste : `buildDocument()` le
  réécrit (`sheetMeta.value = {…}`) ⇒ boucle infinie sinon.
- Props `showChanges` (défaut **true** — indicateur dans la barre d'état), `dirty`, `changes` ;
  events `update:dirty` / `update:changes` ; i18n `modified` / `rowsAdded|Updated|Deleted` /
  `sheetsAdded|Updated|Deleted` / `formatted`. Types ré-exportés par le SFC et par
  `packages/ui/index.ts`.
- Vérif : `bun test packages/ui/lib` **295/295** (+23) ; **CDP** → édition → « 1 modified » /
  « 1 row(s) updated » ; retaper la valeur d'origine → éteint (état net) ; gras →
  `extras: ["formats"]` + « 1 modified » ; `acceptChanges()` → éteint ; éditer puis
  `revertChanges()` → valeur restaurée + éteint ; classeur → +1 feuille « 1 sheet(s) added »,
  renommage « · 1 sheet(s) updated », suppression « 1 sheet(s) updated » (aucun faux positif) ;
  aucune erreur console.

## Doc Heatmap — trois exemples (dont un `visualMap` personnalisé) — 2026-09-28

tag: `decisions` — `namespace: dnax.ui` — `filename: docui/content/docs/5.charts/08.heatmap.md`,
`docui/app/components/demos/DnaxDemoChart.vue`

Demande : « pour la heatmap fait 3 exemples dans la doc ».

- La démo `demo="heatmap"` devient un empilement `demo-chart demo-stack` de **3 cartes** (même jeu
  `temps`), reflété à l'identique dans le bloc `#code` de `08.heatmap.md` :
  1. `fill` numérique (`'temp'`) + `labels: true` → rampe = palette des séries, valeur imprimée ;
  2. `fill` constant (`'primary'`) → grille unie (`visualMap` caché), la valeur passe par un canal
     `title` (`(d) => \`${d.temp} °C\``) ;
  3. échelle personnalisée via l'échappatoire `:options="{ visualMap: […] }"`.
- La section « The value — `fill` » précise désormais que l'échappatoire `options` **remplace**
  l'échelle émise (fusion superficielle — voir `warnings.md`) et que la mise en page complète doit
  être fournie. Une phrase sous la démo annonce les trois variantes.
- Piège associé : le commentaire du composant de démo ne doit pas nommer le moteur de rendu
  (règle « vocabulaire de la doc ») — un « ECharts » y avait fui, corrigé en « le moteur de rendu ».
- **4ᵉ exemple dédié** : « A contribution calendar » (`demo="heatmap-github"`) — 20 semaines ×
  7 jours, `visualMap` `piecewise` à 5 paliers façon GitHub, tooltip par cellule. Données
  **déterministes** (hash entier — pas de `Math.random()` au rendu, cf. `warnings.md`) : même
  rendu serveur/client. Colonnes = lundi de chaque semaine ; `QChartAxis` n'ayant pas d'option
  pour masquer les libellés, l'axe les élague via `hideOverlap`.

## Doc Dot — nuage de points + droite de régression — 2026-09-28

tag: `decisions` — `namespace: dnax.ui` — `filename: docui/content/docs/5.charts/04.dot.md`,
`docui/app/components/demos/DnaxDemoChart.vue`

Demande : « dans dot ajoute aussi un exemple de type scatter pour une régression linéaire ».

- Nouvelle démo `demo="dot-trend"` + section « A trend line » dans `04.dot.md` : un `dot`
  (scatter, `r: 4`) et un second mark `line` (deux points = les extrémités de la droite),
  ajustement **moindres carrés** calculé dans le script.
- Données **déterministes** (hash entier `noise`, pas de `Math.random()`) — cf. `warnings.md`.
- Piège documenté : dès qu'un mark `line` est présent, l'info-bulle devient **d'axe**
  (`axisTooltip` dans `chart.ts`), donc le `title` par point d'un `dot` n'est pas utilisé — les
  séries sont nommées (`name`) pour la légende.
- À savoir : le mark `line` dessine ses **extrémités** comme marqueurs (`symbolSize` 5, non
  débrayable) — visible sur une droite de régression à deux points.

## QTime — champ heure (`v-model`), panneau `placePopover` — 2026-09-28

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/components/QTime.vue`,
`docui/app/components/demos/DnaxDemoTime.vue`, `docui/content/docs/4.components/time.md`

Nouveau composant `QTime` (absent du catalogue jusqu'ici, cf. `knowledges.md`
« Inventaire composants »), à l'API Quasar `<q-time v-model="t" format24h now-btn />`.

- **Format de valeur = toujours 24 h** : `"HH:MM"`, ou `"HH:MM:SS"` si `withSeconds`.
  `format24h` (défaut `true`) ne change **que** l'affichage et la saisie (`h:mm AM/PM`) —
  comme Quasar. Un suffixe AM/PM tapé (`2:30 PM`) ou présent dans `modelValue` est converti.
- **Placement = `lib/datePicker.ts` (`placePopover`)**, comme le mode `popover` de
  QDatePicker ; mesure `getBoundingClientRect` (ancre = bas du **champ**, pas de la racine,
  pour ignorer la zone hint/erreur) + `window.innerWidth/Height`, appelé **après** `nextTick`
  (largeur réelle), repositionné sur `resize` / `scroll` (capture).
- `position` (`bottom-start` | `bottom-end` | `top-start` | `top-end`, défaut `bottom-start`) :
  le côté demandé est honoré quand la place le permet (≥ 120 px), sinon la **bascule
  automatique** du helper reprend la main (contrairement à QSelect où `top`/`bottom` forcent
  sans bascule) ; le suffixe `-start`/`-end` règle l'ancrage **horizontal** du panneau.
  Dernier emplacement conservé à la fermeture (l'animation de sortie en dépend).
- **Colonnes** : heures (`hourStep`) / minutes (`minuteStep`) / secondes (si `withSeconds`).
  Pas de 4ᵉ colonne meridian : en 12 h la colonne heures liste **1–12** et un basculeur
  **AM/PM** vit dans le pied du panneau (la spec demandait exactement 3 colonnes).
  Les **secondes suivent `minuteStep`** (aucune prop `second-step` dans l'API demandée).
  Item courant `aria-selected="true"`, colonne remise sur l'item courant
  (`scrollIntoView({ block: "nearest" })`) à l'ouverture et après chaque sélection.
- **Fermeture** : clic extérieur en **phase de CAPTURE** + `Échap` (cf. `decisions.md`).
  Choix documenté : **la sélection d'un item NE ferme PAS le panneau** (l'utilisateur règle
  heures puis minutes avant de cliquer dehors) ; `Entrée` valide la saisie **et** ferme.
  Le panneau porte `@mousedown.prevent` pour ne pas voler le focus du champ.
- **Saisie clavier** : parseur tolérant (`9:5`, `09:05`, `09h05`, `9.5`, `9 05`, `2:30 PM`) —
  valeurs **bornées** (`h` 0–23, `m`/`s` 0–59) ; une saisie illisible est **ignorée** (retour à
  la valeur courante). Flèches ↑/↓ (champ focus, panneau **fermé**) : ± `minuteStep`, ± 1 h
  avec `Shift` (rebouclage 24 h).
- `disable`/`readonly` : ni ouverture ni modification ; `aria-haspopup="dialog"`,
  `aria-expanded`, `aria-disabled`. Emits `update:modelValue` / `open` / `close` ; méthodes
  exposées `show` / `hide` / `toggle` ; slot unique `#label`.
- **Sombre** : `--dark` sur la racine **et** ancêtre `.dark` (`.dark .q-time__x` en scoped).
  Le panneau est **téléporté** → il porte sa propre classe `q-time__panel--dark`.
- **Survol des items = `var(--muted)`**, pas `var(--accent)` : le thème des docs
  (`docui/app/assets/css/main.css`) ne définit pas `--accent`, qui vaut donc le **violet
  Material** de dnax.ui (`#9c27b0`) — exactement le piège déjà noté dans `main.css`
  (« `--accent` ≠ surface de survol shadcn »).
- **À FAIRE (hors périmètre de la tâche)** : `bun run generate` pour exporter `QTime` dans
  `packages/ui/index.ts` — sinon l'onglet **Props** de `<dnax-api name="QTime">` reste vide
  (le runtime ne résout pas `QTime`). Le module Nuxt auto-importe en revanche `<q-time>`
  (scan du dossier `components`), donc la démo fonctionne sans ce build.
- Vérif : `diagnostics` sur `QTime.vue` et `DnaxDemoTime.vue` → **0 erreur / 0 warning**.
  Les erreurs restantes du projet (`chart.ts`, `DnaxDemoChart.vue`, `QDatePicker.vue`,
  `tsconfig.json`) sont **préexistantes**, non touchées.

## QTimeline + QTimelineEntry — frise chronologique verticale — 2026-09-28

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/components/QTimeline.vue`,
`packages/ui/components/QTimelineEntry.vue`

Famille ajoutée (lacune du catalogue, cf. `knowledges.md`). Deux composants,
conventions shadcn-vue / API Quasar.

- **QTimeline** = conteneur `tag` (défaut `ul`, `role="list"`) : `color` (défaut `primary`),
  `dark`, `layout` (`dense|comfortable|loose`, défaut `comfortable`). Il **dessine le rail**
  (`::before` 1px, centré à 50 %) et pose les variables CSS `--q-timeline-color`,
  `--q-timeline-color-foreground`, `--q-timeline-gap`.
- **QTimelineEntry** = `li` (`role="listitem"`) : `heading`, `tag`, `side`, `icon`, `avatar`
  (`avatar` > `icon`), `title`, `subtitle`, `color`, `dark`. Slots `#default`, `#title`,
  `#subtitle`, `#icon` (remplace le **contenu** de la pastille, le cercle est conservé).
- **Alternance automatique** : sans `side`, l'entrée reçoit `q-timeline__entry--auto` et le CSS
  de **son propre** `<style scoped>` la place à gauche sur `:nth-child(odd)`, à droite sur
  `:nth-child(even)` (impair → gauche). Un `heading` (aussi `li`) **compte** dans l'alternance,
  comme Quasar. `side="left|right"` fige le côté (classe `--left`/`--right`).
- **Couleur héritée** : `QTimeline` pose `--q-timeline-color` sur sa racine ; la pastille de
  l'entrée la lit (`background: var(--q-timeline-color, var(--primary))`). En plus du CSS,
  `provide`/`inject` d'une clé **locale** `qTimelineKey` (`Symbol("q-timeline")`) transmet
  `{ color, layout }` (un `ComputedRef<TimelineContext>`) — repli `color ?? "primary"`,
  `layout ?? "comfortable"` si l'entrée est hors conteneur. Le `layout` pilote `--q-timeline-gap`
  (12/26/42 px).
- **`dark`** : pose des variables (`--q-timeline-fg`/`-muted`/`-surface`) en **inline**, donc
  héritées à travers la frontière de slot (un style `scoped` du conteneur ne peut pas cibler le
  contenu du slot) ; le mode sombre **ambiant** est déjà couvert par les jetons.
- **Suivi** : les deux composants **ne sont pas encore exportés** par `packages/ui/index.ts`
  (interdit dans cette tâche) → lancer `bun run generate` (ou `cd packages/ui && bun run generate`)
  pour que `@dnax/ui/runtime` les expose (nécessaire à la table Props de `:dnax-api`).
  Les démos et l'auto-import Nuxt (scan du dossier `components/`) fonctionnent sans ça.
- Docs : `docui/content/docs/4.components/timeline.md` (+ `DnaxDemoTimeline.vue` : `basic`,
  `heading`, `icons`). Diagnostics propres (aucun build lancé).

## QPopupProxy — panneau ancré ↔ dialogue selon la largeur — 2026-09-28

tag: `decisions` — `namespace: dnax.ui` — `filename:
packages/ui/components/QPopupProxy.vue`, `docui/content/docs/4.components/popup-proxy.md`,
`docui/app/components/demos/DnaxDemoPopupProxy.vue`

Demande : créer `QPopupProxy` (proxy de popup à la Quasar) : **même contenu, même API**,
rendu en **panneau ancré au parent** (`position: fixed`, téléporté dans `<body>`) sur grand
écran, et dans un **`QDialog` centré** sous `breakpoint` (défaut `599`).

- **Pas de déclencheur propre** : comme `QTooltip`, une ancre `<span>` invisible
  (`display:none`, `aria-hidden`) est rendue DANS la cible ; `anchorEl.value.parentElement`
  retrouve l'élément parent même après le Teleport (qui couperait le lien DOM). Ouverture
  programmatique via `show()` / `hide()` / `toggle()` (`defineExpose`).
- **`v-model` optionnel** : détecté par `getCurrentInstance()?.vnode.props` (une prop Boolean
  non passée vaut `false`, pas `undefined` — cf. `QTooltip`) ; sinon état interne.
- **Positionnement** : reprise de `placePanel` de `QBtnActions` (point d'ancrage +
  `translate` en %, cf. `knowledges.md`), avec clamp viewport calculé sur `offsetWidth/Height`
  mesurés (2ᵉ passage après `nextTick`).
- **Bascule live** : `windowWidth` initialisé à `1024` (identique serveur/client → aucun
  mismatch d'hydratation, cf. `warnings.md`) puis mis à jour au montage ; `isWide =
windowWidth >= breakpoint` choisit le rendu, un `watch(isWide)` re-ancre et re-focus.
- **Focus** : premier élément focusable (ou le panneau `tabindex="-1"`) à l'ouverture,
  restauration du focus de départ à la fermeture.
- **Fermeture** : `mousedown` document en **phase de CAPTURE** (cf. `decisions.md` — sinon un
  `@mousedown.stop` parent bloque) + `Échap`, sauf `persistent` ; en mode étroit c'est
  `QDialog` qui gère backdrop/Échap (`persistent` transmis).
- **Styles scoped** dans le SFC (pas de `main.css`) : `--card`/`--border`/`--foreground`,
  `--q-z-menu` (3200), `--radius`/`--q-radius` ; dark via `.dark .q-popup-proxy__panel` et
  `.q-popup-proxy__panel.dark` (panneau téléporté hors du conteneur du provider).
- **Hors périmètre (assumé)** : `packages/ui/index.ts` non modifié (consigne) — la page
  `:dnax-api{name="QPopupProxy"}` n'aura donc pas l'onglet **Props** tant que l'export n'est
  pas ajouté (`bun scripts/generate-exports.ts`) ; les onglets Slots/Events/Methods, eux,
  viennent de l'analyse statique du SFC (`docui/scripts/dnax-ui-meta.ts`).

## QTiptap supprimé du design system — 2026-09-28

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/index.ts`

Demande : « supprime q-tiptap ». L'éditeur de texte riche est retiré (déjà plus fourni du
tout : `QEditorJs` avait été supprimé le 2026-09-17). Aucun remplacement.

- Fichiers supprimés : `components/QTiptap.vue`, `components/internal/QTiptap{Table,TaskItem}View.vue`,
  `lib/tiptap-{table,task-list}.ts`, `docui/.../demos/DnaxDemoTiptap.vue`,
  `docui/content/docs/4.components/tiptap.md`.
- `packages/ui/index.ts` régénéré (`bun scripts/generate-exports.ts`) ; toutes les dépendances
  `@tiptap/*` retirées de `packages/ui/package.json` ; règles `.q-tiptap*` retirées de
  `styles/main.css`.
- Pièges à ne pas réintroduire : `EditorContent` v3 ne propage pas les attributs (d'où le
  conteneur `.q-tiptap__editor` + `min-height: inherit`) ; l'extension `FontSize` doit être
  **enregistrée** (`@tiptap/extension-text-style`) sinon `setFontSize` échoue en silence ;
  `isActive("table")` est faux au curseur dans une cellule (remonter les ancêtres `$from.node(depth)`).

## QInputChat — composer de chat (textarea, options, fichiers, menu « + ») — 2026-09-28

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/components/QInputChat.vue`

Champ « chat » : textarea multiligne auto-extensible, bouton d'envoi intégré, pastilles
d'options activables (`v-model:options`), bouton « + » à menu (actions + pièce jointe) et
fichiers joints (`v-model:files`). Périmètre : composant, démo `DnaxDemoInputChat.vue`, page
`4.components/input-chat.md`.

- Racine `.q-input-chat` + modifiers `q-field--outlined|filled|borderless|dense|error|rounded`
  (modèle QInputTag) ; à l'intérieur `.q-field__control` / `.q-field__native` /
  `.q-field__bottom`, textarea `class="q-field__native q-input-chat__native"` ; styles
  **scoped dans le composant** (jamais `styles/main.css`).
- Types exportés (bloc `<script lang="ts">`, comme QTimeline) : `ChatOption` (`label`
  requis, `icon?`, `value?`, `_id?`, `active?`, `disable?`) et `ChatAction` (`label?`,
  `icon?`, `iconRight?`, `value?`, `disable?`, `separator?`, `title?`, `onClick?` — mêmes
  champs que `BtnAction` de `QBtnActions`, mappage direct). **`side` et `active` retirés de
  `ChatAction`** : la sélection est le rôle d'`options`, les actions vivent dans le menu du
  « + ».
- Props : message, placeholder, label, hint, error, errorMessage, counter, maxlength,
  rows (1), maxRows (6), autogrow (true), sendIcon, sendLabel (`Send`), sendColor,
  sendOnEnter (true), clearOnSend (true), disableSendWhenEmpty (true), loading,
  **options** ([]), **actions** ([]), **actionsIcon** (`lucide:plus`), **actionsLabel**
  (`More actions`), **files** ([]), **accept**, **multiple** (true), **attach**
  (`true|string` ; défaut effectif = activé si `accept` fourni, libellé `Add file`),
  **showFiles** (true), padding, outlined/filled/borderless/dense, radius, dark, disable,
  readonly, safeArea (true → safe-area basse, chaîne 0 → constant() → env()).
- Emits : `update:message`, `update:options` (**nouveau tableau**), `update:files`,
  `option` (`{ option, active }`), `send` (texte trimé), `clear`, `action`
  (`{ action, value }`), `focus`, `blur`.
- Slots : `prepend`/`append` (inline), `options` (remplace les pastilles), `files`
  (remplace les chips de fichiers), `actions` (remplace le « + » et son menu), `tools`
  (droite, avant l'envoi), `send`, `hint`, `error`.
- **Options** : état interne `localOptions` synchronisé sur la prop par `watch` (fonctionne
  **avec ou sans** `v-model:options`) ; au clic, `map` + toggle de `active` (option retrouvée
  par `_id`, sinon par index), puis `update:options` (nouveau tableau) + `option`.
  `disable` → ignoré.
- **Fichiers** : `<input type="file" hidden :accept :multiple>` interne ; l'entrée
  « joindre » du menu du « + » l'ouvre. Au `change`, ajout aux fichiers courants avec
  déduplication `name+size+lastModified`, puis `input.value = ''` (re-choisir le même
  fichier) ; émission `update:files`. Chips retirables (nom + taille Ko/Mo, ✕ → retire).
  État interne `localFiles` synchronisé (`watch`).
- **Menu du « + »** : `<q-btn-actions>` (`flat`, `dense`, `round`, `no-caps`,
  `dropdownIcon` chevron-bas) ; `:actions` = [entrée attach (si activée) + actions mappées].
  Entrée attach marquée par une **valeur sentinelle** (`ATTACH_VALUE`) ; les entrées portent
  une référence `__chatAction` pour retrouver le `ChatAction` d'origine au `@select-action`
  (QBtnActions renvoie `value`, sinon l'entrée elle-même). `onClick` local puis
  `emit('action', …)`.
- Barre (`.q-input-chat__toolbar`) rendue si `options.length || #options || actions.length ||
#actions || #tools || attach` : options à gauche, puis le « + » ; à droite `#tools` +
  envoi. Sans barre, le bouton d'envoi reste inline dans le contrôle.
- Prop `padding?: string` : valeur CSS posée en `--q-input-chat-padding` sur le contrôle.
- Prop `paddingOptions?: string` (`padding-options`) : valeur CSS posée en
  `--q-input-chat-options-padding`, lue en `padding-inline` (gauche/droite) de
  `.q-input-chat__toolbar`.
- **Hauteur d'une ligne du textarea** : variables `--q-input-chat-field-height` /
  `--q-input-chat-field-padding` sur la racine — 44px/12px par défaut (champ « basic » plus haut
  qu'un champ simple), 38px/9px si `padding` fourni (`q-input-chat--custom-padding`), 32px/6px en
  `dense`.
- **Envoi inline (mode basic / autogrow)** : `.q-input-chat__control .q-input-chat__send`
  à 30px (`--q-btn-h`) + `font-size: 12px`, `flex: none`, `align-self: flex-start` +
  `margin-top` = demi-différence avec la ligne → centré sur une ligne, **en haut à droite**
  quand le textarea grandit. La **copie de la barre** (`.q-input-chat__tools .q-input-chat__send`)
  est aussi à 30px (alignée sur les pastilles/outils), sans marge.
- Methods (`defineExpose` forme explicite) : `focus`, `blur`, `clear`, `send`. Bouton
  d'envoi = `<q-btn round type="button">`, désactivé si disable/readonly/loading ou
  (`disableSendWhenEmpty` && trim vide).
- Démo `DnaxDemoInputChat.vue` : `options`, `files`, `actions`, `deepseek`, `vibe`, `tools`
  (+ `basic`/`variants`/`states`/`slots`/`autogrow`) ; maquettes DeepSeek/Vibe sur conteneur
  arrondi sombre (classe `dark`) + composer `borderless` (le « + » vient du composant ;
  `#append` porte le menu « Rapide ⌄ » + micro pour Vibe).
- **Hors périmètre (assumé)** : `styles/main.css` non modifié ; `QInputChat` exporté par
  `packages/ui/index.ts`. `docs/public/llms.txt` et `docui/app/data/menu.ts`
  (`bun scripts/gen-menu.ts`) restent à mettre à jour.

## QSelect `use-search` — comportement de la recherche + section doc — 2026-09-29

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/components/QSelect.vue`,
`docui/content/docs/4.components/select.md`, `docui/app/components/demos/DnaxDemoSelect.vue`

Demande : il n'y avait pas d'exemple de `<q-select use-search>`, et le champ de recherche
devait s'effacer (1) à la sélection d'un élément et (2) au clic extérieur sans sélection.

- **Comportement** : dans `select()` (branche simple), après `closePopup()` la `query` est
  vidée (`query=""` + `emit("update:inputValue", "")`) → le champ d'affichage reprend le label
  de la sélection, plus le filtre. Dans `closePopup()`, si `query !== ""` **et** `!hasValue`,
  la recherche est abandonnée (clic extérieur, backdrop, Échap, ×) — garde `!hasValue` pour
  ne pas toucher au cas « on change une valeur déjà sélectionnée » (là c'est la branche
  `select()` qui nettoie, car `props.modelValue` n'est pas encore à jour dans le même tick).
  En `multiple`, la recherche **reste** (on continue de filtrer pour sélectionner d'autres).
- **Doc** : nouvelle section « Search (`use-search`) » dans `select.md` + démo
  `demo="search"` de `DnaxDemoSelect.vue` (liste de villes, fuzzy fuse.js). Le `ref<string>`
  de la démo `direction` était un `SelectPopupPosition` → typé explicitement (erreur TS
  préexistante corrigée au passage).

## QDatePicker popover — cercles de dates plus petits, calendrier resserré — 2026-09-29

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/styles/main.css`,
`packages/ui/lib/datePicker.ts`

Demande : en mode `popover`, trop d'espace entre les dates et cercles trop gros.

- **Cause racine** : `.q-date-calendar__day` est `width: 100%` + `aspect-ratio: 1` dans une
  grille `repeat(7, 1fr)` → le cercle grandit avec la largeur du panneau (popover 360px →
  cercles ~46px). Correction : **plafond `max-width: 34px`** + `justify-self: center` — la
  pastille ne dépend plus de la largeur (protège aussi le mode `inline` sur conteneur large).
- `.q-date-calendar` : `padding` 12→10px, `gap` 8→6px. `.q-date-calendar__weekdays` reçoit le
  même `gap: 2px` que les semaines (les libellés s'alignent sur les colonnes des jours).
- Panneau popover : `width` 360→**300px** (`.q-date-picker__sheet--popover`) et
  `POPOVER_FALLBACK_WIDTH` 360→**300** (largeur de repli du 1er rendu, `lib/datePicker.ts`).
- Vérif : `bun test lib/datePicker.test.ts lib/chart.test.ts` → **90 pass / 0 fail**
  (le test de repli utilise la constante, pas la valeur). Diagnostics propres. Aucun build lancé.

## Entrées du package @dnax/ui : `./runtime` (léger) vs `./registry` (barrel) vs `.` — 2026-09-29

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/package.json`, `packages/ui/runtime.ts`,
`packages/ui/module.ts`

Contrat des sous-entrées, après le bug « `/runtime` = barrel → `qrcode` au boot » (cf. `warnings.md`) :

- **`"."` → `index.ts`** — le barrel complet (tous les composants). Entrée des **consommateurs**
  (`import { QBtn } from "@dnax/ui"`). ⚠️ **Interdite en interne** : Nuxt bloque l'import de l'entrée
  d'un module depuis le code de l'app (`null:import-protection` / impound).
- **`"./runtime"` → `runtime.ts`** — entrée **légère** des **plugins/directives** : API
  overlay/directive, composables `$q` (`usePlugin`, `useDialogPluginComponent`…), et les **providers**
  `$q` montés au boot. **Ne réexporte jamais `index.ts`.** C'est ce qu'importent les templates de
  `module.ts` et les plugins de l'app hôte.
- **`"./registry"` → `index.ts`** — le barrel en accès **explicite/opt-in**, pour le code qui résout un
  composant **par son nom** (`docui` : `DnaxApi.vue`, `useComponentDocs.ts`). Contourne la protection
  d'import sans affaiblir `./runtime`.
- **`"./module"` → `module.ts`** — le module Nuxt.

Règle générale : **une sous-entrée _runtime/plugin_ ne doit jamais pointer sur `index.ts`** ; si du
code a besoin du barrel, il prend `"./registry"` en connaissance de cause (coût : tout le graphe).

## Thème : tokens de champ `--q-field-bg*`, `theme.vars`, et avertissement `componentProps` — 2026-09-29

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/styles/main.css`,
`packages/ui/lib/{config,themeVars}.ts`, `packages/ui/components/QConfigProvider.vue`

Demande : pouvoir donner une couleur de fond aux champs via le thème, et arrêter le piège de
`componentProps` (clés silencieusement ignorées). Trois changements liés :

1. **Tokens CSS** — `.q-field__control` lit désormais `var(--q-field-bg, …)` (fallbacks = valeurs
   historiques : `#fff`, sombre `var(--muted)`, `outlined`/`borderless` `transparent`) et la variante
   `filled` lit `var(--q-field-bg-filled, rgb(0 0 0 / 0.05))`. Un seul token re-skine **tous** les
   champs (le contrôle est partagé par QInput/QSelect/QAutocomplete/QDatePicker/QInputTag…).
2. **`theme.vars`** — nouveau champ `QTheme.vars?: Record<string, string>` : variables CSS libres
   posées avec le thème (clé avec ou sans `--`), **en dernier** (elles peuvent surcharger `colors`).
   Logique extraite dans le **pur** `lib/themeVars.ts` → `themeVars(theme)` (testé) +
   `themeVarsStyle(computed)` (inchangé), partagé par `QConfigProvider.themeStyle` (qui perd son
   `textColorFor` dupliqué) et les providers d'overlays téléportés.
3. **Avertissement dev** — `QConfigProvider` `console.warn` (une fois par signature, client
   uniquement) les clés de `componentProps.<Nom>` non lues. Registre : `EXTRA_COMPONENT_PROP_KEYS`
   (`QMap: ["apiKey"]`) + `radius` générique.

- **Choix assumé** : ne PAS câbler `componentProps.<Nom>.style` (spread générique) — ça ne
  résoudrait pas les parties internes (racine ≠ `.q-field__control`) et ferait fuiter les clés
  inconnues en attributs DOM. Une seule voie pour le style : **tokens CSS**.
- **Doc** : `2.layouts/1.config-provider.md` (tableau des clés de `:theme` + section `vars` + démo
  `vars`), `4.components/input.md` (section « Background & CSS variables » + démo `background`).
- **Vérif** : `bun test lib` → **302 pass / 0 fail** (dont 7 nouveaux sur `themeVars`) ;
  `cd docui && bun run build` → **EXIT 0** ; équilibre MDC 3/3 et 11/11 sur les deux pages ;
  diagnostics propres. Aucun navigateur (règle projet).

## QSpreadsheet : `validation` accepte une **expression ArkType directe** — 2026-09-29

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/lib/spreadsheetValidation.ts`,
`packages/ui/components/QSpreadsheet.vue`

Demande : pouvoir écrire la contrainte **directement sur la colonne**, du type `"number < 4"`,
au lieu d'un objet `{ min, max }`.

- **API** : `QSpreadsheetColumn.validation` (et `QSpreadsheetRangeValidator.validation`) accepte
  désormais `QSpreadsheetValidationRule = QSpreadsheetValidation | string`. Une **chaîne** est une
  expression ArkType, c'est-à-dire le raccourci de `{ schema: "…" }` ; les deux formes se combinent
  (`{ required: true, schema: "number < 4" }`).
- **Source unique** : les types + la logique vivent dans `lib/spreadsheetValidation.ts` (pur,
  **testé sans navigateur**), ré-exportés par le bloc `<script lang="ts">` du SFC (même pattern que
  `lib/spreadsheetChanges.ts`). Le composant n'a plus qu'à fournir le pont ArkType :
  `checkValidation(rule, value, arkCheck)` avec `arkCheck` injecté (`ArkCheck`) → testable avec un
  faux ArkType (16 tests, dont l'ordonnancement des règles).
- **Ordre** inchangé : `required` → vide toléré → `list` → `integer` → `min`/`max` → `pattern` →
  `schema` ; `message` surcharge la règle qui échoue.
- **Doc** : `4.components/spreadsheet.md` — section Validation (les 4 écritures + l'ordre des règles
  - `Invalid ArkType schema`), **nouvelle sous-section `### ArkType expressions`** (tableau des
    expressions vérifiées avec leur message d'échec, le piège du `&`, le comportement des cellules
    vides, l'import à la demande), tableau des colonnes complété (`required`, `list`, `schema`) ; démo
    `layout` (`DnaxDemoSpreadsheet.vue` : colonne `priority` en `validation: "number < 4"`).
- **Vérif des expressions documentées** (ArkType installé, `arktype@2.2.6`), messages réels :
  `"number < 4"` → `must be less than 4 (was 4)` ; `"number.integer & number >= 0 & number <= 100"`
  → `must be at most 100 (was 150)` ; `"string.email"` → `must be an email address (was "nope")` ;
  `"string >= 3"` → `must be at least length 3 (was 2)`. Toutes valides ; seul
  `"… & >= 0"` (l'ancien exemple de la JSDoc) jette un `ParseError`.
- **Vérif** : `bun test lib` → **323 pass / 0 fail** ; `cd docui && bun run build` → **EXIT 0** ;
  équilibre MDC 16/16 ; diagnostics propres.

## QSpreadsheet : `options` brutes d'API via `optionLabel` / `optionValue` — 2026-09-29

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/lib/spreadsheetOptions.ts`,
`packages/ui/components/QSpreadsheet.vue`

Demande : utiliser directement des objets d'API (`{ _id, name }`, `{ _id, name, value }`) en
options d'une colonne `select` / `multiselect`, sans mapping manuel.

- **API** : `QSpreadsheetColumn.optionLabel?` / `optionValue?: QSpreadsheetOptionAccessor`
  (`string | ((opt) => any)`) — vocabulaire **identique à `<q-select>`**. Défauts `"label"` /
  `"value"` → une colonne déjà écrite `{ value, label, color? }` n'est **pas** modifiée
  (rétro-compatible). `QSpreadsheetColumn.options` passe à `any[]` (n'importe quelle forme — un
  `interface` utilisateur n'est pas assignable à `Record<string, any>`, d'où le `any[]`).
- **Normalisation unique** — le point de conception décisif : `lib/spreadsheetOptions.ts` (pur,
  testé) expose `normalizeCellOptions(options, optionLabel, optionValue)` → `{ value, label,
color? }[]` (garde `Array.isArray`, primitives acceptées, repli label → `String(value)`,
  `color` transmis tel quel). Le composant la met en cache **par nom de colonne** (`cellOptionsOf`,
  cache déclaré dans `<script setup>` donc **par instance** — jamais au niveau module, sinon
  collision entre deux grilles) et les 8 sites (`multiLabels`, `choiceText`, `startEdit`,
  `coerceValue` ×2, `selectOptions`, `badgeOf`, `multiBadges`) lisent la forme normalisée.
  ⚠️ **Ne pas appliquer les accesseurs site par site** : badge `_id` + tooltip « Ada » — le tri,
  le filtre, le CSV et les info-bulles passent tous par `choiceText`.
- **Qui lit quoi** (vérifié) : `label` → cellule, badge, tooltip, éditeur, **tri, filtre,
  copier/coller + CSV** (`choiceText`) ; `value` → `rows` / `toJSON()` uniquement. Stocker un
  `_id` n'apparaît donc **jamais** dans l'UI ni dans le CSV exporté.
- **Contraintes** : `optionValue` **primitive et unique** (comparaison `===`, sérialisation
  `toJSON`), `label` absent → repli `String(value)`, `color` décoré côté app (pas d'`optionColor` :
  la couleur est une décision de présentation). La saisie/collage matche le **label ou la valeur**
  → taper « Ada Lovelace » stocke `u_8f3a`. `canonicalColumns` (feuilles) préserve les accesseurs
  via `{ ...c }`.
- **Doc** : `4.components/spreadsheet.md` — sous-section « Options from an API — `option-label` /
  `option-value` » (tableau « qui lit quoi », les 3 règles, exemple), lignes `optionLabel` /
  `optionValue` ajoutées au tableau du schéma de colonne, renvoi depuis les types
  `select`/`multiselect` ; démo `rawOptions` (`DnaxDemoSpreadsheet.vue`, forme `{ _id, name, value }`).
- **Vérif** : `bun test lib` → **335 pass / 0 fail** (12 nouveaux) ; `cd docui && bun run build`
  → **EXIT 0** ; équilibre MDC 17/17 ; diagnostics propres (`QSpreadsheet.vue`, démo, lib) ;
  `grep col.options` → ne reste que le helper `cellOptionsOf`.

## QSpreadsheet : verrouillage de cellules (`cellReadonly` + `lockedRanges`) — 2026-09-29

tag: `decisions` — `namespace: dnax.ui` — `filename: packages/ui/components/QSpreadsheet.vue`,
`packages/ui/styles/main.css`

Demande : pouvoir verrouiller des cellules en lecture seule — **avec ou sans valeur**.

- **API** (du plus large au plus fin) : `readonly` / `disable` (grille) → `columns[].editable:
false` (colonne, préexistant) → **`columns[].cellReadonly(val, row, rowIndex): boolean`** (par
  cellule, reçoit la valeur **et** la ligne **et l'index de ligne** — 3ᵉ argument ajouté après
  retour utilisateur pour éviter d'avoir à compter des colonnes : `(_v, _r, i) => i === 0`.
  ⚠️ Signature à 3 arguments, contrairement à `cellClass` / `cellBackground` qui n'en ont que 2) →
  **`lockedRanges`** (verrous par coordonnées).
- **`lockedRanges` : forme LISIBLE, en noms de colonnes** (revu le 2026-09-29 après un retour
  utilisateur — la première version `{ r0, c0, r1, c1 }` était illisible) :
  `{ row: 2, column: "total" }` (une cellule) · `{ row: 0 }` (toute la ligne) ·
  `{ column: "total" }` (toute la colonne) · `{ from: {...}, to: {...} }` (un bloc, bornes
  incluses, dans n'importe quel ordre). Une **borne absente = non bornée** (ligne → toutes les
  colonnes), un **nom inconnu est ignoré** (une faute de frappe ne verrouille jamais tout).
  Traduction en rectangles d'index par `lib/spreadsheetZones.ts` (**pur, testé**) :
  `lockRect()` / `lockRects()` / `inLockRect()` — la forme `{r0,c0,r1,c1}` est **abandonnée**
  (jamais publiée). Le composant garde un `computed lockRectsResolved`.
  Le bloc est ce qui verrouille des cellules **encore vides** (en-tête, zone de totaux).
- **Une seule porte** : `isCellLocked(row, column)` centralise les 4 mécanismes (+ `col` absent →
  `false` pour ne pas changer le comportement des colonnes non déclarées). Branchée sur **tous**
  les points de mutation, y compris ceux **oubliés** au premier passage : `startEdit` (+ raccourci
  de frappe au clavier), `clearCell`, `toggleBoolean`, `clearSelection`, `pasteClip`,
  `fillDownKey`, `fillRightKey`, `applyFill` (drag-fill), `pasteValues`, `pasteTransposed`,
  `findReplaceCurrent`, `findReplaceAll`, `toggleMultiOption`, `fxCanEdit` (barre de formule) et
  la case à cocher `boolean` (`:disabled`).
- **Affordance** : classe `q-spreadsheet__cell--locked` → `cursor: default` + hachures
  diagonales **via `background-image` seulement** (la `background-color` du formatage conditionnel
  / `cellBackground` reste intacte). Le verrou **global** (`readonly` / `disable`) ne hache rien
  (tout hacher serait illisible) : il garde `--readonly`.
- **Non gated volontairement** : les opérations **structurelles** (ajout/suppression de lignes ou
  colonnes, tri, import, feuilles, undo/redo) restent régies par `readonly` / `disable` — ce ne
  sont pas des éditions de cellule.
- **Sélection et copie restent possibles** sur une cellule verrouillée (lecture seule ≠ désactivée).
- **Doc** : `4.components/spreadsheet.md` — section « Locking cells » (tableau des 4 mécanismes,
  **tableau « You write… / What it locks »** pour `lockedRanges`, exemples prédicat + coordonnées,
  avertissement « UI guard, pas data guard »), ligne `cellReadonly` ajoutée au tableau du schéma de
  colonne ; démo `locked` (`DnaxDemoSpreadsheet.vue`, `lockedRanges = [{ row: 0 }]`).
- **Vérif** : `bun test lib` → **345 pass / 0 fail** (10 nouveaux sur `spreadsheetLocks`) ;
  `cd docui && bun run build` → **EXIT 0** ; équilibre MDC 18/18 ; diagnostics propres ;
  `grep 'editable === false'` → ne reste que `isCellLocked`.

## QSpreadsheet : préremplissage de zones (`prefill`) — 2026-10-02

Demande : « on doit pouvoir remplir aussi prefill des ligne ou colonne ou cellule ».

- **`lib/spreadsheetLocks.ts` → `lib/spreadsheetZones.ts`** (+ `.test.ts`) : le module sert
  désormais les **deux** usages (verrou **et** remplissage), le nom « locks » ne disait plus
  tout. Imports réécrits dans `QSpreadsheet.vue`.
- **API `prefill` — miroir exact de `lockedRanges`** : même vocabulaire (noms de colonnes,
  jamais d'index), bornes **incluses**, `{ row }` / `{ column }` / `{ row, column }` /
  `{ from, to }`, **plus** le contenu à écrire : `value` **et/ou** `fx`.
  `interface QSpreadsheetFill extends QSpreadsheetLock { value?: any | ((ctx) => any); fx?: QSpreadsheetFillFormula }`.
- **`value` = constante OU fonction `(ctx) => any`** (ajouté le 2026-10-02 après demande
  utilisateur : « on peut aussi appliquer des formules, par ex. toute la somme de la colonne
  effectif »). Contexte `QSpreadsheetFillContext` : `rowIndex`, `row` (réf. live), `column`,
  `columnIndex`, `letter` (A1), `rowCount` (taille du document au fill), `letterOf(name)`.
  ⚠️ Le moteur de formules n'accepte **pas** les colonnes entières `C:C` (`parseRefOnly` exige
  des chiffres) ni `=SUM(C2:C)` : la plage doit être computed via `rowCount`, ou large et
  « sûre » (`=SUM(C2:C1000)` — `SUM` ignore les vides).
- **`fx` = formule, PRIORITAIRE sur `value`** (ajouté le 2026-10-02 — « on peut laisser value
  et avoir fx qui applique/affiche sa dans la valeur de la cellule, le prefill fx est
  prioritaire ») : `QSpreadsheetFillFormula = string | ((ctx) => string)`. Une chaîne sans `=`
  initial est **normalisée** en `"=" + s` (`normalizeFormula` interne) → `fx: "SUM(B1:B2)"`
  suffit. Un `fx` vide (ou blanc) ou non-chaîne **retombe** sur `value` ; ni `fx` ni `value` →
  rien n'est posé. `prefill.ts` : `fillFormula(fill, ctx)` isole cette priorité.
- **Formule aussi possible **directement dans `value`** (retenu le 2026-10-02 — « on laisse fx,
  on peut appliquer la formule directement dans value ») : `value: "=SUM(B1:B2)"` ou une
  `value` fonction renvoyant une chaîne `"=…"` → écrite telle quelle, évaluée par le tableur.
  **Pas de normalisation du préfixe dans `value`** (contrairement à `fx`) : `value` peut être du
  texte littéral (`"SUM(B1:B2)"` reste du texte), le `=` y est **exigé** pour une formule.
- **Fonction pure `prefillForRow(fills, rowIndex, columnNames, env?) → Record<string, any>`** :
  chaque zone qui couvre la ligne fournit son contenu (`fx` sinon `value` ; l'un ou l'autre peut
  être une fonction appelée avec le contexte) ; le **dernier** gagne ; nom inconnu **ignoré** ;
  `{}` si rien à poser (testable hors navigateur). `env` = `{ row?, rowCount? }` fourni par le
  composant (`blankRow` : `rowCount = state.length + 1` ; `applyPrefill` : `rowCount = state.length`).
  `colLetter` vient de `lib/spreadsheet.ts` (import direct, pur, pas de cycle).
- **Deux applications** (révisé le 2026-10-02 — « il faut faire applyPrefill d'abord, est-ce
  qu'il y a moyen de apply de manière auto » → **l'auto est désormais le défaut**) :
  1. **Automatique** : `autoPrefill()` (prop **`autoPrefill`**, défaut `true` via
     `props.autoPrefill !== false`) est appelée **au montage** (dans `onMounted`, AVANT
     `trackReady = true; acceptChanges()` → les défauts ne comptent **pas** comme
     « modifié »), puis à chaque remplacement externe de `rows` / `columns`. Elle est
     **silencieuse** (`runPrefill(false)` → pas de `pushHistory`). Un `watch` sur `prefill`
     a été **écarté** (un tableau inline déclencherait à chaque rendu).
  2. **Ligne neuve** : `blankRow(at)` pose le préremplissage à la **naissance** (bouton « + »,
     insertion). `at` = index d'insertion → **les 2 appels** (`addRow`, `insertRowAt`) passent
     l'index, sinon le fill vise la mauvaise ligne.
  - **`applyPrefill()`** (méthode **exposée**) = appel **explicite** → `runPrefill(true)`
    (avec historique). Elle ne remplit que les cellules **vides** et **renvoie le nombre**
    rempli. Elle **n'écrase jamais** une valeur non vide (garde `isBlankValue`).
  - `runPrefill` / `applyPrefill` / `autoPrefill` sont des **fonctions déclarées** (hoistées) :
    les `watch` immédiats les référencent, et `autoPrefill` sort tôt tant que `prefillReady`
    (drapeau `let`, déclaré avant les watch) est `false` → aucun accès à `pushHistory` en TDZ.
- **Événement dédié `prefill`** (ajouté le 2026-10-02) : `emit("prefill", { count, mode })`
  juste après `update:rows` dans `runPrefill`, **seulement si `count > 0`** ; `mode` =
  `"auto"` (passe de chargement) | `"manual"` (`applyPrefill()`). Les **nouvelles lignes**
  préremplies ne l'émettent pas (elles sont déjà signalées par `structure-change`).
  `runPrefill(history)` est devenu `runPrefill(mode)` (l'historique se déduit de `mode`).
- **Gating** : `runPrefill` bloque sur `disable` (composant inactif) mais pas sur `readonly`
  (appel explicite du développeur). `autoPrefill` bloque en plus sur `props.autoPrefill === false`
  et sur `!prefillReady` (avant montage).
- **Doc** : section « Prefilling cells » (`4.components/spreadsheet.md`, après « Locking
  cells ») — tableau « You write… / What it fills », les 2 modes (auto par défaut +
  ligne neuve ; `applyPrefill()` explicite = avec undo), `:auto-prefill="false"`, la règle
  « jamais d'écrasement », **callout ⚠️ « Prefilling writes to `rows` »** (l'auto émet
  `update:rows` → utiliser `v-model:rows` ou écouter `@update:rows`, sinon la grille affiche
  les défauts mais **le tableau du parent garde les cellules vides** — comme toute édition non
  écoutée), **callout ℹ️ `@prefill`** (`{ count, mode }`), **sous-section « Values, formulas
  (`fx`) & dynamic values »** (tableau `value`/`fx` + priorité, tableau du contexte `ctx`,
  exemple somme de colonne, formule par ligne, notes « `value: "=…"` marche aussi » et
  « formules non live-update ») ; **section Events** mise à jour ; démos `prefill` (affiche
  `@prefill`) et `prefillFormula` **sans bouton** (l'auto se voit au chargement),
  (`DnaxDemoSpreadsheet.vue`).
- **Vérif** : `bun test lib` → **360 pass / 0 fail** ;
  `cd docui && bun run build` → **EXIT 0** ; équilibre MDC 20/20 ; diagnostics propres.

## QSpreadsheet : limites de lignes (`minRows` / `maxRows`) — 2026-10-02

Demande : « on doit pouvoir figer le nombre de lignes d'une sheet (ex. 1 ligne), après ça on ne
peut plus ajouter ».

- **Nouveau module pur `lib/spreadsheetRows.ts`** (+ `.test.ts`, 7 tests) : `rowRoom(current, max)`,
  `canAddRows(current, count, max)`, `removalsAllowed(current, min)`,
  `canRemoveRows(current, count, min)`, `clampRows(rows, max)` (renvoie la **même** référence si
  rien à couper). `max`/`min` non fournis ou non finis (`Infinity`/`NaN`) = **pas de limite**.
- **Props** `maxRows` / `minRows` (aucune limite par défaut). `maxRows` seul = plafond ; avec
  `minRows` à la **même** valeur = **figé**.
- **Périmètre = opérations UTILISATEUR** (même ligne que `readonly` / `disable`) :
  - `addRow` et `insertRowAt` → **early return** si `!canAddRow.value` ;
  - `removeSelectedRows` → **refus** (pas de suppression partielle) si
    `!canRemoveRows(state.length, indexes.size, props.minRows)` ; `pushHistory()` /
    `purgeMergesAndRules()` déplacés **après** les gardes ;
  - `importCsv` → `data = clampRows(data, props.maxRows)` (jamais au-dessus du plafond) ;
  - `loadDocument()` (programmatique) → **non borné**.
- **Déjà bornés par construction** (donc rien à faire) : `applyFill` (drag-fill) et les collages
  (`pasteClip` / `pasteValues` / `pasteTransposed`) — ils `continue`/`return` hors grille, ils
  **ne grandissent jamais** les lignes.
- **UI** : `computed canAddRow` / `canRemoveRow` ; désactivent le « + » et la corbeille de la
  **toolbar** et les items « Insérer une ligne au-dessus/en dessous » / « Supprimer les lignes »
  du **menu contextuel**.
- **Doc** : nouvelle section « Row limits (`maxRows` / `minRows`) »
  (`4.components/spreadsheet.md`, avant « Events ») + démo `rowLimit` (feuille figée à 1 ligne)
  dans `DnaxDemoSpreadsheet.vue`.
- **Vérif** : `bun test lib` → **367 pass / 0 fail** ;
  `cd docui && bun run build` → **EXIT 0** ; équilibre MDC 21/21 ; diagnostics propres.
