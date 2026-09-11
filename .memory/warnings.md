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
`data-grid`, `date-picker`, `dialog`, `editor-js`, `fab`.
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
