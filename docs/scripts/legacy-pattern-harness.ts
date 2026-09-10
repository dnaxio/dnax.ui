// Harnais : reproduit le crash emitsOptions avec le VRAI motif SFC cassé
// (<template v-for> + deux frères v-if indépendants) dans un Teleport+Transition,
// monté dans la structure DocsDemo (QTabPanels animated). Scénario réel :
// ouvrir le menu, puis basculer d'onglet (DocsDemo re-render → patch du menu).
import { Window } from "happy-dom"

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
} catch {}
globalThis.HTMLElement = win.HTMLElement
globalThis.Element = win.Element
globalThis.Node = win.Node

const { createApp, defineComponent, h, ref } = await import("vue")
const QTabs = (await import("@ui/components/QTabs.vue")).default
const QTab = (await import("@ui/components/QTab.vue")).default
const QTabPanels = (await import("@ui/components/QTabPanels.vue")).default
const QTabPanel = (await import("@ui/components/QTabPanel.vue")).default
const LegacyActions = (await import("@ui/components/_QBtnActionsLegacy.vue")).default

const advance = () => new Promise((r) => setTimeout(r, 0))

// — DocsDemo (fidèle à docs/app/components/DocsDemo.vue) —
const DocsDemo = defineComponent({
  props: { code: String, script: String },
  setup(props, { slots }) {
    const tab = ref<"preview" | "code">("preview")
    const tree = h("div", { class: "demo-block" }, [
      h(
        QTabs,
        { modelValue: tab.value, "onUpdate:modelValue": (v: any) => (tab.value = v), "no-caps": true, "inline-label": true, align: "left", dense: true },
        { default: () => [h(QTab, { name: "preview", label: "Preview" }), h(QTab, { name: "code", label: "Code" })] },
      ),
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
    return { tab, tree }
  },
  render(this: any) {
    return this.tree
  },
})

const Page = defineComponent({
  setup() {
    const menuActions = [
      { label: "Copy link", value: "copy-link", icon: "lucide:link" },
      { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
      { separator: true },
      { label: "Archive", value: "archive", icon: "lucide:archive", color: "warning" },
    ]
    return {
      menuActions,
      demo: () =>
        h(
          DocsDemo,
          { code: "<q-btn-actions label=\"Actions\" />", script: "const x = 1" },
          {
            default: () =>
              h("div", { class: "demo-col" }, [
                h(LegacyActions, { label: "Actions", outline: true, "no-caps": true, actions: menuActions }),
                h("p", {}, ["Selected: —"]),
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

const errors: string[] = []
const origError = console.error
console.error = (...a: any[]) => {
  errors.push(a.map(String).join(" "))
}

app.mount(mountEl)
await advance()
await advance()

// 1) ouvre le menu (clic sur le déclencheur)
const trigger = win.document.querySelector(".q-btn-actions__trigger") as HTMLElement | null
trigger?.dispatchEvent(new win.MouseEvent("click", { bubbles: true }))
await advance()
await advance()
console.log("menu open:", !!win.document.querySelector(".q-btn-actions__panel"))

// 2) bascule d'onglet pendant que le menu est ouvert
for (let round = 0; round < 6; round++) {
  win.document.querySelectorAll(".q-tab")[1]?.dispatchEvent(new win.MouseEvent("click", { bubbles: true }))
  await advance()
  await advance()
  win.document.querySelectorAll(".q-tab")[0]?.dispatchEvent(new win.MouseEvent("click", { bubbles: true }))
  await advance()
  await advance()
  if (errors.some((e) => e.includes("emitsOptions"))) break
}

console.error = origError
const fail = errors.filter((e) => e.includes("emitsOptions"))
console.log(fail.length ? "❌ CRASH REPRODUCED" : "✅ no crash")
if (fail.length) console.log(fail[0].slice(0, 400))
app.unmount()
process.exit(fail.length ? 0 : 2)
