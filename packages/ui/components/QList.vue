<script setup lang="ts">
// QList — API Quasar : <q-list bordered dense separator dark padding>
interface Props {
  /** Bordure fine */
  bordered?: boolean
  /** Hauteur réduite des items */
  dense?: boolean
  /** Séparateurs entre items */
  separator?: boolean
  /** Thème sombre */
  dark?: boolean
  /** Padding plus important */
  padding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bordered: false,
  dense: false,
  separator: false,
  dark: false,
  padding: false,
})
</script>

<template>
  <div
    class="q-list"
    :class="{
      'q-list--bordered': props.bordered,
      'q-list--dense': props.dense,
      'q-list--separator': props.separator,
      'q-list--dark': props.dark,
      'q-list--padding': props.padding,
    }"
    role="list"
  >
    <slot />
  </div>
</template>
