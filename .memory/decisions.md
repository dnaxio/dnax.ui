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

`filename: packages/ui/components/{QBtnActions,QSelect,QAutocomplete,QDatePicker,QCountryPicker,QNavMenu,QFab,QSwipeCell,QSpreadsheet,QTiptap}.vue`

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
suggestions) et `QTiptap` (palette de couleurs).

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
