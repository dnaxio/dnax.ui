// Harnais REPRO : contrôle mutuel (A ↔ B) sur QSwiper — boucle infinie possible ?
import { Window } from "happy-dom"

const win = new Window({ url: "http://localhost/" })
for (const k of Object.getOwnPropertyNames(win)) {
  if (!(k in globalThis)) (globalThis as any)[k] = (win as any)[k]
}
globalThis.window = win
globalThis.document = win.document
try { globalThis.navigator = win.navigator } catch {}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
if (typeof globalThis.MutationObserver === "undefined") {
  globalThis.MutationObserver = class {
    observe() {}
    disconnect() {}
    takeRecords() { return [] }
  }
}

const { createApp, h, ref } = await import("vue")
const { default: QSwiper } = await import("@ui/components/QSwiper.vue")
const { default: QSwiperSlide } = await import("@ui/components/QSwiperSlide.vue")

const ctrlA = ref<any>(null)
const changed = ref(0)

const app = createApp({
  render: () => [
    // Master : aucun controller
    h(
      QSwiper,
      {
        slidesPerView: 3,
        spaceBetween: 12,
        onSwiper: (s: any) => { ctrlA.value = s },
        onSlideChange: () => { changed.value++ },
      },
      {
        default: () =>
          [1, 2, 3, 4, 5].map((i) => h(QSwiperSlide, { key: i }, { default: () => "A " + i })),
      },
    ),
    // Slave : contrôlé par le master (UNIDIRECTIONNEL)
    h(
      QSwiper,
      {
        slidesPerView: 3,
        spaceBetween: 12,
        controller: { control: ctrlA.value },
        onSlideChange: () => { changed.value++ },
      },
      {
        default: () =>
          [1, 2, 3, 4, 5].map((i) => h(QSwiperSlide, { key: i }, { default: () => "B " + i })),
      },
    ),
  ],
})

const mountEl = win.document.createElement("div")
win.document.body.appendChild(mountEl)
app.mount(mountEl)

// Laisse le temps aux swipers de s'initialiser et au contrôle mutuel de se connecter
await new Promise((r) => setTimeout(r, 1500))

console.log("ctrlA set:", !!ctrlA.value)
console.log("slideChange count:", changed.value)

console.log(ctrlA.value ? "✅ CONTROLLER OK (unidirectionnel, pas de boucle)" : "⚠️ master non connecté")
app.unmount()
process.exit(0)
