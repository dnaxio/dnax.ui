// Harnais de test QSwiper : vérifie que swiper/vue reconnaît bien QSwiperSlide
// (détection par nom "SwiperSlide") et initialise les slides.
import { Window } from "happy-dom"

const win = new Window({ url: "http://localhost/" })
for (const k of Object.getOwnPropertyNames(win)) {
  if (!(k in globalThis)) (globalThis as any)[k] = (win as any)[k]
}
globalThis.window = win
globalThis.document = win.document
try { globalThis.navigator = win.navigator } catch {}

// Polyfills happy-dom manquants
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

const active = ref(false)

const app = createApp({
  render: () =>
    h(QSwiper, { slidesPerView: 2, spaceBetween: 16, onSwiper: () => { active.value = true } }, {
      default: () =>
        [1, 2, 3, 4, 5].map((i) =>
          h(QSwiperSlide, { key: i }, { default: () => "Slide " + i }),
        ),
    }),
})

const mountEl = win.document.createElement("div")
win.document.body.appendChild(mountEl)
app.mount(mountEl)

await new Promise((r) => setTimeout(r, 300))

const slides = win.document.querySelectorAll(".swiper-slide")
const initialized = !!win.document.querySelector(".swiper.swiper-initialized")
console.log("slides found:", slides.length)
console.log("initialized:", initialized)
console.log("first text:", slides[0]?.textContent)
console.log("active:", active.value)

const ok =
  slides.length === 5 &&
  initialized &&
  active.value &&
  slides[0]?.textContent?.includes("Slide 1")

console.log(ok ? "✅ QSWIPER WORKS" : "❌ QSWIPER BROKEN")
app.unmount()
process.exit(ok ? 0 : 1)
