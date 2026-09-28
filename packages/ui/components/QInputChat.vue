<script lang="ts">
// QInputChat — composer de chat : textarea multiligne auto-extensible, bouton d'envoi
// intégré, pastilles d'options activables (v-model:options), bouton « + » à menu
// (actions + pièce jointe) et fichiers joints (v-model:files).
//
// Les interfaces `ChatOption` / `ChatAction` vivent dans ce bloc `<script lang="ts">`
// « normal » (comme `QTimeline`) : elles sont exportées pour les démos / la doc.

/** Option activable d'un composer (pastille) — sélection pilotée par `v-model:options` */
export interface ChatOption {
  /** Libellé de la pastille */
  label: string
  /** Icône Iconify à gauche (ex. "lucide:globe") */
  icon?: string
  /** Valeur métier de l'option */
  value?: any
  /** Identifiant stable (recommandé) — sert à retrouver l'option au clic ; repli sur l'index */
  _id?: string
  /** Sélectionnée (mis à jour par le composant et renvoyé via `v-model:options`) */
  active?: boolean
  /** Désactivée */
  disable?: boolean
}

/**
 * Entrée du menu du bouton « + ». Les champs correspondent à ceux de `BtnAction`
 * de `QBtnActions` : l'objet peut être mappé directement.
 */
export interface ChatAction {
  /** Libellé de l'entrée de menu */
  label?: string
  /** Icône Iconify à gauche (ex. "lucide:paperclip") */
  icon?: string
  /** Icône Iconify à droite */
  iconRight?: string
  /** Valeur émise par `@action` ; à défaut, l'action elle-même est émise */
  value?: any
  /** Entrée désactivée */
  disable?: boolean
  /** Ligne de séparation affichée au-dessus de l'entrée */
  separator?: boolean
  /** Info-bulle */
  title?: string
  /** Rappel local au clic (en plus de l'événement `action`) */
  onClick?: (action: ChatAction) => void
}
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useSlots, watch } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"
import { icons } from "../lib/icons"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"
import QBtn from "./QBtn.vue"
import QBtnActions, { type BtnAction } from "./QBtnActions.vue"

/** Entrée de menu interne : la `BtnAction` porte une référence à son `ChatAction`. */
interface MenuEntry extends BtnAction {
  __chatAction?: ChatAction
}

/** Valeur sentinelle de l'entrée « joindre un fichier » du menu du « + ». */
const ATTACH_VALUE = "__dnax-input-chat-attach__"

interface Props {
  /** Texte saisi (v-model:message) */
  message?: string
  /** Texte d'invite affiché quand le champ est vide */
  placeholder?: string
  /** Label affiché au-dessus du champ */
  label?: string
  /** Aide affichée sous le champ */
  hint?: string
  /** État d'erreur */
  error?: boolean
  /** Message d'erreur (affiché quand error) */
  errorMessage?: string
  /** Affiche le compteur (nécessite maxlength) */
  counter?: boolean
  /** Longueur maximale du texte */
  maxlength?: number
  /** Hauteur minimale du textarea, en lignes */
  rows?: number
  /** Plafond d'auto-extension, en lignes (0 = pas de plafond) */
  maxRows?: number
  /** Le textarea grandit avec le contenu jusqu'à maxRows, puis défile */
  autogrow?: boolean
  /** Icône Iconify du bouton d'envoi */
  sendIcon?: string
  /** Libellé accessible (aria-label) du bouton d'envoi */
  sendLabel?: string
  /** Couleur du bouton d'envoi : token (primary, secondary…) ou hex */
  sendColor?: string
  /** Entrée envoie le message (Maj+Entrée insère un saut de ligne) */
  sendOnEnter?: boolean
  /** Vide le champ après l'envoi */
  clearOnSend?: boolean
  /** Désactive le bouton d'envoi quand le texte est vide */
  disableSendWhenEmpty?: boolean
  /** Affiche un spinner dans le bouton d'envoi et bloque l'envoi */
  loading?: boolean
  /** Pastilles activables (v-model:options) — la sélection est gérée par le composant */
  options?: ChatOption[]
  /** Entrées du menu du bouton « + » */
  actions?: ChatAction[]
  /** Icône Iconify du bouton « + » */
  actionsIcon?: string
  /** Libellé accessible (aria-label) du bouton « + » */
  actionsLabel?: string
  /** Fichiers joints (v-model:files) */
  files?: File[]
  /** Types de fichiers acceptés (attribut `accept` du sélecteur) */
  accept?: string
  /** Autorise plusieurs fichiers à la fois */
  multiple?: boolean
  /**
   * Entrée « joindre un fichier » dans le menu du « + » : `false` la masque, une chaîne
   * remplace son libellé. Défaut effectif : activée si `accept` est fourni, sinon masquée.
   */
  attach?: boolean | string
  /** Affiche les fichiers choisis en pastilles retirables au-dessus du textarea */
  showFiles?: boolean
  /** Padding du contrôle (valeur CSS) — pour l'aspect aéré des maquettes */
  padding?: string
  /** Padding horizontal (gauche/droite) de la barre d'options (valeur CSS) */
  paddingOptions?: string
  /** Bordure visible */
  outlined?: boolean
  /** Fond gris, soulignement */
  filled?: boolean
  /** Aucune bordure */
  borderless?: boolean
  /** Hauteur réduite */
  dense?: boolean
  /** Coins arrondis : true = pilule, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
  /** Force l'habillage sombre (sinon hérite de l'ancêtre .dark) */
  dark?: boolean
  /** Désactive le champ et le bouton d'envoi */
  disable?: boolean
  /** Champ en lecture seule (le bouton d'envoi est désactivé) */
  readonly?: boolean
  /** Applique la safe-area basse (composer plaqué au bas de l'écran) */
  safeArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  error: false,
  counter: false,
  rows: 1,
  maxRows: 6,
  autogrow: true,
  sendIcon: "lucide:send",
  sendLabel: "Send",
  sendColor: "primary",
  sendOnEnter: true,
  clearOnSend: true,
  disableSendWhenEmpty: true,
  loading: false,
  options: () => [],
  actions: () => [],
  actionsIcon: "lucide:plus",
  actionsLabel: "More actions",
  files: () => [],
  multiple: true,
  showFiles: true,
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  dark: false,
  disable: false,
  readonly: false,
  safeArea: true,
})

const emit = defineEmits<{
  "update:message": [value: string]
  /** Pastilles mises à jour — **nouveau tableau** (le composant bascule `active`) */
  "update:options": [options: ChatOption[]]
  /** Fichiers joints mis à jour — nouveau tableau */
  "update:files": [files: File[]]
  /** Option basculée (en plus de `update:options`) */
  option: [{ option: ChatOption; active: boolean }]
  send: [value: string]
  clear: []
  /** Entrée du menu du « + » choisie */
  action: [{ action: ChatAction; value: any }]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const slots = useSlots()

const nativeEl = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
// Composition IME en cours (clavier chinois/japonais…) : Entrée ne doit PAS envoyer
// tant que la composition n'est pas terminée.
const composing = ref(false)

const value = computed(() => props.message ?? "")

// — Sélection des options : état interne synchronisé sur la prop (`watch`) — le
//   composant fonctionne avec OU sans `v-model:options`.
const localOptions = ref<ChatOption[]>([...props.options])
watch(
  () => props.options,
  (next) => {
    localOptions.value = [...next]
  },
)

// — Fichiers joints : même principe (état interne synchronisé sur la prop).
const localFiles = ref<File[]>([...props.files])
watch(
  () => props.files,
  (next) => {
    localFiles.value = [...next]
  },
)

// radius : prop explicite > composantProps.QInputChat.radius ; échelle → --q-radius
const effectiveRadius = useRadius("QInputChat", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const fieldClasses = computed(() =>
  cn(
    "q-input-chat",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    effectiveRadius.value === true && "q-field--rounded",
    props.dense && "q-field--dense",
    props.error && "q-field--error",
    props.disable && "q-field--disabled",
    props.dark && "q-input-chat--dark",
    props.safeArea && "q-input-chat--safe-area",
    // `padding` fourni → la hauteur du champ est réglée par le contrôle (plein
    // composeur) : le textarea garde la hauteur de champ standard.
    props.padding && "q-input-chat--custom-padding",
  ),
)

// `padding` : valeur CSS posée en variable, lue par la règle du contrôle.
const controlStyle = computed<Record<string, string> | undefined>(() =>
  props.padding ? { "--q-input-chat-padding": props.padding } : undefined,
)

// `padding-options` : valeur CSS posée en variable, lue en padding horizontal de la barre.
const optionsStyle = computed<Record<string, string> | undefined>(() =>
  props.paddingOptions ? { "--q-input-chat-options-padding": props.paddingOptions } : undefined,
)

// — Pièce jointe : activée si `accept` fourni (ou `attach` explicite) —
const attachEnabled = computed(() =>
  props.attach === undefined ? !!props.accept : props.attach !== false,
)
const attachLabel = computed(() => (typeof props.attach === "string" ? props.attach : "Add file"))

// — Menu du « + » : entrée attach (si activée) + actions mappées en `BtnAction` —
const menuActions = computed<MenuEntry[]>(() => {
  const list: MenuEntry[] = []
  if (attachEnabled.value) {
    list.push({ label: attachLabel.value, icon: "lucide:paperclip", value: ATTACH_VALUE })
  }
  for (const action of props.actions) list.push({ ...action, __chatAction: action })
  return list
})

const showToolbar = computed(
  () =>
    localOptions.value.length > 0 ||
    !!slots.options ||
    props.actions.length > 0 ||
    !!slots.actions ||
    !!slots.tools ||
    attachEnabled.value,
)

// Séparateur « | » entre les pastilles d'options et le bouton « + » (rendu seulement
// quand les deux zones sont présentes, sinon la barre ne montrerait qu'un trait isolé).
const showOptionsSeparator = computed(
  () =>
    (localOptions.value.length > 0 || !!slots.options) &&
    (menuActions.value.length > 0 || !!slots.actions),
)

// — Sélection d'une option : bascule dans l'état interne, émet le NOUVEAU tableau —
const toggleOption = (option: ChatOption, index: number) => {
  if (option.disable) return
  const same = (o: ChatOption, i: number) =>
    option._id !== undefined ? o._id === option._id : i === index
  const next = localOptions.value.map((o, i) => (same(o, i) ? { ...o, active: !o.active } : o))
  localOptions.value = next
  const changed = next.find((o, i) => same(o, i))
  emit("update:options", next)
  if (changed) emit("option", { option: changed, active: !!changed.active })
}

// — Pièce jointe : sélecteur de fichiers —
const openFilePicker = () => fileInput.value?.click()

const fileKey = (f: File) => `${f.name}:${f.size}:${f.lastModified}`

const onFilesChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const picked = Array.from(input.files ?? [])
  // Remet à zéro pour pouvoir re-choisir le même fichier.
  input.value = ""
  if (!picked.length) return
  const seen = new Set(localFiles.value.map(fileKey))
  const next = [...localFiles.value]
  for (const f of picked) {
    const key = fileKey(f)
    if (seen.has(key)) continue
    seen.add(key)
    next.push(f)
  }
  localFiles.value = next
  emit("update:files", next)
}

const removeFile = (index: number) => {
  const next = localFiles.value.filter((_, i) => i !== index)
  localFiles.value = next
  emit("update:files", next)
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) {
    const ko = bytes / 1024
    return `${ko < 10 ? ko.toFixed(1) : Math.round(ko)} Ko`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

// — Entrée du menu du « + » choisie —
const onSelectAction = (value: unknown) => {
  if (value === ATTACH_VALUE) {
    openFilePicker()
    return
  }
  // QBtnActions renvoie `value` de l'entrée, sinon l'entrée elle-même (qui porte la ref).
  const entry: MenuEntry | undefined =
    value && typeof value === "object" && "__chatAction" in value
      ? (value as MenuEntry)
      : menuActions.value.find((e) => e.value !== undefined && e.value === value)
  const action = entry?.__chatAction
  if (!action) return
  action.onClick?.(action)
  emit("action", { action, value: action.value ?? action })
}

// — Auto-extension : mesure scrollHeight (hauteur remise à `auto` avant) plafonnée à
//   `maxRows` lignes (line-height réelle mesurée), puis overflow-y auto. Même mécanique
//   que `resizeTextarea` de QInput.vue.
const resizeTextarea = async () => {
  const el = nativeEl.value
  if (!el || !props.autogrow) return
  await nextTick()
  el.style.height = "auto"
  const cs = getComputedStyle(el)
  const fontSize = Number.parseFloat(cs.fontSize) || 14
  const lineHeight = Number.parseFloat(cs.lineHeight) || fontSize * 1.4
  const padding = (Number.parseFloat(cs.paddingTop) || 0) + (Number.parseFloat(cs.paddingBottom) || 0)
  const cap = props.maxRows > 0 ? lineHeight * props.maxRows + padding : Number.POSITIVE_INFINITY
  const full = el.scrollHeight
  el.style.height = `${Math.min(full, cap)}px`
  el.style.overflowY = full > cap ? "auto" : "hidden"
}

watch([value, () => props.autogrow, () => props.maxRows], resizeTextarea)
onMounted(resizeTextarea)

// — Envoi —
const canSend = computed(() => !props.disable && !props.readonly && !props.loading)
const sendDisabled = computed(
  () => !canSend.value || (props.disableSendWhenEmpty && value.value.trim() === ""),
)

const focus = () => nativeEl.value?.focus()
const blur = () => nativeEl.value?.blur()

const send = () => {
  if (!canSend.value) return
  // Valeur vide (après trim) : rien n'est émis. Le texte émis est **trimé**.
  const text = value.value.trim()
  if (!text) return
  emit("send", text)
  if (props.clearOnSend) {
    emit("update:message", "")
    emit("clear")
  }
  // Textarea remis à sa hauteur de base (contenu vidé) + focus rendu à la saisie.
  nextTick(() => {
    resizeTextarea()
    focus()
  })
}

const clear = () => {
  emit("update:message", "")
  emit("clear")
  nextTick(() => {
    resizeTextarea()
    focus()
  })
}

// — Saisie & clavier —
const onInput = (e: Event) => {
  emit("update:message", (e.target as HTMLTextAreaElement).value)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== "Enter" || !props.sendOnEnter) return
  // Maj/Alt/Ctrl/Meta + Entrée → comportement natif (saut de ligne).
  if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return
  // Jamais d'envoi pendant une composition IME (`isComposing` en complément du flag).
  if (e.isComposing || composing.value) return
  e.preventDefault()
  send()
}

const onCompositionStart = () => {
  composing.value = true
}

const onCompositionEnd = () => {
  composing.value = false
}

const onFocus = (e: FocusEvent) => emit("focus", e)

const onBlur = (e: FocusEvent) => {
  composing.value = false
  emit("blur", e)
}

const inputAttrs = computed(() => ({
  maxlength: props.maxlength,
  placeholder: props.placeholder,
  disabled: props.disable || undefined,
  readonly: props.readonly || undefined,
  "aria-label": props.label ?? props.placeholder,
}))

// Forme explicite `clé: valeur` : l'analyse statique des docs détecte les méthodes
// exposées en lisant les clés de `defineExpose` (cf. `scripts/component-parse.ts`).
defineExpose({ focus: focus, blur: blur, clear: clear, send: send })
</script>

<template>
  <div class="q-input-chat" :class="fieldClasses" :style="roundedStyle" v-bind="$attrs">
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>

    <!-- Fichiers joints : pastilles retirables au-dessus du textarea -->
    <div v-if="showFiles && localFiles.length" class="q-input-chat__files">
      <slot name="files" :files="localFiles" :remove="removeFile">
        <span v-for="(f, i) in localFiles" :key="`${f.name}-${i}`" class="q-input-chat__file">
          <Icon :icon="icons.file" class="q-input-chat__file-icon" aria-hidden="true" />
          <span class="q-input-chat__file-name">{{ f.name }}</span>
          <span class="q-input-chat__file-size">{{ formatSize(f.size) }}</span>
          <button
            type="button"
            class="q-input-chat__file-remove"
            :aria-label="`Remove ${f.name}`"
            @click="removeFile(i)"
          >
            <Icon :icon="icons.x" aria-hidden="true" />
          </button>
        </span>
      </slot>
    </div>

    <div class="q-field__control q-input-chat__control" :style="controlStyle">
      <slot name="prepend" />
      <div class="q-input-chat__textarea-wrap">
        <textarea
          ref="nativeEl"
          class="q-field__native q-input-chat__native"
          :value="value"
          :rows="rows"
          v-bind="inputAttrs"
          @input="onInput"
          @keydown="onKeydown"
          @compositionstart="onCompositionStart"
          @compositionend="onCompositionEnd"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
      <slot name="append" />
      <!-- Envoyer « inline » quand il n'y a pas de barre (une seule ligne) -->
      <slot v-if="!showToolbar" name="send" :send="send" :disabled="sendDisabled" :loading="loading">
        <q-btn
          class="q-input-chat__send"
          type="button"
          round
          :icon="sendIcon"
          :color="sendColor"
          :loading="loading"
          :disable="sendDisabled"
          :aria-label="sendLabel"
          @click="send"
        />
      </slot>
    </div>

    <div v-if="showToolbar" class="q-input-chat__toolbar" :style="optionsStyle">
      <div class="q-input-chat__options">
        <slot name="options" :options="localOptions" :toggle="toggleOption">
          <q-btn
            v-for="(o, i) in localOptions"
            :key="o._id ?? i"
            class="q-input-chat__option"
            :class="{ 'q-input-chat__option--active': o.active }"
            outline
            dense
            no-caps
            radius
            :icon="o.icon"
            :label="o.label"
            :disable="o.disable"
            @click="toggleOption(o, i)"
          />
        </slot>
      </div>

      <span v-if="showOptionsSeparator" class="q-input-chat__toolbar-separator" aria-hidden="true" />

      <div v-if="$slots.actions || menuActions.length" class="q-input-chat__actions">
        <slot name="actions">
          <q-btn-actions
            class="q-input-chat__add"
            flat
            dense
            round
            no-caps
            :icon="actionsIcon"
            :aria-label="actionsLabel"
            :actions="menuActions"
            dropdown-icon="lucide:chevron-down"
            @select-action="onSelectAction"
          />
        </slot>
      </div>

      <div class="q-input-chat__spacer" />
      <div class="q-input-chat__tools">
        <slot name="tools" />
        <slot name="send" :send="send" :disabled="sendDisabled" :loading="loading">
          <q-btn
            class="q-input-chat__send"
            type="button"
            round
            :icon="sendIcon"
            :color="sendColor"
            :loading="loading"
            :disable="sendDisabled"
            :aria-label="sendLabel"
            @click="send"
          />
        </slot>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      class="q-input-chat__file-input"
      :accept="accept"
      :multiple="multiple"
      hidden
      @change="onFilesChange"
    />

    <div class="q-field__bottom">
      <div v-if="error" class="q-field__error">
        <slot name="error">{{ errorMessage }}</slot>
      </div>
      <div v-else-if="hint || $slots.hint" class="q-field__hint">
        <slot name="hint">{{ hint }}</slot>
      </div>
      <div v-if="counter && maxlength" class="q-field__counter">
        {{ value.length }}/{{ maxlength }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Racine = colonne, comme `.q-input` (les règles globales de champ sont scopées à
   `.q-input`, jamais à cette racine). */
.q-input-chat {
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: 14px;

  /* Hauteur d'une ligne du textarea. Un composer de chat s'assied un peu plus haut
     qu'un champ simple (40px) ; surchargée par les modifiers ci-dessous. */
  --q-input-chat-field-height: 44px;
  --q-input-chat-field-padding: 12px;
}

/* `padding` custom (plein composeur) : le contrôle porte la hauteur, on rend au
   textarea la hauteur de champ standard pour ne pas décaler la maquette. */
.q-input-chat.q-input-chat--custom-padding {
  --q-input-chat-field-height: 38px;
  --q-input-chat-field-padding: 9px;
}

/* Variante dense : une ligne resserrée (accorde le contrôle à 32px). */
.q-input-chat.q-field--dense {
  --q-input-chat-field-height: 32px;
  --q-input-chat-field-padding: 6px;
}

/* Padding du contrôle : valeur par défaut, surchargée par la prop `padding`
   (`--q-input-chat-padding`). `align-items: center` centre `#prepend`/`#append` dans
   la ligne (le textarea la remplit, l'envoi inline s'ancre en haut via `align-self`).
   Spécificité montée (2 classes) pour battre `.q-field__control`. */
.q-field__control.q-input-chat__control {
  align-items: center;
  padding: var(--q-input-chat-padding, 0 12px);
}

/* Enveloppe du textarea : prend la largeur restante (prépare les piliers gauche/droite). */
.q-input-chat__textarea-wrap {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: flex-end;
}

/* Champ natif — recopie du nécessaire de `.q-input .q-field__native`. */
.q-input-chat__native {
  flex: 1;
  min-width: 0;
  height: auto;
  min-height: var(--q-input-chat-field-height);
  padding: var(--q-input-chat-field-padding) 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground);
  font: inherit;
  line-height: 20px;
  resize: none;
  overflow-y: auto;
}

.q-input-chat__native::placeholder {
  color: var(--muted-foreground);
}

/* Envoi : 30px dans les deux cas (même échelle que les pastilles d'options et les
   outils de la barre), sinon le `round` de 36px par défaut écrase la rangée. Sélecteurs
   à 2 classes pour battre `--q-btn-h: 36px` / `font-size: 14px` déclarés sur l'élément
   par `.q-btn` / `.q-btn--md`. */
.q-input-chat__control .q-input-chat__send,
.q-input-chat__tools .q-input-chat__send {
  flex: none;
  --q-btn-h: 30px;
  font-size: 12px;
}

/* Envoi « inline » (pas de barre) : ancré **en haut** — le `margin-top` vaut la
   demi-différence avec la ligne (hauteur de champ − bouton 30px − 2px de bordures),
   donc centré sur la première ligne et **en haut à droite** quand le textarea grandit
   (autogrow). Dans la barre, le bouton est centré par `.q-input-chat__tools`
   (`align-items: center`), sans marge. */
.q-input-chat__control .q-input-chat__send {
  align-self: flex-start;
  margin-top: calc((var(--q-input-chat-field-height) - 32px) / 2);
}

/* ===== Fichiers joints ===== */
.q-input-chat__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 12px 6px;
}

.q-input-chat__file {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 4px 6px 4px 8px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background-color: color-mix(in srgb, var(--foreground) 4%, transparent);
  font-size: 12px;
  color: var(--muted-foreground);
}

.q-input-chat__file-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.q-input-chat__file-name {
  max-width: 220px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--foreground);
}

.q-input-chat__file-size {
  flex-shrink: 0;
  opacity: 0.8;
}

.q-input-chat__file-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.q-input-chat__file-remove:hover {
  background-color: color-mix(in srgb, var(--foreground) 10%, transparent);
}

.q-input-chat__file-remove svg {
  width: 12px;
  height: 12px;
}

/* ===== Barre (options + « + » à gauche, outils + envoi à droite) ===== */
.q-input-chat__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
  padding-top: 6px;
  padding-bottom: 10px;
  /* Padding horizontal (gauche/droite) piloté par la prop `padding-options`. */
  padding-inline: var(--q-input-chat-options-padding, 0);
}

.q-input-chat__options,
.q-input-chat__actions,
.q-input-chat__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

/* Séparateur « | » entre les pastilles et le bouton « + ». */
.q-input-chat__toolbar-separator {
  align-self: center;
  width: 1px;
  height: 16px;
  margin: 0 8px;
  background-color: var(--border);
}

.q-input-chat__spacer {
  flex: 1 1 auto;
}

.q-input-chat__tools {
  margin-left: auto;
}

/* Pastille d'option : bordure 1px, rayon pilule, libellé ~13px. */
.q-input-chat__option {
  --q-btn-bg: var(--muted-foreground);
  --q-btn-h: 30px;
  padding: 0 10px;
  gap: 6px;
  border-color: var(--border);
  color: var(--muted-foreground);
  font-size: 13px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  box-shadow: none;
}

.q-input-chat__option:hover {
  border-color: var(--muted-foreground);
  background-color: color-mix(in srgb, var(--foreground) 6%, transparent);
}

/* Option active : bordure + texte primaires, léger fond primaire. */
.q-input-chat__option.q-input-chat__option--active {
  --q-btn-bg: var(--primary);
  border-color: var(--primary);
  color: var(--primary);
  background-color: color-mix(in srgb, var(--primary) 12%, transparent);
}

.q-input-chat__option.q-input-chat__option--active:hover {
  background-color: color-mix(in srgb, var(--primary) 18%, transparent);
}

/* Bouton « + » (trigger interne de QBtnActions) : icône grise, rond. */
.q-input-chat__add :deep(.q-btn-actions__trigger) {
  --q-btn-bg: var(--muted-foreground);
  --q-btn-h: 30px;
  color: var(--muted-foreground);
  box-shadow: none;
}

/* ===== Mode sombre ===== */
/* Champ : ancêtre `.dark` (héritage) ou prop `dark` (classe `--dark`). */
.dark .q-input-chat__native,
.q-input-chat--dark .q-input-chat__native {
  color: var(--foreground);
}

.dark .q-input-chat__native::placeholder,
.q-input-chat--dark .q-input-chat__native::placeholder {
  color: var(--muted-foreground);
}

.dark .q-input-chat__option:hover,
.q-input-chat--dark .q-input-chat__option:hover {
  background-color: rgb(255 255 255 / 0.06);
}

.dark .q-input-chat__add :deep(.q-btn-actions__trigger:hover),
.q-input-chat--dark .q-input-chat__add :deep(.q-btn-actions__trigger:hover) {
  background-color: rgb(255 255 255 / 0.08);
}

.dark .q-input-chat__file,
.q-input-chat--dark .q-input-chat__file {
  border-color: var(--border);
  background-color: rgb(255 255 255 / 0.04);
}

/* Safe-area basse (règle projet obligatoire) : un composer de chat est plaqué au bas
   de l'écran. Chaîne de fallback en 3 niveaux, dans cet ordre. */
.q-input-chat--safe-area {
  padding-bottom: 0; /* fallback vieux navigateurs */
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 – 11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
}
</style>
