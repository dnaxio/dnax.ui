<script setup lang="ts">
import { useThemeMode } from "~/composables/useThemeMode"

const { mode } = useThemeMode()
</script>

<template>
  <q-config-provider :theme="{
    mode, componentProps: {
    default: {
      radius:'sm'
    }
  }}">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </q-config-provider>
</template>
