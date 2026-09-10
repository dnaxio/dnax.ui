<script setup lang="ts">
// QBreadcrumbsEl — une miette du fil d'ariane : <q-breadcrumbs-el label="Home" icon="lucide:home" to="/" />
// Rendu comme lien routeur (<a>, prop `to`/`href`) ou simple texte (<span>) sinon —
// la dernière miette du <q-breadcrumbs> parent est la page courante (couleur active
// + aria-current gérés par le conteneur).
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"
import { useRouter } from "vue-router"
import type { RouteLocationRaw } from "vue-router"

interface Props {
  /** Texte de la miette (sinon contenu du slot) */
  label?: string | number
  /** Icône Iconify affichée à gauche (ex. : "lucide:home") */
  icon?: string
  /** Destination routeur : rend un lien <a> qui navigue au clic (router.push/replace) */
  to?: RouteLocationRaw
  /** router.replace au lieu de router.push */
  replace?: boolean
  /** Lien natif (<a href>) — sans routeur */
  href?: string
  /** Cible du lien natif (ex. "_blank") */
  target?: string
  /** Désactive la miette (clics ignorés) */
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  replace: false,
  disable: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

// Routeur optionnel : sans router installé, `to` dégrade en simple <span> (l'API
// `href` reste disponible pour les liens natifs).
let router: ReturnType<typeof useRouter> | undefined
try {
  router = useRouter()
}
catch {
  router = undefined
}

const resolvedHref = computed(() => {
  if (props.href) return props.href
  if (props.to && router) return router.resolve(props.to).href
  return undefined
})

const tag = computed(() => (resolvedHref.value ? "a" : "span"))

const elClasses = computed(() =>
  cn("q-breadcrumbs__el", props.disable && "q-breadcrumbs__el--disabled"),
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
    :href="resolvedHref || undefined"
    :target="tag === 'a' ? target || undefined : undefined"
    :rel="tag === 'a' && target === '_blank' ? 'noopener' : undefined"
    :tabindex="disable && tag === 'a' ? -1 : undefined"
    :aria-disabled="disable || undefined"
    :class="elClasses"
    @click="onClick"
  >
    <Icon v-if="icon" :icon="icon" class="q-breadcrumbs__el-icon" aria-hidden="true" />
    <span v-if="label !== undefined" class="q-breadcrumbs__el-label">{{ label }}</span>
    <slot v-else />
  </component>
</template>
