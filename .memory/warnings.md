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
