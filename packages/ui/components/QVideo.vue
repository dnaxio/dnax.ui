<script setup lang="ts">
// QVideo — lecteur vidéo basé sur le framework HTML de Video.js v10 (@videojs/html) :
// <q-video src="movie.mp4" poster="…" ratio="16/9" />
// Custom elements composables : <video-player> > <video-skin> > media element.
// Le média est choisi selon la source : <video> (mp4/webm/ogg), <youtube-video>
// (YouTube), <hlsjs-video> (.m3u8) — mux-video est aussi enregistré (prêt à l'emploi).
// Les modules sont chargés uniquement côté client (SSR safe — customElements).
// Events : @ready (media element), @play, @pause, @ended, @timeupdate, @loadedmetadata, @volumechange.
// Méthodes exposées : play / pause / togglePlay / seek / getCurrentTime / getDuration / setVolume / setMuted / isPlaying.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

interface Props {
  /** URL de la vidéo (mp4, webm, ogg, HLS .m3u8, YouTube…) */
  src?: string
  /** Image d'affiche avant lecture */
  poster?: string
  /** Affiche les contrôles (défaut true) */
  controls?: boolean
  /** Démarre la lecture automatiquement (souvent combiné avec muted) */
  autoplay?: boolean
  /** Boucle à la fin */
  loop?: boolean
  /** Muet */
  muted?: boolean
  /** Chargement : "auto" | "metadata" (défaut) | "none" */
  preload?: string
  /** Ratio d'affichage : "16/9" (défaut), "4/3", "1/1", "none" (hauteur auto) */
  ratio?: string
  /** Largeur max du lecteur (défaut 100%) */
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
  poster: "",
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
  preload: "metadata",
  ratio: "16/9",
  width: "",
})

const emit = defineEmits<{
  ready: [media: any]
  play: []
  pause: []
  ended: []
  timeupdate: [payload: { currentTime: number; duration: number }]
  loadedmetadata: [payload: { duration: number }]
  volumechange: [payload: { muted: boolean; volume: number }]
}>()

/** URL YouTube (watch, shorts, embed, youtu.be) */
const isYoutube = computed(() =>
  /(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)/.test(props.src),
)
/** Flux HLS (.m3u8) → media element hlsjs-video */
const isHls = computed(() => /\.m3u8(\?|$)/.test(props.src))

const mediaEl = ref<HTMLElement | null>(null)
const playing = ref(false)

const media = (): any => mediaEl.value

const onPlay = () => {
  playing.value = true
  emit("play")
}
const onPause = () => {
  playing.value = false
  emit("pause")
}
const onEnded = () => emit("ended")
const onTimeupdate = () =>
  emit("timeupdate", { currentTime: media()?.currentTime ?? 0, duration: media()?.duration ?? 0 })
const onLoadedmetadata = () => emit("loadedmetadata", { duration: media()?.duration ?? 0 })
const onVolumechange = () =>
  emit("volumechange", { muted: media()?.muted ?? false, volume: media()?.volume ?? 1 })

const listeners: Array<[string, EventListener]> = [
  ["play", onPlay],
  ["pause", onPause],
  ["ended", onEnded],
  ["timeupdate", onTimeupdate],
  ["loadedmetadata", onLoadedmetadata],
  ["volumechange", onVolumechange],
]

const attachListeners = () => {
  const el = mediaEl.value
  if (!el) return
  for (const [type, fn] of listeners) el.addEventListener(type, fn)
  emit("ready", el)
}

const detachListeners = () => {
  const el = mediaEl.value
  if (!el) return
  for (const [type, fn] of listeners) el.removeEventListener(type, fn)
}

// Re-attache les listeners quand le media element change (changement de source/type)
watch(mediaEl, (el) => {
  detachListeners()
  if (el) attachListeners()
})

onMounted(async () => {
  // Charge le framework HTML (custom elements) — uniquement côté client
  await Promise.all([
    import("@videojs/html/video/player" as string),
    import("@videojs/html/video/skin" as string),
    import("@videojs/html/media/mux-video" as string),
    import("@videojs/html/media/youtube-video" as string),
    import("@videojs/html/media/hlsjs-video" as string),
  ])
  if (typeof customElements !== "undefined") {
    await customElements.whenDefined("video-player")
  }
  attachListeners()
})

onBeforeUnmount(detachListeners)

// — Méthodes exposées —
const play = () => media()?.play()
const pause = () => media()?.pause()
const togglePlay = () => {
  const el = media()
  if (!el) return
  if (el.paused) el.play()
  else el.pause()
}
const seek = (t: number) => {
  if (media()) media().currentTime = t
}
const getCurrentTime = () => media()?.currentTime ?? 0
const getDuration = () => media()?.duration ?? 0
const setVolume = (v: number) => {
  if (media()) media().volume = v
}
const setMuted = (m: boolean) => {
  if (media()) media().muted = m
}
const isPlaying = () => playing.value

defineExpose({
  play,
  pause,
  togglePlay,
  seek,
  getCurrentTime,
  getDuration,
  setVolume,
  setMuted,
  isPlaying,
})

const wrapperStyle = (): Record<string, string> => {
  const style: Record<string, string> = {}
  if (props.width) style.maxWidth = props.width
  if (props.ratio !== "none") style.aspectRatio = props.ratio.replace("/", " / ")
  else style.aspectRatio = "auto"
  return style
}
</script>

<template>
  <div class="q-video" :style="wrapperStyle()">
    <!-- Custom elements @videojs/html : player > skin > media -->
    <video-player class="q-video__player">
      <video-skin>
        <video
          v-if="!isYoutube && !isHls"
          ref="mediaEl"
          :src="src"
          :poster="poster"
          :autoplay="autoplay"
          :loop="loop"
          :muted="muted"
          :preload="preload"
          playsinline
        />
        <youtube-video
          v-else-if="isYoutube"
          ref="mediaEl"
          :src="src"
          :poster="poster"
          :autoplay="autoplay"
          :loop="loop"
          :muted="muted"
          playsinline
        />
        <hlsjs-video
          v-else
          ref="mediaEl"
          :src="src"
          :poster="poster"
          :autoplay="autoplay"
          :loop="loop"
          :muted="muted"
          playsinline
        />
      </video-skin>
    </video-player>
  </div>
</template>

<style scoped>
.q-video {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--q-radius, 12px);
  background: #000;
}
/* Avant l'upgrade des custom elements : display block + remplir le cadre */
.q-video video-player,
.q-video video-skin,
.q-video video,
.q-video youtube-video,
.q-video hlsjs-video {
  display: block;
}
.q-video video-player,
.q-video video-skin {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}
.q-video video,
.q-video youtube-video,
.q-video hlsjs-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
