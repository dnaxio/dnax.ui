<script lang="ts">
// QNavMenu — barre de navigation type NavigationMenu shadcn-vue, style Quasar.
// Fournit le contexte (item ouvert, enregistrement des triggers) via provide/inject.
import type { InjectionKey, Ref } from "vue"

export interface NavMenuContext {
  openName: Readonly<Ref<string | null>>
  setOpen: (name: string | null) => void
  registerTrigger: (name: string, el: Ref<HTMLElement | null>) => void
}

export const qNavMenuKey: InjectionKey<NavMenuContext> = Symbol("q-nav-menu")
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, shallowRef } from "vue"

const openName = ref<string | null>(null)
const triggers = shallowRef<{ name: string; el: Ref<HTMLElement | null> }[]>([])
const rootEl = ref<HTMLElement | null>(null)

const context: NavMenuContext = {
  openName,
  setOpen: (name) => {
    openName.value = name
  },
  registerTrigger: (name, el) => {
    triggers.value = [...triggers.value, { name, el }]
  },
}
provide(qNavMenuKey, context)

// Fermeture au clic extérieur
const onDocMousedown = (e: MouseEvent) => {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) openName.value = null
}

// Clavier : flèches/Home/End déplacent le focus, Échap ferme
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    openName.value = null
    return
  }
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return
  if (!rootEl.value) return
  const list = Array.from(
    rootEl.value.querySelectorAll(".q-nav-menu__trigger, .q-nav-menu__item"),
  ) as HTMLElement[]
  if (list.length === 0) return
  const active = document.activeElement as HTMLElement | null
  const index = active ? list.indexOf(active) : -1
  let target: HTMLElement | undefined
  if (e.key === "ArrowRight") target = list[(index + 1) % list.length]
  else if (e.key === "ArrowLeft") target = list[(index - 1 + list.length) % list.length]
  else if (e.key === "Home") target = list[0]
  else if (e.key === "End") target = list[list.length - 1]
  if (target) {
    e.preventDefault()
    target.focus()
  }
}

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("mousedown", onDocMousedown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("mousedown", onDocMousedown)
})
</script>

<template>
  <nav ref="rootEl" class="q-nav-menu" @keydown="onKeydown">
    <slot />
  </nav>
</template>
