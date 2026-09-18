# Règles du projet dnax.ui (tag: rules)

## Règle mémoire (.memory) — règle générale

Toute bonne pratique, règle, décision, cause racine, piège ou élément important
doit être **enregistré dans `.memory/`** (fichiers par thématique — voir
`README.md`) et **toujours consulté** en début de session / avant d'agir pour se
rappeler des actions passées. Ne jamais laisser ces éléments uniquement dans le
contexte de la conversation. Mettre à jour les entrées existantes plutôt que créer
des doublons.

## Safe-area insets

**Obligatoire** : tout composant fullscreen ou plaqué contre un bord d'écran
(header, footer, bottom sheet, action sheet, dialog plein écran, FAB, modales,
`QDatePicker` en mode dialog/sheet…) doit appliquer les safe-area insets.
Chaîne de fallback obligatoire, dans l'ordre :

```css
padding-top: 0;                                   /* fallback vieux navigateurs */
padding-top: constant(safe-area-inset-top);       /* iOS 11.0 – 11.2 */
padding-top: env(safe-area-inset-top);            /* iOS 11.2+ */
```

- `padding-*` pour les panneaux/conteneurs, `margin-*` pour les éléments flottants
- Prérequis : `viewport-fit=cover` dans le meta viewport (`apps/mobile/nuxt.config.ts`) — ne jamais le retirer
- Sur desktop les insets valent 0 → le fallback `0` s'applique, aucun impact
- Composants couverts : `.q-header` (top+left+right), `.q-footer` (bottom+left+right),
  `.q-page` (bottom), sheets, `.q-select__sheet`, `.q-fab`, `.q-date-picker__sheet`,
  `.q-back-header`, `.q-sidebar--offcanvas` (top+bottom+côtés)

## Conventions d'API

- Nommage : préfixe `Q` + PascalCase (fichier et export), balises kebab-case (`<q-btn>`)
- Props booléennes = modifiers (la présence active le comportement)
- **Icônes = strings Iconify** (`icon="lucide:star"`), jamais de composants — voir `knowledges.md`
- `v-model` = `:model-value` + `@update:model-value` pour les formulaires
- Tout composant conteneur expose `<slot />` (piège vérifié : QApp)
- `aria-label` sur les boutons icône seuls

## Génération docs

- `scripts/gen-menu.ts` génère `docs/app/data/menu.ts` + les pages statiques
  `docs/app/pages/docs/components/*.vue` (familles groupées : Accordion, Dialog, Sidebar…)
- Relancer après avoir ajouté/modifié un composant ; les pages custom (ex. `accordion.vue`)
  sont préservées

## Documentation des graphiques (`docd/`, section Charts)

- **Chaque marque de graphique documente ses propres options** : page
  `/docs/charts/<marque>` = titre `## <Mark> options` + `:dnax-mark-api{mark="bar"}`.
  L'API de `<q-chart>` (props/events/methods) ne figure **que** sur
  `5.charts/index.md` — pas de rappel en bas des pages de marque (consigne utilisateur).
- Les options affichées viennent de **`packages/ui/lib/chart.ts`** : `MARK_OPTIONS` (clés
  acceptées par la marque) + le **JSDoc de `QChartMark`** (type, description, valeurs).
  → ajouter une option = la déclarer dans l'interface **avec son JSDoc** ; l'exposer à la
  marque = l'ajouter à `MARK_OPTIONS`. Aucune table manuelle en markdown.
- Toute couleur donnée à ECharts doit être dans une forme que **zrender** relit : les couleurs
  relues sur le thème passent par `lib/color.ts` (peinture + lecture de pixel), jamais par
  `ctx.fillStyle` seul (`warnings.md`).

## Aucun build spontané

Ne lancer **aucun build** (`bun run generate`, `bun run build`, `nuxt build`) sans demande
explicite de l'utilisateur, ou sauf nécessité réelle de test.

- Vérifier une page : serveur de dev (`cd docd && PORT=3000 bun run dev`) ou test unitaire —
  jamais un build complet « pour voir ».
- `bun test packages/ui/lib` reste la vérification de référence du traducteur : rapide, sans
  artefact, elle ne remplace pas un build.
- Le build est réservé à la livraison (vérifier `docd/.output/public`, `llms.txt`).

## Vocabulaire de la documentation : jamais le moteur de rendu

La doc publique parle **la langue de la bibliothèque**, jamais celle de l'implémentation.

- **Bannir le nom du moteur** (ECharts) de tout ce qui est publié : pages `docd/content/**`,
  descriptions `frontmatter`/`seo`, démos (`docd/app/components/demos/**`), `llms.txt`,
  **et les JSDoc de `packages/ui/lib/chart.ts`** — ces derniers alimentent les tables
  d'options générées (`MARK_OPTIONS` + JSDoc), donc une mention y fuite dans la doc.
  Remplacer par : « chart options », « the renderer », « the underlying label rotation »…
- **Le payload `@pick` parle en marques** : `markName`, `markIndex`, `markType`
  (`bar`, `pie`…), `origin` (`mark` | `legend`) — jamais `seriesName`/`seriesIndex`/
  `seriesType`/`componentType`. La traduction des paramètres du moteur se fait **une seule
  fois**, dans `pickFromEvent()`.
- Vérification systématique après une modification de doc :
  `grep -ri echarts docd/content docd/app docd/public docs` → **0**, plus un contrôle HTTP de
  chaque page (un serveur de dev tombé renvoie 0 occurrence : le comptage serait faux).

