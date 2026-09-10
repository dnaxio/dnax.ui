<script setup lang="ts">
// Live demos for the Video page (page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "pexels" | "ratio" | "autoplay" | "youtube" | "hls" | "placeholder" | "events"
}>()

const MP4 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
const POSTER = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
const HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
const YT = "https://www.youtube.com/watch?v=oTxi562M-Bs&list=RDoTxi562M-Bs&start_radio=1"
const PEXELS = "https://www.pexels.com/download/video/28561463"
const PEXELS_BASIC = "https://www.pexels.com/download/video/7313654/"

// — Events demo —
const t = ref(0)
const d = ref(0)
const state = ref("idle")
</script>

<template>
  <q-video v-if="demo === 'basic'" :src="PEXELS_BASIC" />

  <q-video v-else-if="demo === 'pexels'" :src="PEXELS" />

  <q-video v-else-if="demo === 'ratio'" :src="MP4" :poster="POSTER" ratio="4/3" width="420px" />

  <q-video v-else-if="demo === 'autoplay'" :src="MP4" :poster="POSTER" autoplay muted loop />

  <q-video v-else-if="demo === 'youtube'" :src="YT" />

  <q-video v-else-if="demo === 'hls'" :src="HLS" :poster="POSTER" />

  <q-video v-else-if="demo === 'placeholder'" :src="MP4">
    <template #placeholder>
      <div class="demo-loading">
        <q-spinner size="28px" color="#fff" />
        <span>Loading video…</span>
      </div>
    </template>
  </q-video>

  <template v-else-if="demo === 'events'">
    <q-video
      :src="MP4"
      :poster="POSTER"
      @timeupdate="({ currentTime }) => (t = currentTime)"
      @loadedmetadata="({ duration }) => (d = duration)"
      @play="state = 'playing'"
      @pause="state = 'paused'"
    />
    <p class="demo-p demo-meta">
      t = {{ t.toFixed(1) }}s · duration = {{ d.toFixed(1) }}s · state = {{ state }}
    </p>
  </template>
</template>

<style scoped>
.demo-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.demo-meta {
  margin-top: 12px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
</style>
