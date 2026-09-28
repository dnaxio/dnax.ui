# warnings — Pièges et erreurs rencontrés

Tag : `warnings` · `namespace: dnax.ui` · `worktree: /Volumes/D/PKG/dnax.ui`

## MDC / ddocs — une balise auto-fermante avale tout ce qui la suit — 2026-09-10

`filename: ddocs/content/docs/4.components/*.md` (+ tout composant `DnaxDemo<Page>`)

**Symptôme** : dans une page MDC de `ddocs/`, un composant écrit en **auto-fermant**
(`<DnaxDemoXxx demo="…" />`, `<DnaxApi name="QXxx" />`, `<q-avatar … />`, `<q-app />`…)
englobe **tous les nœuds suivants** du même bloc HTML comme _enfants_. Conséquences
vérifiées :

1. Le `<template v-slot:code>` du `::code-preview` devient un enfant du composant de
   démo → `code-preview` (`@nuxt/ui` `dist/runtime/components/prose/CodePreview.vue`,
   `v-if="!!slots.code"`) ne reçoit plus de slot `code` → **l'onglet Code disparaît**.
   Preuve : `ddocs/.output/public/docs/components/btn.html` — les blocs « Interactive
   loading » / « Click event » de `btn.md` (le modèle canonique !) n'ont pas de bloc
   code, contrairement à leurs démos statiques inlinées.
2. Un `<DnaxApi … />` suivi d'une nouvelle section `##` (pages famille) avale la suite
   de la page ; `ddocs/app/components/DnaxApi.vue` n'ayant pas de `<slot/>`, **tout le
   contenu suivant est perdu** à l'affichage.
3. Des frères `div`/`span` auto-fermants (ex. plusieurs `<q-avatar … />` dans un
   `demo-row`) sont **imbriqués** dans le DOM SSR — le navigateur ne « dé-imbrique »
   que les `<button>`, donc seuls les boutons s'en sortent visuellement.

**Cause** : `rehype-raw` (`@nuxtjs/mdc`) re-parse le HTML brut avec parse5 en mode HTML
→ `/>` est ignoré pour tout élément non-void. De plus le handler `html.js` de
`@nuxtjs/mdc` réécrit le nom de balise en kebab-case via `String.replace` (PascalCase →
kebab), donc **une balise fermante laissée en PascalCase ne correspond plus** à la
balise ouvrante réécrite.

**Correctif appliqué (batch accordion → back-header)** : dans le **markup live** des
`.md`, toujours kebab-case **+** balise fermante explicite :

```md
<dnax-demo-avatar demo="sizes"></dnax-demo-avatar>
<dnax-api name="QAvatar"></dnax-api>
<q-app></q-app>
<q-btn flat round icon="lucide:phone"></q-btn>
```

**Préférer désormais la syntaxe MDC inline** pour tout composant **sans enfant**
(norme des derniers lots, ex. `reorder.md`, `list.md`, `input.md`) :

```md
:dnax-demo-avatar{demo="sizes"}
:dnax-api{name="QAvatar"}
```

Vérifié avec le vrai parseur (`createMarkdownParser` de `@nuxtjs/mdc/runtime`) :
sur une ligne seule, le nœud `textComponent` est **enfant direct de `root`** (pas de
`<paragraph>`), donc ni perte de slot ni `<p><div>` ; alors que la forme explicite
`<dnax-api …></dnax-api>` est re-parsée en nœud `raw` **dans un `<p>`**. Les deux
formes sont valides (pas d'auto-fermant) — l'inline est simplement plus sûre.

Les fences `#code` gardent la syntaxe auto-fermante **exacte** de la source (l'extra
snippet est ce que le lecteur copie : les composants s'y utilisent en auto-fermant,
c'est valide en SFC).

⚠ Pages converties **avant** ce correctif, donc à reprendre : `btn.md` (démos
`DnaxDemoBtn`), `back-top`, `badge`, `bar`, `board`, `bottom-sheet`, `breadcrumbs`,
`btn-actions`, `btn-dropdown`, `btn-group`, `bubble`, `card`, `carousel`, `checkbox`,
`chip`, `circular-progress`, `collapse`, `container`, `count-down`, `country-picker`,
`data-grid`, `date-picker`, `dialog`, `fab`.
Priorité : pages famille (tout ce qui suit le 1ᵉʳ `<DnaxApi />` est invisible) puis
démos passées par `DnaxDemo<Page>` (onglet Code manquant).

**Vérif outillage** : parser les `.md` avec `createMarkdownParser` de
`@nuxtjs/mdc/runtime` (dans `ddocs/`) et contrôler que, dans l'AST, le nœud
`template v-slot:code` est **frère** du composant de démo (et non son enfant), et
qu'aucun élément n'a d'enfant portant le même `tag`.

## MDC / ddocs — l'attribut `accept` est découpé en tableau (piège des attributs « comma-separated ») — 2026-09-10

`filename: ddocs/content/docs/4.components/*.md`

**Symptôme** : dans le markup live d'une page MDC, `accept="image/*"` arrive au
composant sous forme de **tableau** (`["image/*"]`) et non de chaîne.

**Cause** : `@nuxtjs/mdc` (parser) résout les attributs via `property-information`
(`find(html, key)`) : les attributs définis comme **comma-separated** (`accept`,
`srcset`, `sizes`, `class`…) sont découpés sur `,`. Ensuite `MDCRenderer.propsToData`
rejoint un tableau de chaînes avec **un espace** (`value.join(" ")`).

Conséquences :

- `accept="image/*"` → `["image/*"]` → rejoint en `"image/*"` : OK.
- `accept="image/*,.pdf"` → `["image/*", ".pdf"]` → rejoint en `"image/* .pdf"` :
  **invalide** (séparateur espace au lieu de virgule).
- Un composant qui fait `props.accept.trim()` (ex. `QFilePicker`, `QImagePicker`)
  peut casser si la valeur n'est pas une chaîne (cas d'un tableau non-string).

**Correctif / règle** : dans le markup live, n'utiliser qu'**une seule valeur** pour
ces attributs (`accept="image/*"`) ; documenter la liste complète (virgules) en
prose ou dans le fence `#code` (les fences ne sont pas parsés). Pour plusieurs
valeurs, utiliser un binding littéral `:accept='"image/*,.pdf"'` (résolu par
`evalInContext`+`destr`, renvoie bien une chaîne).

**Vérif outillage** : parser la page avec `parseMarkdown` (`@nuxtjs/mdc/runtime`) et
signaler tout `props[k]` de type `Array` sur un élément live (hors `className`, qui
doit être un tableau de classes).

### Complément (2026-09-10) — la syntaxe MDC inline est sûre, elle aussi

`<Dnax… />` (auto-fermant) est le seul piège. Deux écritures équivalentes sont
correctes pour un composant _childless_ :

- **syntaxe MDC inline** (forme préférée par `CONVERSION.md`) :
  `:dnax-demo-reorder{demo="basic"}`, `:dnax-api{name="QReorder"}` — vérifié avec
  `parseMarkdown` : nœud `element` (tag + props) **frère** du `v-slot:code` ;
- **kebab-case + balise fermante explicite** (lots précédents) :
  `<dnax-demo-avatar demo="sizes"></dnax-demo-avatar>`.

Ne pas mélanger les deux dans une même page ; le lot `radio → scroll-area` utilise
la syntaxe inline (cf. `.memory/knowledges.md`).

## DnaxDemo<Page> — prop `demo` + état local `demo` = collision silencieuse — 2026-09-10

`filename: ddocs/app/components/demos/DnaxDemo<Page>.vue`

Si le composant de démo déclare `defineProps<{ demo: … }>()` **et** un
`const demo = ref(...)` / `reactive(...)` local (nom repris de la page source, ex.
`inner-loading.vue` avec `const demo = reactive({ basic: false, … })`), le binding
`const demo` **masque la prop** dans le template : `v-if="demo === 'basic'"` compare
alors l'objet à une chaîne → aucune démo ne s'affiche, et **sans erreur de
compilation**.

**Correctif** : renommer l'état interne (ex. `state`) en réservant `demo` à la prop ;
les fences `#code` gardent le nom source (`demo.basic`). Idem pour tout identifiant
qui doublerait un nom de prop (`size`, `state`…).

## ddocs — aucun `QConfigProvider` monté au niveau app → les démos `$q.*` n'ont pas de rendu — 2026-09-10

`filename: ddocs/app/**` (+ pages `5.plugins/*.md`)

**Constat** : `ddocs/` (Docus) n'a **ni `app.vue` ni layout local** (seul le layer
`docus` fournit l'app : `node_modules/docus/app/app.vue` = `UApp` + `AppHeader` +
`NuxtLayout`/`NuxtPage` + `AppFooter`). Or les providers d'overlays ne sont
**jamais auto-montés** : `QConfigProvider` est le seul à rendre
`QDialogProvider` / `QBottomSheetProvider` / `QNotifyProvider` /
`QLoadingProvider` / `QImagePreviewProvider` (`packages/ui/components/QConfigProvider.vue`,
`isProvidersRoot = !inject(qProvidersKey)`), et `usePlugin()` ne fait que renvoyer
le singleton module-level `$q` (`packages/ui/lib/q.ts`) — il pousse sur les piles
mais ne rend rien.

**Conséquence** : dans `ddocs/`, `$q.dialog.open()`, `$q.bottomSheet.open()`,
`$q.notify.show()`, `$q.loading.show()` et `$q.imagePreview.open()` **n'affichent
rien** tant qu'un `QConfigProvider` n'est pas monté au-dessus de la page. Le
problème est **pré-existant** (déjà le cas de la démo `programmatic` de
`4.components/image-preview.md`), pas introduit par les pages plugins.

**Correctif conseillé** : monter `QConfigProvider` dans l'app ddocs (app.vue
recopiant le layer docus, ou layout `docs`/`default` qui enveloppe `<slot>`).
⚠ Ne PAS ajouter un **second** providers root (ex. plugin client montant un app
Vue séparé) : `isProvidersRoot` ne serait pas partagé entre apps → doublons de
providers (chaque overlay rendu 2×) et conflit sur la classe `.dark` posée sur
`<html>` (`watch isDark` de QConfigProvider force le mode `light|dark|system`).
Un plugin séparé devrait en plus synchroniser `useColorMode()` pour ne pas casser
le toggle de thème Docus.

**À vérifier** quand le provider sera monté : `DemoConfirmDialog` /
`DemoScrollDialog` / `DemoShareSheet` (portés dans
`ddocs/app/components/demos/`) et les 7 démos `5.plugins/*`.

## ddocs — `DnaxDemo<Page>` : collision de nom entre page composant et page directive — 2026-09-10

`filename: ddocs/app/components/demos/DnaxDemoIntersection.vue`

`DnaxDemoIntersection.vue` (démos du composant `QIntersection`, page
`4.components/intersection.md`) porte déjà le nom qu'imposerait la convention
`DnaxDemo<Page>` pour la **directive** `v-intersection`
(`6.directives/intersection.md`). Réutiliser le fichier mélangerait deux pages
(et l'écraserait).

**Correctif** : le composant de démo de la directive est nommé
`DnaxDemoIntersectionDirective.vue`, référencé
`:dnax-demo-intersection-directive{demo="basic"}`. Avant de créer un
`DnaxDemo<Page>.vue`, vérifier l'absence de collision de nom — une page composant
et une page directive peuvent partager le même slug (ex. `intersection`).

## ddocs — `.demo-grid` : helper global flex qui casse les démos QGrid/QRow — 2026-09-10

`filename: ddocs/content/docs/3.styles/{1.grid,2.col,3.row}.md` +
`ddocs/app/components/demos/DnaxDemo{Grid,Col,Row}.vue`

Les pages source `grid.vue` / `col.vue` / `row.vue` posent `class="demo-grid"` sur
leur `q-grid` / `q-row`, alors que **le CSS scoped de la page ne définissait pas
`.demo-grid`** (classe inerte dans l'app legacy `docs/`). Dans `ddocs/`,
`.demo-grid` est un helper **global** de `ddocs/app/assets/css/main.css`
(`display:flex; flex-wrap:wrap; gap:14px; align-items:flex-start; width:100%`) :
posé sur un `.q-grid` (`display:grid`, `gap:var(--q-grid-gap)`) il le transforme en
flex et écrase le `gap` → toutes les démos de grille cassées (les `q-col`
positionnés par `grid-column` ne se placent plus).

**Correctif** : dans les 3 composants de démo, redéfinir `.demo-grid` **en scoped**
avec les valeurs de `.q-grid` — la spécificité scoped (`.demo-grid[data-v-x]`,
0,2,0) repasse devant le helper global (0,1,0) :

```css
.demo-grid {
  display: grid;
  grid-template-columns: repeat(var(--q-grid-cols, 12), minmax(0, 1fr));
  gap: var(--q-grid-gap, 16px);
  row-gap: var(--q-grid-row-gap, var(--q-grid-gap, 16px));
  column-gap: var(--q-grid-column-gap, var(--q-grid-gap, 16px));
  width: 100%;
}
```

`align-items` vient de l'inline style de QGrid (`props.align`) → rien à faire.
Généralisation : dès qu'une `class="demo-*"` d'une page source est **inerte** (ou
définie avec d'autres valeurs) mais correspond à un helper global de `ddocs/`, la
classe doit être re-déclarée dans le scope du composant de démo (même piège que
`.demo-row` / `.demo-label` déjà consigné).

## docd — le lien workspace `@dnax/ui` ne se fait pas tout seul — 2026-09-10

`filename: docd/package.json`, `bun.lock` (racine)

**Symptôme** : après avoir ajouté `docd/` aux `workspaces` racine et passé
`@dnax/ui` en `workspace:*`, `bun install` annonce "no changes" mais
`docd/node_modules/@dnax/ui` reste une **copie npm** (dossier réel, mtime
antérieur) et non un lien vers `packages/ui`.

**Cause** : la version npm déjà installée (`0.0.35`) satisfaisait le résolveur ;
bun n'a pas relinké.

**Correctif** :

```bash
rm -rf docd/node_modules/@dnax && bun install
ls -la docd/node_modules/@dnax/ui   # -> ../../../packages/ui
```

À vérifier systématiquement après tout ajout de workspace : le lien doit être un
`symlink` (les sources `packages/ui` sont alors prises en compte en dev).

## docd — tables d'API « Loading… » dans le HTML prérendu — 2026-09-10

`filename: docd/app/components/DnaxApi.vue`

`useComponent()` (porté de `ddocs/`) résout le composant dans un `watchEffect`
async : en SSR le `await import("@dnax/ui/runtime")` n'est **pas** attendu → le
HTML prérendu ne contient que `dnax-api__empty` (« Loading… ») et les tables ne
se remplissent qu'à l'hydratation.

**Correctif (docd)** : résoudre le module pendant le `setup` via
`const runtime = await import("@dnax/ui/runtime")` (top-level await, composant
asynchrone géré par le Suspense de Nuxt) puis `const comp = computed(() =>
runtime[props.name] ?? null)`. Vérif : `dnax-api__empty` n'apparaît plus dans le
HTML prérendu (hors CSS) et les `<td><code>modelValue</code>` sont présents.

## `stretch` inopérant sous une racine `display: inline-flex` — 2026-09-10

`filename: packages/ui/styles/main.css` (`.q-btn-actions`, `.q-btn-group`)

**Symptôme** : `<q-btn-dropdown stretch>` (ou `<q-btn-group stretch>`) ne s'étire pas
sur la largeur du conteneur ; il fallait ajouter `class="w-full"` côté consommateur
(contournement relevé dans `platform/app/layouts/space.vue`).

**Cause** : la racine `.q-btn-actions` / `.q-btn-group` est `display: inline-flex`
→ « shrink-to-fit » : elle se réduit à la taille de son contenu. Le
`.q-btn--stretch { width: 100% }` du QBtn interne ne fait donc 100 % que… de ce
parent déjà réduit → aucun effet visuel (et le caret, poussé par `margin-left: auto`,
n'avait aucun espace libre à absorber).

**Règle générale** : quand un composant à racine `inline-flex` expose `stretch`, la
**racine** doit passer à `width: 100%` — pas seulement l'enfant.

**Correctif** : `.q-btn-actions--stretch { width: 100% }` (classe posée par
`QBtnActions.vue` sur sa racine) + `.q-btn-group--stretch { width: 100% }`, même
schéma que `.q-tabs--stretch` déjà en place pour `QTabs`.

## Ripple : double onde clic + clavier sur les éléments activables — 2026-09-10

`filename: packages/ui/lib/ripple.ts`

**Symptôme** : avec un listener `click` **et** un listener `keyup` (modèle
Quasar), appuyer sur Entrée ou Espace dans un `<button>` / `<a href>` produit
**deux** ondes : le navigateur synthétise déjà un `click` d'activation clavier,
puis `keyup` redéclenche l'onde. Quasar évite le doublon par le flag
`qSkipRipple` posé par ses composants (QBtn…), ce que notre implémentation
n'avait pas.

**Correctif retenu** (auto-suffisant, sans coopération des composants) :

- si l'hôte est activable nativement (`button, a[href],
input[type=button|submit|reset]`), **aucun listener clavier** n'est posé —
  c'est le `click` natif qui déclenche l'onde ;
- un clic généré au clavier a `detail === 0` (pas de coordonnées fiables) →
  l'onde est **forcée au centre** (`forceCenter`), comme Quasar sur ses key events.

**Piège lié** : le conteneur `.q-ripple` est en `position: absolute` → il faut un
bloc conteneur. Quasar impose au consommateur la classe `relative-position` ; ici
la directive vérifie `getComputedStyle(el).position === "static"` et pose
`position: relative` elle-même, en mémorisant la valeur inline d'origine pour la
**restaurer au démontage** (ne pas oublier ce `prevPosition`, sinon on laisse un
style inline résiduel sur l'élément).

## Icônes/couleurs de texte noires codées en dur sans surcharge dark — 2026-09-10

`filename: packages/ui/styles/main.css`

**Symptôme** : en mode dark, des icônes et des textes restent **noirs** (donc
quasi invisibles) — ex. remonté sur le chevron de `q-select`.

**Cause** : la feuille pose la couleur de base en dur (`color: rgb(0 0 0 / 0.5)`…)
sur le sélecteur du composant, et le bloc `.dark` (en haut du fichier) ne couvre
pas ce sélecteur. La couleur explicite gagne sur le `color` hérité de
`.dark .q-field__control` / `.dark .q-select__popup` → l'élément reste noir.

**Règle** : toute déclaration `color: rgb(0 0 0 / …)` doit avoir son pendant en
dark ; soit `var(--foreground)` (icônes fonctionnelles : chevrons, loupe, icône
de champ), soit `rgb(255 255 255 / 0.65)` (texte secondaire, aligné sur
`.dark .q-field__hint`).

**Correctif de ce lot** : groupe d'icônes `.dark .q-field__icon,
.dark .q-select__arrow, .dark .q-autocomplete__arrow, .dark .q-select__search-icon,
.dark .q-autocomplete__search-icon { color: var(--foreground) }` + groupes d'états
vides `.dark .q-select__empty, .dark .q-autocomplete__empty`.

**Méthode d'audit** (à relancer après tout ajout de styles) — repérer les règles
avec une couleur de texte noire dont aucune classe n'apparaît dans un sélecteur
`.dark` :

```py
# python3, depuis la racine : extrait les sélecteurs non couverts par .dark
import re
src = open('packages/ui/styles/main.css').read()
rules   = re.findall(r'([^{}]+)\{([^{}]*)\}', src)
dark    = ' '.join(s for s, _ in re.findall(r'(\.dark[^{}]*)\{([^{}]*)\}', src))
for sel, body in rules:
    if re.search(r'(^|;)\s*color\s*:\s*rgb\(\s*0\s+0\s+0', body) and not sel.strip().startswith('.dark'):
        cls = re.findall(r'\.([a-zA-Z0-9_-]+)', sel)
        if cls and not any(c in dark for c in cls): print(sel.strip())
```

**Candidats restants au 2026-09-10** (non corrigés, hors périmètre du lot — à
vérifier au cas par cas, certains vivent peut-être sur une surface claire) :
`.q-field__prefix`, `.q-field__suffix`, `.q-field__counter`,
`.q-image-picker__add-label`, `.q-file-picker__preview`, `.q-file-picker__size`,
`.q-file-picker__add-label`, `.q-table__no-data`,
`.q-autocomplete__search-input::placeholder`, `.q-bottom-sheet__description`,
`.q-action-sheet__title`, `.q-date-picker__field-icon`, `.q-date-calendar__weekday`,
`.q-dialog__description`, `.q-bubble--muted .q-bubble__content`,
`.q-infinite-scroll__loading`, `.q-input-otp__separator`.

## `table-layout: fixed` + `min-width: 100%` → toutes les colonnes gonflent — 2026-09-10

`filename: packages/ui/styles/main.css` (`.q-spreadsheet__table`)

**Symptôme** : dans `QSpreadsheet`, la gouttière des numéros de ligne (34px)
envahissait l'espacement — jusqu'à ~70px sur une grille à 2 colonnes — et les
largeurs de colonnes configurées étaient ignorées.

**Cause** : `.q-spreadsheet__table { table-layout: fixed; width: max-content;
min-width: 100% }`. Quand la somme des colonnes est **inférieure** à la largeur du
conteneur, `min-width: 100%` étire le tableau et le navigateur **répartit l'espace
libre sur toutes les colonnes** (proportionnellement à leurs largeurs). La gouttière
(la plus étroite) doublait donc de largeur, comme toutes les autres colonnes.

**Règle générale** : avec `table-layout: fixed`, une largeur de colonne n'est
respectée **exactement** que si le tableau n'est pas étiré au-delà de la somme des
colonnes. Pour garder des largeurs exactes ET remplir le conteneur, il faut une
**colonne de remplissage** (cellule sans largeur qui absorbe le rab) — sinon c'est
l'étirement qui gagne.

**Correctif appliqué** : `min-width: 100%` retiré du tableau (les largeurs
deviennent exactes, l'espace à droite reste vide, façon tableur) + classe
`q-spreadsheet__table--empty` (rendue quand `cols.length === 0`) qui rétablit
`min-width: 100%` : dans ce cas il n'y a **qu'une** cellule de message, c'est elle
qui prend toute la largeur.

**Alternative écartée** (à proposer si on veut que la grille remplisse malgré tout
le conteneur) : ajouter une `<th>`/`<td>` de remplissage à chaque ligne — ça marche
mais touche le thead, chaque ligne du tbody et les `<td :colspan>` des états vides.

## QSpreadsheet : `.trim()` sur une valeur non-string (`label` d'option) — 2026-09-10

`filename: packages/ui/components/QSpreadsheet.vue`

**Symptôme** : `Uncaught (in promise) TypeError: s.trim is not a function`, signalé à
la ligne du watch de `fxQuery` (barre de formule).

**Cause** : `draft` (brouillon de l'éditeur de cellule) était alimenté par
`opt?.label` d'une colonne `select` : `QSpreadsheetCellOption.label` est typé
`string`, mais **rien n'empêche un consommateur de passer un nombre** (cas très
courant : `options: [{ value: 1, label: 1 }, …]` pour une note / un niveau).
`fxSource = editing ? draft : fxDraft` → `s.trim()` sur un `number` → throw. Le
même piège existait dans les autres appels de méthodes de chaîne :
`selectOptions` (`draft.trim().toLowerCase()` + `o.label.toLowerCase()`),
`coerceValue` (`text.trim()`), `filterValueItems` (`a.label.localeCompare`),
`sortByColumn` (`(opt?.label ?? …).toLowerCase()`), `findTextOf` → `findScan`
(`.toLowerCase()`), `cellTitle` / `copySelection` (types menteurs).

**Règle générale** : toute valeur issue de `state`/`columns[].options` doit être
`String()`-coercée **avant** une méthode de chaîne (`trim`, `toLowerCase`,
`localeCompare`, `includes`, `startsWith`) — les types TS ne protègent pas du JS.

**Correctif** : coercition **à la source** (`draft.value = String(initial ??
opt?.label ?? "")`, `pickOption`, `fxSource = String((editing ? draft : fxDraft) ??
"")`) **et** aux points de lecture de label (`sortByColumn`, `selectOptions`,
`filterValueItems`, `findTextOf`, `cellTitle`, `copySelection`) ; `coerceValue` prend
désormais `text: unknown` et normalise une fois (`const raw = String(text ?? "")`).
Le fix sur `fxSource` suffit à lui seul à rendre l'erreur signalée impossible.

**Garde-fou de démo** : colonne `rating` (`type: "select"`, `options` à labels
**numériques** `{ value: 1, label: 1 }…`) ajoutée à la démo « Cell types » de
`DnaxDemoSpreadsheet.vue` → permet de rejouer le cas à la main (éditer une cellule
Rating) dans `/docs/components/spreadsheet`.

Vérif : `cd docd && bun run generate` → 0 erreur ; colonne `Rating` rendue dans le
tableur ; `diagnostics` sur `QSpreadsheet.vue` → 0 erreur / 0 warning ; `bun test
packages/ui/lib` → 41/41.

### Cause racine trouvée ensuite : `v-model` sur `input[type="number"]` — 2026-09-10

Second rapport : `TypeError: draft.value.trim is not a function`, cette fois à
l'édition d'une cellule **numérique**. Le vrai coupable était l'éditeur :
`editorInputType` renvoyait `"number"` pour `number`/`integer`, et **`v-model` sur un
`input[type=number]` caste la valeur en `Number`** (directive `vModelText` de Vue).
D'où : `draft` = number → `editingIsFormula` (`draft.value.trim()`),
`draftLines` (`draft.value.split()`), `positionEditor` (`draft.value.length`),
`selectOptions`, `acceptFx` (`replaceTail`) explosaient ou donnaient `NaN`.

- **Correctif racine** : `editorInputType` ne renvoie plus jamais `"number"`
  (number/integer → `"text"`) ; le clavier numérique mobile passe par
  `:inputmode="editorInputMode"` (`decimal` / `numeric`). Bénéfice au passage : on
  peut enfin **taper une formule `=` dans une cellule numérique** (un input number
  refuse `=`, `-` isolé, etc.), ce que la doc promettait déjà. `editorStep` et
  `:step` supprimés (spinner natif, ignoré en `type="text"`).
- **Défense** : `String(draft.value ?? "")` aux 5 points de lecture ci-dessus.

**Règle générale (à retenir)** : ne jamais mettre `v-model` sur un
`input[type="number"]` (ou `range`) quand le modèle est censé être une string — Vue
caste en `Number`. Préférer `type="text"` + `inputmode`, ou un handler `:value` +
`@input` manuel.

## Popup qui ne se ferme pas au clic extérieur (`stopPropagation` parent) — 2026-09-10

`filename: packages/ui/components/QSelect.vue` (+ QAutocomplete, QDatePicker,
QCountryPicker, QBtnActions, QNavMenu, QFab, QSwipeCell, QSpreadsheet, QTiptap)

**Symptôme** : `q-select`, `q-autocomplete`, `q-date-picker` (inline),
`q-btn-actions` / `q-btn-dropdown`… ne se ferment pas quand on clique ailleurs dans
la page — en pratique surtout **dans un `<q-dialog>`**.

**Cause** : tous ces composants écoutaient déjà `document.addEventListener("mousedown",
…)` mais en **phase de bulle**. Or `QDialog` pose `@mousedown.stop` sur son contenu
(`.q-dialog__content`, cf. `QDialog.vue`) — idem `QDataGrid` — donc tout `mousedown`
déclenché _à l'intérieur_ du dialog est stoppé avant d'atteindre `document` : le
handler extérieur ne tourne jamais.

**Règle** : un listener « clic extérieur → fermer » se pose en **phase de capture**
(`addEventListener(type, fn, true)`) — la capture descend de `window` vers la cible
AVANT les `stopPropagation` de la bulle. ⚠️ Mettre le **même `true` au
`removeEventListener`**, sinon fuite de listener.

**Correctif** : `, true` sur add/remove pour QBtnActions, QSelect, QAutocomplete,
QDatePicker, QCountryPicker, QNavMenu, QFab, QSwipeCell, QSpreadsheet (window +
`pointerdown`) et QTiptap (palette). Les listeners **clavier** (Échap) restent en
bulle : aucun parent ne stoppe le `keydown`.

Vérif : `bun run generate` → 0 erreur ; `diagnostics` projet → 0 erreur / 0 warning
(le linter avait aussi révélé 2 erreurs de types, corrigées : cf. décision
« `QSpreadsheetCellOption.label` accepte les nombres » et démo `inlineRows: any[]`).

## Menu téléporté qui s'affiche DERRIÈRE un overlay (z-index) — 2026-09-10

`filename: packages/ui/styles/main.css`

**Symptôme** : `<q-spreadsheet>` placé dans un `<q-dialog>` → clic droit sur une
colonne, le menu contextuel apparaît **derrière** le dialog.

**Cause** : les menus du tableur sont **téléportés dans `<body>`**
(`position: fixed`) avec `z-index: 1300`, alors que l'overlay modal est à `3000`
(`.q-dialog__overlay`, `.q-bottom-sheet__overlay`, `.q-select__overlay`,
`.q-action-sheet__overlay`, pickers…). Téléportés tous les deux dans `<body>`, seul
le z-index tranche → le menu passe dessous.

**Règle** : un **menu** téléporté (non modal) doit toujours être AU-DESSUS de la
couche overlay. Les popups **en flux** (`position: absolute` dans leur champ :
select, autocomplete, nav-menu) ne sont pas concernés : ils vivent dans le contexte
empilement de leur parent (donc dans le dialog si le champ y est).

**Échelle des z-index désormais documentée dans `main.css` (`:root`)** :
`1000` popups en flux · `1999/2000` sidebar offcanvas + backdrop · `3000` overlays
modaux (dialog, bottom sheet, action sheet, pickers) · **`3200` menus téléportés
(`--q-z-menu`)** · `4000` palettes tiptap · `7000` loading global · `9999` tooltip ·
`10000` image preview. Ne pas inventer une valeur hors échelle : mettre à jour le
commentaire d'échelle avec la nouvelle couche.

**Correctif** : `--q-z-menu: 3200` + commentaire d'échelle, appliqué à
`.q-btn-actions__panel` (était `3000` : égalité fragile avec le dialog, l'ordre DOM
tranchait), `.q-spreadsheet__ctx` / `.q-spreadsheet__fpop` (étaient `1300`) et
`.q-spreadsheet__fnsug--fx` (était `1320` → `calc(var(--q-z-menu) + 30)`).

**Écarté** : un empilement incrémental (à la popper) — inutile ici : les overlays
d'un même niveau peuvent partager `3000`, le dernier monté passe devant (comportement
standard reka-ui/radix).

Docs : note dans `spreadsheet.md` (menu contextuel + filtre + suggestions) et
`btn-dropdown.md` (panneau téléporté) ; surcharge possible
`:root { --q-z-menu: 3600 }` si une app a un overlay plus haut.

Vérif : CSS du bundle relu (`--q-z-menu:3200`, `z-index:var(--q-z-menu,3200)` sur
`.q-spreadsheet__ctx,.q-spreadsheet__fpop` et `.q-btn-actions__panel`,
`calc(var(--q-z-menu,3200) + 30)` sur `.q-spreadsheet__fnsug--fx`) ; `bun run
generate` → 0 erreur.

## Doc : un sous-dossier de section doit avoir un `index.md` — 2026-09-14

`filename: docd/content/docs/4.components/charts/`

**Symptôme** : créer un dossier `charts/` (avec `.navigation.yml` + `1.line.md` +
`2.bar.md`) sous une section fait **échouer le prerender** :

```
ERROR [request error] [fatal] [GET] http://localhost/docs/components/charts
  │ ├── [404] Page not found
ERROR  Exiting due to prerender errors.
```

**Cause** : l'entrée de navigation d'un dossier pointe vers **sa propre route**
(`/docs/components/charts`) et le crawler du prerender la suit ; sans `index.md`,
aucune page n'existe à cette route → 404 **fatal** (le build s'arrête).

**Correctif** : ajouter `index.md` dans le dossier (il devient la page du groupe) ;
les pages filles restent dans la barre latérale repliable. Les sections de premier
niveau existantes ne posaient pas le problème, mais le réflexe vaut pour tout
nouveau dossier.

## TS : `Array.isArray` ne narrow pas `readonly any[]` — 2026-09-14

`filename: packages/ui/lib/chart.ts`

Dans une union `string | readonly any[] | ((d, i) => any)`, un
`if (Array.isArray(x)) { … }` laisse `readonly any[]` subsister dans la branche
**false** (le type predicate de `Array.isArray` est `any[]`) → `row[x]` échoue avec
« Type 'readonly any[]' cannot be used as an index type ».

**Contournement** : tester la forme objet (`typeof x === "object" && x !== null`) puis
caster — `const arr = x as readonly any[]` — ce qui retire bien le membre de l'union.

## Doc : les tokens `:root` de dnax.ui écrasaient le thème de l'app hôte — 2026-09-14

tag: `warning` — `namespace: dnax.ui` — `filename: packages/ui/styles/main.css`

Symptôme : dans la doc (`docd`), des **surfaces violettes** apparaissaient alors que
le thème Docd est bleu (`.theme-blue`) — barre latérale au survol, entrées de menus,
états actifs.

**Cause** : `styles/main.css` déclarait la palette Material dans un `:root` **hors
couche**, et le module `@dnax/ui` fait `nuxt.options.css.push(...)` → la feuille dnax
est émise **après** celle de l'hôte. `--accent` de dnax vaut `#9c27b0` (accent
Material = violet), celui du thème Docd vaut `oklch(96.7% .001 286.375)` (gris clair)
et sert de fond de survol shadcn (`.hover\:bg-accent`) : même spécificité (`:root` vs
`.theme-*` = 0,1,0), donc **l'ordre source tranche → dnax gagne**. Le piège est
sémantique en plus d'être un problème de cascade : `--accent` n'a **pas** le même sens
chez Quasar (couleur d'accent) et chez shadcn (surface de survol) ; idem pour
`--primary`, `--secondary`, `--muted`, `--border`, `--background`, `--foreground`,
`--card`.

**Correctif** : envelopper les deux blocs de tokens de couleur (`:root` et le `.dark`
correspondant) dans **`@layer dnax-tokens`** — une règle hors couche gagne toujours
sur une règle en couche, quelle que soit la spécificité ou l'ordre d'émission. Le
thème de l'hôte (Docd/Docus, shadcn-vue…) reprend la main, et dnax reste fonctionnel
seul (aucune règle concurrente). `color-scheme: dark` est resté **hors** couche.

Diagnostic : `docd/.output/public/_nuxt/entry.*.css`, comparer l'ordre et la couche
de `:root{--primary:#1976d2` et de `.theme-blue{` (`@layer` n'est pas hérité par un
simple `rfind('}')` — il faut piler les `{`/`}`).

## SKILL.md : un `:` suivi d'une espace dans le `description` casse le frontmatter — 2026-09-14

tag: `warning` — `filename: .agents/skills/*/SKILL.md`

Un frontmatter de skill écrit en **scalaire YAML non quoté** ne supporte pas la
séquence `"` + espace (deux-points + espace) : `yaml` lève
« Nested mappings are not allowed in compact mappings » et **le skill n'est plus
chargé du tout** (échec silencieux côté éditeur).

```md
---
name: echarts-skill
description: … lib/chart.ts : marks … ← INVALIDE (colonne 14)
---
```

**Correctifs possibles** : remplacer par une virgule / un tiret cadratin
(`lib/chart.ts, marks …`), ou **quoter** la valeur (`description: "…"`, en échappant
les `"` internes). Vérifier après écriture :

```bash
cd docd && bun -e 'const fs=require("fs"),YAML=require("yaml");YAML.parse(fs.readFileSync("../.agents/skills/echarts/SKILL.md","utf8").split("---")[1])'
```

Les autres `:` sont sans danger s'ils ne sont **pas** suivis d'une espace (`https://…`,
`{ type: 'line' }` dans un bloc de code — le corps du fichier n'est pas du YAML).

## Un token de SURFACE n'est pas une couleur de série (lignes invisibles) — 2026-09-14

tag: `warning` — `namespace: dnax.ui` — `filename: packages/ui/lib/chart.ts`

Symptôme : « en mode dark et light, quand je survole les charts de type line on ne voit
plus la line » — la courbe `Cost` du graphe de doc `/docs/charts/line` disparaissait
(les deux modes), alors que la série était bien listée dans l'info-bulle.

**Cause** : `stroke: 'secondary'` était résolu sur le **thème hôte**. Or chez shadcn-vue
(et donc dans `docd`, thème `.theme-blue`) `--secondary` est une **surface**, pas une
couleur — mesuré dans `entry.*.css` :

| token                      | `.theme-blue` (clair)                   | `.theme-blue.dark`                     |
| -------------------------- | --------------------------------------- | -------------------------------------- |
| `--background`             | `oklch(100% 0 0)`                       | `oklch(14.1% .005 285.823)`            |
| `--primary`                | `oklch(62.3% .214 259.815)` (bleu)      | `oklch(54.6% .245 262.881)`            |
| `--secondary` / `--accent` | `oklch(96.7% .001 286.375)` ≈ **blanc** | `oklch(27.4% .006 286.033)` ≈ **noir** |
| `--chart-1…5`              | oranges/verts/bleus **vifs**            | idem, adaptés au sombre                |

Une ligne de 2 px avec la couleur du fond est invisible — dans **les deux** modes (d'où
le fait que ce n'était pas un problème de thème clair/sombre). Même classe de piège que
l'entrée « tokens `:root` qui écrasaient le thème de l'app hôte » ci-dessus : deux
systèmes qui donnent le **même nom** à deux concepts différents (`--accent` = couleur
d'accent chez Quasar, surface de survol chez shadcn).

**Correctif** : `COLOR_TOKENS` (tokens relus sur l'hôte) **exclut** `secondary` et
`accent` — ils gardent la valeur Material de dnax (`#26a69a`, `#9c27b0`) — et la palette
des séries utilise les tokens **`--chart-1…6`** (convention shadcn, définie par tous les
thèmes shadcn _et_ ajoutée à dnax dans `styles/main.css`), donc jamais un nom de surface.
Règle générale : avant de relire un token hôte comme couleur, vérifier qu'il désigne une
**couleur** dans les deux systèmes (cf. `.theme-*` construits).

## zrender ne sait pas relire `oklch()` : l'élément SURVOLÉ disparaît — 2026-09-14

tag: `warning` — `namespace: dnax.ui` — `filename: packages/ui/lib/chart.ts`,
`packages/ui/components/QChart.vue`

Symptôme (signalé après le premier correctif de couleurs, donc **autre cause**) :
« au survol d'une chart l'élément disparaît — sur un bar, la bar disparaît, mais le
tooltip s'affiche ». Lignes **et** barres, en clair **et** en sombre (ce n'est donc ni un
problème de thème, ni un token de surface).

**Cause** : au survol ECharts applique l'état `emphasis` en **recalculant la couleur** :

```js
// echarts/lib/util/states.js — createEmphasisDefaultState()
emphasisStyle.fill = liftColor(fromFill); // barres, points, surfaces
emphasisStyle.stroke = liftColor(fromStroke); // lignes
```

Or `liftColor()` s'appuie sur le parseur de couleur de **zrender**, qui ne comprend que
`#hex`, `rgb(a,b,c)` / `rgba(a,b,c,a)`, `hsl(h,s%,l%)` et les noms CSS. Mesuré :

```
#f97316                    parse=OK     lift=rgba(255,126,24,1)
oklch(62.3% .214 259.815)  parse=ÉCHEC  lift=undefined   ← tous les tokens d'un thème shadcn/docd
rgb(0 0 0 / 0.55)          parse=ÉCHEC  lift=undefined   ← syntaxe moderne espace/slash
hsl(210 90% 50%)           parse=ÉCHEC  lift=undefined
color-mix(in srgb,…), var(…)  parse=ÉCHEC  lift=undefined
```

`lift()` sort par `if (colorArr)` **sans `return`** → `undefined`. L'état `emphasis`
reçoit alors `fill: undefined` (resp. `stroke: undefined`) ; zrender considère la forme
sans remplissage (`styleHasFill()` faux) → l'élément survolé n'est plus dessiné.

**Correctif** (⚠️ 2ᵉ passe — la 1ʳᵉ était insuffisante, cf. juste après) : normaliser les
couleurs **relues sur le DOM** en `#rrggbb`/`rgba()` avant de les donner à ECharts, et les
appliquer à **toutes** les couleurs de l'option : tokens,
`--foreground`/`--muted-foreground`/`--border`, palette et couleurs littérales des marks.
Hors navigateur, `normalizeColor` est absent → couleurs telles quelles (aucun impact SSR).

### ⚠️ `ctx.fillStyle` ne normalise RIEN (le bug est revenu) — 2026-09-15

tag: `warning` — `namespace: dnax.ui` — `filename: packages/ui/lib/color.ts`,
`packages/ui/components/QChart.vue`

Symptôme (re-signalé) : « au survol des marks par exemple bar ou line la marque disparaît ».

**Cause racine de la 1ʳᵉ tentative** : la normalisation recopiait `ctx.fillStyle` après
`ctx.fillStyle = value` pour « sérialiser » la couleur. Or **`fillStyle` conserve l'espace
colorimétrique** : pour `oklch(64.6% .222 41.116)` (tous les `--chart-N`, `--primary`,
`--foreground`… de `docd`, mesurés dans `docd/.output/public/_nuxt/entry.*.css`) la
relecture rend la **même chaîne oklch** → zrender échoue toujours → `liftColor` → `undefined`
→ la forme survolée n'est plus remplie. Les seules couleurs converties étaient les hex des
tokens dnax (repli Material), d'où un correctif qui « marchait » sur les démos sans thème.

**Reproduction** (Chromium 149 headless, Playwright `chromium_headless_shell`, tokens oklch
réels, marque `bar` + `line`, état `emphasis` forcé) :

| normalisation       | couleur dans l'option       | barre survolée                              |
| ------------------- | --------------------------- | ------------------------------------------- |
| `fillStyle` recopié | `oklch(0.646 0.222 41.116)` | `fill="none"` → **disparaît**               |
| peinture + pixel    | `#f54a00`                   | `fill="rgb(255,81,0)"` → visible, éclaircie |

**Correctif (retenu)** : `lib/color.ts` — **peindre** la couleur sur un canvas **1×1** puis
**relire le pixel** (`getImageData`) → `rgbaFromBytes()` → `#rrggbb` (opaque) ou
`rgba(r, g, b, a)`. Seule conversion indépendante de l'espace colorimétrique et du
navigateur. Sentinelles conservées pour détecter une couleur invalide, repli sur la
sérialisation si `getImageData` échoue (canvas illisible), cache par couleur dans `QChart`.
Vérifié par `lib/color.test.ts` (faux contexte mimant la conservation d'oklch) et par le
harnais Chromium ci-dessus.

Règle générale : **normaliser une couleur = la peindre et relire le pixel** ; ne jamais
supposer qu'une API de sérialisation convertit d'espace colorimétrique.

Diagnostic reproductible **sans navigateur** :
`bun -e` + `import { liftColor } from "…/zrender/lib/tool/color.js"` sur les valeurs des
tokens (voir tableau ci-dessus) ; et en SVG (`echarts.init(null,null,{renderer:'svg',ssr:true})`

- `dispatchAction({type:'highlight'})`) l'état est visible dans le `<style>` (`:hover`).
  Règle générale : **une couleur qui traverse une bibliothèque graphique doit être dans une
  forme que son parseur connaît** ; les tokens CSS modernes ne le sont pas.

## Marquage `heatmap` : `visualMap` obligatoire et `{c}` qui imprime les index — 2026-09-15

tag: `warning` — `namespace: dnax.ui` — `filename: packages/ui/lib/chart.ts`

Deux pièges rencontrés en écrivant la carte de chaleur :

1. **`Heatmap must use with visualMap`** — l'erreur est **levée** par `HeatmapView.js` quand
   la série n'a pas de `visualMap` associé (mode dev) : la carte ne s'affiche pas du tout.
   Le traducteur en émet donc **toujours** un ; quand `fill` est une couleur constante il est
   **caché** (`show: false`) avec une rampe dégénérée `inRange.color: [c, c]` (et des valeurs
   de cellule mises à `1` pour que la mise en correspondance aboutisse).
2. **L'étiquette d'une cellule n'est pas `{c}`** : avec un item `[colonne, ligne, valeur]`,
   `formatter: '{c}'` imprime les **index** (« 0,3 ») et non la valeur. Il faut viser la
   dimension : **`formatter: '{@[2]}'`** (vérifié en SVG SSR : 12, 21, 26, 8, 18, 33…).

Rappel utile : sans `visualMap`, les **couleurs par cellule** sont ignorées (le `visualMap`
a priorité sur `itemStyle.color` pour la dimension mappée) — d'où la conception « `fill` =
la valeur », qui suit le `fill` d'un rectangle de Plot.

## Image ronde (`round`) : le motif n'est pas redimensionné — 2026-09-15

tag: `warning` — `namespace: dnax.ui` — `filename: packages/ui/lib/chart.ts`

Pour découper une image en cercle on peint un **motif** (`itemStyle.color.image`) dans un
symbole `circle`. Deux constats mesurés :

- Le motif est posé à la **taille native** de l'image, ancré en **haut à gauche** du
  symbole : une source 200 px dans une pastille de 44 px n'affiche qu'un fragment zoomé du
  coin haut-gauche. → servir l'image **au format du marqueur** (`&w=44&h=44&fit=crop`).
- `width`/`height` passés dans le motif (formes documentées pour `label.backgroundColor`)
  sont **ignorés** par le rendu d'un `itemStyle.color.image` : captures byte-identiques
  avec et sans. Ne pas compter sur eux pour adapter la taille.

Autre piège du même genre que l'étiquette : un caractère moche peut aussi venir du
**chargement asynchrone** — une capture prise trop tôt montre le motif partiel et flou
(c'est ce qui a fait croire un instant à un bug de `devicePixelRatio`).

## `echarts.connect(group)` seul ne lie RIEN (piège silencieux)

`echarts.connect('revenue')` n'active aucun lien tant que le groupe n'est pas aussi posé sur
**l'instance** : `chart.group = 'revenue'`. Les deux sont nécessaires (`connectedGroups` +
`chart.group`, testés dans `enableConnect`). L'API ne signale pas l'erreur : la liaison est un
no-op silencieux, et toutes les mesures « ne se propage pas » deviennent fausses.

```ts
// correct (utilisation (A) documentée par ECharts)
chart.group = "revenue";
echarts.connect("revenue");
```

`echarts.connect([chart1, chart2])` (forme tableau) génère un nom `g_<n>` et **perd le nom de
groupe** : à n'utiliser que sans nom imposé.

Mesuré dans Chromium (rendu SVG, deux bar charts) : avec les deux posés, le survol de A
affiche dans B **le curseur d'axe** (même x) et **l'info-bulle avec la valeur propre de B**
(`Feb Revenue 51` dans A, `31` dans B). En revanche `highlight`/`downplay` **ne sont pas**
propagés (actions non partageables) → d'où la prop `selected` de `<q-chart>`, qui rejoue la
mise en évidence graphique par graphique.

## Piège TDZ : ne jamais nommer une locale comme la ref du composant

Dans `<script setup>`, une locale qui **masque** une ref du même nom la met en zone morte :

```ts
const applySelection = () => {
  const chart = chart.value   // ❌ « Cannot access 'chart' before initialization »
  ...
}
```

Le bug peut rester **latent** : tant que la fonction n'est appelée que depuis un `watch` qui ne
se déclenche jamais (sélection initiale nulle), rien ne casse. Dès qu'on l'appelle dans le
chemin du rendu (`applySelection()` en fin de `render()`), chaque montage de `<q-chart>` jette
une exception — visible seulement comme « Unhandled error during execution of mounted hook »
dans la console du navigateur, les graphiques restant dessinés. Renommer en `instance`.
Vérification : recharger une page contenant des `<q-chart>` et surveiller
`Runtime.exceptionThrown` par CDP.

## `v-if="picked.value"` sur un état indexé par clé : le span ne s'affiche jamais

Après le passage de `picked` (une `ref`) à un état par démo (`picked.interaction`,
`picked.select`…), une légende de démo testait encore `picked.value !== undefined` — or
`picked` est l'objet **indexé**, sans champ `value` : la condition était toujours fausse et la
valeur ne s'affichait pas. Symptôme trompeur : on croit que le payload est incomplet alors que
le composant est correct. Vérifier les `v-if` d'un état refactorisé (`grep picked\.` vs
`grep picked\.[a-z]*\.`).

## Préfixe numérique de page : au-delà de 9, l'ordre casse (tri **alphabétique**)

L'ordre de la sidebar suit le **nom de fichier trié en texte**, pas la valeur du nombre :
`10.interaction.md` se range **juste après `1.line.md`** (car `"10." < "2."`), pas à la fin.

- Règle : préfixes **sur deux chiffres** dès qu'un dossier peut dépasser 9 pages
  (`01.line.md` … `09.table.md`, `10.interaction.md`).
- Les URL ne changent pas : le préfixe (`\d+\.`) est retiré du slug
  (`01.line.md` → `/docs/charts/line`) — vérifié après renommage.
- `4.components/` (84 pages) n'utilise **aucun** préfixe : l'ordre y est alphabétique, ce qui
  n'est pas un ordre voulu. Ne pas s'en inspirer pour un dossier ordonné.
- Vérification : extraire la sidebar du HTML (avant `<main>`) et lire l'ordre des
  `href="/docs/charts/…"` — un tri visuel ne suffit pas, la page contient aussi ses propres liens.

## Pièges : état `select`, props non renseignées, défauts — 2026-09-15

`filename: packages/ui/components/QChart.vue, packages/ui/lib/chart.ts`

- **Le style `select` par défaut du moteur** ajoute `borderColor: primary, borderWidth: 2` autour de
  l'élément sélectionné. Toute définition de `select.itemStyle` **fusionne** avec lui : pour s'en
  débarrasser il faut l'annuler explicitement (`borderColor: 'transparent'`, `borderWidth: 0`).
- **Ne pas toucher au `borderRadius`** en estompant ou en sélectionnant : il vient de la marque
  (`borderRadius: [3, 3, 0, 0]` pour les barres, l. ~1003 de `chart.ts`). L'écraser à `0` casse le
  dessin de la marque — l'état `dim` ne doit surcharger **que** l'opacité.
- Un composant qui lit une prop **directement** (la marque `table`, rendue en HTML, ne passe pas par
  `chartToECharts`) ne bénéficie pas des défauts du traducteur : les poser aussi dans
  `withDefaults` (`linkMode: 'filter'`, `dimOpacity: 0.25`), sinon `opacity: undefined` → attribut
  `style` vide et aucun effet visible (les classes, elles, étaient bien posées).

## Build de production docd cassé : « Failed to resolve import source "#app" » — 2026-09-23

tag: `warning` — `filename: tsconfig.json`

`bun run build` (nuxt build) dans `docd/` **échoue** (`EXIT=1`) sur les composants de la couche
`@baybreezy/docd` : `[plugin vite:vue] Error: [@vue/compiler-sfc] Failed to resolve import source
"#app"` — puis `"#app/components"` — sur `app/components/Ui/{Button,Badge}.vue` et
`app/components/content/prose/Prose*.global.vue`.

**Cause** : ces fichiers font `import type { NuxtLinkProps } from "#app"` (ou `"#app/components"`).
Pour un `defineProps<…>()`, `@vue/compiler-sfc` génère **toujours** des props runtime
(`compileScript` → `genRuntimeProps` → `resolveRuntimePropsFromType`, inconditionnel) et doit donc
**résoudre les types importés** : il le fait avec TypeScript, en cherchant le `tsconfig.json`
**le plus proche du fichier compilé** (`ts.findConfigFile`), puis `ts.resolveModuleName` avec les
`paths` de ce tsconfig (`importSourceToScope`, `@vue/compiler-sfc`). Or ces fichiers vivent dans
`node_modules/.bun/@baybreezy+docd@…/node_modules/@baybreezy/docd/…` : en remontant l'arbre, le seul
tsconfig trouvé est celui de la **racine du monorepo** — qui n'avait aucun `paths`.
Les alias Nuxt ne se résolvent pas autrement : `#app` existe dans les `imports` de
`nuxt/package.json`, mais le _package scope_ du fichier compilé est
`@baybreezy/docd/package.json`, qui ne déclare rien (`#app/components` n'existe nulle part dans un
`imports`).

**Déclencheur** : `@baybreezy/docd@0.3.6` — le paquet est **identique** depuis 0.3.3 (même
`app/`, vérifié en extrayant les tarballs) mais ses dépendances ont bougé (`@nuxt/content` 3.16.1,
`nuxt-og-image` 6.8, `@nuxtjs/mcp-toolkit` 0.21…) et ses composants `Ui/*` + `Prose*.global.vue`
entrent alors dans le build client (avec 0.3.3 ils n'étaient pas compilés → pas d'erreur).
`bun.lock` **n'est pas versionné** (`.gitignore:9`) : la version résolue de `@baybreezy/docd`
dépend donc de la machine (`latest` dans `docd/package.json`) — d'où le « chez moi ça passe ».

**Correctif** : `paths` dans le **tsconfig racine** (le seul découvrable depuis `node_modules`) :
`"#app"` → `./docd/node_modules/nuxt/dist/app` (repli `./node_modules/nuxt/dist/app`) et
`"#app/*"` → `…/dist/app/*` — les deux `index.d.ts` exportent bien `NuxtLinkProps`.

**Vérif** : `ts.findConfigFile` + `ts.resolveModuleName` exécutés sur le chemin **réel** (`realpath`
`.bun/…`) d'un composant du layer → trouvent le tsconfig racine, `#app` →
`nuxt/dist/app/index.d.ts` et `#app/components` → `nuxt/dist/app/components/index.d.ts` ;
`bun run build` → **EXIT 0**, 0 erreur de résolution ; `bun run generate` → EXIT 0, 0 `[404]`/`[500]`.

## `scripts/generate-exports.ts` désynchronisé de `index.ts` — 2026-09-23

tag: `warning` — `filename: packages/ui/scripts/generate-exports.ts`

Le générateur réécrit entièrement `packages/ui/index.ts` (exports des composants +
bloc `manualExports`), mais son bloc `manualExports` **ne contient pas** les exports de
`lib/datePicker.ts` présents dans `index.ts` (`placePopover`, `PlacePopoverOptions`,
`PopoverAnchor`, `PopoverPlacement`, `PopoverViewport`) : tout ajout manuel à
`index.ts` hors composants ne survit pas à une régénération.

**Conséquence** : lancer `bun run generate` (dans `packages/ui`) **supprime** ces 7
lignes → `placePopover` et ses types disparaissent de l'API publique.

**Vérif** : générateur exécuté sur une copie hors repo (`/tmp/gen-check`, scripts +
components + index.ts) → `diff` avec le vrai `index.ts` = 7 lignes manquantes
(`167a168,174`). **Correctif** : recopier les lignes `placePopover` / types dans
`manualExports` avant toute régénération.

## `nuxt-og-image` : `Cannot find module '@takumi-rs/core'` en dev — 2026-09-23

tag: `warning` — `filename: docd/nuxt.config.ts`

**Symptôme** : `ERROR renderer.createImage error for /_og/s/*.png: Cannot find module
'@takumi-rs/core'` (logger `@nuxtjs/og-image`), stack passant par
`<racine projet>/docd/noop.js` et `[worker eval]` — puis `[request error] [unhandled]
[GET] /_og/s/*.png`.

**Cause** : `docd` étend `@baybreezy/docd`, qui dépend de `nuxt-og-image` (rendu des
og:image). En v6 le moteur par défaut est **Takumi**, dont `@takumi-rs/core` n'est
qu'un **peer optionnel** (pas installé d'office). En dev le binding `node-dev`
(`nuxt-og-image/dist/runtime/server/og-image/bindings/takumi/node-dev.js`) exécute le
rendu dans un **worker thread** qui résout le natif avec
`createRequire(process.cwd() + '/')` → **depuis la racine du projet qui tourne**, alors
que la détection du module (`hasResolvableDependency` → `resolvePath`) se fait dans le
**scope du module** (`node_modules/.bun/nuxt-og-image@…/node_modules/`), où le peer est
bien lié : « détecté installé, introuvable au runtime ». Le hoisting du peer à
`docd/node_modules/@takumi-rs/core` dépend de la machine/plateforme → ça marche sur ce
Mac (2.13.7 + `core-darwin-arm64` hoistés), pas ailleurs.
Même piège pour **`@resvg/resvg-js`** (`bindings/resvg/node-dev.js`, même
`createRequire(cwd)`) si le rendu Satori/resvg est choisi.

**Correctifs** : déclarer le moteur dans `docd` (`bun add -D @takumi-rs/core`, **sur la
machine cible** → bonne binaire `@takumi-rs/core-<os>-<arch>`, ex. `linux-x64-gnu` vs
`-musl` pour Alpine) ; ou `ogImage: { enabled: false }` ; ou désactiver Takumi en dev
(`ogImage: { compatibility: { dev: { takumi: false } } }`, avec satori + resvg installés
— même contrainte CWD).
**Aggravant** : `bun.lock` non versionné + `@baybreezy/docd: latest` → hoisting d'un
peer optionnel variable selon la machine (même classe de problème que l'avertissement
`#app`/tsconfig racine ci-dessus).

**Appliqué (2026-09-23)** : `"@takumi-rs/core": "^2.13.7"` déclaré dans les
`dependencies` de `docd/package.json` (satisfait le peer `^1.0.0-beta.3 || ^2.0.0` de
`nuxt-og-image` 6.x ; en `dependencies` car le rendu est aussi appelé à la demande par
le serveur Nitro, pas seulement au build). Garantit un `docd/node_modules/@takumi-rs/core`
résolu depuis le CWD, sur toute plateforme (les binaires `@takumi-rs/core-<os>-<arch>`
sont des deps optionnelles du paquet). **Reste à faire** : `bun install` **sur la machine
qui plante** (aucun install/build lancé ici — règle projet + réseau requis).
Écartés : `ogImage.enabled: false` (fonctionnalité voulue par la couche Docus, cf.
`modules` de son `nuxt.config.ts`) et le repli Satori/resvg (même `createRequire(cwd)`
dans `bindings/resvg/node-dev.js`) ; si `@takumi-rs/core` et `@takumi-rs/wasm` sont tous
deux présents, le module alerte sur un écart de version majeure.

## docui — `@dnax/ui` dans `extends` → « Unknown file extension ".vue" » — 2026-09-24

tag: `warnings` — `filename: docui/nuxt.config.ts`

**Symptôme** : `bun run dev` dans `docui/` s'arrête **avant** de servir, sans autre
indication :

```
ERROR  Unknown file extension ".vue" for …/packages/ui/components/QAccordion.vue
    at Object.getFileProtocolModuleFormat (node:internal/modules/esm/get_format:219:9)
```

**Cause racine** : `extends: ["@baybreezy/docd", "@dnax/ui", …]`. `@dnax/ui` **n'est pas
une layer** Nuxt : son `exports["."]` est le barrel **runtime** (`index.ts`, qui importe
`./components/*.vue`). c12/Nuxt résout donc `packages/ui/index.ts` et le charge avec
l'ESM de **Node** (aucun loader `.vue`) → erreur sur la 1re ligne du barrel. Par
contraste, `@baybreezy/docd` exporte `./nuxt.config.ts` : c'est une vraie layer.

**Correctif** : garder `@dnax/ui` dans **`modules`** (contrat documenté en tête de
`packages/ui/module.ts`) — `extends: ["@baybreezy/docd"]` +
`modules: ["@dnax/ui", "./scripts/dnax-ui-meta"]`.

**Vérif** : `bun run dev` → serveur démarré (plus d'erreur) ;
`curl -s localhost:2009/docs/layouts/app-layout` → 200.

## MapTiler SDK — le constructeur `Map` exige `container` — 2026-09-25

tag: `warnings` — `filename: packages/ui/components/QMap.vue`

**Symptôme** : la carte reste sur la surcouche « Carte indisponible », et la console du
navigateur affiche :

```
[q-map] Error: Invalid type: 'container' must be a String or HTMLElement.
```

**Cause** : `new Map(options)` du SDK MapTiler (v4) **exige `container`** (id ou élément),
comme maplibre — ce n'est pas une option facultative. En séparant les options « pures »
(`lib/map.ts`, testable) de l'initialisation, il est facile d'oublier de le passer.

**Correctif** : `new lib.Map({ ...options, container: node })` — le composant pose le
`container` lui-même (c'est son DOM), donc une option `container` passée par
l'utilisateur est ignorée.

**Piège du diagnostic** : le prerender SSR et `curl` ne voient **rien** (le SDK ne tourne
qu'au navigateur, dans `onMounted`) — la page répond 200 et la surcouche « Chargement de
la carte… » est dans le HTML. Seul un rendu réel (Chromium headless, cf. `knowledges.md`)
révèle l'erreur, via le log console `CONSOLE:` ou la présence/absence de
`class="maplibregl-canvas"` / `class="q-map__overlay"` dans le DOM.

## MapTiler — `terrain` / `projection` au constructeur : « Style is not done loading » — 2026-09-25

tag: `warnings` — `filename: packages/ui/components/QMap.vue`, `packages/ui/lib/map.ts`

**Symptôme** : sur une page dont une carte passe `terrain` (et/ou `projection`), la console
du navigateur montre une erreur **non capturée** — `Uncaught Error: Style is not done
loading.` — et l'événement `ready` du SDK **ne se déclenche pas** : la surcouche
« Chargement de la carte… » reste affichée alors que le style est bel et bien chargé
(attribution « © MapTiler » dans le DOM, contexte WebGL créé).

**Cause** : passer `terrain: true` / `projection: "…"` au **constructeur** `new Map({…})`
(les options sont pourtant documentées par MapTiler). Le SDK les applique avant que le
style soit chargé → exception interne, qui casse la suite de l'init.

**Correctif** : ne plus les passer au constructeur, et les appliquer **après** le
chargement, avec les méthodes du SDK : `map.enableTerrain()` / `map.setProjection(type,
{ persist: true })` (appelées au premier `load`/`ready`, puis réactives sur changement de
prop). Corollaire utile : s'accrocher au **premier** de `load` et `ready` — `ready` attend
tous les contrôles du SDK et peut être retardé (ou ne pas venir si l'init a jeté).

**Vérif** : Chromium headless sur `/docs/maps/maptiler` → 0 `Uncaught`,
`class="maplibregl-canvas"`, `© MapTiler` dans le DOM, aucune surcouche `q-map__overlay`.

## Ne jamais nommer une prop `style` (ni `class`) — 2026-09-25

tag: `warnings` — `filename: packages/ui/components/QMap.vue`

`style` et `class` sont des attributs réservés par Vue : `resolveProps` les traite à part
de l'héritage d'attributs, et côté types (`vue-tsc`, `<script setup>`) une écriture
**statique** `<q-map style="outdoor">` est typée comme le `style` CSS (`{}` / `StyleValue`)
→ « Type '{}' is not assignable to type 'string' » dès que la prop est déclarée, et côté
usage l'utilisateur qui écrit `<q-map style="height: 300px">` (intention CSS) l'envoie à
la prop sans le voir.

- La prop de style de carte s'appelle donc **`map-style`** (`mapStyle` en JS) ; le nom
  reste proche de l'option du SDK (`style`, résolue par `lib/map.ts`) puisque c'est le
  composant qui la traduit.
- Règle générale : pour une prop dont le nom serait `style`/`class`/`key`/`ref`,
  préfixer (ex. `map-style`, `card-class`) — jamais ces noms nus.

## MDC — un `::` de fermeture manquant avale la fin de la page, en silence — 2026-09-25

tag: `warnings` — `filename: docui/content/docs/**/*.md`

**Symptôme** : une section d'une page de doc disparaît sans aucune erreur — le composant de
démo n'est pas rendu (parfois ni son texte ni son contenu ne figurent dans le HTML) et tout
ce qui suit la section (autres sections, `## API`…) s'évanouit aussi. Le serveur de dev
répond `200` et le build passe : **rien ne signale le problème**.

**Cause** : un bloc `::prose-show-case … #code …` dont la ligne `::` de fermeture a été
oubliée. Le bloc engloutit alors le reste du fichier comme contenu de la directive.

**Détection** (à lancer après toute retouche de page MDC) :

```sh
# par fichier : fermetures attendues = prose-show-case + prose-card + autres directives
grep -c '::prose-show-case' page.md ; grep -cE '^::$' page.md
# et côté navigateur : vérifier que les sections attendues sont dans le HTML servi
curl -s http://localhost:2009/docs/<page> | grep -o "Nom de section"
```

Deux occurrences le 2026-09-25 : `4.components/image-picker.md` (la démo « états » et les
sections « Recipes » / « API » avalées) et `6.maps/01.maptiler.md` (tout ce qui suivait la
démo « terrain »).

## CSS — une règle partagée déclarée **avant** la règle de base du composant est écrasée — 2026-09-25

tag: `warnings` — `filename: packages/ui/styles/main.css`

**Symptôme** : une variante stylée par une classe (`--translucent`, `--glass`…) semble ne
rien faire — mesuré en CDP sur le bottom sheet : `.q-bottom-sheet__panel--translucent`
donnait un fond `rgb(255, 255, 255)` (le fond de base) et **pas** de `backdrop-filter`.

**Cause** : la recette partagée (`.q-header--translucent, .q-footer--translucent,
.q-back-header--translucent, .q-bottom-sheet__panel--translucent, .q-country-picker__sheet--translucent { … }`)
vit **ligne ~1670**, alors que `.q-bottom-sheet__panel` (5211) et `.q-country-picker__sheet`
(6074) posent `background-color` plus loin. À **spécificité égale** (une classe contre une
classe), c'est l'**ordre du fichier** qui tranche : la règle de base gagnait, en silence.
Le même piège touchait donc `translucent` sur les deux feuilles (bottom sheet **et** country
picker) — corrigé en donnant à chaque feuille sa règle **dans sa propre section**, après sa
règle de base.

**Règle** : pour styler une variante d'un composant « téléporté / plein écran » dont la
section vit en fin de fichier, déclarer la variante **dans cette section**, pas dans un bloc
partagé en tête de feuille — ou monter la spécificité (`.q-bottom-sheet__panel.q-bottom-sheet__panel--glass`).
Vérifier la valeur **calculée** (CDP `getComputedStyle`), jamais la seule présence de la
classe dans le DOM.

## Disposition aléatoire : ne jamais tirer `Math.random()` pendant le rendu (SSR) — 2026-09-25

tag: `warnings` — `filename: packages/ui/components/QNumericKeyboard.vue`

**Symptôme** : un pavé à disposition aléatoire (`random`) diverge entre le HTML prérendu et le
premier rendu client → **écart d'hydratation** Vue (et un mélange qui « saute » au chargement).

**Cause** : tirer la permutation dans un `computed` ou au `setup` fait tourner `Math.random()`
**aussi côté serveur** (prerender Nuxt) et **une seconde fois** côté client — deux dispositions
différentes pour le même arbre virtuel.

**Correctif** : générer la permutation dans `onMounted` (client uniquement). Le SSR et le
premier rendu client affichent alors la disposition **canonique** (identique), puis le mélange
s'applique. Un `watch` sur `random` gère l'activation ultérieure ; `shuffle()` (exposé) permet
de re-tirer sans remonter le composant. Même logique que `QChart` (ECharts chargé dans
`onMounted`, rien en SSR).

**Vérif** : en CDP, comparer l'ordre des chiffres du DOM prérendu puis après hydratation —
le prérendu doit être canonique (`1234567890`).

## Couleur calculée : mesurer APRÈS la fin de la transition — 2026-09-25

tag: `warnings` — `filename: packages/ui/styles/main.css` (vérif dans le navigateur)

**Symptôme** : en CDP, `getComputedStyle(dot).backgroundColor` d'un point qui vient de passer en
état d'erreur renvoyait `rgba(134, 42, 88, 0.984)` — une teinte violette sans rapport avec
`var(--negative)` (`#c10015`), alors que la classe `--error` était bien posée sur le pavé.

**Cause** : `.q-numeric-keyboard__dot` porte `transition: background-color 0.18s, border-color
0.18s`. La mesure tombait **pendant** l'interpolation (alpha `0,984` = transition inachevée) ;
selon l'espace d'interpolation, la couleur intermédiaire n'est pas sur le segment attendu.

**Règle** : après avoir déclenché un changement d'état stylé, **attendre la fin des transitions**
(≥ la durée, ou écouter `transitionend`) avant de comparer une valeur **calculée de couleur**.
Même vigilance qu'avec une animation (le `--pop` des points dure 0,34 s). Vérifié après 700 ms :
`rgb(193, 0, 21)` pour les points pleins **et** le message — c'est-à-dire `var(--negative)`.

## QSpreadsheet — un diff révèle les incohérences de représentation interne — 2026-09-25

tag: `warnings` — `filename: packages/ui/components/QSpreadsheet.vue`

Le delta `changes` compare le document courant à une référence : il révèle donc **toute**
incohérence de représentation interne du composant. Deux faux positifs trouvés en CDP (une
feuille inactive comptée comme « modifiée » sans qu'on ait rien fait) :

1. **`_key` manquantes sur les feuilles inactives.** `ensureRowKeys` n'était appelé que pour
   `props.rows` et pour la feuille **chargée** — alors que la doc du composant promet l'injection
   « pour `rows`, pour chaque `sheets[].rows` et pour `loadDocument()` ». Une feuille jamais
   ouverte n'avait donc aucune `_key` dans la référence : au premier chargement, l'injection les
   créait ⇒ **toutes ses lignes comptaient comme « added »**. Correctif : `ensureRowKeys(s.rows)`
   à l'**ingestion** (watcher `props.sheets` + `loadDocument`) — le code rejoint sa doc.
2. **Colonnes non canoniques à l'ingestion.** Le moteur normalise les colonnes en sortant de
   `localSheets` (`type ?? "text"`, `options ?? []`, largeur résolue — via
   `loadSheetIntoEngine` / `persistCurrent`), mais `localSheets[].columns` gardait la forme brute
   reçue : la référence contenait la forme brute, le courant la forme normalisée ⇒
   `sheets.updated[].changed = ["columns"]` sans changement réel. Correctif : `canonicalColumns()`
   appliqué à l'ingestion (watcher + `loadDocument`), ce qui rend aussi `buildDocument()` /
   `toJSON()` stables.

**Leçon** : quand on compare deux représentations, elles doivent être **canoniques des deux
côtés** ; un diff qui « voit » des différences invisibles à l'œil signale presque toujours une
normalisation faite trop tard (au chargement) plutôt qu'à l'entrée.

## QSpreadsheet — undo/redo morts : piles non réactives (NON corrigé) — 2026-09-25

tag: `warnings` — `filename: packages/ui/components/QSpreadsheet.vue`

**Symptôme** (mesuré en CDP) : le bouton « Undo » de la barre d'outils est **toujours
désactivé**, même après une édition de cellule ou un `addRow()` ; cliquer ne fait rien (et donc
`Ctrl+Z` non plus).

**Cause** : `const undoStack: Snapshot[] = []` et `redoStack` sont des **tableaux simples**, alors
que `canUndo` / `canRedo` sont des `computed(() => undoStack.length > 0 && …)` : un tableau non
réactif ne crée **aucune** dépendance, le computed est figé sur sa première évaluation (`false`).
Et comme `undo()` / `redo()` commencent par `if (!canUndo.value) return`, l'historique ne peut
jamais s'exécuter. À noter : l'édition de cellule n'appelle pas `pushHistory()` (seules les
opérations structurelles le font), donc même réparé l'undo n'annulerait pas une saisie.

**À corriger** (proposé, hors périmètre du suivi de modifications) : en faire des
`ref<Snapshot[]>([])` (≈10 lignes : `pushHistory`, `canUndo`/`canRedo`, `undo`, `redo`,
`loadSheetIntoEngine`) **et** pousser un snapshot dans `commitEdit` quand la valeur change.

## Échappatoire `options` de `<q-chart>` : fusion **superficielle** (une clé tableau est remplacée) — 2026-09-28

tag: `warning` — `namespace: dnax.ui` — `filename: packages/ui/lib/chart.ts`

`chartToECharts` termine par `{ ...option, ...(config.options ?? {}) }` : la fusion est **clé par
clé**, sans profondeur. Passer `options.visualMap` (rampe personnalisée d'une heatmap) **remplace**
donc l'échelle émise par la marque — y compris sa mise en page (`orient: 'horizontal'`,
`left`/`bottom`, `itemWidth`/`itemHeight`) et son `textStyle` adapté au thème. Il faut la redonner
en entier. Même règle pour tout autre canal tableau (`series`, `xAxis`…). Documenté et démoé sur
`/docs/charts/heatmap`.

## `<style scoped>` — `:global(.dark) .q-x` **avale** le sélecteur ciblé — 2026-09-28

tag: `warning` — `namespace: dnax.ui` — `filename: packages/ui/components/*.vue`

Dans un `<style scoped>`, écrire `:global(.dark) .q-timeline__content { … }` ne produit **pas**
`.dark .q-timeline__content[data-v-x]`. Le compilateur `@vue/compiler-sfc` émet seulement
`.dark { … }` : le sélecteur d'après `:global(...)` **disparaît** (vérifié à la compilation).

- **Correctif** : utiliser le motif éprouvé du dépôt `.dark .q-timeline__content { … }`, qui
  compile en `.dark .q-timeline__content[data-v-x]` — fonctionnellement équivalent à
  `:global(.dark) &` (le `.dark` reste global, l'élément scoped porte l'attribut).
- Idem pour `:global(.dark)` en **fin** de sélecteur (`.q-x :global(.dark)`) : le résultat est
  perdu.
- Vérification rapide : `compileStyle({ source, scoped: true })` de `@vue/compiler-sfc`
  (dispo dans `docui/node_modules`).
- Piège lié : le CSS `scoped` d'un composant **ne cible pas le contenu de son slot** (compilé
  dans le scope du consommateur). Pour transmettre un style (couleur, dark) à travers la
  frontière de slot, passer par une **variable CSS héritée** posée inline sur la racine
  (cf. `QTimeline` → `--q-timeline-*`).

## CDP headless — `#__nuxt.__vue_app__` est posé AVANT la fin de l'hydratation — 2026-09-28

> ⛔ **NE PAS APPLIQUER** — le pilotage de navigateur headless / Puppeteer / CDP est **interdit**
> dans ce projet depuis 2026-09-28 (voir la règle dans `AGENTS.md`) : il ralentit le processus de
> développement. Entrée conservée comme **historique**.

tag: `warning` — `namespace: dnax.ui` — `filename: .tmp/cdp-verify.ts` (recette CDP)

`!!document.querySelector('#__nuxt')?.__vue_app__` vaut **vrai dès `app.mount()`**, avant que
l'hydratation ait branché les écouteurs. Un `Input.dispatchMouseEvent` (clic CDP) émis à ce
moment part **dans le vide** : le bouton SSR existe, mais son `@click` n'est pas encore
attaché.

- **Symptôme vérifié** (démo `basic` de `QPopupProxy`) : le **1er** clic n'ouvre pas le
  panneau, le **2e** (même séquence `mousePressed`/`mouseReleased`, 450 ms plus tard) l'ouvre —
  et le nœud DOM n'a pourtant **pas** été remplacé (`sameNode: true`). Faux KO de recette, pas
  un bug du composant.
- **Correctif** : ne pas se fier au drapeau d'app ; **sonder l'interactivité** — boucler
  `el.click()` + `await rAF×2` et vérifier que le composant réagit (panneau ouvert), puis
  refermer par `Escape`, **avant** de lancer les vrais `Input.dispatchMouseEvent`.
- Un `el.click()` **JS** suffit pour cette sonde (même listener) et évite de consommer l'état
  de la démo.
- Confirmé sur cette page : après la porte, les 4 points `QPopupProxy` et les 4 points
  `QTime` passent, **0 erreur console / exception**.

## docui — le cache SQLite de contenu garde les octets d'une page supprimée — 2026-09-28

tag: `warning` — `namespace: dnax.ui` — `filename: docui/.data/content/contents.sqlite`

Après la suppression d'une page (`content/docs/4.components/tiptap.md`), `/docs/components/tiptap`
renvoyait bien **404** et `_content_docs` n'avait plus la ligne, mais un `grep -ri tiptap` sur
`docui/` continuait de trouver les octets de la page dans le cache SQLite (fichier **gitignoré**,
`docui/.data/content/contents.sqlite`). Ce n'était pas une ligne résiduelle mais des **pages
libres** (`freelist_count > 0`) laissées par la suppression. Un `VACUUM` (non destructif, serveur
de dev resté actif et 200) fait retomber le `grep` à **0**. À refaire si un audit de « traces »
après suppression de contenu remonte d'anciennes chaînes.

## Règle « llms.txt » de `AGENTS.md` — obsolète (l'ancien site `docs/` n'existe plus) — 2026-09-28

tag: `warning` — `namespace: dnax.ui` — `filename: AGENTS.md`

`AGENTS.md` impose de mettre à jour `docs/public/llms.txt` après `bun scripts/gen-menu.ts` à chaque
ajout de composant. **Constat mesuré (2026-09-28)** : `scripts/gen-menu.ts`, `docs/public/llms.txt`,
`docs/app/data/menu.ts` — **aucun n'existe** (ni sous `docui/`). Le site est désormais `docui/`
(layer `@baybreezy/docd`) : la navigation vient du contenu (`content/docs/**`, frontmatter
`navigation.icon`), et `llms.txt` est **généré au build** par la layer Docd (clé `llms` de
`docui/nuxt.config.ts`) — il n'y a plus de fichier statique ni de menu à régénérer à la main.

→ Ajouter un composant = créer le SFC + (pour le barrel) `bun scripts/generate-exports.ts` +
la page `docui/content/docs/4.components/<slug>.md` + la démo. Rien d'autre.
La section « llms.txt » de `AGENTS.md` reste à réécrire (proposé, non fait).

## Build production « Failed to resolve import source "#app" » — layer Docd + Nuxt 4.5/Vite 8 — 2026-09-28

tag: `warning` — `namespace: dnax.ui` — `filename: docui/nuxt.config.ts` (déclencheur : `@baybreezy/docd@0.3.6`)

**Symptôme** : `nuxt build` (prod) échoue sur
`[@vue/compiler-sfc] Failed to resolve import source "#app"` dans
`@baybreezy/docd/app/components/content/prose/ProseA.global.vue` (et 8 autres prose + `Ui/Button.vue`).

**Cause** : ces fichiers font `import type { NuxtLinkProps } from "#app"` dans un bloc `<script>`
et l'utilisent dans `defineProps`. À l'extraction des types, `@vue/compiler-sfc` résout `#app` via
`fs.resolveId` de `@vitejs/plugin-vue` ; sous Nuxt 4.5.x (Vite 8 / Rolldown) cette résolution renvoie
null pour l'alias **virtuel** `#app` → erreur. **Pas lié à nos composants** ; c'est la combinaison
layer Docd + toolchain Nuxt/Vite qui régresse (l'import existe depuis docd 0.2.0, cf. unpkg).

**Piège vérifié** : ne PAS tenter `vite.resolve.alias['#app'] → nuxt/dist/app/index.js` : l'app
importe massivement des sous-chemins `#app/types`, `#app/config`, `#app/composables/*` (voir
`docui/.nuxt/imports.d.ts`), un alias fichier les casserait. L'alias répertoire existe déjà côté Nuxt.

**Pistes de correction** (non appliquées, à valider en prod `/apps/dnax.ui`) :

1. Bloquer le lockfile : commit `bun.lock` + `bun install --frozen-lockfile` en prod (le hash `.bun`
   de prod diffère du local → dérive transitive probable).
2. Épingler la toolchain (transitive) via `overrides`/`resolutions` : `vite`, `@vitejs/plugin-vue`,
   `@vue/compiler-sfc`, `rolldown` aux versions avec lesquelles Nuxt 4.5.2 est sorti/testé.
3. Signaler upstream (docd et/ou nuxt).
