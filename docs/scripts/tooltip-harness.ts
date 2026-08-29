// Harnais de test QTooltip : bundleé par vite (une seule instance Vue), exécuté
// par node avec happy-dom. Monte QBtn + QTooltip, simule le hover, vérifie le tooltip.
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
const { createApp, h } = await import("vue")
const { default: QBtn } = await import("@ui/components/QBtn.vue")
const { default: QTooltip } = await import("@ui/components/QTooltip.vue")

const advance = (ms: number) => new Promise((r) => setTimeout(r, ms))

const app = createApp({
  render: () =>
    h("div", { class: "stage" }, [
      h(
        QBtn,
        { label: "Hover me", color: "primary" },
        { default: () => h(QTooltip, null, { default: () => "Hello! I'm a tooltip." }) },
      ),
      h(
        QBtn,
        { label: "Info", outline: true },
        {
          default: () =>
            h(
              QTooltip,
              { type: "info", icon: "lucide:info", showArrow: true },
              { default: () => "More details" },
            ),
        },
      ),
    ]),
})

const mountEl = win.document.createElement("div")
win.document.body.appendChild(mountEl)
app.mount(mountEl)

const button = win.document.querySelector("button") as HTMLElement
console.log("button found:", !!button)
console.log("anchor in button:", !!win.document.querySelector("button .q-tooltip__anchor"))

// hover
button.dispatchEvent(new win.MouseEvent("mouseenter", { bubbles: false }))
await advance(400)

const tip = win.document.querySelector("body > .q-tooltip") as HTMLElement | null
console.log("tooltip in body:", !!tip)
if (tip) {
  console.log("text:", tip.textContent)
  console.log("style:", tip.getAttribute("style"))
  console.log("display:", getComputedStyle(tip).display)
  console.log("opacity:", getComputedStyle(tip).opacity)
}

// ── Vérifie le tooltip 1 (hover de base) ──
const ok =
  !!button &&
  !!win.document.querySelector("button .q-tooltip__anchor") &&
  !!tip &&
  tip.textContent?.includes("Hello! I'm a tooltip.") &&
  tip.getAttribute("style")?.includes("left:") &&
  tip.getAttribute("style")?.includes("top:") &&
  getComputedStyle(tip).display !== "none"
console.log(ok ? "✅ TOOLTIP WORKS" : "❌ TOOLTIP BROKEN")

// ── Vérifie le tooltip 2 (type info + icône) ──
const buttons = win.document.querySelectorAll("button")
buttons[1]!.dispatchEvent(new win.MouseEvent("mouseenter", { bubbles: false }))
await advance(400)
const tips = win.document.querySelectorAll("body > .q-tooltip")
const tip2 = tips[1] as HTMLElement | undefined
console.log("tip2 bg var:", tip2?.style.getPropertyValue("--q-tooltip-bg"))
console.log("tip2 icon:", !!tip2?.querySelector(".q-tooltip__icon"))

const ok2 =
  !!tip2 &&
  tip2.style.getPropertyValue("--q-tooltip-bg").includes("--info") &&
  !!tip2.querySelector(".q-tooltip__icon") &&
  !!tip2.querySelector(".q-tooltip__arrow") &&
  tip2.textContent?.includes("More details")
console.log(ok2 ? "✅ TYPE/ICON WORKS" : "❌ TYPE/ICON BROKEN")

app.unmount()
process.exit(ok && ok2 ? 0 : 1)
