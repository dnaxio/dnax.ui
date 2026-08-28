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
    "QDialogFooter",
    "QDialogTrigger",
    "QDialogProvider",
  ],
  Fab: ["QFab", "QFabAction"],
  List: ["QList", "QItem", "QItemSection"],
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
};

// Pages écrites à la main (non régénérées)
const CUSTOM_PAGES = new Set([
  "accordion",
  "action-sheet",
  "autocomplete",
  "avatar",
  "badge",
  "btn-group",
  "collapse",
  "date-picker",
  "fab",
  "footer",
  "header",
  "img",
  "inner-loading",
  "input-password",
  "list",
  "loading-provider",
  "bottom-sheet",
  "btn",
  "bubble",
  "card",
  "carousel",
  "checkbox",
  "chip",
  "dialog",
  "icon",
  "input",
  "message-scroller",
  "nav-menu",
  "radio",
  "rating",
  "select",
  "separator",
  "sidebar",
  "slider",
  "syntax",
  "tab-panels",
  "table",
  "tabs",
  "toolbar",
]);

const GUIDES = [
  { title: "Installation", link: "/docs/getting-started/installation" },
  { title: "Setup", link: "/docs/getting-started/quick-start" },
];

// Composants internes (ponts de rendu) non documentés comme pages —
// leur API est le plugin correspondant (voir Plugins API).
const EXCLUDED = new Set(["QNotifyProvider"]);

// Composants Layout : regroupés sous « Layouts > Page » dans le menu
// (leurs pages restent générées, mais hors du groupe Components).
const LAYOUTS = [
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
  { title: "Page Layout", link: "/docs/components/page", export: "QPage" },
  {
    title: "Sidebar Layout",
    link: "/docs/components/sidebar",
    export: "QSidebar",
  },
];
const LAYOUT_EXPORTS = new Set(LAYOUTS.map((l) => l.export));

const PLUGINS = [
  { title: "Dialog", link: "/docs/plugins/api#dialog" },
  { title: "Bottom Sheet", link: "/docs/plugins/api#bottom-sheet" },
  { title: "Notify", link: "/docs/plugins/api#notify" },
  { title: "Loading", link: "/docs/plugins/api#loading" },
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
      link: `/docs/components/${kebab(root)}`,
      export: root,
      members,
    };
  }),
  ...singles.map((n) => ({
    title: titleOf(n),
    link: `/docs/components/${kebab(n)}`,
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
    title: "Components",
    icon: "lucide:component",
    items: [
`;
for (const e of entries) {
  if (LAYOUT_EXPORTS.has(e.export)) continue;
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
  if (!entries.some((e) => kebab(e.export) === base))
    rmSync(`${PAGES_DIR}/${f}`);
}

for (const e of entries) {
  const file = `${PAGES_DIR}/${kebab(e.export)}.vue`;
  if (CUSTOM_PAGES.has(kebab(e.export))) continue; // page écrite à la main

  const parts = e.members
    .filter((m) => m !== e.export)
    .map(
      (m) =>
        `  { title: ${JSON.stringify(titleOf(m))}, export: ${JSON.stringify(m)} },`,
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
