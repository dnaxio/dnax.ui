<script setup lang="ts">
// Live demos for the Image page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "loading" | "placeholder" | "caption" | "error"
}>()

// Full-resolution photo and its low-res blur-up counterpart (w=40 & q=40).
const photo =
  "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const thumb =
  "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=40&w=40&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

// — loading —
const forcedLoading = ref(false)
const toggleLoading = () => {
  forcedLoading.value = true
  setTimeout(() => (forcedLoading.value = false), 2200)
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-img">
    <q-img :src="photo" ratio="16/9" />
  </div>

  <div v-else-if="demo === 'loading'" class="demo-img">
    <q-img
      :src="photo"
      ratio="16/9"
      :loading="forcedLoading"
      spinner-color="primary"
      spinner-size="42px"
    />
    <p class="demo-p demo-p--action">
      <q-btn size="sm" outline color="primary" no-caps :loading="forcedLoading" label="Simulate loading" @click="toggleLoading" />
    </p>
  </div>

  <div v-else-if="demo === 'placeholder'" class="demo-img">
    <q-img :src="photo" :placeholder-src="thumb" ratio="16/9" />
  </div>

  <div v-else-if="demo === 'caption'" class="demo-img">
    <q-img :src="photo" ratio="16/9" alt="Workspace">
      <q-text-caption
        position="bottom"
        absolute
        fit
        title="Morning workspace"
        subtitle="Unsplash · free to use"
      />
    </q-img>
  </div>

  <div v-else-if="demo === 'error'" class="demo-img">
    <q-img src="https://example.com/broken.jpg" ratio="16/9">
      <template #error>
        <div class="demo-img__error">
          <q-icon name="lucide:image-off" size="28px" />
          <span>Failed to load</span>
        </div>
      </template>
    </q-img>
  </div>
</template>

<style scoped>
.demo-img {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}
.demo-img :deep(.q-img) {
  border-radius: 12px;
  overflow: hidden;
}
.demo-p--action {
  margin: 14px 0 0;
  text-align: center;
}
.demo-img__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #8b93a1;
  font-size: 13px;
}
</style>
