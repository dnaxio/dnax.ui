# Mémoire du projet dnax.ui

Mémoire longue durée du projet, organisée **par thématique** (un fichier par tag).
Toute bonne pratique, règle, décision, cause racine ou piège doit y être enregistrée —
jamais laissée uniquement dans le contexte d'une conversation.

## Fichiers par thématique

| Fichier | Tag | Contenu |
|---|---|---|
| `rules.md` | `rules` | Règles obligatoires du projet |
| `knowledges.md` | `knowledges` | Connaissances techniques & bonnes pratiques |
| `decisions.md` | `decisions` | Décisions d'architecture / d'API |
| `warnings.md` | `warnings` | Pièges et erreurs rencontrés |

## Format d'une entrée

```markdown
## [Titre explicite] — YYYY-MM-DD

Contexte / correctif / décision, de façon concise et réutilisable.
Liens vers les fichiers concernés si pertinent.
```

## Workflow obligatoire

1. **Consulter** — en début de session, lire les fichiers pertinents (surtout
   `warnings.md` et `rules.md`) pour se rappeler des actions passées et des
   décisions prises. Rechercher par mot-clé dans les 4 fichiers avant d'agir.
2. **Enregistrer** — après toute action pertinente (correctif, décision,
   convention validée, piège), ajouter ou mettre à jour l'entrée dans le fichier
   de la bonne thématique.
3. **Mettre à jour plutôt que dupliquer** — si le sujet évolue, compléter
   l'entrée existante au lieu d'en créer une doublon.

## Convention d'écriture

- `namespace: dnax.ui`, `worktree` = racine du projet (`/Volumes/D/PKG/dnax.ui`)
- Tag + titre explicite (ex. « Migration icônes lucide → Iconify »)
- `filename` du fichier concerné si pertinent
