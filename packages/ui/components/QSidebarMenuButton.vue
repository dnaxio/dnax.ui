<script setup lang="ts">
// QSidebarMenuButton — bouton/lien de menu (équivalent SidebarMenuButton).
// Avec `to`, le bouton devient un lien routeur : navigation au clic + état actif
// automatique selon la route courante (pattern QRouteTab).
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"
import { useRoute, useRouter } from "vue-router"
import type { RouteLocationRaw } from "vue-router"

interface Props {
  label?: string
  /** Icône Iconify (ex. : "lucide:settings") */
  icon?: string
  /** Lien natif (<a href>) — sans routeur */
  href?: string
  /** Destination routeur : rend un lien et active le bouton selon la route courante */
  to?: RouteLocationRaw
  /** Match exact (path + hash) — sinon préfixe de segment de chemin */
  exact?: boolean
  /** router.replace au lieu de router.push */
  replace?: boolean
  /** État actif manuel (ignoré quand `to` est fourni — l'activation suit la route) */
  active?: boolean
  activeClass?: string
  disable?: boolean
  /** Badge affiché à droite */
  badge?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  exact: false,
  replace: false,
  activeClass: "",
  disable: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

// Routeur optionnel : sans router installé, `to` dégrade en simple bouton (@click)
let router: ReturnType<typeof useRouter> | undefined
let route: ReturnType<typeof useRoute> | undefined
try {
  router = useRouter()
  route = useRoute()
}
catch {
  router = undefined
  route = undefined
}

// La route courante matche-t-elle `to` ? (même logique que QRouteTab)
const matches = computed(() => {
  if (!router || !route || !props.to) return false
  const resolved = router.resolve(props.to)
  if (props.exact) {
    return resolved.path === route.path && resolved.hash === route.hash
  }
  const prefix = resolved.path.endsWith("/") ? resolved.path : resolved.path + "/"
  return route.path === resolved.path || route.path.startsWith(prefix)
})

const effectiveActive = computed(() => (props.to ? matches.value : props.active))

const resolvedHref = computed(() => {
  if (props.href) return props.href
  if (props.to && router) return router.resolve(props.to).href
  return undefined
})

const tag = computed(() => (resolvedHref.value ? "a" : "button"))

const buttonClasses = computed(() =>
  cn(
    "q-sidebar__menu-button",
    effectiveActive.value && "q-sidebar__menu-button--active",
    effectiveActive.value && props.activeClass,
    props.disable && "q-sidebar__menu-button--disabled",
  ),
)

const onClick = (e: MouseEvent) => {
  if (props.disable) return
  if (props.to && router && !e.defaultPrevented) {
    e.preventDefault()
    if (props.replace) router.replace(props.to)
    else router.push(props.to)
  }
  emit("click", e)
}
</script>

<template>
  <component
    :is="tag"
    :href="resolvedHref"
    :disabled="tag === 'button' ? disable : undefined"
    class="q-sidebar__menu-button"
    :class="buttonClasses"
    :aria-current="effectiveActive ? 'page' : undefined"
    @click="onClick"
  >
    <Icon :icon="icon" v-if="icon" class="q-sidebar__menu-button-icon" aria-hidden="true" />
    <span v-if="label" class="q-sidebar__menu-button-label">{{ label }}</span>
    <slot v-else />
    <span v-if="badge !== undefined" class="q-sidebar__menu-badge">{{ badge }}</span>
  </component>
</template>
