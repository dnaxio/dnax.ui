<script setup lang="ts">
// QSidebarTrigger — bouton bascule du QSidebar (équivalent SidebarTrigger).
// À placer n'importe où dans le sous-arbre d'un QSidebar.
import { inject } from "vue"
import { Menu } from "@lucide/vue"
import { qSidebarKey } from "./QSidebar.vue"

interface Props {
  /** Libellé accessible */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "Ouvrir/fermer la barre latérale",
})

const sidebar = inject(qSidebarKey, null)
</script>

<template>
  <button
    type="button"
    class="q-sidebar__trigger"
    :aria-label="label"
    @click="sidebar?.toggle()"
  >
    <slot>
      <Menu aria-hidden="true" />
    </slot>
  </button>
</template>
