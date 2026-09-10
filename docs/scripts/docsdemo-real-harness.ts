// Harnais DocsDemo RÉEL (v2) : slot réactif côté page + sélection d'action (re-render
// de la page → le slot est recréé → patch sous QTabPanels) + bascule d'onglets.
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

const { createApp, defineComponent, h, ref, nextTick } = await import("vue")
const QTabs = (await import("@ui/components/QTabs.vue")).default
const QTab = (await import("@ui/components/QTab.vue")).default
const QTabPanels = (await import("@ui/components/QTabPanels.vue")).default
const QTabPanel = (await import("@ui/components/QTabPanel.vue")).default
const QSyntax = (await import("@ui/components/QSyntax.vue")).default
const QBtnActions = (await import("@ui/components/_QBtnActionsLegacy.vue")).default
const QBtn = (await import("@ui/components/QBtn.vue")).default
const QSeparator = defineComponent({ template: "<hr class='q-separator' />" })
const DocsDemo = (await import("../app/components/DocsDemo.vue")).default

const advance = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const actions = [
  { label: "Copy link", value: "copy-link", icon: "lucide:link" },
  { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
  { separator: true },
  { label: "Archive", value: "archive", icon: "lucide:archive", color: "warning" },
]

// Page fidèle à btn-actions.vue : slot réactif (lastMenu) + DocsDemo code/script
const makeDemo = (name: string) =>
  defineComponent({
    name: `Page${name}`,
    setup() {
      const lastMenu = ref("—")
      const demo = () =>
        h(
          DocsDemo,
          { code: `<q-btn-actions label="Actions" outline no-caps :actions="menuActions" @select-action="onMenuAction" />`, lang: "html", filename: "App.vue", script: "const lastMenu = ref('—')" },
          {
            default: () =>
              h("div", { class: `demo-col ${name}` }, [
                h(QBtnActions, {
                  label: "Actions", outline: true, "no-caps": true, actions,
                  "onSelect-action": (v: any) => (lastMenu.value = String(v)),
                }),
                h("p", { class: "demo-meta" }, ["Selected: ", lastMenu.value]),
              ]),
          },
        )
      return { lastMenu, demo }
    },
    render(this: any) {
      return h("div", { class: "stage" }, [this.demo()])
    },
  })

const Demo1 = makeDemo("demo1")
const Demo2 = makeDemo("demo2")

const app = createApp({
  render: () => h("div", null, [h(Demo1), h(Demo2)]),
})
app.component("QTabs", QTabs)
app.component("QTab", QTab)
app.component("QTabPanels", QTabPanels)
app.component("QTabPanel", QTabPanel)
app.component("QSyntax", QSyntax)
app.component("QBtnActions", QBtnActions)
app.component("QBtn", QBtn)
app.component("QSeparator", QSeparator)

const mountEl = win.document.createElement("div")
win.document.body.appendChild(mountEl)

const errors: string[] = []
const origError = console.error
console.error = (...a: any[]) => {
  const s = a.map(String).join(" ")
  if (!s.includes("[Vue warn]: Component provided template option")) errors.push(s)
}

app.mount(mountEl)
await advance(20)
await advance(20)
console.log("panels:", win.document.querySelectorAll(".q-tab-panel").length)

const click = (el: Element | null | undefined) => el?.dispatchEvent(new win.MouseEvent("click", { bubbles: true }))

const selectItem = async () => {
  // clic sur un item du menu ouvert
  const items = win.document.querySelectorAll(".q-btn-actions__item")
  if (items.length) click(items[1]) // "Duplicate" → lastMenu change → re-render page
  await nextTick()
  await advance(10)
}

let crashed = false
for (let round = 0; round < 10 && !crashed; round++) {
  // ouvre le menu du premier bloc, sélectionne une action → re-render page
  const demo = win.document.querySelector(".demo-col.demo1") as HTMLElement | null
  const trigger = demo?.querySelector(".q-btn-actions__trigger")
  click(trigger)
  await advance(10)
  await selectItem()

  // bascule vers "code" puis retour "preview"
  const tabs = Array.from(demo?.querySelectorAll(".q-tab") ?? [])
  click(tabs[1])
  await advance(20)
  await advance(20)
  click(tabs[0])
  await advance(20)
  await advance(20)

  crashed = errors.some((e) => e.includes("emitsOptions"))
  if (crashed) break
}

console.error = origError
const fail = errors.filter((e) => e.includes("emitsOptions"))
console.log(fail.length ? "❌ CRASH REPRODUCED" : "✅ no crash")
if (fail.length) console.log(fail[0].slice(0, 600))
app.unmount()
process.exit(fail.length ? 1 : 0)
