<script setup lang="ts">
// QLoadingProvider — overlay de chargement plein écran ($q.loading).
// Intégré dans QConfigProvider (rendu automatiquement par le plus externe),
// utilisable aussi en autonome : <q-loading-provider>.
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { colorValue } from "../lib/colors"
import { loading } from "../lib/loading"

const visible = loading.isActive
const opts = loading._opts

const spinnerStyle = computed(() => ({
  width: `${opts.spinnerSize}px`,
  height: `${opts.spinnerSize}px`,
  borderWidth: `${Math.max(2, Math.round((opts.spinnerSize ?? 48) / 8))}px`,
  color: colorValue(opts.spinnerColor ?? "primary"),
}))

const iconStyle = computed(() => ({
  width: `${opts.spinnerSize}px`,
  height: `${opts.spinnerSize}px`,
  color: colorValue(opts.iconColor ?? opts.spinnerColor ?? "primary"),
}))

const messageStyle = computed(() => ({ color: colorValue(opts.messageColor ?? "#1d1d1d") }))
const overlayStyle = computed(() => ({ backgroundColor: opts.backgroundColor }))
</script>

<template>
  <slot />
  <div v-if="visible" class="q-loading" :style="overlayStyle" role="status" aria-live="polite">
    <div class="q-loading__box">
      <span v-if="!opts.icon" class="q-loading__spinner" :style="spinnerStyle" aria-hidden="true" />
      <Icon :icon="opts.icon" v-else class="q-loading__icon" :style="iconStyle" aria-hidden="true" />
      <div v-if="opts.message" class="q-loading__message" :style="messageStyle">
        {{ opts.message }}
      </div>
    </div>
  </div>
</template>
