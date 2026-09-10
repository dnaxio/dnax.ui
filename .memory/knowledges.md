# Connaissances & bonnes pratiques (tag: knowledges)

## ddocs (Docus/MDC) — contrat de conversion et outillage — 2026-09-10

Toute la doc vit désormais dans `ddocs/` (Docus = Nuxt Content + MDC). Avant de
modifier ou d'ajouter une page, lire le contrat **`ddocs/CONVERSION.md`** (squelette
de page, `::code-preview`, composant démo par page, pièges). Points clés :

- Ajouter une page = un `.md` dans `ddocs/content/docs/<section>/` (préfixe numérique
  = ordre du menu, retiré de l'URL). Pas de `h1` : le titre vient du frontmatter.
- API : `:dnax-api{name="QXxx"}` (inline MDC). Démos live : `::dnax-demo` →
  onglets **Preview / Code** (Preview par défaut), slot défaut live + `#code` =
  snippet exact du source.
- **Ne jamais auto-fermer une balise de composant en MDC** (parse5 l'ignore) :
  inline `:component{…}` ou fermeture explicite. Fixer un lot :
  `bun run fix:mdc` (dans `ddocs/`), puis `bun run validate`.
- Les démos avec état vivent dans `ddocs/app/components/demos/DnaxDemo<Page>.vue`
  (une par page, prop `demo`), styles de page en `<style scoped>`.
- Après ajout/suppression de page : `bun run gen:llms` (met à jour
  `ddocs/public/llms.txt`).
- Vérifier : `bun run build` dans `ddocs/` — 0 erreur `[500] Server Error` et toutes
  les routes prérendues attendues.

## Pages docs — ordre des blocs SFC : template en haut, script en bas — 2026-09-09

Dans les pages docs (`docs/app/pages/docs/**/*.vue`), l'ordre des blocs SFC est :
`<template>` en haut, `<script setup lang="ts">` ensuite, `<style scoped>` en bas.
L'ordre des blocs n'a aucune incidence sur la compilation, mais la lecture suit le
rendu : la structure visible d'abord, la logique ensuite, les styles enfin.

- À appliquer aux pages nouvelles et modifiées (ex. `btn-actions.vue` réordonné).
- Les pages existantes encore en script d'abord sont migrées au fil des éditions.
- Portée : pages DOCS uniquement — les composants de `packages/ui/components/`
  gardent leur convention actuelle (logique/script en tête, template ensuite).

## Positionner un panneau fixe autour d'un déclencheur : point d'ancrage + translate % — 2026-09-09

Pour ouvrir un popup téléporté en `position: fixed` de chaque côté d'un bouton
(QBtnActions/QBtnDropdown, placement `position`), pas besoin de mesurer le panneau :

- Choisir un POINT D'ANCRAGE sur le déclencheur (top/left fixed), éloigné du bord
  principal par `offset` ;
- aligner le panneau via `transform: translate(tx, ty)` où chaque axe vaut `0`
  (bord start), `-100%` (bord end — les % portent sur la taille du panneau) ou
  `-50%` (centre).
- Ex. bottom-end : `top = rect.bottom + offset`, `left = rect.right`,
  `translate(-100%, 0)` ; top centré : `top = rect.top - offset`, `left = midX`,
  `translate(-50%, -100%)`.
- Compatible avec une transition d'ouverture qui n'anime QUE l'opacity (fade) —
  jamais de conflit de transform ; centrer/fixer sans layout shift.

## Réafficher les vnodes d'un slot en template : helper RenderNodes — 2026-09-09

Intercaler des éléments entre les vnodes d'un slot (ex. séparateurs d'un
QBreadcrumbs entre chaque `q-breadcrumbs-el`) est impossible en `<template>` pur :
Vue ne permet pas de rendre une vnode brute avec `<component :is>` ni de boucler le
résultat de `useSlots().default()` en la ré-enveloppant.

- `defineRender` (macro Vue ≥ 3.4, rendu par fonction dans `<script setup>`) :
  **non typée dans ce toolchain** — vtsls remonte « Cannot find name 'defineRender' »
  même sans import (diagnostic bloquant). Écartée.
- Solution validée (QBreadcrumbs) : helper interne `components/internal/RenderNodes.vue`
  (non auto-importé, non exporté) dont la fonction de rendu re-affiche des vnodes
  bruts passés en prop `nodes` (`type: [Object, Array] as PropType<VNode | VNode[]>`).
- Appelant : calculer les rangées (crumb + isLast) dans une **fonction appelée par le
  template** (`v-for="row in rows()"`) — PAS dans un `computed` : les slots ne sont
  pas réactifs, un computed ne se recalculerait pas quand le parent re-route du contenu.
  Une seule invocation de `slots.default()` par rendu.
- Filtrer `vnode.type` contre `Comment`/`Text` importés de "vue" pour ignorer les
  commentaires (v-if) et nœuds texte blancs du slot.

## QBoard — dashboard tuiles (Power BI-like) — 2026-09-07

`packages/ui/components/QBoard.vue` : `<q-board v-model:items="tiles" :columns="12">`
wrapper par-dessus **QInteract** (drag/resize à l'intérieur).

- Items en unités GRILLE : { id, column, row, spanColumns, spanRows, … } ;
  grille de fond `.q-board__grid` (lignes + labels optionnels `showLabels`),
  cellule adaptative (ResizeObserver → width/columns), rangées = `rowHeight`
- Conversion tuiles↔px interne (`buildPx` stable pour ne pas casser le drag
  de QInteract pendant un déplacement), reconversion tuiles à drag-end/resize-end
  (round + clamp), events `drag-end`/`resize-end` relayés en tuiles
- API : addItem/removeItem/clear/layout/getItems ; `rows` auto depuis les tuiles
  ou props rows/height ; slots #item/#handle/#empty forwardés
- Naming : QInteract = conteneur générique ; QBoard = dashboard (alias possible)

## QSpreadsheet — tableur type Excel — 2026-09-07

`packages/ui/components/QSpreadsheet.vue` : `<q-spreadsheet v-model:rows="rows"
:columns="cols" />` — grille éditable type Excel.

- **API** : rows (objets par column.name) + columns `{ name, label, width,
minWidth/maxWidth, type: text|number|integer|boolean|date|datetime|select,
editable, options
[{value,label,color}], chip (badge coloré), format, cellClass,
cellBackground, align, headerClass/Style }` ; `v-model:selected`
  (QSpreadsheetSelection {row,column,endRow,endColumn}) ; `defaultColWidth`,
  `rowHeight`, `height`, `showToolbar/showRowNumbers/showColumnHeaders`,
  `showFormulaBar` (barre fx),
  `dense/flat/bordered/dark/readonly/disable/radius`
- **Emits** : update:rows/columns/selected + selection-change, cell-click,
  cell-change (old/new), cell-edit-start/end, structure-change ({rows,columns,
  reason: add/remove-row|column, sort, undo, redo})
- **Interaction** : sélection cellule/plage (clic, shift+clic, drag via
  pointerdown+pointerenter, isPointerDown global), clavier (flèches, Tab,
  Entrée/F2 édition, Delete/Backspace efface, Ctrl+C/V copier-coller TSV,
  Ctrl+Z/Y undo-redo via snapshots rows+cols, Ctrl+A tout sélectionner,
  frappe directe remplace — type-to-replace)
- **Édition** : overlay positionné sur la cellule (getBoundingClientRect du td
  vs conteneur scroll, refocus + select) ; coerceValue par type (nombre→Number,
  select→value par label, vide→null) ; booléens = case à cocher (pas d'éditeur) ;
  select = input + popup d'options filtrables (arrow/Enter/type)
- **Éditeur natif selon type (2026-09-07)** : number → input type=number
  step="any" (décimales), integer → type=number step="1" coerce Math.trunc,
  date → input type=date, datetime → input type=datetime-local, text → text ;
  alignement droite pour number/integer (classe --number) ; tri : number et
  integer comparés numériquement, date/datetime en ISO (lexicographique =
  chronologique) ; format ne change que l'affichage (le draft édite la valeur
  brute)
- **Formules A1 (2026-09-07)** : toute valeur qui commence par "=" est une
  formule — réutilise le moteur `lib/formula.ts` (QDataGrid) : `=B1*C1`,
  `=SUM(D1:D4)`, `$D$5` absolu, fonctions IF/SUM/ROUND… Évaluation
  **mémorisée** dans un computed (memo + visiting → `#CYCLE!`, hors grille →
  `#REF!`), recalculée à chaque pushRows ; l'affichage montre la VALEUR
  (cellText→eval puis format), le raw reste "=…" dans la ligne (tooltip =
  source) ; erreurs rendues en rouge (`.q-spreadsheet__cell--error`)
- **Éditeur formule** : draft qui commence par "=" → textarea monospace
  auto-extensible (positionEditor élargit ≈7.6px/car, max 480, clampé au
  conteneur) ; Shift+Enter = retour ligne, Enter = commit + descend
- **Barre fx (2026-09-07)** : prop `showFormulaBar`, div entre toolbar et
  grille (ref lettre+n° + input texte) ; draft synchro sur sel/state
  (`watch([sel,state], syncFx)`), commitFx → coerceValue (formules passent
  brutes), Enter = commit+descend, Esc = restaure, blur = commit ; désactivée
  pour booléen/select (fxCanEdit)
- **coerceValue** : `=` prioritaire → conserve la formule brute (sauf
  booléen/select) même en colonne number/integer/date ; tri et copier/coller
  utilisent les valeurs ÉVALUÉES (copie = valeur affichée, façon Excel)
- **Autofill / recopie (2026-09-07)** : poignée 8px en bas-droite de la
  sélection (`.q-spreadsheet__fill`, positionnée comme l'éditeur via rect du td
  ancré + scrollLeft/Top) ; drag → fillTarget (prévisualisation
  `.q-spreadsheet__cell--fill`). Motif : source = bloc cyclique modulo ;
  SÉRIES si 2 graines numériques (step) ou dates ISO (step jours) vers le bas/
  droite uniquement ; formules recopiées avec décalage des références A1
  relatives (`shiftFormulaRefs`, `$` préservé, plages incluses). Historique
  push une seule fois ; la zone remplie devient la sélection
- **Freeze panes (2026-09-07)** : props `frozenRows`/`frozenCols` ; sticky par
  cellules (`td/th` position:sticky + left/top cumulés inline ; offsets :
  gutter 34 + somme colWNum / head 28 + somme rowH). ⚠ les cellules gelées
  doivent avoir un fond OPAQUE (`--q-spreadsheet-bg` inline) sinon le contenu
  scrollé transparaît ; ne PAS mettre `position: relative` sur `.rownum`
  (écrase le sticky)
- **Filtres colonne (2026-09-07)** : entonnoir `.q-spreadsheet__fbtn` dans
  chaque en-tête → popup téléportée (recherche, valeurs uniques avec comptes,
  vides = token `__q_spreadsheet_blank__`, select affiché par label) ;
  `filters: Record<colName, string[]|null>`. Rendering : `visibleRows`
  (indices réels — les numéros gardent des trous), clavier saute les lignes
  masquées, édition/undo inchangés
- **Clic droit + insertion (2026-09-07)** : menu contextuel téléporté
  (`.q-spreadsheet__ctx`) sur cellule/ligne/colonne (sélection pré-posée par
  selectRow/selectCol) : cut/copy/paste, insertRowAt(above/below),
  insertColumnAt(left/right), suppressions, tri, gras/italique, couleurs
  fond/texte (swatches), clear formatting. Fermeture : pointerdown doc
  (`closest('.q-spreadsheet__ctx')`)
- **Formatage cellule (2026-09-07)** : `cellFmt: Record<"r:name", {bold,
italic, bg, color}>` INTERNE (non sérialisé dans rows) + undo via snapshot
  étendu (rows, cols, formats, rowHeights). Priorité fond : fmt.bg >
  sélection > col.cellBackground > gel → `--q-spreadsheet-bg`
- **Resize lignes (2026-09-07)** : `rowHeights` keyé par index + handle bas du
  numéro ; les clés indexées (formats, hauteurs) sont ré-indexées sur
  insert/suppression (`shiftRowKeys`, `dropRowRangeKeys`) ; suppression de
  colonne purge aussi filters/colWidths/cellFmt (`dropColumnKeys`)
- **Démos docs visibles sans interaction (2026-09-07)** : pré-appliquer l'état
  via les méthodes exposées dans `onMounted` de la page docs — ex.
  `filterDemo.setFilterOnly('dept',['it'])` (filtre visible d'emblée),
  `opsDemo.select(...)` + `setBgColorSelection(...)` (formatage pré-appliqué)
  — pour les features interactives (clic droit, autofill, gel, filtre)
- **Clavier Excel (2026-09-07)** : Home/End (début/fin de ligne), Ctrl+Home/End
  (A1 / dernière cellule utilisée), PageUp/PageDown (viewport), Ctrl+flèches
  (saut aux bords du bloc de données contigu — les lignes filtrées sont
  sautées), Ctrl+D / Ctrl+R (recopie la ligne du dessus / colonne de gauche
  dans la sélection), double-clic sur la poignée = fill jusqu'à la fin des
  données voisines (fillHandleDbl)
- **Formules étendues (2026-09-07)** dans `lib/formula.ts` : IFS / SWITCH /
  IFNA / VLOOKUP évalués paresseusement dans `evalCall` (VLOOKUP exploite la
  géométrie A1 des plages : 1re colonne = clé, col_index 1-based, sinon
  #N/A) ; texte LEFT/RIGHT/MID/FIND/SUBSTITUTE(n-ième)/REPLACE/CONCATENATE ;
  dates ISO TODAY/NOW/DATE/EDATE/YEAR/MONTH/DAY (DATE = getUTC\* pour éviter le
  décalage de fuseau) ; RAND
- **Autocomplétion fonctions (2026-09-07)** : liste FORMULA_FNS (50+ entrées
  name/sig) affichée dès qu'on tape après "=" (trailing letters de
  fxSource=draft ou fxDraft) dans l'éditeur formule (sous le textarea) ET dans
  la barre fx (Teleport positionné sous l'input, fxPopStyle via rect) ;
  Tab accepte (remplace la fin par NOM(), ↑/↓ naviguent, Esc ferme, clic
  accepte via acceptFxAt)
- **Virtualisation (2026-09-07)** : prop `virtualScroll` (défaut true), actif
  si visibleRows > 150 ET frozenRows == 0. Rendu slice + rangées d'espacement
  (`.q-spreadsheet__vpad`), positions cumulées par computed `visInfo` (headH +
  rowH), binaire search sur scroll (updateRange dans onViewportScroll/
  resize/mount/watch visibleRows+rowHeights) ; ensureRowVisible dans select
  (scrollTop = top - headH - overscan) pour garder la cellule cible rendue ;
  focusCell/éditeur requièrent que la cellule soit dans la fenêtre rendue
- **Mise en page / CF / validation (2026-09-07)** : CellFormat.wrap (wrap +
  hauteur auto via rowDisplayH/rowContentHeight, span `.cell-text--wrap`) ;
  fusions `merges[]` (seul le top-left est rendu rowspan/colspan, clic ailleurs
  → owner, purge sur ops structurelles, virtualisation coupée si merges) ;
  masquage hiddenRows/hiddenCols (intégré à visibleRows + nav clavier, classes
  `--hide`) ; conditional rules condRules[] (gt/gte/lt/lte/eq/contains/blank/
  notblank + bg/bold, priorité format manuel > règle > sélection) ; validation
  colonne col.validation {min,max,integer,pattern,message} refusée à la saisie
  (validateAndSet), erreurs valErrors → `--invalid` + title ⚠
- **Multi-feuilles (2026-09-07)** : prop `sheets` (v-model:sheets, records
  {key,name,columns?,rows?}) — onglets (clic switch, double-clic rename,
  +/× add/remove). Moteur = références actuelles (state/cols/…) + registry
  `sheetMeta: Record<key,{cols,widths,filters,formats,rowHeights}>` ;
  `persistCurrent()` écrit le record courant, `loadSheetIntoEngine` charge
  (largeurs gravées dans col.width sinon le watcher cols les écrase) ;
  l'undo est vidé à chaque switch ; watcher [state,cols] synchronise le record
  et émet `update:sheets` avec la MÊME référence (évite la boucle du watcher
  props par comparaison d'identité)
- **Sérialisation / export (2026-09-07)** : `buildDocument()/toJSON()`
  (version 1, active + sheets avec rows/columns/formats/widths/rowHeights/
  filters), `loadDocument(json|object)` (reconstruit meta + onglets),
  `exportJson()` télécharge le classeur, `exportCsv(opts)`/`getCsv(opts)`
  exporte la feuille ACTIVE (headers optionnels, valeurs affichées, BOM UTF-8,
  quote si delim/quote/newline) ; méthodes exposées via defineExpose
- **Find & Replace + import/clipboard (2026-09-07)** : barre inline
  `q-spreadsheet__find` (Ctrl+F ou loupe) — occurrences dans les lignes
  VISIBLES (filtres respectés), valeurs affichées (labels select), next/prev,
  replace un/tout (regex échappée, insensible à la casse sauf flag) ; classes
  `--find` / `--find-cur`. Méthodes exposées : `importCsv(text,{delimiter,
headers})` (remplace la feuille active, colonnes = 1re ligne si headers,
  vides→null), `copyFormulas()` (sources brutes), `pasteTransposed()`
  (lignes↔colonnes)
- **Tests unitaires (2026-09-07)** : `bun test` (racine `bun test
packages/ui/lib`) — `formula.test.ts` (~25 cas : opérateurs, A1/abs/plages,
  erreurs, SUM/…, IF/IFS/SWITCH/IFERROR/VLOOKUP, texte, dates, math) et
  `spreadsheet.test.ts` (colLetter/colFromLetters, shiftFormulaRefs,
  csvEscape/csvSplitLine/parseCsv, deriveCols, isoAddDays) ; logique pure
  extraite du SFC vers `lib/spreadsheet.ts` (aucune dépendance DOM/Vue).
  ⚠ littéraux TRUE/FALSE non supportés par le moteur → utiliser 1/0 dans les
  tests ; parseCsv ignore la ligne finale vide (flag sawDelim)
- **Barre d'état + zoom + autofill complet (2026-09-07)** : barre basse
  `.q-spreadsheet__status` (cellule active, dims sélection, Σ/x̄/n des valeurs
  numériques sélectionnées via evalAt, chips « rows shown » quand filtre/
  masquage, nb de feuilles, contrôles zoom −/%/+/reset). Zoom = prop CSS
  `zoom` sur la `<table>` (zoomLevel 0.5–2, exposé zoomIn/Out/resetZoom/
  getZoom). Autofill : fill copie dans les 4 directions (haut/gauche déjà
  pattern), **Ctrl/meta pendant le drag = copie forcée sans série**
  (`fillCopy`, lu dans pointermove) ; `fillFormatsDown()` duplique le format
  de la 1re ligne sur la sélection
- **Scroll virtuel fluide (2026-09-07)** : `scroll-behavior: smooth` sur
  `.q-spreadsheet__viewport` (animé pour les scrolls programmatiques —
  flèches/clavier hors fenêtre, Home/End, page — pas le scroll souris qui
  reste natif) ; `prefers-reduced-motion: reduce` → auto. `ensureRowVisible`
  pose un `pendingFocus` (ligne+colonne) et le focus est différé dans
  `updateRange` (nextTick flushPendingFocus) quand la ligne entre dans la
  fenêtre virtuelle — éviter de focuser un td pas encore rendu
- **Types élargis + doc data model (2026-09-07)** : union
  QSpreadsheetCellType += string (alias text), email, url — éditeurs natifs
  (input type email/url) ; coerce/stockage = texte ; page docs : démo Cell
  types avec colonnes Email/Website + dans « QSpreadsheet API », sous-sections
  Rows (type → valeur stockée), Columns (schéma complet), Selection/Validation/
  Sheets — pour montrer la structure des données
- **i18n en/fr (2026-09-07)** : prop `lang` ("en" défaut | "fr") + dictionnaire
  `I18N` + helpers `t(key)` / `fmt(key,{…})` / `sheetName(n)` — libellés des
  menus contextuels, barres Find/CF, popup filtre, barre d'état, messages
  vides, placeholders fx, noms de feuilles par défaut. ⚠ tooltips/aria des
  icônes toolbar restent EN (étendre I18N si besoin)
- **Lang global QConfigProvider (2026-09-07)** : prop `lang="fr"|"en"`
  fusionnée dans `QTheme.lang` + `QConfigContext.lang` (provide)
  (`config.ts`), priorité prop > theme.lang > parent > "en". Helper
  `useConfigLang()` (`useComponentProps.ts`) pour tout composant.
  QSpreadsheet : `lang` = prop ?? configLang. ⚠ ne pas fournir qConfigKey
  AVANT la déclaration de isDark/lang (TDZ)
- **Paste values / import fichier / undo élargi / sérialisation totale
  (2026-09-07)** : `pasteValues()` colle en TEXTE les "=" (préfixe apostrophe
  `'` masqué à l'affichage/édition — celluleText + startEdit strip) ;
  `importFile()` ouvre un sélecteur (CSV/TSV délimiteur auto, JSON →
  loadDocument) ; Snapshot étendu (widths, filters, hiddenRows/Cols, merges,
  rules) → undo des resize/lignes-hauteurs/masquage/merge/CF/filtres
  (pushHistory avant purge structurelle dans les 4 ops) ; `toJSON()`/feuilles
  incluent désormais merges + hiddenRows/hiddenCols (SheetExtras étendu)
- **Features 2/3/4/6 (2026-09-07)** : formules += XLOOKUP (géométrie retour),
  WEEKDAY (types 1-3), EOMONTH, DATEDIF (D/M/Y/MD/YD), TEXT (tokens YYYY MM
  DD HH mm hh ss + 0.00/0%) — natif, PAS de Moment (pur, ISO, pas de dep). CF :
  mode fill/bar (gradient % colNumericRange)/scale (lerp hex), kind "always";
  validation étendue : col.validation {required, list} + prop `validators`
  (plages {r0,c0,r1,c1,validation}) via guardValidation(row,…) — pas d'ArkType
  (schémas optionnels en lazy plus tard si demandé). Drag & drop réordonne
  lignes (state) & colonnes (ordre cols) via pointerdown header + drop preview
- **ArkType validation optionnelle (2026-09-07)** : dep `arktype` ajoutée ;
  `validation.schema` (string ArkType) sur colonne/plages — lazy dynamic
  import (promesse cachée), v2 renvoie un TABLEAU de problèmes directement
  (`type(s)(v) => []` si ok, message via [0]); validateAndSet est async et
  attendu dans commitEdit/commitFx
- **QInteract — dashboard drag & resize (2026-09-07)** : conteneur de
  widgets ; items {id,x,y,w,h,…}, v-model:items + v-model:selected ; drag
  (tout l'élément ou poignée si `handle`), resize poignée bas-droite, snap
  (`snap`), clamps conteneur (padding/minW/H), bringToFront ; events
  drag/resize start-move-end + select ; méthodes addItem/removeItem/clear/
  getItem/toGrid(columns)/realPos ; slot #item (+#handle/#empty) ; CSS grille
  `.q-interact--grid`. Nom : QInteract générique — QBoard envisageable comme
  alias si usage dashboard only
- **Sélecteur : badges colorés\*\*** — `type:"select" + chip:true` rend chaque
  valeur en badge avec sa couleur d'option (token via colorValue/foregroundFor,
  hex libre) ; le rendu est `chipFor`→style inline `backgroundColor/color`
- \*\*Drag : col headers (lettres A..Z) cliquables = sélection colonne, numéros
  de ligne = sélection ligne, corner = tout sélectionner ; resize colonne par
  drag (colWidths interne, min 60/max 600, réinitialisé à chaque changement de
  columns)
- **SSR-safe** : aucune création dans setup ; tout est refs/computed/watch
- Styles dans main.css : section `QSpreadsheet` (`.q-spreadsheet`, toolbar,
  table sticky corner/colhead/rownum, cellules --in-range/--active (outline
  primary 2px), checkbox, badge, editor overlay + options list)
- Page docs custom `docs/components/spreadsheet.vue` (People badges, cell
  types, events, variants/readonly) — CUSTOM_PAGES ; menu « Spreadsheet »

## QBar — barre fine (type fenêtre/app) — 2026-09-05

`packages/ui/components/QBar.vue` : `<q-bar dense dark as="header">` —
barre compacte façon Quasar (contrôles fenêtre, menus, statut ; Electron
frameless, entêtes de dialogs desktop).

- Props : `dense` (compact), `dark` (fond sombre forcé), `as` (balise,
  défaut div), `role` (défaut "toolbar"), `label` (aria-label du toolbar)
- Rendu `role="toolbar"` + aria-label ; slot défaut ; `.q-bar__dot` helper
  (points macOS) dans main.css
- CSS : flex gap 10, min-height 40 (32 dense), padding 0 12 (10 dense),
  couleur/background via tokens + `.q-bar--dark` (fond #1d1d1d)
- Page docs custom `docs/components/bar.vue` (démos macOS, sombre/contrôles
  fenêtre, props/as) — dans CUSTOM_PAGES ; menu « Bar »

## QFab — fermeture au clic extérieur — 2026-09-05

`QFab.vue` : quand le FAB est ouvert (`modelValue`), un écouteur
`pointerdown` au niveau `document` ferme les actions si le clic tombe HORS du
composant (`rootEl.contains(target)`) — installé au montage, retiré au
unmount. Le clic sur le bouton principal (toggle) et les actions
(`QFabAction` → `fab.close()`) restent gérés (ils sont dans le root).

## v-touch-pan — pan Pointer Events façon Quasar — 2026-09-05

`packages/ui/lib/touchPan.ts` : directive « pan » (tirer un élément) —
équivalent Quasar v-touch-pan, sans dépendance (Pointer Events unifiés).

- Enregistrée par le module Nuxt (client) sous le nom `touch-pan` (même
  template `dnax-ui-directives.mjs` que v-close) ; export `vTouchPan` +
  types `PanDetails`/`TouchPanHandler` dans index.ts
- **Modifiers** : `horizontal | vertical | up | down | left | right` (filtres
  de direction — axe dominant au premier mouvement, seuil PAN_MIN 4px),
  `mouse` (inclut la souris — défaut tactile seul), `prevent` (bloque le
  scroll natif), `stop | capture | passive | mouseCapture`
- **Détails** Quasar : evt, position{top,left}, direction, delta{x,y} (depuis
  le dernier event), distance{x,y}, duration, speed{x,y} (px/s), isFirst,
  isFinal, isVertical/isHorizontal
- `touch-action` posé sur l'élément : none si .prevent ; pan-y si horizontal
  seul (scroll vertical natif conservé) ; pan-x si vertical seul ; sinon auto
- Piège : en pointer events, sans `touch-action` adapté le navigateur annule
  le geste (pointercancel) dès qu'il scrolle → mapping ci-dessus indispensable
- Page docs manuelle `/docs/directives/touch-pan` (démo pastille déplaçable +
  détails en direct), entrée DIRECTIVES de gen-menu « V Touch Pan »
- **v-touch-hold (2026-09-05)** : `lib/touchHold.ts` — appui long (Pointer
  Events). Défaut 600ms, sensibilité 5px tactile / 7px souris ; value
  acceptée : fn | nombre (ms) | `'400:8:10'` | `{ time, sensitivity,
mouseSensitivity }` ; modifiers mouse/capture/mouseCapture/stop/prevent/
  passive. `touch-action:none` + user-select none posés ; mouvement >
  sensibilité annule ; au déclenchement le geste est CONSOMMÉ (listeners
  window pointerup/touchend/click capture pour empêcher le clic après un
  hold). Enregistrée `touch-hold` dans module.ts ; page docs
  `/docs/directives/touch-hold` (démo 600ms + 350ms) ; entrée DIRECTIVES
  « V Touch Hold »
- **v-touch-swipe / v-touch-repeat (2026-09-05)** : `lib/touchSwipe.ts`
  (flick rapide relâché — ≥50px / ≤300ms par défaut, seuils configurables
  `{ distance, duration }`, filtres d'axe, `.mouse` ; détails evt, direction,
  distance{x,y}, duration, speed{x,y}) ; `lib/touchRepeat.ts` (handler répété
  tant que pressé — 1er appel après delay 600ms puis interval 150ms ; value
  nombre | 'd:interval' | { delay, interval } ; `.mouse`). Enregistrées
  `touch-swipe`/`touch-repeat` ; pages docs + entrées DIRECTIVES correspondantes.
- **v-intersection (2026-09-05)** : `lib/intersection.ts` — wrapper
  IntersectionObserver. value = fn | { handler, cfg } | false (off) ; modifier
  `.once` (stop après la 1ère entrée) ; POOL d'observateurs partagés par cfg
  identique (clé JSON root/rootMargin/threshold) — unobserve retire l'élément
  et disconnect quand le pool est vide. Enregistrée `intersection` ; page docs
  `/docs/directives/intersection` (démo cartes viewport + sentinel once).

## QEditorJs — éditeur par blocs Editor.js — 2026-09-05

`packages/ui/components/QEditorJs.vue` : `<q-editor-js v-model="data" />` —
éditeur par BLOCS Editor.js (https://editorjs.io/base-concepts/) — données
JSON `{ time?, blocks: [{ type, data }], version? }` (pas du HTML !).

- **Deps** : `@editorjs/editorjs` + tools header/paragraph/list/checklist/
  quote/code/delimiter (chargés dynamiquement à l'init via `import()` — SSR-safe,
  instance créée dans onMounted, destroy au unmount)
- **v-model** : `onChange → save() → emit update:modelValue` (JSON) ; watch
  externe → `render()` sauf si égal au dernier JSON émis (garde `lastJson` +
  flag `internal` → pas de boucle).
- ⚠ Editor.js v2 **injecte lui-même ses styles** à l'init (pas de
  `dist/style.css` dans le paquet npm — un import CSS plante Vite ; rien à
  importer). Les surcharges de thème vivent dans `styles/main.css`.
- Props : `data`, `placeholder`, `min-height`, `readonly`/`disable` (readOnly +
  pointer-events), `tools` (fusion d'extras) ; events `@ready` ; méthodes
  exposées `save()`, `clear()`, `getEditor()`
- CSS `main.css` : conteneur tokens (border/radius/card), focus-within primary,
  surcharges light/dark des classes Editor.js (.ce-paragraph, .ce-header,
  .cdx-list, .cdx-checklist, .ce-code\_\_textarea, .cdx-quote, toolbar/popovers)
- Page docs générée `/docs/components/editor-js` (menu « Editor.js »,
  TITLE_OVERRIDES gen-menu)

## QTiptap — éditeur riche Tiptap v3 — 2026-09-05

`packages/ui/components/QTiptap.vue` : `<q-tiptap v-model="html" />` basé sur
Tiptap v3 (déjà dans package.json : `@tiptap/vue-3`, `@tiptap/pm`,
`@tiptap/starter-kit` 3.31.3).

- **SSR-safe** : `new Editor()` créé dans `onMounted` uniquement (jamais en
  SSR), `destroy()` dans `onBeforeUnmount`
- **v-model** : `onUpdate → emit(getHTML())` ; le watch externe ne pousse le
  HTML que s'il diffère vraiment de `editor.getHTML()` via
  `setContent(html, { emitUpdate: false })` (v3 : options objet, plus de
  booléen) → pas de boucle ni de saut de curseur ; garde spéciale document
  vidé normalisé en `<p></p>`
- **`EditorContent` v3 ne propage PAS les attrs** (render = `h("div", {ref})`) →
  envelopper dans `.q-tiptap__editor` qui porte la classe + `min-height`
  inline ; chaîne `min-height: inherit` pour que `.ProseMirror` remplisse la
  zone (clic possible sur toute la hauteur)
- **Barre d'outils réactive** : compteur `tick` incrémenté sur
  `onTransaction`/`onSelectionUpdate`, lu dans un computed qui recrée les
  boutons (active/disabled) → pas besoin de rendre l'éditeur réactif
- `StarterKit.configure({ heading: { levels: [1,2,3] }, link: { openOnClick: false } })`
- Icônes toolbar ajoutées dans `lib/icons.ts` (bold, heading1-3, undo2…)
- **Couleur de texte (2026-09-05)** : extensions `TextStyle` + `Color` depuis
  `@tiptap/extension-text-style` (en v3, `@tiptap/extension-color` n'est qu'un
  alias de ré-export → ne pas installer le doublon). Bouton palette dans la
  toolbar (`kind: "color"` dans ToolSpec/ToolView) qui ouvre une **palette
  popover téléportée au body** (le conteneur `.q-tiptap` est overflow:hidden →
  un popover absolu serait clippé) : 14 swatches prédéfinis + swatch « No
  color » (fond blanc barré, `unsetColor`) + input natif « Custom… ».
  Pourquoi pas un simple input type=color : il ne permet PAS de désélectionner
  (pas de valeur « aucune »). `picked` ref : dernière couleur rappelée quand la
  selection n'a pas de couleur ; fermeture = clic extérieur / Échap / blur /
  resize ; position fixed recalculée sous le bouton au toggle.
- **Image par URL (2026-09-05)** : extension `@tiptap/extension-image` ajoutée
  aux deps ; bouton « Image URL » (icône image-plus, groupe blocks-list) →
  **dialog dnax.ui** (plus de prompt) : `<q-dialog>` embarqué (imports
  explicites QDialog/QDialogHeader/QDialogFooter/QBtn/QInput) avec champ URL +
  champ alt optionnel ; `setImage({ src, alt })` ou `updateAttributes` si une
  image est déjà sélectionnée (`isActive("image")` capturé à l'ouverture →
  remplace au lieu de dupliquer). CSS : `img { max-width:100%; … }` dans la
  typographie ProseMirror.
- **Lien par dialog aussi (2026-09-05)** : le lien (avant : `window.prompt`)
  utilise le même `<q-dialog>` (mode `link`, URL pré-remplie) →
  `setLink({ href })` ; bouton de soumission désactivé si URL vide. Bouton
  « Remove link » inchangé (`unsetLink`).
- **Alignement (2026-09-05)** : extension `@tiptap/extension-text-align`
  ajoutée, configurée `types: ["heading", "paragraph"]` +
  `alignments: ["left", "center", "right"]` ; nouveau groupe de toolbar
  « align » (icônes lucide align-left/center/right, ajoutées à lib/icons.ts) →
  `setTextAlign(align)`. L'état actif lit l'attribut `textAlign` du nœud
  courant (heading/paragraph) ; « left » est actif quand AUCUN attribut n'est
  posé (alignement implicite).
- **Task list avec q-checkbox (2026-09-05)** : extension officielle
  `@tiptap/extension-task-list` + `@tiptap/extension-task-item` (v3 :
  ré-exportées depuis `@tiptap/extension-list`). NodeView Vue custom :
  `packages/ui/components/internal/QTiptapTaskItemView.vue` (dans internal/
  → ignoré de l'auto-import Nuxt, des exports index.ts et du menu docs) qui
  rend `q-checkbox` dnax.ui. `lib/tiptap-task-list.ts` : `QTipTapTaskItem =
TaskItem.extend({ addNodeView: () =>
VueNodeViewRenderer(QTiptapTaskItemView) })` — schéma, keymap, input rules
  conservés. Toggle coché = transaction `setNodeMarkup(getPos(), …)` ; bouton
  toolbar « Task list » (toggleTaskList).
  ⚠ **NodeView Vue** : racine OBLIGATOIRE `<node-view-wrapper>` (sinon erreur
  « Please use the NodeViewWrapper component for your node view ») ; en v3 ce
  wrapper ne propage PAS les attrs → l'état `data-checked`/class cochée vit sur
  un div interne contenant `<node-view-content>` (contentDOM imbriquable). CSS :
  `ul[data-type="taskList"]` (nom camel du nœud) sans puces, li flex via
  `[data-node-view-wrapper]`, texte coché barré `--q-tiptap-muted`.
- **Mentions (2026-09-05)** : prop `mentions` ({ label, value }[]) branchée sur
  `@tiptap/extension-mention` (deps ajoutées : extension-mention +
  @tiptap/suggestion). Suggestion v3 : `char: "@"`, `items` (filtre
  label/value), `command` (`insertContentAt(range, [mention attrs {id,label},
espace])`), `render` → popup DOM stylé dnax.ui (`props.mount(el)` : la plugin
  ancre/repositionne via Floating UI et renvoie unmount pour onExit) ;
  navigation clavier Arrow/Enter/Tab dans `onKeyDown`, clic + hover. `allow`
  garde la popup inactive si mentions vide. Rendu du nœud = défaut officiel
  (span[data-type=mention], attrs id/label) stylé via CSS (puce primary +
  popup `.q-tiptap__mention-*`).
- **Bubble menu (2026-09-05)** : import `BubbleMenu` depuis
  `@tiptap/vue-3/menus` (v3 : pas d'extension à enregistrer, le composant
  crée la plugin et gère position/clavier). `:should-show` = sélection texte
  non vide + editable (exclut codeBlock/image) ; boutons gras/italique/
  souligné/barré/code, lien (dialog), retirer lien/couleur, nettoyage, +
  bouton couleur qui réutilise `togglePalette`/`paletteCurrent` (barre de
  couleur). `@mousedown.prevent` pour ne pas perdre la sélection ; états actifs
  état actifs recalculés via `tick`. CSS `.q-tiptap__bubble*` (chip bar, dark).
- **Drag handle (2026-09-05)** : composant `DragHandle` de
  `@tiptap/extension-drag-handle-vue-3` (enregistre la plugin automatiquement)
  - dep `@tiptap/extension-drag-handle`. Rendu quand editor éditable :
    poignée grip (icône gripVertical) au survol du bord gauche ; `nested`
    activé avec config CONSTANTE hors composant (`DRAG_HANDLE_NESTED`,
    threshold -16 → vise facilement les items imbriqués — objet inline
    réinitialiserait la plugin à chaque rendu) ; plugin-key dédié. Masqué en
    readonly/disable. CSS `.q-tiptap__drag-handle` (grab, hover primary).
- **Drag handle : espace icône ≥ 5% (2026-09-05)** : `margin-right: 5%` sur
  `.q-tiptap__drag-handle` → espace entre l'icône et l'élément dragué ≥ 5% de
  la largeur du conteneur (`.q-tiptap__body` est positionné → les % relatifs à
  l'éditeur). Si la zone du margin gêne la sélection en début de ligne, passer
  à une gouttière réservée dans le padding du contenu.
- **Table of contents (2026-09-05)** : extension `@tiptap/extension-table-of-contents`
  enregistrée (`onUpdate` → mapping des ancres en items sérialisables émis via
  l'événement `@update:toc` : id, textContent, level, originalLevel, itemIndex,
  pos, isActive, isScrolledOver) — la TOC n'est PAS un nœud éditable, c'est un
  plugin qui fournit les données à afficher côté app. Le rendu (liste cliquable
  scroll) est montré sur la page docs (`.demo-toc`, scroll via
  `[data-toc-id]`).
- **Scroll interne TOC (2026-09-05)** : méthodes exposées par QTiptap —
  `scrollToHeading(id)` (cherche `[data-toc-id]`/`[id]` dans `editor.view.dom`,
  repli via `view.nodeDOM(pos)` à partir de la TOC mémorisée, puis
  `scrollIntoView` smooth — fonctionne aussi dans un conteneur scrollable
  interne) et `getToc()` (copie des dernières ancres). La démo docs utilise
  `tocEditor.value?.scrollToHeading(id)` via un ref au lieu du
  `document.querySelector` global.
- **Sélecteur font-size (2026-09-05)** : `FontSize` exporté par
  `@tiptap/extension-text-style` (setFontSize/unsetFontSize, pas de paquet
  séparé). Groupe toolbar « font-size » (entre align et marks) rendu avec
  **`q-select` dnax.ui** (dense outlined, options Default + 12-40px, emit-value) ;
  valeur courante lue depuis `textStyle.fontSize` (parse px),
  `setFontSize("NNpx")`, option vide → `unsetFontSize`.
  ⚠ L'extension `FontSize` doit être ENREGISTRÉE (import { FontSize } depuis
  extension-text-style) — sans elle `setFontSize` n'existe pas et le run
  échoue en silence (bug 2026-09-05 : le sélecteur ne faisait rien).
- **Tableaux (2026-09-05)** : dep `@tiptap/extension-table` (v3 consolidé :
  exporte `TableKit` qui enregistre table/row/header/cell + toutes les
  commandes insertTable, add/delete Row/Column, mergeCells, splitCell,
  toggleHeaderRow/Column, deleteTable). Bouton toolbar « Table » (groupe
  `table`, icône lucide table) → popup `.q-tiptap__table-menu` (téléportée,
  même pattern que la palette) : hors table = « Insert table (3×3) » ; dans une
  table (détection ancêtre `$from.node(depth)` — isActive('table') est FAUX au
  curseur dans une cellule) = insertion lignes/colonnes, suppression, fusion/
  scission, header, suppression de la table. CSS table (bords, th, selectedCell,
  column-resize-handle, tableWrapper overflow-x). Le rendu vit dans le DOM
  ProseMirror (pas le composant data `QTable`, réservé aux données externes).
- **Table : NodeView Vue (2026-09-05)** : rendu du nœud « table » passé en
  Vue — `internal/QTiptapTableView.vue` (racine `<node-view-wrapper as="div">`
  - `<table>` + `<node-view-content as="tbody">`, contentDOM imbriqué) et
    `lib/tiptap-table.ts` (`QTipTapTable = Table.extend({ addNodeView: () =>
VueNodeViewRenderer(QTiptapTableView) })`, rows/header/cell officiels
    conservés — TableKit délaissé pour éviter le doublon « table »). Sélection de
    cellules/merge/clavier toujours gérés par PM (décorations dans le contentDOM) ;
    colgroup/redimensionnement natif non portés (largeurs via CSS).
  - **Toolbar : tableaux retirés (2026-09-05)** : bouton « Table » + popup
    d'actions retirés de la toolbar (groupe `table`, état + popup
    `.q-tiptap__table-menu` supprimés). Les extensions (`QTipTapTable` + rows/
    header/cell, NodeView Vue + resize colonnes) restent enregistrées : une
    table présente dans le HTML (`v-model`) ou collée reste rendue et éditable ;
    l'insertion se fait alors par contenu HTML ou commandes programmatiques.
  * **Padding configurable (2026-09-05)** : prop `padding` (valeur CSS,
    défaut `5%` sur les 4 côtés haut/droite/bas/gauche) appliquée via
    `--q-tiptap-content-padding` sur `.ProseMirror` (computed `editorStyle`
    sur `.q-tiptap__editor`) ; `dense` n'affecte plus que la toolbar
    (overrides dense padding/placeholder retirés) ; placeholder aligné sur le
    défaut (top/left/right 5%).
- ⚠ **Popups téléportés** (mentions montées au body via props.mount, palette
  Teleport, bubble menu) : ils n'héritent PAS des `--q-tiptap-*` définis sur
  `.q-tiptap` (fond transparent). Fix : variables redéfinies localement sur
  `.q-tiptap__mention-list` / `.q-tiptap__palette` / `.q-tiptap__bubble` —
  fond `var(--card, #fff)` en light, `.dark` override sombre (2026-09-05).
- **Piège listes + Tailwind (2026-09-05)** : le preflight de Tailwind pose
  `ul/ol { list-style: none }` → les bullet/ordered list « ne fonctionnaient
  pas » visuellement (pas de puces/chiffres). Fix CSS dans la typographie
  ProseMirror : `list-style-type: disc` (ul), `decimal` (ol), circle/square
  pour les niveaux imbriqués — l'override taskList (`list-style: none`) reste
  déclaré après. Vérifié headless (happy-dom) : toggleBulletList/
  toggleOrderedList/splitListItem OK avec la pile d'extensions complète.
- ⚠ **Piège tokens** : `--muted` (#f4f6f9) est un token de FOND (bg shadcn),
  pas une couleur de texte → ne jamais l'utiliser pour des icônes/secondary.
  `--q-tiptap-muted` utilise des gris texte explicites (#8b93a1 / dark #9aa2b1)
- Styles : section `QTiptap` dans `styles/main.css` (variables `--q-tiptap-*`
  - `.dark` ; typographie ProseMirror : h1-h3, listes, blockquote, pre/code, a, hr)
- Page docs manuelle `docs/components/tiptap.vue` (listée dans `CUSTOM_PAGES`
  de gen-menu) : démo v-model + sortie, variantes filled/dense/min-height,
  read-only ; menu « Tiptap »

## Headers dialog/bottom-sheet — mode contenu custom sans toolbar — 2026-08-31

`QDialogHeader` / `QBottomSheetHeader` : si un contenu custom est fourni (slot
par défaut, SANS `title`/`description`/`show-close`), il n'est PAS enveloppé
dans le `<q-toolbar>` embarqué — l'utilisateur fournit son propre layout
(ex. un `q-toolbar` + `q-space`), rendu directement dans la barre.

- Détection du contenu du slot : parcours des vnodes (`Comment` ignorés,
  `Text` vide ignorés, fragments récursifs) ; `onUpdated` incrémente une ref
  `refresh` pour recalculer le computed à chaque update du composant (le
  contenu du slot peut changer dynamiquement côté parent)
- Mode : `useCustom = !isStandard && hasCustomContent` avec `isStandard` =
  title/description présents (ou show-close pour dialog) — si title/description
  sont là, le slot default va en fin de toolbar standard
- `class="!bg-transparent"` etc. fonctionne via `v-bind="$attrs"` (racine)
- Build ✅.

## Directive v-close + marquage des overlays — 2026-08-31

- `lib/closeOverlay.ts` : `markOverlayClose(el, fn)` (pose `el.__qClose`),
  `closeParentOverlay(el)` (remonte jusqu'à l'overlay marqué),
  `vClose` (directive : au clic ferme l'overlay parent ; `v-close="false"`
  désactive). Exports ajoutés à index.ts + generate-exports manualExports
- Enregistrement global : module Nuxt → addPluginTemplate
  `dnax-ui-directives.mjs` (`nuxtApp.vueApp.directive("close", vClose)`, mode
  client)
- Overlays marqués : QDialog et QBottomSheet posent `__qClose` sur leur
  overlay div via une ref fonction (`markOverlay`) → `v-close` ferme le
  dialog/sheet le plus proche (la directive remonte depuis le bouton dans le
  contenu)
- Exemple : démo « Header + footer » (dialog.vue) + note QDialogHeader
  (`v-close` mentionné)
- **Page docs + menu (2026-09-03)** : groupe de menu « Vue Directives »
  (constante `DIRECTIVES` dans `scripts/gen-menu.ts`, icône `lucide:zap`,
  entrée « V Close » → `/docs/directives/close`) + page manuelle
  `docs/app/pages/docs/directives/close.vue` (pattern guide : Setup → Usage →
  Live demo avec q-dialog + q-bottom-sheet → variantes de valeur → how it
  works). llms.txt : section « Vue Directives » ajoutée.
- **QBtn color** : `color="primary"` est le DÉFAUT du bouton → aucun
  changement visible (normal) ; tout autre token (secondary, negative…) ou
  couleur (hex, nom CSS) fonctionne via classe ou var --q-btn-bg
- **Fix thème → téléports (2026-08-31)** : les overlays téléportés au body
  (dialogs $q.dialog…) perdaient l'héritage des vars du `.q-config-provider`
  (le DOM téléporté retombe sur :root = #1976d2) → `colors.primary` custom
  non appliqué aux q-btn dans les dialogs. Fix : le QConfigProvider RACINE
  pose aussi `themeStyle` (--primary etc.) sur `<html>` (comme la classe
  .dark déjà posée dessus) via un watch `[themeStyle, isProvidersRoot]` avec
  nettoyage (appliedThemeKeys + onBeforeUnmount) ; les providers imbriqués ne
  touchent pas html (leur div local prime). Démo Theming : selecteur
  colors.primary ajouté. Build ✅.
- Build ✅.

## $q.bottomSheet — doc complète + transition — 2026-08-31

- **Nouvelles options** sur QBottomSheet + `BottomSheetOptions` (plugin) :
  `transition` ("slide-up" défaut | "fade" | "zoom") et
  `transitionDuration` (ms → vars `--q-bs-duration-enter/leave`) — nom de
  transition dynamique `q-bs-${transition}` + CSS fade/zoom ; provider passe
  les deux au q-bottom-sheet
- **Contrat plugin bottom sheet ≠ dialog** : le QBottomSheetProvider rend DÉJÀ
  le panneau + header (si title/description) ; le composant passé fournit le
  corps et émet `@ok / @cancel / @dismiss` — PAS de racine `<q-bottom-sheet>`
  exigée (contrairement au `<q-dialog>` du plugin dialog)
- **Pattern auto ajouté (2026-08-31)** : comme $q.dialog — quand le composant
  passé n'a PAS de `title`/`description`, il EST le sheet (racine
  `<q-bottom-sheet v-model="open">` pilotée par
  `useBottomSheetPluginComponent()`, open déjà true via le contexte fourni par
  `internal/QBottomSheetHost.vue`). Le provider choisit : auto → Host (rendu
  tel quel) ; title/description → enveloppe historique. Heuristique simple,
  pas de double rendu
- `useBottomSheetPluginComponent` + `BottomSheetPluginContext` exportés
  (index.ts + generate-exports). Build ✅.
- Démo réelle : `docs/app/components/DemoShareSheet.vue` (grille d'actions,
  émet ok avec { target, file })
- Page plugin `plugins/bottom-sheet.vue` réécrite : Setup, Usage, Options
  (height/width/rounded/dark/translucent/persistent/dragThreshold/transition),
  exemple déclaratif équivalent, Live example (height 62%, rounded 24px,
  translucent, transition zoom) + log onOK/onCancel/onDismiss
- Piège : `@iconify/vue` n'est pas en dep directe de docs/ → utiliser
  `<q-icon>` dans les composants docs, pas `import { Icon }`
- Build ✅.

## QDialogHeader — show-close opt-in — 2026-08-31

Le bouton fermer de `QDialogHeader` est désormais **opt-in** : il ne s'affiche
que si `show-close` est présent (défaut `false` — comme
`switch-indicator-position` des tabs).

- Avant : `showClose` défaut `true` → × toujours visible
- Propagation : `show-close` ajouté à DemoConfirmDialog, DemoScrollDialog et
  aux démos/snippets de `dialog.vue` qui montraient le × (usageHeader,
  usageHeaderFooter, usageContent, usagePluginComponent) — via script de
  remplacement ciblé (pages docs .vue autorisées, contrairement à main.css)
- Les démos transitions/position/maximized ferment désormais par
  footer/backdrop/Esc (nouveau défaut sans ×)
- Note section QDialogHeader mise à jour (opt-in). Build ✅.

## QVirtualScroll — page docs manuelle — 2026-08-31

Page `virtual-scroll.vue` convertie en page manuelle riche (Basic 50k rows,
Variable heights, Tuning, QPage virtual, API).

- `virtual-scroll` ajouté à `CUSTOM_PAGES` (gen-menu) — était généré
- **Piège typage slot** : `defineSlots` sur `QVirtualScroll` déclare
  `ref: (el: unknown) => void` (pas `Element | null`) pour rester assignable à
  `:ref` côté consommateur ; `itemRef` accepte `unknown` et caste en interne.
  NE PAS typer les slots d'un composant à double mode (QPage virtual scoped /
  normal simple) : le `<slot />` du mode normal exigeait des props → QPage
  reste SANS defineSlots (forward brut), l'usage QPage virtual est documenté
  par snippet (q-syntax) au lieu d'une preview live
- Bindings numériques → `:virtual-scroll-slice-size="20"` (pas string) ;
  snippets JS sans backticks imbriqués (concaténation)
- Build ✅ après gen-menu (page intacte).

## QRouteTab — tab lié à la route (pattern Quasar) — 2026-08-31

Nouveau `QRouteTab.vue` (wrapper de QTab + vue-router) :

- Props : `to` (RouteLocationRaw, API RouterLink), `exact`, `replace` + toute
  l'API QTab (label, icon, alert, count…) transmise
- **Matching** : `router.resolve(to)` — exact = path + hash identiques ; sinon
  préfixe de chemin par segment (`/docs` matche `/docs/xxx`)
- **Sync route → actif** : `watch(() => route?.fullPath, …)` avec
  `immediate: true` → `tabs.setActive(resolvedName)` (le v-model du QTabs
  suit la route, pas besoin de v-model explicite)
- **Clic → navigation** : `router.push(to)` / `replace(to)` ; le QTab interne
  reçoit `:name="resolvedName"` (auto `rt_N` si absent)
- **Router optionnel** : `useRoute()/useRouter()` dans try/catch → sans app
  router le composant se comporte comme un QTab (pas de crash)
- Famille `Tabs` dans gen-menu FAMILIES (`["QTab", "QTabs", "QRouteTab"]`)
  → pas de page `route-tab` générée ; démo docs « Route tab » (navigation
  réelle). `bun run generate` → 129 composants. Build ✅.
- **QTabs non-contrôlé (2026-08-31)** : sans v-model (pas de listener
  `onUpdate:modelValue`), QTabs maintient un état interne (`internal`) —
  sinon l'émission `update:modelValue` était perdue → le q-route-tab ne
  devenait jamais actif (pas de couleur active) sans v-model parent.
  Détection : `"onUpdate:modelValue" in instance.vnode.props` ; `activeName`
  = modelValue (contrôlé) sinon internal ; `setActive` émet ou écrit
  internal ; `watch([activeName, tabRegs])` + `activeTabEl` par `activeName`.
  Bénéfice général : tout q-tabs sans v-model devient cliquable. L'activation
  par route (`q-route-tab`) tient compte d'`exact` (path+hash vs préfixe).

## QGrid/QCol responsive — vrai CSS @media (fix racine) — 2026-08-31

Les classes responsive (`q-col--span-md-*`, `q-col--offset-*`,
`q-grid--cols-*`) étaient définies hors de tout `@media` et activées par
matchMedia JS (`useGridBreakpoints`) → flash au chargement, dépendance JS,
layout faux. Fix racine :

- **CSS** : chaque groupe sm/md/lg/xl est enveloppé dans
  `@media (min-width: 600/1024/1440/1920px)` (valeurs par défaut)
- **QCol/QGrid** : les classes responsive sont TOUJOURS posées (plus de
  condition `bp.value.*`) — c'est le CSS qui les active au breakpoint
- `useGridBreakpoints` (`lib/breakpoints.ts`) devient inutilisé (code mort —
  conservé, supprimable plus tard)
- **Piège conceptuel docs** : un `q-col` SANS `span` = span-auto 1 colonne
  (PAS pleine largeur) → l'ancien exemple `:cols-md="6"` + items sans span
  était faux ; exemples corrigés avec `:span="12" :span-md="6"
:span-lg="3"` (row.vue + grid.vue)
- `cols-*` (total de colonnes) reste supporté, mais l'usage standard est le
  span par item. Build ✅.
- **BUG placement (2026-08-31)** : `.q-col { grid-column-start:
calc(var(--q-col-offset, 0) + 1) }` → start = 1 pour TOUS les items sans
  offset → superposition (une seule colonne visible, « ça sort toujours une
  colonne »). Fix : fallback `-1` → `calc(0) = 0` → valeur invalide → la
  propriété retombe sur `auto` → placement automatique. Ne jamais forcer un
  start numérique par défaut.

## QAutocomplete — swipe-to-close en mode sheet — 2026-08-31

Prop `swipe-to-close` (opt-in, défaut false) : drag vers le bas sur le header
ferme le sheet. Miroir du pattern vaul de QBottomSheet :

- `canSwipe = props.swipeToClose && props.mode === "sheet"` (sinon headers
  non interactifs)
- pointer capture sur le header (`setPointerCapture`) + suivi `translateY`
  (clampé ≥ 0) ; au relâchement > 80px → `closePopup()`, sinon reset `""`
- classe `--dragging` (transition: none) pendant le drag ; `--swipeable`
  (cursor grab + touch-action: none) seulement si le swipe est actif
- **1 seul ref par élément** : le panneau utilise `sheetRef` (pas de panelRef
  séparé — le drag transform s'applique à `sheetRef`)
- La recherche (`q-autocomplete__search`) reste scrollable (touch-action none
  uniquement sur le header, pas sur la liste)
- **Clear de recherche** (2026-08-31) : bouton × dans `.q-autocomplete__search`
  visible quand `query !== ''` — `onSearchClear()` vide la recherche (query +
  inputValue) SANS toucher au modelValue (la sélection reste), garde le focus
  dans l'input (`mousedown.prevent` + re-focus nextTick)
- **Fix swipe-to-close (2026-08-31)** : au relâchement > seuil, le panneau
  revenait à sa position (transform inline écrasé par l'animation leave
  pop-out) avant de fader. Fix : poser `translateY(100%)` (transition 0.25s
  du sheet) + classe `--swipe-closing` (désactive l'animation leave) + fermer
  au `transitionend` (fallback timeout 400ms, cleared au unmount). L'élément
  est détruit avec le Teleport → pas de reset de transform nécessaire
- Docs : démo swipe-to-close + note. Build ✅.

## Icône gauche des champs : icon-left + espacement — 2026-08-31

- `icon-left` ajouté à `QSelect` et `QAutocomplete` (QInput l'avait déjà) —
  rendu `<Icon class="q-field__icon">` dans `.q-field__control`, remplacé par
  le slot `#prepend` s'il est fourni
- Espacement : `.q-field__icon { margin-right: 6px }` → icône → valeur =
  gap 6px du control + 6px = 12px (l'icône n'est plus collée au texte — le
  8px initial était insuffisant, passé à 12px)
- `#prepend` partagé entre les trois champs (même sémantique que Quasar) ; le
  slot custom reste à la charge de l'utilisateur pour l'espacement
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
- Highlighter singleton clé sur **`globalThis`** (`__dnax_ui_shiki_highlighter__`,
  2026-09-03) : une seule instance par page, survit au HMR (réévaluation du module
  QSyntax ou de ses imports) → plus de « [Shiki] N instances have been created » ;
  reset de la clé si `createHighlighter` échoue
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

## Lot ddocs : country-picker, data-grid, date-picker, dialog, editor-js, fab — 2026-09-10

Complète l'entrée « Conversion docs → ddocs (Docus/MDC) » ci-après.

- Frontmatter : `title` (= `h1.doc-title`), `description`, `navigation.icon`
  (`i-lucide-*`), `seo.title` (`<title> (<QXxx>)`) + `seo.description`.
- Page famille (dialog) : un `## <Part> — <sous-titre>` + un `<DnaxApi>` par
  composant, en conservant les `### API` internes de la source (cf. `bottom-sheet.md`).
- `ddocs/nuxt.config.ts` : `components: [{ path: "~/components", pathPrefix: false }]`
  → les composants de `demos/` s'utilisent sans préfixe de dossier.
- `editor-js.vue` = stub généré (`<DocsComponentPage>`) sans démo → page minimale
  (intro + `## Example` statique + `## API`) ; ⚠ `QEditorJs` déclare la prop `data`
  mais émet `update:modelValue` (pas de `v-model` direct possible sur `data`).

## Conversion docs → ddocs (Docus/MDC) — 2026-09-10

Contrat : `ddocs/CONVERSION.md` (autoritaire). Source `docs/app/pages/docs/components/<slug>.vue`
→ cible `ddocs/content/docs/4.components/<slug>.md` (slug inchangé) ; démos avec état
→ UN composant par page `ddocs/app/components/demos/DnaxDemo<Page>.vue` (prop `demo`).

- `<docs-demo :code :script>` → `::code-preview` : slot par défaut = démo live,
  `#code` = exactement `:code` (+ `:script` combinés en SFC complet si présent), en
  ` ```vue `. `<q-syntax :code lang>` → bloc ` `<lang> ```.
`<docs-api>`→`<DnaxApi name="QXxx" />`(export de`useComponent`, jamais d'import).
- Démos **statiques** (aucun binding) → markup inliné dans le slot, en gardant les
  wrappers `demo-row` / `demo-col` / `demo-stack` (globaux dans `app/assets/css/main.css`).
- **Piège** : un `<style scoped>` de `DnaxDemo<Page>.vue` n'atteint **pas** le markup
  rendu par MDC (hors du template du composant). Donc toute démo qui a besoin d'un CSS
  spécifique à la page — même purement statique, ex. `.badge-host`, `.demo-bar`,
  `.demo-stage` — doit être **rendue par le composant de démo** (avec son style scoped),
  pas inlinée. Seules les démos n'utilisant que les helpers globaux restent inline.
- Un `:label="42"` (binding sans état réel) reste un binding Vue → démo dans le composant.
- Prose en **anglais** (traduire les pages FR, ex. `bar.vue`, `board.vue`, `breadcrumbs.vue`) ;
  jamais de `{{ }}` / `:prop` / `@event` dans le MDC hors composant de démo ; mentions de
  balises toujours en backticks (`` `<q-bar>` ``). Entités : `&lt;`→`<`, `&amp;`→`&`.
- Vérif outillage : compter les fences `^```` (paires) et les lignes `^::`(ouvrantes`::xxx`= fermantes`::`).
- MDC évalue `:prop="littéral"` via `evalInContext` (`@nuxtjs/mdc` : split(".") sur
  le runtimeData puis `destr()`) → `:value="0.42"` / `:max="100"` donnent bien des
  **nombres** (pas de warning de prop `Number`). Un binding littéral self-contained
  est donc OK dans un slot MDC (ex. `q-circular-progress`), contrairement à
  `:prop="uneVariable"`.
- Lot converti (2026-09-10) : checkbox, chip, circular-progress (stub → page
  minimale), collapse, container, count-down. `chip`/`collapse` : les démos sans
  binding mais avec un CSS page (`.demo-collapse`, `.demo-surface`, `.demo-time`…)
  ont aussi été routées par `DnaxDemo<Page>`.

## Conversion docs → ddocs — lot boutons / chat / carousel — 2026-09-10

Pages : `btn-actions`, `btn-dropdown`, `btn-group`, `bubble`, `card`, `carousel`.
Complète l'entrée « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- Démos routées par `DnaxDemo<Page>.vue` (CSS page ⇒ composant, cf. entrée
  précédente) : `DnaxDemoBtnActions` (row/menu/manage), `DnaxDemoBtnDropdown`
  (menu/view/row/placement — inclut le déclencheur pleine largeur), `DnaxDemoBubble`
  (chat/variants/reactions), `DnaxDemoCard` (basic/bordered/actions/glass/hover),
  `DnaxDemoCarousel` (basic/loop/vertical).
- **Seule page inline du lot** : `btn-group.md` — ses 4 démos n'utilisent que les
  helpers globaux (`demo-row` / `demo-col`), donc markup inliné + `#code` exact.
- Scoped CSS atteignant un composant enfant : utiliser `:deep()` (sinon le
  sélecteur ne matche pas, l'élément n'étant pas dans le template du composant).
  Ex. `.demo-chat :deep(.q-bubble__reactions button)`,
  `.demo-carousel--vertical :deep(.q-carousel__viewport)`.
- Une classe posée sur la racine d'un composant enfant (`.demo-card`,
  `.demo-carousel`, `.demo-chat`) fonctionne en scoped : Vue pose le scope id du
  parent sur la racine de l'enfant.
- **Vérifié** sur `@nuxtjs/mdc` (parseur réel de Docus) : `<template #slot>` dans du
  HTML brut inline EST reconnu (`props: { "#actions": "" }`, géré par
  `getSlotName`) ; `<style>` dans le `.md` est conservé et rendu (`dangerousTags`
  ne bloque que `script`/`base`). On ne s'en sert pas : le CSS va dans le composant
  de démo (convention du projet, plus cohérente).
- Rappel MDC : le texte des `<h3>` de démo passe par `prose-h3` (mapping
  automatique des tags HTML vers les composants prose) → prévoir le CSS de démo
  dans le composant pour reprendre la main sur la taille/poids.
- Vérif outillage : script Node jetable qui (1) parse chaque `.md` avec
  `parseMarkdown` de `@nuxtjs/mdc/runtime`, (2) compte les fences ` ``` ` (paires)
  et les lignes `^::` (ouvrantes `::xxx` = fermantes `::`), (3) grep `{{ }}` /
  `:prop=` / `@event=` hors fences.

## Conversion docs → ddocs — lot accordion → back-header — 2026-09-10

Pages : `accordion`, `action-sheet`, `app`, `autocomplete`, `avatar`, `back-header`.
Complète l'entrée « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- ⚠️ **Nouveauté importante** : dans le **markup live** du `.md`, tout composant doit
  être écrit **kebab-case + balise fermante explicite**
  (`<dnax-demo-avatar demo="sizes"></dnax-demo-avatar>`, `<dnax-api name="QAvatar"></dnax-api>`,
  `<q-app></q-app>`) : la syntaxe auto-fermante `<Dnax… />` fait perdre l'onglet Code du
  `::code-preview` ou avale la suite de la page — cause racine et portée exactes dans
  `.memory/warnings.md`. Les fences `#code` gardent l'auto-fermant exact de la source.
- `accordion` = page **famille** (4 composants) : `## QAccordion — container`, puis
  `## QAccordionItem — a section`, `## QAccordionTrigger — the button`,
  `## QAccordionContent — the animated content`, chacune avec son `### API` +
  `<dnax-api>` (cf. `bottom-sheet.md`). Les `q-syntax` → fences ` ```html ` exactes.
- `app.vue` = stub `DocsComponentPage` (`title="App" export="QApp"`) → page minimale
  (intro + `## Example` avec `<q-app></q-app>` + `## API`), même patron que `editor-js.md`.
- `accordion` était **en français** (prose) : lead, titres de sections et `doc-note`
  traduits ; les chaînes d'exemple **dans les snippets/démos** sont restées verbatim
  (règle « `#code` = exactement `xCode` » ; même choix que les commentaires FR gardés
  dans `breadcrumbs.md` / `dialog.md`).
- Démos : `DnaxDemoAccordion` (single/multiple), `DnaxDemoActionSheet` (options/events),
  `DnaxDemoAutocomplete` (basic/slot/icon/states/panel/swipe), `DnaxDemoAvatar`
  (sizes/photos/colors/icons/shapes/fallback), `DnaxDemoBackHeader`
  (basic/custom/noBack/styles/slot).
- Démos statiques inlinées quand elles n'utilisent que des helpers **globaux** :
  `back-header.md` « Actions » (seul cas du lot) ; les démos d'`avatar` qui ont un CSS
  page (`.demo-row--avatars`) et le slot `#title` de back-header (`.demo-custom-title`)
  sont routées par le composant (convention mémoire ci-dessus).
- `avatar` : les URLs Unsplash (photo1/photo2) vivent dans `DnaxDemoAvatar.vue` ; les
  fences répètent `scriptData` (photo1 + photo2) comme dans la source.
- `#code` d'une démo avec `:script` = SFC complet (`<script setup lang="ts">` + le
  `script` source, puis `<template>` + le `xCode` source) ; le `xCode` multi-ligne est
  ré-indenté de 2 espaces dans `<template>` (comme `btn.md`).
- `QActionSheet` : le label par défaut du bouton cancel est bien `"Annuler"`
  (`packages/ui/components/QActionSheet.vue`) — gardé tel quel en prose (valeur
  factuelle du composant, pas de la prose à traduire).

## Conversion docs → ddocs — lot input → loading — 2026-09-10

Pages : `input`, `interact`, `intersection`, `linear-progress`, `list`, `loading`.
Complète l'entrée « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- ✅ **Syntaxe MDC inline adoptée pour tout composant sans enfant** (formes utilisées
  par le dernier lot) : `:dnax-demo-input{demo="basic"}` et `:dnax-api{name="QInput"}`
  (jamais `<DnaxApi … />`, ni PascalCase). Vérifié avec le **vrai parseur**
  (`createMarkdownParser` de `@nuxtjs/mdc/runtime`) : sur une ligne seule, le nœud
  `textComponent` est un **enfant direct de `root`** (pas emballé dans un
  `<paragraph>`), donc pas de `<p><div>` invalide. La forme explicite
  `<dnax-api name="QX"></dnax-api>` produit au contraire un nœud `raw` **dans un
  `<p>`** (parse5) : c'est pour ça que l'inline est préféré. Dans une phrase,
  `:q-btn{label="Hi"}` reste bien un enfant du paragraphe (rendu inline).
- `#code` d'une démo avec `:script` = fence unique ` ```vue ` contenant
  `<script setup lang="ts">` + le `script` source, puis `<template>` + le `xCode`
  source ré-indenté de 2 espaces ; export du **contremplaire exact** de la source,
  y compris ses incohérences (ex. `input` : le snippet `mask` fait
  `v-model="date"` alors que `scriptMask` déclare `birthDate`).
- `list.vue` = page **famille** : un `## <Part>` par composant (titres source
  `## QList — container`, `## QItem — basic rows`, `## QItemSection — thumbnail`)
  puis `## QList` / `## QItem` / `## QItemSection` + un `:dnax-api{…}` par partie.
- `loading.vue` documente `QLoading` **et** `QLoadingProvider` (2 API) et est rangée
  dans `4.components/` (pas dans les plugins) : `## q-loading — declarative, with
v-model` + `### API`, puis `## q-loading-provider — the plugin overlay` + `### API`.
- Démos routées par composant (CSS page ⇒ composant) : `DnaxDemoInput`
  (basic/types/autogrow/variants/dense/clear/affixes/iconProps/mask/hint),
  `DnaxDemoInteract` (dashboard), `DnaxDemoIntersection`
  (basic/transitions/toggle/chat/cards), `DnaxDemoLinearProgress` (download),
  `DnaxDemoList` (container/basic/clickable/thumbnail/alignment/states),
  `DnaxDemoLoading` (basic/custom/boxed). `list` : même ses démos **statiques**
  (`container`, `alignment`, `states`) passent par le composant car elles portent le
  CSS page `.demo-list` / `.demo-item-title` / `.demo-thumb`.
- `linear-progress` : les démos statiques sont **inlinées** (elles n'utilisent que
  les helpers globaux `demo-col` / `demo-p` / `demo-meta` / `demo-label`) ; seules
  les valeurs littérales `:value="0.25"` / `:min="0"` sont gardées telles quelles
  (autorisé, cf. entrée « MDC évalue `:prop="littéral"` »). `.q-linear-progress`
  a `width: 100%`, donc `align-items: flex-start` du `demo-col` global ne l'écrase
  pas.
- Piège CSS récurrent : le `.demo-col` **global** (`app/assets/css/main.css`) est
  `display:flex; flex-direction:column; align-items:flex-start`, alors que les pages
  historiques le définissaient en `flex: 1 1 220px` **sans** `display:flex`. Un
  `.q-input` (flex item sans `width`) s'effondrerait donc dans un `demo-col` inline →
  dans le composant de démo, override scopé
  `.demo-col { flex: 1 1 220px; min-width: 0; align-items: stretch }`
  (+ `.demo-field { width:100%; max-width:520px }` pour `input`).
- `interact` était en partie FR (lead + fin de « Notes ») : prose traduite, snippets
  et commentaires FR des fences gardés verbatim.

## Conversion docs → ddocs — lot gallery / icon / image-preview (+ stubs pickers) — 2026-09-10

Pages : `file-picker`, `gallery`, `icon`, `image-picker`, `image-preview-provider`,
`image-preview`. Complète « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- **Stubs générés** (`file-picker`, `image-picker`, `image-preview-provider`) → page
  minimale (intro lue dans le SFC `packages/ui/components/Q…vue` + `## Example`
  statique + `## API`), patron `editor-js.md` / `app.md` : live en kebab-case +
  balise fermante, `#code` = version auto-fermante du même exemple.
- Démos stateful → UN composant par page : `DnaxDemoGallery`
  (basic/multiple/labels/custom/viewer), `DnaxDemoImagePreview`
  (basic/fade/zoom/programmatic), `DnaxDemoIcon` (spacing uniquement — page CSS
  `.demo-inline`/`.demo-spin`).
- `icon.md` : seules les démos Sizes/Colors/Custom CSS sizes sont inlinées (helpers
  globaux uniquement) ; « Spacing & rotation » passe par `DnaxDemoIcon` (CSS page).
  Le `q-syntax` CSS (`rotationCode`) → fence ` ```css ` autonome.
- `image-preview.md` : reste dans `4.components/` (page du composant `QImagePreview`
  **et** du plugin `$q.imagePreview`) ; section plugin `## Programmatic
($q.imagePreview)` + `#code` en ` ```ts ` (pas de SFC) ; section finale
  normalisée `## API`. Démo programmatique : `usePlugin` depuis
  `@dnax/ui/runtime`, contrôleur `.open()`/`goTo()` (cf. `packages/ui/lib/q.ts`).
- Piège MDC : attribut `accept` découpé en tableau puis rejoint par un **espace**
  → une seule valeur dans le live (`accept="image/*"`), détails dans
  `.memory/warnings.md`.
- ⚠️ Incohérence source non corrigée (fidélité au contrat « `#code` = exactement
  `X`/`Y` ») : dans `image-preview.vue`, `scriptFade` déclare `open`/`index` alors que
  `usageFade`/`usageZoom` utilisent `openFade`/`indexFade`/`openZoom`/`indexZoom`.
  Les fences reprennent la source telle quelle.

## Conversion docs → ddocs — lot image → input-tag — 2026-09-10

Pages : `img`, `infinite-scroll`, `inner-loading`, `input-otp`, `input-password`,
`input-tag`. Complète l'entrée « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- Les 6 pages routent **toutes** leurs démos par `DnaxDemo<Page>.vue` : chacune a un
  CSS page (`.demo-img`, `.demo-scroll`, `.demo-panel`, `.demo-field`, `.demo-value`,
  `.demo-event`) que le `<style scoped>` du composant doit porter (cf. piège scoped).
  Composants : `DnaxDemoImg` (basic/loading/placeholder/caption/error),
  `DnaxDemoInfiniteScroll` (basic/animated/slot/silent), `DnaxDemoInnerLoading`
  (basic/label/dark/icon), `DnaxDemoInputOtp` (basic/numeric/grouped/masked/states/
  complete), `DnaxDemoInputPassword` (basic/variants/states/confirm),
  `DnaxDemoInputTag` (basic/events/states).
- `img` : les URLs Unsplash (`photo` pleine résolution, `thumb` basse résolution
  w=40&q=40) vivent dans `DnaxDemoImg.vue` ; les fences `#code` répètent le `script`
  correspondant (photo, photo+thumb, photo+loading…), comme dans la source.
- `infinite-scroll` : le `xCode` de la démo « Basic » contenait **son propre**
  `<script setup>` (doublon du `:script`). Le `#code` a été construit en SFC complet
  comme pour `dialog.md` : `<script setup>` = `scriptData` (état réel : 20 items,
  +10, max 60), `<template>` = le markup `q-infinite-scroll` de `xCode` (script
  embarqué non dupliqué).
- `inner-loading` : la source nommait `demo` le `reactive` d'état ; la prop du
  composant de démo s'appelle aussi `demo` → renommé `state` en interne
  (cf. `.memory/warnings.md`), les fences gardent `demo.xxx` (exact `xCode`).
- Incohérences **de la source** conservées verbatim (règle « `#code` = exactement
  `xCode` + `xScript` ») : `input-password` (`variantsCode`/`statesCode` utilisent
  `v-model="password"` alors que `scriptDense` déclare `densePwd`) ; `input-tag`
  (fences avec `tags`, démo live avec `emails`/`features`/`limited`).
- `<kbd>Backspace</kbd>` / `<kbd>Enter</kbd>` → backticks (`` `Backspace` ``) ; le CSS
  `kbd` de la source n'est pas repris.
- Vérif outillage : `node scripts/fix-mdc-self-closing.mjs --check` → 0 fichier ;
  parse `parseMarkdown` (`@nuxtjs/mdc/runtime`) : 5/4/4/6/4/3 `code-preview`, chacun
  avec son `template v-slot:code`, dernier nœud = `dnax-api` (rien d'avalé).

## Conversion docs → ddocs — lot radio → scroll-area — 2026-09-10

Pages : `radio`, `rating`, `reorder`, `rolling-text`, `safe-area`, `scroll-area`.
Complète l'entrée « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- Compose tous les éléments _childless_ en **syntaxe MDC inline**
  (`:dnax-demo-radio{demo="group"}`, `:dnax-api{name="QRadio"}`) — forme
  préférée par le contrat (`ddocs/CONVERSION.md`, § Self-closing tags), alternative
  équivalente au kebab-case + balise fermante explicite des lots précédents. Vérifié
  au parseur réel : `@nuxtjs/mdc/runtime` `parseMarkdown` produit un nœud `element`
  `dnax-demo-radio` (props `demo`) **frère** du `<template v-slot:code>` du
  `::code-preview` (le slot `#code` est normalisé en `v-slot:code` dans l'AST) —
  l'onglet Code est donc bien conservé.
- Les 6 pages ont toutes un CSS de démo spécifique (`demo-group`, `demo-rating`,
  `demo-list`/`demo-track`, `demo-row`/`demo-col`/`demo-label`,
  `demo-phone*`, `demo-log`/`demo-msg`) ⇒ **toutes les démos sont routées** par
  `DnaxDemo<Page>.vue` (aucune démo inlinée dans ce lot).
- ⚠ Collision de classes avec les helpers **globaux** de `ddocs/app/assets/css/main.css`
  (absents de l'ancienne app `docs/`) : quand le CSS scoped de la page source
  redéfinissait `.demo-row` / `.demo-label` **sans** déclarer une propriété globale
  (`display`, `text-transform`…), la valeur globale s'appliquait en plus et changeait
  le rendu. Correctif : figer la propriété dans le composant —
  `scroll-area` → `.demo-row { display: block }`, `rolling-text` →
  `.demo-label { font-size: inherit; font-weight: 400; text-transform: none;
letter-spacing: normal; color: inherit }`. Garder les helpers globaux seulement
  quand la page source s'appuyait déjà dessus.
- `safe-area` : les insets réels valent 0 hors iOS, le mockup les simule via des
  `:deep(.q-safe-area--*)` (repris du scoped source) ; `q-syntax :code lang="html"`
  → fence ` ```html ` (meta viewport, filename `index.html` perdu, sans importance).
- `reorder` : `lastEvent`/`onReorder` conservés dans le composant (fidélité à la
  source), le commentaire FR de `usageHandle` reste **dans** la fence.
- Vérif outillage : script jetable (supprimé) — parse des 6 `.md`, AST : nombre de
  `code-preview` = nombre de `#code`, slot frère (pas englobé), `dnax-api` avec prop
  `name`, fences paires, `::` équilibrés, aucun auto-fermant / `{{ }}` hors fence ;
  puis `node ddocs/scripts/fix-mdc-self-closing.mjs --check` → 0 fichier.

## Conversion docs → ddocs — lot tab-panels → tiptap — 2026-09-10

Pages : `tab-panels`, `table`, `tabs`, `text-caption`, `text`, `tiptap`.
Complète « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- Composants de démo (un par page) : `DnaxDemoTabPanels`
  (basic/animations/lazy/rich), `DnaxDemoTable` (12 démos), `DnaxDemoTabs`
  (basic/align/icons/counts/switch/animated/collapse/colors/route),
  `DnaxDemoTextCaption` (basic/breathing/generate/highlight/positions),
  `DnaxDemoText` (basic/lines/tag/transitions/generate/highlight/breathing),
  `DnaxDemoTiptap` (model/context/toc/mentions/variants/readonly/padding/states).
- **Toutes** les démos de ces 6 pages sont routées par le composant : soit un
  binding non évaluable (`:rows="rows"`, `:text="LONG"`, `v-model`…), soit un CSS
  page (`.demo-table-count`, `.demo-actions-cell`, `.demo-panels*`, `.demo-tabs-meta`,
  `.demo-align-select`, `.demo-switch*`, `.demo-stage*`, `.demo-transitions*`,
  `.demo-col` spécifique, `.demo-output*`, `.demo-toc__*`). Aucune démo inlinée.
- Pages **famille** : `tab-panels` → `## QTabPanels — the animated panels` +
  `### API` (`:dnax-api{name="QTabPanels"}`) puis `## QTabPanel — the panel` +
  `### API`. `tabs` : `## QTabs — the tab bar` (démos + `### API`) puis `## QTab`
  et `## QRouteTab` (la note « Route tab » et sa démo ont été déplacées sous
  `## QRouteTab`) — la source ne documentait que `QTabs` (`useComponent`), les
  deux autres parties viennent de `FAMILIES.Tabs` de `scripts/gen-menu.ts`.
- `table` : page mono-composant → `## QTable — data table` puis `## API` ; le
  tableau `QTableColumn` (rendu `v-for` dans la source) est converti en **table
  Markdown statique** (le `<name>` de la description est mis en backticks pour
  éviter le parsing HTML, les `|` de types sont échappés `\|`). Incohérence source
  conservée verbatim : `usageHeaderStyle` ne montre qu'une table sans
  `header-style` alors que la démo live en affiche une seconde (fond plein).
- Fences avec CSS page : `demo-col` historique (`max-width: 420px` pour `text`,
  `640px` pour `tiptap`) **figé dans le composant** avec `align-items: stretch`
  (le `.demo-col` global met `align-items: flex-start`) ; `.demo-row` de
  `text-caption` figé `align-items: stretch, gap: 16px`.
- Vérif outillage : `ddocs/scripts/fix-mdc-self-closing.mjs --check` → 0 fichier ;
  parse `@nuxtjs/mdc/runtime` (via `result.body`) : 4/12/9/5/7/8 `code-preview`,
  chacun avec son `template v-slot:code` **frère** du composant de démo (aucune
  imbrication), fences paires, `::` équilibrés, aucun `{{ }}`/`:prop`/`@event`
  hors fence (masquer les spans de code inline avant le grep).
- ⚠️ Le nœud retourné par `createMarkdownParser()` a sa racine dans `result.body`
  (pas `result` directement) et `result` porte aussi `data`/`toc`.

## Conversion docs → ddocs — lot select → spinner — 2026-09-10

Pages : `select`, `separator`, `skeleton`, `slider`, `space`, `spinner`. Complète
« Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- Syntaxe **MDC inline** partout pour les composants sans enfant
  (`:dnax-demo-select{demo="basic"}`, `:dnax-api{name="QSelect"}`) ; le seul
  markup live inliné (démo statique n'utilisant que les helpers globaux) est la démo
  « Horizontal » de `separator` — composants en kebab-case + balise fermante
  explicite (`<q-separator spaced></q-separator>`), vérifié au parseur : enfants
  directs du `code-preview`, `q-separator` frères des `<p>` (pas d'engloutissement).
- Démos routées par `DnaxDemo<Page>.vue` (CSS page) : `DnaxDemoSelect`
  (basic/customKeys/outlined/multiple/primitives), `DnaxDemoSeparator`
  (vertical/dark), `DnaxDemoSkeleton` (shapes/types/card/anims/dark),
  `DnaxDemoSlider` (basic/markers/colors/states/vertical), `DnaxDemoSpinner`
  (basic/types/sizes/colors). Aucune démo de `skeleton` n'est inlinée : même
  « Animations » (`.demo-row` page) diffère du helper global (gap 14 vs 10).
- `space.vue` = stub généré (`DocsComponentPage title="Space" export="QSpace"`) →
  page minimale (intro + `## Example` statique + `## API`) : `QSpace` n'a pas de CSS
  propre, `.q-space { flex: 1 1 auto }` vit dans `packages/ui/styles/main.css`
  (racine `aria-hidden`).
- Sections finales `## QSkeleton API` / `## QSpinner API` **normalisées** en `## API`
  (précédent `image-preview`).
- Fidélité `#code` : fences statiques = exact `xCode` (y compris le CSS `.card`
  incohérent de `usageCard` et le commentaire FR de `usageAnims`) ; fences avec
  `:script` = SFC complet `<script setup lang="ts">` + `script` puis `<template>` +
  `xCode` réindenté de 2 espaces.
- Vérif outillage : script jetable (supprimé) — `parseMarkdown` de
  `@nuxtjs/mdc/runtime` renvoie `{ body }` (et **non** l'arbre directement : lire
  `result.body`), 5/3/5/5/1/4 `code-preview` = autant de `v-slot:code` frères,
  `dnax-api` avec `name`, fences paires, `::` équilibrés ;
  `node ddocs/scripts/fix-mdc-self-closing.mjs --check` → 0 fichier.

## Conversion docs → ddocs — lot toolbar → virtual-scroll — 2026-09-10

Pages : `toolbar`, `tooltip`, `uploader`, `video`, `virtual-scroll`. Complète
« Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- Syntaxe **MDC inline** pour les composants sans enfant
  (`:dnax-demo-toolbar{demo="basic"}`, `:dnax-api{name="QToolbar"}`).
- Les 5 pages routent **toutes** leurs démos par `DnaxDemo<Page>.vue` : chacune a un
  CSS page (`.demo-toolbar`/`.demo-title`, `.demo-target`/`.demo-grid`,
  `.demo-meta`/`.demo-badge`, `.demo-loading`/`.demo-meta`, `.demo-vs*`) que le
  `<style scoped>` doit porter — même les démos statiques de `toolbar`.
  Composants : `DnaxDemoToolbar` (basic/header/inset-shrink),
  `DnaxDemoTooltip` (basic/anchors/side-align/delay/disable/controlled/types),
  `DnaxDemoUploader` (basic/limit/placeholder/accept/details/disabled/slots),
  `DnaxDemoVideo` (basic/pexels/ratio/autoplay/youtube/hls/placeholder/events),
  `DnaxDemoVirtualScroll` (basic/mixed/tuning).
- ⚠ Collision classe globale (cf. entrée « lot radio → scroll-area ») : le
  `.demo-grid` **scoped** de `tooltip` est une grille CSS (`repeat(auto-fit,
minmax(150px,1fr))`) alors que le helper global `main.css` est un `flex-wrap` →
  redéfini dans le scoped du composant pour rester fidèle au rendu source.
- `uploader` : URLs Unsplash (`IMG()` + `PRESET`) dans `DnaxDemoUploader.vue` ; les
  fences `#code` gardent les placeholders `img-1.jpg…` de `scriptPreset`. Le slot
  live `#file` rend `{ index }` (et non `{ item, index }`) pour éviter la variable
  inutilisée — le `#code` reste exact (`{ item, index }`).
- `video` : constantes (MP4/POSTER/HLS/YT/PEXELS) dans `DnaxDemoVideo.vue` ; les
  émissions d'événements live sont des affectations fléchées parenthésées
  (`@timeupdate="({ currentTime }) => (t = currentTime)"`) — comportement identique.
- Fidélité `#code` (= exact `xCode` + `xScript`, cf. lots précédents) : fences avec
  `:script` = SFC complet `<script setup lang="ts">` + `script` puis `<template>` +
  `xCode` réindenté de 2 espaces ; fences sans script = `xCode` nu (pas de
  `<template>`), ex. `virtual-scroll` « Tuning » et `video` « Placeholder ».
  Incohérences **de la source conservées** : `video` passe `scriptBasic`
  (`PEXELS_BASIC`) aux démos ratio/autoplay alors que leur `xCode` référence
  `MP4`/`POSTER` (non déclarés), et `scriptHls` à la démo HLS qui utilise
  `MP4`/`POSTER` ; `uploader` « File details »/« Disabled » passent `scriptPreset`
  (qui déclare `PRESET`) alors que le `xCode` utilise `files`. Commentaires FR des
  fences gardés verbatim (`tooltip`, `uploader`, `virtual-scroll`).
- `q-syntax` → fence autonome ` ```html ` (`toolbar` header usage,
  `virtual-scroll` « Inside QPage ») ; `q-syntax` `lang="html"` conservé.
- Sections finales `## QTooltip API` / `## QUploader API` / `## QVideo API` /
  `## QVirtualScroll` **normalisées** en `## API` (précédent `image-preview`).
- Vérif outillage : script jetable (supprimé) — `parseMarkdown`
  (`@nuxtjs/mdc/runtime`, lire `result.body` et `result.data` pour le frontmatter) :
  3/7/7/8/3 `code-preview` = autant de `v-slot:code` frères du nœud démo, un
  `dnax-api` par page avec prop `name`, aucun nœud avalé ; puis
  `node ddocs/scripts/fix-mdc-self-closing.mjs --check` → 0 fichier.

## Conversion docs → ddocs — lot splitter → syntax — 2026-09-10

Pages : `splitter`, `spreadsheet`, `sticky`, `swipe-cell`, `swiper`, `syntax`.
Complète « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- Syntaxe **MDC inline** pour les composants sans enfant
  (`:dnax-demo-splitter{demo="basic"}`, `:dnax-api{name="QSplitter"}`).
- Les 6 pages routent **toutes** leurs démos par `DnaxDemo<Page>.vue` (chacune a un
  CSS page : `.demo-panel*`/`.demo-knob*`, `.demo-bar*`/`.demo-viewport`,
  `.demo-list`/`.demo-cell`/`.demo-action*`, `.demo-slide*`/`.demo-thumbs`/
  `.demo-swiper--*`, `.demo-tables*`, `.demo-tools`/`.demo-json`). Composants :
  `DnaxDemoSplitter` (basic/horizontal/px/custom), `DnaxDemoSpreadsheet` (14 démos),
  `DnaxDemoSticky` (basic/offset/bound/bottom/events), `DnaxDemoSwipeCell`
  (basic/both/lock/before/events), `DnaxDemoSwiper` (14 démos), `DnaxDemoSyntax`
  (basic/languages/themes).
- `spreadsheet` (~1400 l., 14 `code-preview`) : les 3 tables de référence
  (Syntax/Operators, Functions, Errors) et les 2 tables du « Data model » sont
  hand-written dans la source → converties en **tables Markdown statiques**. La
  table « Functions » utilisait des lignes `th colspan="3"` de groupe
  (Aggregation / Logic / Math / Text / Dates / Conversion) → **éclatée en 6 tables**
  précédées d'un label gras (Markdown ne gère pas `colspan`). Les cellules `type`
  (`string | text | …`) et `align` (`left | center | right`) contenaient des `|` →
  réécrites en listes séparées par des virgules / `/` dans des backticks (pas
  d'échappement `\|`). Les `<pre class="demo-json">` → fences ` ```ts `.
- `spreadsheet` — pré-réglages impératifs (filtre pré-appliqué IT, fonds de la
  démo clic-droit) : l'`onMounted` de la source a été **conditionné par
  `props.demo`** (`if (props.demo === 'filter') …`) car chaque `code-preview` monte
  sa propre instance (les refs `filterDemo`/`opsDemo` n'existent que pour la démo
  active) — comportement identique au « tout sur une page » d'origine.
- ⚠️ `spreadsheet` démo « export » : le live source n'avait que les boutons (le
  `ref=wbRef` venait de la démo « sheets » du dessus). En page MDC autonome ça
  donnerait des boutons inactifs → le composant **rend sa propre grille**
  `ref=wbRef` dans la démo export (la fence `usageExport` la contient déjà) — seule
  déviation volontaire au markup live source.
- `syntax` : la section « Default slot » de la source n'utilise **pas** `docs-demo`
  mais un `q-syntax :code` nu → convertie en fence ` ```html ` autonome (comme la
  règle `q-syntax`), donc `DnaxDemoSyntax` n'a que basic/languages/themes (pas de
  démo « slot »).
- `swiper` = page **famille** (`QSwiper` + `QSwiperSlide`) : sections finales
  `## QSwiper — the carousel` + `:dnax-api{name="QSwiper"}` puis
  `## QSwiperSlide — one slide` + `:dnax-api{name="QSwiperSlide"}`. Les 14 démos
  partagent un composant unique (images Unsplash, `effectOptions`, `thumbs`/`master`).
- `sticky` : `stuckBound`/`stuckBottom` étaient déclarés mais inutilisés dans la
  source → supprimés du composant (le rendu est identique) ; `stuckOffset` conservé.
- `swipe-cell` : le badge `<span class="demo-mobile-badge">📱 Mobile-ready ·
Capacitor</span>` (pas un début de composant) a été **replié en prose** dans le
  lead, avec la mention Capacitor.
- Fidélité `#code` (= exact `xCode` + `xScript`) : SFC `<script setup lang="ts">` +
  `script` puis `<template>` + `xCode` réindenté de 2 espaces ; `usageExport`
  (spreadsheet) embarque déjà son `<template>` → fence = script puis `usageExport`
  verbatim (pas de double `<template>`). Fences sans script = `xCode` nu.
  Commentaires FR des fences gardés verbatim (`splitter` aucun, `swipe-cell`,
  `spreadsheet` `usageSheets`/`usageFreeze`/`usageBig`…).
- `llms.txt` : les 6 entrées (`/docs/components/splitter|spreadsheet|sticky|
swipe-cell|swiper|syntax`) **existaient déjà** dans `docs/public/llms.txt`
  (L103-108, ordre alphabétique) → aucune modification.
- Vérif outillage : script jetable (supprimé) — `parseMarkdown`
  (`@nuxtjs/mdc/runtime`, lire `result.body`) : 4/14/5/5/14/3 `code-preview` =
  autant de `v-slot:code` frères du nœud démo, un `dnax-api` terminal par page,
  fences paires, `::` équilibrés, aucun auto-fermant non-void / `{{ }}` / `:prop` /
  `@event` hors fence (`<img />` inline toléré) ; puis
  `node ddocs/scripts/fix-mdc-self-closing.mjs --check` → 0 fichier.

## Conversion docs → ddocs — lot directives (v-close → v-intersection) — 2026-09-10

Pages : `close`, `touch-pan`, `touch-hold`, `touch-swipe`, `touch-repeat`,
`intersection` (source `docs/app/pages/docs/directives/*.vue` → cible
`ddocs/content/docs/6.directives/*.md`). Complète l'entrée « Conversion docs →
ddocs (Docus/MDC) » (mêmes règles).

- Les 6 démos ont un CSS page-spécifique (`.pan-stage`/`.pan-ball`, `.hold-pad`,
  `.swipe-pad`, `.repeat-pad`, `.ix-card`…, `.guide-row`/`.demo-body`) → toutes
  routées par un `DnaxDemo<Page>.vue` (`DnaxDemoClose/TouchPan/TouchHold/
TouchSwipe/TouchRepeat`) avec `<style scoped>`.
- ⚠ `intersection` : `DnaxDemoIntersection.vue` est **déjà pris** par la page
  composant `4.components/intersection.md` (`QIntersection`, démos basic/
  transitions/toggle/chat/cards) → la démo directive utilise
  `DnaxDemoIntersectionDirective.vue` (`:dnax-demo-intersection-directive{demo="basic"}`).
- Directives globales du module `@dnax/ui` → utilisées telles quelles dans les
  composants de démo (`v-close`, `v-touch-pan.horizontal.mouse.prevent`,
  `v-touch-hold.mouse`, `v-touch-swipe`, `v-touch-repeat.mouse`,
  `v-intersection`, `v-intersection.once`).
- Tables `v-for` (valeur/modifiers/details) → tables Markdown statiques ; effets
  FR traduits en anglais. `'up' | 'down' | …` dans une cellule → pipes échappés
  `` `'up' \| 'down'` `` (obligatoire en GFM, même dans un code span).
- Pas de section `## API` : ces pages documentent des directives, pas des
  composants (aucun `docs-api` dans la source).
- Prose FR → EN, mais **fences `q-syntax` gardées verbatim** (commentaires FR des
  snippets) ; `q-syntax` → fence du langage seul (pas de `[filename]`, conforme
  aux autres pages converties).
- Fidélité `#code` : combiné script + template (`usageDemo` + `scriptDemo`), même
  quand le script source omet des identifiants utilisés par le template
  (`fastCount`, `speed`, `onceCount`) — repris tel quel, c'est le snippet source.
- Vérif outillage : script jetable (supprimé) — `parseMarkdown`
  (`@nuxtjs/mdc/runtime`, lire `result.body`) : 1 `code-preview`/page,
  `v-slot:code` frère du nœud démo, fences paires, `::` équilibrés, aucun
  auto-fermant non-void / `{{ }}` / `:prop` / `@event` hors fence ni prop tableau.

## Conversion docs → ddocs — lot plugins `$q.*` (dialog → web-storage) — 2026-09-10

Pages : `dialog`, `bottom-sheet`, `notify`, `loading`, `image-preview`, `platform`,
`web-storage` (source `docs/app/pages/docs/plugins/*.vue` → cible
`ddocs/content/docs/5.plugins/*.md`). Complète l'entrée « Conversion docs →
ddocs (Docus/MDC) » (mêmes règles).

- **Noms de démos en collision** : `DnaxDemoDialog`, `DnaxDemoBottomSheet`,
  `DnaxDemoLoading`, `DnaxDemoImagePreview` sont déjà pris par les pages composants
  `4.components/dialog|bottom-sheet|loading|image-preview.md` → suffixe `Plugin`
  (`DnaxDemoDialogPlugin.vue` → `:dnax-demo-dialog-plugin{demo="live"}`, idem
  BottomSheet/Loading/ImagePreview). Depuis `demos/`, `pathPrefix: false`
  (`nuxt.config.ts`) = nom du fichier seul. Même précédent que
  `DnaxDemoIntersectionDirective.vue`.
- **Helpers portés** (copies, originaux `docs/app/components/*` intacts) :
  `DemoConfirmDialog.vue`, `DemoScrollDialog.vue`, `DemoShareSheet.vue` →
  `ddocs/app/components/demos/` (mêmes noms, importés en chemin relatif/`~/components/demos/…`).
- **`q-syntax :script="…"` est un no-op** : `QSyntax` ne déclare pas de prop
  `script` (`packages/ui/components/QSyntax.vue`) → l'ancienne doc n'affichait QUE
  `code`. Donc, à la conversion, les fences de type `q-syntax` ne contiennent que
  `code` (`bottom-sheet` Options, `platform` « In a template »). Le `script` n'est
  inclus que pour les `docs-demo` → `::code-preview` (contrat SFC script+template),
  ex. `platform` « Your device » (`usageTemplate` + `scriptTemplate`).
- **`platform`** : `apiRows` (33 lignes) → table Markdown statique (Property/Type/
  Meaning, 1ʳᵉ cellule `` `$q.platform.<path>` `` ; pipe interne échappé
  `` `'cordova' \| 'capacitor'` ``). `deviceRows` + `flags` restés **live**
  (`:dnax-demo-platform{demo="device"}`, valeurs de session) — ce sont des
  détections, pas une table d'API. ⚠ La source passait `:code="usageTemplate"`
  (onglets `q-tabs`) alors que la preview montrait le device : incohérence source
  conservée telle quelle dans le `#code`.
- **`web-storage`** : démo live `$q.localStorage` conservée ; n'écrit que sous
  `ws:demo:` (jamais de `clear()` global), type via `typeof`/`instanceof Date`.
  `apiRows` (11 lignes) → table Markdown statique.
- **`dialog` / `bottom-sheet` / `notify` / `loading` / `image-preview`** : pas de
  section `## API` (aucun `docs-api` dans la source) ; `::code-preview` seulement
  pour les `docs-demo`, les « Live example » sans `:code` = composant posé seul.
- **Fences** : `q-syntax` gardées **verbatim** (commentaires FR des snippets
  conservés, ex. `rend automatiquement QDialogProvider…`) ; `\/script` des template
  literals source réécrit en `</script>` réel (fence = texte, non parsé).
- Vérif outillage : script jetable (supprimé) — `parseMarkdown` +
  `scripts/fix-mdc-self-closing.mjs --check` (0 fichier à corriger) : `v-slot:code`
  frère du nœud `:dnax-demo-…{}`, aucun `<x-y>` imbriqué dans `<x-y>`, tables
  parsées. ⚠ Voir warnings « aucun `QConfigProvider` monté au niveau app » : les
  démos `$q.*` ne s'afficheront qu'après montage du provider.

## Conversion docs → ddocs — lot layouts / styles — 2026-09-10

Pages (source `docs/app/pages/docs/components/*.vue` → cible
`ddocs/content/docs/2.layouts|3.styles/*.md`) : `config-provider`, `page` (stub →
page minimale), `header`, `footer`, `sidebar` (famille) ; `grid`, `col`, `row`.
Complète « Conversion docs → ddocs (Docus/MDC) » (mêmes règles).

- Titres de frontmatter pris sur `LAYOUTS`/`STYLES` de `scripts/gen-menu.ts` (le
  `doc-title` des stubs diffère : `page.vue` affiche « Page » mais l'entrée menu
  est « Page Layout ») : **Config Provider**, **Page Layout**, **Header Layout**,
  **Footer Layout**, **Sidebar Layout** ; **Grid**, **Col**, **Row**. Fichiers
  numérotés `2.layouts/1..5` et `3.styles/1..3` ; aucun `.navigation.yml` créé
  (Docus dérive le titre du dossier — `2.essentials` en a un car son titre
  diffère du dossier).
- Syntaxe **MDC inline** (`:dnax-demo-header{demo="basic"}`,
  `:dnax-api{name="QHeader"}`) pour tous les composants sans enfant.
- Les 7 pages routent **toutes** leurs démos par `DnaxDemo<Page>.vue` (chacune a un
  CSS page : `.demo-stage*`, `.demo-shell-*`, `.demo-radius`, `.demo-toolbar`,
  `.demo-side-head`, `.demo-brand`, `.demo-layout`, `.demo-main`, `.demo-user`,
  `.demo-cell*`). Composants : `DnaxDemoConfigProvider` (shell/theme),
  `DnaxDemoHeader` (basic/translucent/glass/fixed), `DnaxDemoFooter`
  (basic/elevated/translucent/glass/fixed), `DnaxDemoSidebar` (offcanvas/static),
  `DnaxDemoGrid` (layout/responsive/colsResponsive/cells/six/square/horizontal/
  custom), `DnaxDemoCol` (span/auto/offset/responsive/alignSelf), `DnaxDemoRow`
  (basic/gap/responsive/responsiveMixed/align). Aucun nom en collision avec les
  `DnaxDemo<Page>` existants.
- ⚠ **Collision `.demo-grid`** (détail en `.memory/warnings.md`) : `grid`/`col`/
  `row` passent `class="demo-grid"` sur leurs `q-grid`/`q-row` — inerte dans la
  source (aucun `.demo-grid` dans l'app legacy) mais helper **global flex** dans
  `ddocs/app/assets/css/main.css` → `.demo-grid` **scoped** dans les 3 composants
  répliquant `.q-grid` (spécificité scoped > helper global).
- `config-provider` : `appShellNote` (string FR rendue via `{{ }}`) est de la
  **prose** → traduite en anglais ; les fences `q-syntax` et les `#code` gardent
  les commentaires FR **verbatim** (convention lots splitter→syntax, directives,
  plugins). `providerPattern` contenait `\/script` dans la template literal source
  → réécrit `</script>` dans la fence (texte, non parsé).
- `page` = stub généré (`DocsComponentPage title="Page Layout" export="QPage"`) →
  page minimale sur le modèle de `app.md` : intro (d'après
  `packages/ui/components/QPage.vue` + `lib/fixedLayout.ts` : padding-top =
  barres fixed HAUT précédentes, padding-bottom = barres BAS suivantes, prop
  `virtual` → `QVirtualScroll`) + `## Example` (`<q-page></q-page>` en live,
  `#code` = `<q-page />`) + `## API`.
- `grid` et `sidebar` = familles : `## <Part>` + `### API` +
  `:dnax-api{name=…}` (`## QGrid`/`## QGridItem` ; les 8 parts de Sidebar avec
  leurs `### API` internes repris tels quels). `grid.md` fait aussi 3 fixtures :
  4 tableaux de spans (usageBasic), 2 responsive, et la fence ` ```css ` des
  breakpoints (`q-syntax :code=\`:root {…}\`` inline dans la source).
- `header`/`footer` : la note finale de la source (lien `/docs/components/toolbar`,
  lien `/docs/components/grid`) est gardée avec ses liens **tels quels** ; la
  section `## QHeader`/`## QFooter` devient `## API`.
- Vérif outillage : scripts jetables (supprimés) — (1) `parseMarkdown`
  (`@nuxtjs/mdc/runtime`) : 2/1/4/5/2/8/5/5 `code-preview`, **tous** avec
  `v-slot:code` frère du nœud démo, `dnax-api` = 1/1/1/1/8/2/1/1, aucun `q-*` hors
  `code-preview` (le `<q-page></q-page>` live de `page.md` est bien dans le slot
  par défaut) ; (2) comparaison **verbatim** des 49 consts `:code`/`:script` des
  sources (normalisées indentation + lignes vides) → toutes présentes dans les
  `.md` ; (3) `node ddocs/scripts/fix-mdc-self-closing.mjs --check` → 0 fichier ;
  (4) comptage `^::code-preview$` == `^::$` et fences paires.
- `llms.txt` : `ddocs/` n'a pas de `docs/public/llms.txt` (l'index vit dans l'app
  legacy `docs/`, hors périmètre de ce lot) → aucune modification.

## Docd (layer `@baybreezy/docd`) — conventions de contenu — 2026-09-10

`filename: docd/content/**/*.md`

**MDC / prose** (noms de blocs vérifiés dans
`docd/node_modules/@baybreezy/docd/app/components/content/prose/*.global.vue`) :

- `::prose-show-case` = bloc **Preview / Code** (`tab = ref("preview")`, cf.
  `ProseShowCase.global.vue`). Le snippet va dans le slot `#code`, exactement
  comme `::dnax-demo` ; `ProseShowCaseProps` n'a qu'un prop `prose` (default
  `false` → classe `not-prose` sur le wrapper, ce qu'on veut pour nos démos).
- `::prose-callout{variant="…"}` : variantes `default | info | success |
warning | error | tip | note | example` (+ `filled`, `title`, `description`,
  `icon`, `url`). Remplace `::note` / `::tip` de Docus.
- `::prose-card{icon title description to href}` : carte cliquable (NuxtLink),
  slots `icon`/`title`/`default`/`footer`. Pas de `card-group` dans Docd → les
  cartes s'empilent.
- Autres blocs dispo : `prose-code-group`, `prose-code-tree`,
  `prose-code-collapse`, `prose-steps`/`prose-step`, `prose-pm-x`,
  `prose-pm-install`, `prose-pm-run`, `prose-icon-list`, `prose-tabs`,
  `prose-field`/`prose-field-group`, `prose-collapsible`, `prose-mermaid`.
- Le layer génère nativement `llms.txt` + `llms-full.txt` (nuxt-llms) et des
  routes `/raw/**/*.md` — pas besoin du script `gen-llms.mjs` de `ddocs/`.

**Frontmatter** : le schéma `page` de Nuxt Content v3 inclut déjà `title`,
`description`, `navigation` **et `seo`** (cf. `pageStandardSchema` dans
`@nuxt/content/dist/module.mjs`) → le `seo:` des pages `ddocs/` est conservé
(pas de perte SEO). Icônes de navigation : convention Docd `lucide:x`.

**Noms de composants** : `components: [{ path: "~/components", pathPrefix: false }]`
dans `docd/nuxt.config.ts` → `app/components/demos/DnaxDemoBtn.vue` s'utilise
`<dnax-demo-btn>` (et non `<demos-dnax-demo-btn>`), comme dans `ddocs/`.

**Ordre / routing** : `content/docs/**` (préfixe `/docs`), les préfixes numériques
`1.getting-started`, `4.components`… ordonnent la sidebar et sont retirés de
l'URL — identique à `ddocs/`. Les `.navigation.yml` de dossier sont copiés tels
quels.

## Ajouter une directive `v-*` à @dnax/ui — recette — 2026-09-10

Quatre points à toucher (sinon la directive disparaît ou n'est pas enregistrée) :

1. **Implémentation** — `packages/ui/lib/<nom>.ts`, export `v<Pascal>` (objet
   `{ mounted, updated?, unmounted? }`). Style maison : closures par élément,
   nettoyage stocké sur l'élément (`el.__qXxx`), `binding` typé localement
   (`{ value?, arg?, modifiers? }`) plutôt que `DirectiveBinding` de Vue, garde
   `typeof document/getComputedStyle === "undefined"` si besoin, commentaires FR
   en tête (usage + modifiers).
2. **Export** — ajouter au bloc `manualExports` de
   `packages/ui/scripts/generate-exports.ts` (le fichier `index.ts` est
   **entièrement régénéré** par `bun run generate` : tout export manuel absent de
   ce script est écrasé), puis relancer `bun run generate`.
3. **Enregistrement** — plugin UNIVERSEL `dnax-ui-directives.mjs` dans
   `packages/ui/module.ts` : `import { vXxx } from "@dnax/ui/runtime"` +
   `nuxtApp.vueApp.directive("kebab-case", vXxx)`. **Pas** de `mode: "client"` :
   sans enregistrement serveur, tout rendu SSR/SSG d'une page utilisant la
   directive crash (`dir.getSSRProps` sur directive non résolue). Une directive
   sans `getSSRProps` rend `{}` en SSR (no-op) — c'est le comportement voulu.
4. **Docs** — page `docd/content/docs/6.directives/<nom>.md` (frontmatter +
   `## Setup` / `## Usage` / `## Live demo` avec `::prose-show-case` /
   `## Value` / `## Modifiers` / `## How it works`) + composant de démo
   `docd/app/components/demos/DnaxDemo<Nom>.vue` (un `defineProps<{ demo: ... }>()`
   par page, styles scoped). Vérifier les collisions de nom avec une page
   composant (cf. warnings).
