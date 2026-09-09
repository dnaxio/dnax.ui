#!/usr/bin/env python3
# Génère docs/public/docs.txt — documentation complète (Props/Events/Slots/Methods)
# de chaque composant Q* à partir de packages/ui/components/*.vue, des plugins $q
# (lib/q.ts) et des pages docs.
import os, re, html, glob

SRC = "packages/ui/components"
DOCS = "docs/app/pages/docs/components"
OUT = "docs/public/docs.txt"

def clean(s):
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    return re.sub(r"[ \t]+", " ", s).strip()

def head_comment(src):
    """Premier bloc de commentaires // en tête du fichier (description)."""
    m = re.match(r"^\s*(//[^\n]*\n\s*)+", src)
    if not m: return ""
    out = []
    for line in m.group(0).splitlines():
        line = line.strip()
        if line.startswith("//"):
            out.append(line[2:].strip())
    return " ".join(x for x in out if x)

def page_desc(slug):
    p = os.path.join(DOCS, slug + ".vue")
    if not os.path.exists(p): return ""
    t = open(p, encoding="utf-8").read()
    if "DocsComponentPage" in t: return ""
    m = re.search(r'<p class="doc-lead">(.*?)</p>', t, re.S)
    return clean(m.group(1)) if m else ""

def extract_interface_props(src, name="Props"):
    """Interface Props { /** doc */ name?: Type } — renvoie liste (name, doc, type, optional)."""
    m = re.search(r"interface\s+" + name + r"\s*\{(.*?)\n\}", src, re.S)
    if not m: return []
    body = m.group(1)
    props = []
    # découpe sur les lignes de propriétés en tenant compte des blocs doc /** */
    # tokenise : commentaires /* */ puis ligne de prop
    i = 0
    tokens = []
    for mm in re.finditer(r"/\*\*(.*?)\*/|(?m)^\s*([A-Za-z_$][\w$]*)\s*(\??)\s*:\s*([^\n]+?)\s*$", body, re.S):
        if mm.group(1) is not None:
            tokens.append(("doc", clean(mm.group(1))))
        elif mm.group(2) is not None:
            tokens.append(("prop", mm.group(2), mm.group(3) == "?", mm.group(4).strip()))
    props = []
    cur_doc = ""
    for tok in tokens:
        if tok[0] == "doc":
            cur_doc = tok[1]
        else:
            props.append({"name": tok[1], "optional": tok[2], "type": tok[3], "doc": cur_doc})
            cur_doc = ""
    return props

def extract_defaults(src):
    """withDefaults(defineProps<Props>(), { name: value, ... })"""
    m = re.search(r"withDefaults\(\s*defineProps<[\w]+>\(\),\s*\{(.*?)\}\s*\)", src, re.S)
    if not m: return {}
    body = m.group(1)
    defaults = {}
    for mm in re.finditer(r"([A-Za-z_$][\w$]*)\s*:\s*([^,\n]+)", body):
        val = mm.group(2).strip()
        # normalize () => ...
        if val.startswith("() =>"):
            inner = val[5:].strip()
            defaults[mm.group(1)] = inner
        else:
            defaults[mm.group(1)] = val
    return defaults

def extract_emits(src):
    """defineEmits<{ "name": [arg: type, ...] | ... }>()"""
    m = re.search(r"defineEmits<\{([\s\S]*?)\}>\(\)", src)
    if not m: return []
    body = m.group(1)
    body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
    out = []
    for mm in re.finditer(r'["']?([A-Za-z][\w:$-]*)["']?\s*:\s*\[([^\]]*)\]', body):
        name = mm.group(1)
        args = mm.group(2)
        payload = ", ".join(
            re.sub(r"^[A-Za-z_$][\w$]*\s*:\s*", "", a.strip()) for a in args.split(",") if a.strip()
        )
        out.append((name, payload))
    return out

def extract_slots(src):
    out = []
    for mm in re.finditer(r"<slot\b([^>]*?)(?:/>|>)", src):
        n = re.search(r'\bname\s*=\s*["\']([^"\']+)["\']', mm.group(1))
        out.append(n.group(1) if n else "default")
    # déduplique
    return list(dict.fromkeys(out))

def extract_expose(src):
    m = re.search(r"defineExpose\(\{([\s\S]*?)\}\)", src)
    if not m: return []
    body = m.group(1)
    return [x.strip() for x in re.findall(r"(?:^|[,;\n])\s*([A-Za-z_$][\w$]*)\s*:", body)]

def kebab(name):
    s = name[1:]
    return "q-" + re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", s).lower()

def default_display(d):
    if d is None: return ""
    s = d.replace("\n", " ")
    if len(s) > 60: s = s[:57] + "…"
    return s

# ── $q plugin info (déclaratif rapide) ──
Q_PLUGIN_DESC = {
  "dialog": "$q.dialog — imperative dialog: $q.dialog.open(options) → DialogController; declarative <q-dialog>.",
  "bottomSheet": "$q.bottomSheet — imperative bottom sheet: $q.bottomSheet.open(options) → BottomSheetController.",
  "imagePreview": "$q.imagePreview — imperative fullscreen lightbox: $q.imagePreview.open(urls, opts).",
  "notify": "$q.notify — toasts: $q.notify.show(options) / $q.notify(options) — types, position, actions.",
  "loading": "$q.loading — fullscreen overlay: $q.loading.show(opts) / $q.loading.hide().",
  "platform": "$q.platform — device/OS detection (is.desktop, is.ios, has.touch…).",
  "breakpoints": "$q.breakpoints — screen breakpoint helpers.",
  "screen": "$q.screen — reactive window/screen info (width, height, orientation…).",
  "localStorage": "$q.localStorage — typed web storage (Quasar-compatible).",
  "sessionStorage": "$q.sessionStorage — typed web storage (Quasar-compatible).",
}
DIRECTIVES = {
  "v-close": "close parent overlay (dialog / bottom sheet).",
  "v-touch-pan": "pan gesture (direction, delta, distance, speed).",
  "v-touch-hold": "press & hold (duration, repeat).",
  "v-touch-swipe": "swipe direction.",
  "v-touch-repeat": "repeat while held.",
  "v-intersection": "observe viewport visibility.",
}

out = []
out.append("# dnax.ui — Documentation complète des composants")
out.append("")
out.append("Généré depuis `packages/ui/components/*.vue` + `lib/q.ts`. Chaque composant expose une balise kebab-case (`QAvatar` → `<q-avatar>`), un `v-model` Quasar, des props booléennes modifier (`flat dense no-caps`), et partage les modifiers communs `dense`, `flat`, `bordered`, `readonly`, `disable`, `dark`, `color`/`text-color`, `size`, `radius`.")
out.append("")

# trier les composants
files = sorted(glob.glob(os.path.join(SRC, "Q*.vue")))
# exclure les familles 'internes' (sub-components) déjà couvertes par leur parent ?
# on les garde mais sous-section famille quand le nom est dérivé du parent.
roots = []
for f in files:
    name = os.path.basename(f)[:-4]
    src = open(f, encoding="utf-8").read()
    slug = kebab(name)[2:]
    props = extract_interface_props(src)
    defaults = extract_defaults(src)
    emits = extract_emits(src)
    slots = extract_slots(src)
    methods = extract_expose(src)
    desc = page_desc(slug) or head_comment(src)

    out.append(f"## {name} — `<{kebab(name)}>`")
    if desc: out.append("")
    if desc: out.append(desc)
    out.append("")
    # Exemple minimal
    if props:
        sample = f"<{kebab(name)} />"
        out.append(f"**Usage** : `{sample}`")
        out.append("")
        out.append("### Props")
        out.append("")
        out.append("| Prop | Type | Défaut | Description |")
        out.append("|---|---|---|---|")
        for p in props:
            d = defaults.get(p["name"], "")
            out.append(f"| {p['name']} | `{p['type']}` | {default_display(d) or '—'} | {p['doc']} |")
        out.append("")
    if emits:
        out.append("### Events")
        out.append("")
        out.append("| Event | Payload |")
        out.append("|---|---|")
        for name_e, payload in emits:
            out.append(f"| `{name_e}` | {payload or '—'} |")
        out.append("")
    if slots:
        out.append("### Slots")
        out.append("")
        for s in slots:
            out.append(f"- `#{s}`" + (" (default)" if s == "default" else ""))
        out.append("")
    if methods:
        out.append("### Methods")
        out.append("")
        out.append(", ".join(f"`{m}()`" for m in methods))
        out.append("")
    out.append("")

# ── Plugins $q ──
out.append("# Plugins $q")
out.append("")
out.append("Accès programmatique via `$q` (injecté par `QConfigProvider` ou `usePlugin()`).")
out.append("")
for k, v in Q_PLUGIN_DESC.items():
    out.append(f"- **`$q.{k}`** — {v}")
out.append("")

# ── Directives ──
out.append("# Vue Directives")
out.append("")
for k, v in DIRECTIVES.items():
    out.append(f"- **`{k}`** — {v}")
out.append("")

open(OUT, "w", encoding="utf-8").write("\n".join(out))
print("OK — écrit", len("\n".join(out)), "caractères,", len(files), "composants")
