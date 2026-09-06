<script setup lang="ts">
// QRouteTab — QTab lié à la route (pattern Quasar QRouteTab) :
// <q-route-tab to="/docs/components/tabs" label="Tabs" exact />
// Le tab devient actif automatiquement quand la route courante matche `to`
// (le v-model du QTabs suit), et cliquer navigue vers la destination.
import { computed, inject, watch } from "vue"
import type { RouteLocationRaw } from "vue-router"
import { useRoute, useRouter } from "vue-router"
import QTab from "./QTab.vue"
import { qTabsKey } from "./QTabs.vue"

let seq = 0

interface Props {
  /** Destination de route (même API que RouterLink `to`) */
  to: RouteLocationRaw
  /** Match exact : path (et hash) identiques — sinon préfixe de chemin */
  exact?: boolean
  /** remplace l'entrée d'historique au clic (router.replace) */
  replace?: boolean
  // — API QTab (transmise) —
  name?: string | number
  icon?: string
  label?: string | number
  alert?: boolean | string
  alertIcon?: string
  count?: number
  countColor?: string
  countMax?: number
  noCaps?: boolean
  tabindex?: string | number
  disable?: boolean
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  exact: false,
  replace: false,
  alert: false,
  noCaps: false,
  disable: false,
  countMax: 99,
})

const tabs = inject(qTabsKey, null)

const resolvedName = props.name ?? `rt_${seq++}`

// Router optionnel : sans app router, QRouteTab se comporte comme un QTab
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

const matches = computed(() => {
  if (!router || !route || !props.to) return false
  const resolved = router.resolve(props.to)
  if (props.exact) {
    return resolved.path === route.path && resolved.hash === route.hash
  }
  // non-exact : la route courante commence par le path de `to` (préfixe de segment)
  const prefix = resolved.path.endsWith("/") ? resolved.path : resolved.path + "/"
  return route.path === resolved.path || route.path.startsWith(prefix)
})

// La route change → le tab qui matche devient actif (sync du v-model QTabs)
watch(
  () => route?.fullPath,
  () => {
    if (matches.value) tabs?.setActive(resolvedName)
  },
  { immediate: true },
)

const onClick = () => {
  if (props.disable || !router) return
  if (props.replace) router.replace(props.to)
  else router.push(props.to)
}
</script>

<template>
  <q-tab
    :name="resolvedName"
    :label="label"
    :icon="icon"
    :alert="alert"
    :alert-icon="alertIcon"
    :count="count"
    :count-color="countColor"
    :count-max="countMax"
    :no-caps="noCaps"
    :tabindex="tabindex"
    :disable="disable"
    :content-class="contentClass"
    @click="onClick"
  >
    <slot />
  </q-tab>
</template>
