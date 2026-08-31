// Génère docs/app/data/menu.ts + les pages statiques docs/app/pages/docs/components/*.vue.
// Familles (Accordion, Dialog, Sidebar…) : une entrée de menu + une page documentant toutes les parties.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";

// ─── Familles : la racine documente toutes ses parties (une seule entrée de menu) ───
const FAMILIES: Record<string, string[]> = {
  Accordion: [
    "QAccordion",
    "QAccordionItem",
    "QAccordionTrigger",
    "QAccordionContent",
  ],
  "Bottom Sheet": [
    "QBottomSheet",
    "QBottomSheetHeader",
    "QBottomSheetFooter",
    "QBottomSheetTrigger",
    "QBottomSheetProvider",
  ],
  Bubble: ["QBubble", "QBubbleContent", "QBubbleGroup", "QBubbleReactions"],
  Card: ["QCard", "QCardContent", "QCardActions"],
  Carousel: ["QCarousel", "QCarouselContent", "QCarouselItem", "QCarouselNav"],
  Dialog: [
    "QDialog",
    "QDialogHeader",
    "QDialogContent",
    "QDialogFooter",
    "QDialogTrigger",
    "QDialogProvider",
  ],
  Fab: ["QFab", "QFabAction"],
  Grid: ["QGrid", "QGridItem"],
  List: ["QList", "QItem", "QItemSection"],
  Loading: ["QLoading", "QLoadingProvider"],
  "Message Scroller": [
    "QMessageScroller",
    "QMessageScrollerContent",
    "QMessageScrollerItem",
    "QMessageScrollerButton",
    "QMessageScrollerViewport",
    "QMessageScrollerProvider",
  ],
  "Nav Menu": [
    "QNavMenu",
    "QNavMenuContent",
    "QNavMenuItem",
    "QNavMenuTrigger",
  ],
  Sidebar: [
    "QSidebar",
    "QSidebarHeader",
    "QSidebarContent",
    "QSidebarFooter",
    "QSidebarMenu",
    "QSidebarMenuButton",
    "QSidebarMenuItem",
    "QSidebarTrigger",
  ],
  Swiper: ["QSwiper", "QSwiperSlide"],
  Tabs: ["QTab", "QTabs"],
  "Tab Panels": ["QTabPanels", "QTabPanel"],
};

// Pages écrites à la main (non régénérées)
const CUSTOM_PAGES = new Set([
  "accordion",
  "action-sheet",
  "autocomplete",
  "avatar",
  "back-top",
  "badge",
  "btn-group",
  "col",
  "collapse",
  "config-provider",
  "container",
  "count-down",
  "data-grid",
  "date-picker",
  "fab",
  "footer",
  "gallery",
  "grid",
  "header",
  "img",
  "image-preview",
  "infinite-scroll",
  "inner-loading",
  "intersection",
  "input-password",
  "input-otp",
  "input-tag",
  "linear-progress",
  "list",
  "loading",
  "loading-provider",
  "bottom-sheet",
  "btn",
  "bubble",
  "card",
  "carousel",
  "checkbox",
  "chip",
  "country-picker",
  "dialog",
  "icon",
  "input",
  "marquee",
  "message-scroller",
  "nav-menu",
  "pagination",
  "parallax",
  "radio",
  "rating",
  "reorder",
  "rolling-text",
  "row",
  "pull-to-refresh",
  "safe-area",
  "scroll-area",
  "select",
  "separator",
  "sidebar",
  "skeleton",
  "slider",
  "spinner",
  "splitter",
  "sticky",
  "swiper",
  "swipe-cell",
  "syntax",
  "tab-panels",
  "table",
  "tabs",
  "text",
  "text-caption",
  "toolbar",
  "tooltip",
  "uploader",
  "video",
]);

const GUIDES = [
  { title: "Installation", link: "/docs/getting-started/installation" },
  { title: "Setup", link: "/docs/getting-started/quick-start" },
];

// Pages vitrines (hors docs, accessibles depuis le menu)
const SHOWCASE = [{ title: "Mobile Mockup", link: "/mockup" }];

// Composants internes (ponts de rendu) non documentés comme pages —
// leur API est le plugin correspondant (voir Plugins API).
const EXCLUDED = new Set(["QNotifyProvider", "QNotifyToast"]);

// Composants Layout : regroupés sous « Layouts > Page » dans le menu
// (leurs pages restent générées, mais hors du groupe Components).
// Ordre : configuration (Config Provider) → disposition (Page) → barres (Header/Footer) → Sidebar.
const LAYOUTS = [
  {
    title: "Config Provider",
    link: "/docs/components/config-provider",
    export: "QConfigProvider",
  },
  { title: "Page Layout", link: "/docs/components/page", export: "QPage" },
  {
    title: "Header Layout",
    link: "/docs/components/header",
    export: "QHeader",
  },
  {
    title: "Footer Layout",
    link: "/docs/components/footer",
    export: "QFooter",
  },
  {
    title: "Sidebar Layout",
    link: "/docs/components/sidebar",
    export: "QSidebar",
  },
];
const LAYOUT_EXPORTS = new Set(LAYOUTS.map((l) => l.export));

// Composants Styles : listés à plat sous « Styles » (plus de sous-groupes
// Columns / Rows) — leurs pages restent générées/custom, mais hors du groupe
// Components.
const STYLES = [
  { title: "Grid", link: "/docs/components/grid", export: "QGrid" },
  { title: "Col", link: "/docs/components/col", export: "QCol" },
  { title: "Row", link: "/docs/components/row", export: "QRow" },
];
const STYLE_EXPORTS = new Set(STYLES.map((i) => i.export));

// Slugs de pages surchargés (nom de fichier/lien ≠ kebab de l'export)
const SLUG_OVERRIDES: Record<string, string> = {
  QTab: "tabs",
};
const slugOf = (exportName: string) =>
  SLUG_OVERRIDES[exportName] ?? kebab(exportName);

const PLUGINS = [
  { title: "Dialog", link: "/docs/plugins/dialog" },
  { title: "Bottom Sheet", link: "/docs/plugins/bottom-sheet" },
  { title: "Notify", link: "/docs/plugins/notify" },
  { title: "Loading", link: "/docs/plugins/loading" },
  { title: "Image Preview", link: "/docs/plugins/image-preview" },
  { title: "Platform", link: "/docs/plugins/platform" },
];

const titleOf = (name: string) => {
  let n = name
    .replace(/^Q/, "")
    .replace(/Btn/g, "Button")
    .replace(/Img$/, "Image");
  return n
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
};

// Titres de menu surchargés (dérivation automatique imparfaite)
const TITLE_OVERRIDES: Record<string, string> = {
  QInputOtp: "Input OTP",
};
const titleOfEntry = (exportName: string) =>
  TITLE_OVERRIDES[exportName] ?? titleOf(exportName);
const kebab = (name: string) =>
  name
    .replace(/^Q/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

const files = readdirSync("packages/ui/components")
  .filter((f) => f.endsWith(".vue"))
  .map((f) => f.replace(/\.vue$/, ""))
  .filter((f) => !EXCLUDED.has(f))
  .sort();

const familyMembers = new Set(Object.values(FAMILIES).flat());
const familyRoots = new Set(Object.values(FAMILIES).map((m) => m[0]));
const singles = files.filter(
  (f) => !familyMembers.has(f) && !familyRoots.has(f),
);

// Entrées du menu : racines de familles + composants simples, triés par titre
const entries = [
  ...Object.entries(FAMILIES).map(([title, members]) => {
    const root = members[0]!;
    return {
      title,
      link: `/docs/components/${slugOf(root)}`,
      export: root,
      members,
    };
  }),
  ...singles.map((n) => ({
    title: titleOfEntry(n),
    link: `/docs/components/${slugOf(n)}`,
    export: n,
    members: [n],
  })),
].sort((a, b) => a.title.localeCompare(b.title));

// ─── menu.ts ───
let out = `export interface MenuItem {
  title: string
  link: string
  /** Export dans @dnax/ui (ex. QBtn) — vide pour les guides/plugins */
  export?: string
}

export interface MenuSubgroup {
  title: string
  items: MenuItem[]
}

export interface MenuGroup {
  title: string
  /** Icône Iconify du groupe (affichée à gauche du libellé) */
  icon?: string
  items?: MenuItem[]
  /** Sous-groupes (ex. Layouts > Page) */
  groups?: MenuSubgroup[]
}

export const menuItems: MenuGroup[] = [
  {
    title: "Getting Started",
    icon: "lucide:rocket",
    items: [
`;
for (const g of GUIDES)
  out += `      { title: ${JSON.stringify(g.title)}, link: ${JSON.stringify(g.link)} },\n`;
out += `    ],
  },
  {
    title: "Showcase",
    icon: "lucide:smartphone",
    items: [
`;
for (const s of SHOWCASE)
  out += `      { title: ${JSON.stringify(s.title)}, link: ${JSON.stringify(s.link)} },\n`;
out += `    ],
  },
  {
    title: "Layouts",
    icon: "lucide:layout-template",
    groups: [
      {
        title: "Page",
        items: [
`;
for (const l of LAYOUTS)
  out += `          { title: ${JSON.stringify(l.title)}, link: ${JSON.stringify(l.link)}, export: ${JSON.stringify(l.export)} },\n`;
out += `        ],
      },
    ],
  },
  {
    title: "Styles",
    icon: "lucide:frame",
    items: [
`;
for (const s of STYLES)
  out += `      { title: ${JSON.stringify(s.title)}, link: ${JSON.stringify(s.link)}, export: ${JSON.stringify(s.export)} },\n`;
out += `    ],
  },
  {
    title: "Components",
    icon: "lucide:component",
    items: [
`;
for (const e of entries) {
  if (LAYOUT_EXPORTS.has(e.export) || STYLE_EXPORTS.has(e.export)) continue;
  out += `      { title: ${JSON.stringify(e.title)}, link: ${JSON.stringify(e.link)}, export: ${JSON.stringify(e.export)} },\n`;
}
out += `    ],
  },
  {
    title: "Plugins API",
    icon: "lucide:plug",
    items: [
`;
for (const p of PLUGINS)
  out += `      { title: ${JSON.stringify(p.title)}, link: ${JSON.stringify(p.link)} },\n`;
out += `    ],
  },
]
`;
writeFileSync("docs/app/data/menu.ts", out);

// ─── Pages statiques par composant ───
const PAGES_DIR = "docs/app/pages/docs/components";
mkdirSync(PAGES_DIR, { recursive: true });

// Nettoie les pages générées obsolètes (conserve les pages custom)
for (const f of readdirSync(PAGES_DIR)) {
  if (!f.endsWith(".vue")) continue;
  const base = f.replace(/\.vue$/, "");
  if (CUSTOM_PAGES.has(base)) continue;
  if (!entries.some((e) => slugOf(e.export) === base))
    rmSync(`${PAGES_DIR}/${f}`);
}

for (const e of entries) {
  const file = `${PAGES_DIR}/${slugOf(e.export)}.vue`;
  if (CUSTOM_PAGES.has(slugOf(e.export))) continue; // page écrite à la main

  const parts = e.members
    .filter((m) => m !== e.export)
    .map(
      (m) =>
        `  { title: ${JSON.stringify(titleOfEntry(m))}, export: ${JSON.stringify(m)} },`,
    );
  const partsBlock = parts.length
    ? `\nconst parts = [\n${parts.join("\n")}\n]\n`
    : "";
  const template = parts.length
    ? `<DocsComponentPage title=${JSON.stringify(e.title)} export=${JSON.stringify(e.export)} :parts="parts" />`
    : `<DocsComponentPage title=${JSON.stringify(e.title)} export=${JSON.stringify(e.export)} />`;

  writeFileSync(
    file,
    `<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })
${partsBlock}
</script>

<template>
  ${template}
</template>
`,
  );
}

console.log(
  `✓ menu.ts : ${GUIDES.length} guides + ${entries.length} composants (${Object.keys(FAMILIES).length} familles)`,
);
console.log(
  `✓ ${entries.length} pages générées dans docs/app/pages/docs/components/`,
);
