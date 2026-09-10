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
