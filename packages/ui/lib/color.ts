// Normalisation des couleurs CSS → une forme que **zrender** (le moteur d'ECharts) sait
// relire : `#rrggbb`, `rgb(a,b,c)`, `rgba(a,b,c,a)`, `hsl(h,s%,l%)` ou un nom CSS.
//
// Pourquoi c'est vital : au survol, ECharts **recalcule** la couleur de l'élément —
//   `emphasisStyle.fill = liftColor(fromFill)`   (`echarts/lib/util/states.js`)
// — et `liftColor()` s'appuie sur le parseur de zrender. Sur une couleur moderne
// (`oklch()`, `color-mix()`, `rgb(0 0 0 / .5)` — c'est-à-dire **tous** les tokens d'un
// thème shadcn/Docd) la fonction sort sans `return` → `undefined` → la forme est dessinée
// sans remplissage → **l'élément survolé disparaît** (cf. `.memory/warnings.md`).
//
// Piège vérifié : `ctx.fillStyle = "oklch(…)"` **conserve l'espace colorimétrique** — la
// relecture rend la même chaîne `oklch(…)`. Recopier `fillStyle` ne normalise donc rien ;
// le seul moyen portable de convertir n'importe quelle couleur CSS en sRGB est de la
// **peindre puis de relire les pixels** (`getImageData`).

/** Sentinelles : une couleur invalide laisse `fillStyle` inchangé */
const SENTINELS = ["#010203", "#040506"]

/** Octets sRGB → CSS relisible par zrender : `#rrggbb` si opaque, sinon `rgba(…)` */
export function rgbaFromBytes(r: number, g: number, b: number, a: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  const byte = (n: number) => clamp(n).toString(16).padStart(2, "0")
  // Opaque → `#rrggbb` (la forme la plus lisible) ; sinon l'alpha est conservé
  return clamp(a) === 255
    ? `#${byte(r)}${byte(g)}${byte(b)}`
    : `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${+(clamp(a) / 255).toFixed(3)})`
}

/** Couleur CSS → `#rrggbb` / `rgba(…)`, ou `undefined` si elle est invalide (ou sans
 *  contexte). `ctx` doit être un contexte 2D **1×1** : le canvas ne sert qu'à ça. */
export function normalizeCssColor(
  value: any,
  ctx: CanvasRenderingContext2D | null | undefined,
): string | undefined {
  if (!ctx || typeof value !== "string" || value.trim() === "") return undefined
  // La couleur est-elle reconnue par le navigateur ? (`fillStyle` inchangé = invalide)
  let known = false
  for (const sentinel of SENTINELS) {
    ctx.fillStyle = sentinel
    ctx.fillStyle = value
    if (ctx.fillStyle !== sentinel) {
      known = true
      break
    }
  }
  if (!known) return undefined
  try {
    // Peindre la couleur puis relire le pixel : conversion **indépendante de l'espace
    // colorimétrique** (le seul moyen de sortir un oklch/color-mix en sRGB).
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = value
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    return rgbaFromBytes(r ?? 0, g ?? 0, b ?? 0, a ?? 0)
  } catch {
    // Canvas illisible (contexte perdu, rendu logiciel…) : on retombe sur la
    // sérialisation du navigateur — imparfaite, mais c'est le comportement historique.
    return typeof ctx.fillStyle === "string" ? ctx.fillStyle : undefined
  }
}
