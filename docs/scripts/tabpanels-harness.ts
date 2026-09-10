// Harnais de test DocsDemo/QTabPanels : monte QTabs + QTabPanels (animated) avec
// panneaux preview (slot forwarding) / code, simule des changements d'onglet et
// capture le crash `emitsOptions` null (désynchronisation de l'arbre de blocs).
import { Window } from "happy-dom"

// ── Setup DOM avant tout import Vue ──
const win = new Window({ url: "http://localhost/" })
for (const k of Object.getOwnPropertyNames(win)) {
  if (!(k in globalThis)) {
    ;(globalThis as any)[k] = (win as any)[k]
  }
}
globalThis.window = win
globalThis.document = win.document
try {
  globalThis.navigator = win.navigator
} catch {
  // node 21+ a un navigator natif en lecture seule
}
globalThis.HTMLElement = win.HTMLElement
globalThis.Element = win.Element
globalThis.Node = win.Node

// ── Imports dynamiques (après le setup) ──
const { createApp, defineComponent, h, ref } = await import("vue")
const QTabs = (await import("@ui/components/QTabs.vue")).default
const QTab = (await import("@ui/components/QTab.vue")).default
const QTabPanels = (await import("@ui/components/QTabPanels.vue")).default
const QTabPanel = (await import("@ui/components/QTabPanel.vue")).default
const QBtnActions = (await import("@ui/components/QBtnActions.vue")).default

const advance = () => new Promise((r) => setTimeout(r, 0))

// — DocsDemo reproduit fidèlement docs/app/components/DocsDemo.vue —
const DocsDemo = defineComponent({
  props: { code: String, script: String },
  setup(props, { slots }) {
    const tab = ref<"preview" | "code">("preview")
    const demo = h("div", { class: "demo-block" }, [
      h(
        QTabPanels,
        { modelValue: tab.value, "onUpdate:modelValue": (v: any) => (tab.value = v), animated: "" },
        {
          default: () => [
            h(QTabPanel, { name: "preview" }, { default: () => h("div", { class: "demo-block__preview" }, [slots.default?.()]) }),
            h(
              QTabPanel,
              { name: "code", class: "demo-block__code" },
              {
                default: () => [
                  h("div", { class: "raw" }, [props.code]),
                  props.script ? h("div", { class: "raw" }, [props.script]) : null,
                ],
              },
            ),
          ],
        },
      ),
    ])
    return { tab, demo }
  },
  render(this: any) {
    return this.demo
  },
})

// — Page reproduit le slot fourni par btn-actions.vue à DocsDemo —
const Page = defineComponent({
  setup() {
    const lastMenu = ref("—")
    const actions = [
      { label: "Copy link", value: "copy-link", icon: "lucide:link" },
      { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
      { separator: true },
      { label: "Archive", value: "archive", icon: "lucide:archive", color: "warning" },
    ]
    return {
      lastMenu,
      actions,
      demo: () =>
        h(
          DocsDemo,
          { code: "<q-btn-actions label=\"Actions\" />", script: "const x = 1" },
          {
            default: () =>
              h("div", { class: "demo-col" }, [
                h(QBtnActions, { label: "Actions", outline: true, "no-caps": true, actions, "onSelect-action": (v: any) => (lastMenu.value = String(v)) }),
                h("p", { class: "demo-meta" }, ["Selected: ", h("code", { innerHTML: lastMenu.value })]),
              ]),
          },
        ),
    }
  },
  render(this: any) {
    return h("div", { class: "stage" }, [this.demo()])
  },
})

const app = createApp(Page)
const mountEl = win.document.createElement("div")
win.document.body.appendChild(mountEl)

// Capture des erreurs non gérées
const errors: string[] = []
const origError = console.error
console.error = (...a: any[]) => {
  errors.push(a.map(String).join(" "))
}

app.mount(mountEl)
await advance()
await advance()

console.log("panels mounted:", !!win.document.querySelector(".q-tab-panel"))
console.log("initial state OK")

// ── Bascule preview → code → preview, répétée (reproduction du crash) ──
let crashed = false
for (let round = 0; round < 4 && !crashed; round++) {
  // passe en "code"
  win.document.querySelectorAll(".q-tab")[1]?.dispatchEvent(new win.MouseEvent("click", { bubbles: true }))
  await advance()
  await advance()
  // revient en "preview"
  win.document.querySelectorAll(".q-tab")[0]?.dispatchEvent(new win.MouseEvent("click", { bubbles: true }))
  await advance()
  await advance()

  const panelCode = win.document.querySelector('.q-tab-panel[name="code"]')
  console.log(`round ${round}: code display=${panelCode ? (panelCode as HTMLElement).style.display : "?"} `)
  crashed = errors.some((e) => e.includes("emitsOptions"))
}

console.error = origError
const fail = errors.filter((e) => e.includes("emitsOptions"))
if (fail.length) {
  console.log("❌ CRASH REPRODUCED:", fail[0])
} else {
  console.log("✅ NO CRASH (emitsOptions)")
}

app.unmount()
process.exit(fail.length ? 1 : 0)
