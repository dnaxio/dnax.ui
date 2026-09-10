<script setup lang="ts">
// QBreadcrumbs — fil d'ariane : <q-breadcrumbs separator="›" gutter="12px" active-color="secondary" align="center" dense />
// Famille Quasar QBreadcrumbs + QBreadcrumbsEl, rendu façon shadcn-vue Breadcrumb
// (nav > ol > li, aria-current="page" sur la page courante).
//
// Le conteneur insère AUTOMATIQUEMENT un séparateur entre chaque miette du slot par
// défaut (en général des <q-breadcrumbs-el>) et marque la dernière miette comme la
// page courante (couleur active + graisse). Les vnodes bruts du slot sont réaffichés
// via le helper interne RenderNodes (intercaler les séparateurs = impossible en
// template pur).
import { Comment, Text, useSlots, type VNode } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"
import RenderNodes from "./internal/RenderNodes.vue"

/** "lucide:chevron-right", "mdi:chevron-right"… → séparateur rendu en icône Iconify */
const ICON_PREFIX_RE = /^[\w-]+:/
const isIconName = (name: string) => ICON_PREFIX_RE.test(name)

interface Props {
  /** Séparateur entre les miettes : texte ("/", "›", "·"…) ou icône Iconify ("lucide:chevron-right") */
  separator?: string
  /** Couleur du séparateur (token ou hex) */
  separatorColor?: string
  /** Couleur de la dernière miette — la page courante (token ou hex, défaut primary) */
  activeColor?: string
  /** Couleur des miettes non courantes (token ou hex — défaut : texte adouci) */
  color?: string
  /** Espace entre les éléments (valeur CSS, défaut "8px") */
  gutter?: string
  /** Alignement du fil d'ariane */
  align?: "left" | "center" | "right"
  /** Taille réduite */
  dense?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  separator: "/",
  activeColor: "primary",
  color: "",
  gutter: "8px",
  align: "left",
  dense: false,
})

const emit = defineEmits<{
  /**
   * Émis quand l'utilisateur clique une miette qui n'est pas la page courante
   * (la dernière) — payload : index de la miette + événement souris d'origine.
   */
  change: [index: number, event: MouseEvent]
}>()

const slots = useSlots()

interface CrumbRow {
  crumb: VNode
  isLast: boolean
}

/** Miettes du slot par défaut (commentaires et nœuds texte purs ignorés), avec le marqueur de dernière. */
const rows = (): CrumbRow[] => {
  const list = (slots.default?.() ?? []).filter((v) => {
    const t = v.type
    return t !== Comment && t !== Text
  })
  return list.map((crumb, i) => ({ crumb, isLast: i === list.length - 1 }))
}

const containerStyle = (): Record<string, string> => {
  const style: Record<string, string> = {}
  if (props.separatorColor) style["--q-breadcrumbs-sep-color"] = colorValue(props.separatorColor)
  if (props.activeColor) style["--q-breadcrumbs-active-color"] = colorValue(props.activeColor)
  if (props.color) style["--q-breadcrumbs-color"] = colorValue(props.color)
  if (props.gutter) style["--q-breadcrumbs-gutter"] = props.gutter
  return style
}

const navClasses = (): string =>
  cn(
    "q-breadcrumbs",
    props.align === "center" && "q-breadcrumbs--center",
    props.align === "right" && "q-breadcrumbs--right",
    props.dense && "q-breadcrumbs--dense",
  )

// Délégation de clic sur le <nav> : le clic DOM remonte jusqu'ici même pour les
// miettes-lien (l'émission Vue de QBreadcrumbsEl ne « bulle » pas). On ignore la
// page courante (dernière miette) et les séparateurs.
const onNavClick = (e: MouseEvent) => {
  const target = e.target
  if (!(target instanceof Element)) return
  const li = target.closest(".q-breadcrumbs__item")
  if (!li || li.classList.contains("q-breadcrumbs__item--last")) return
  const items = Array.from(li.parentElement?.children ?? []).filter((el) =>
    el.classList.contains("q-breadcrumbs__item"),
  )
  const index = items.indexOf(li)
  if (index >= 0) emit("change", index, e)
}
</script>

<template>
  <nav
    class="q-breadcrumbs"
    :class="navClasses()"
    :style="containerStyle()"
    aria-label="Breadcrumb"
    @click="onNavClick"
  >
    <ol class="q-breadcrumbs__list">
      <template v-for="(row, i) in rows()" :key="i">
        <li
          class="q-breadcrumbs__item"
          :class="{ 'q-breadcrumbs__item--last': row.isLast }"
          :aria-current="row.isLast ? 'page' : undefined"
        >
          <render-nodes :nodes="row.crumb" />
        </li>
        <li
          v-if="!row.isLast && separator !== ''"
          class="q-breadcrumbs__separator"
          aria-hidden="true"
        >
          <Icon v-if="isIconName(separator)" :icon="separator" />
          <template v-else>{{ separator }}</template>
        </li>
      </template>
    </ol>
  </nav>
</template>
