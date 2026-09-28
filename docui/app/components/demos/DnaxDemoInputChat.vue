<script setup lang="ts">
// Démos live de la page Input Chat (état par page + styles de page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { computed, ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo:
    | "basic"
    | "variants"
    | "states"
    | "slots"
    | "autogrow"
    | "options"
    | "files"
    | "deepseek"
    | "vibe"
    | "tools"
    | "actions"
}>()

/** Forme locale d'une option (structurellement compatible `ChatOption`). */
interface DemoOption {
  _id?: string
  label: string
  icon?: string
  value?: any
  active?: boolean
  disable?: boolean
}

/** Forme locale d'une action de menu (structurellement compatible `ChatAction`). */
interface DemoAction {
  label?: string
  icon?: string
  iconRight?: string
  value?: any
  disable?: boolean
  separator?: boolean
  title?: string
}

// — basic : v-model + journal du dernier envoi —
const message = ref("")
const lastSent = ref("")

// — variants : outlined / filled / borderless / rounded —
const outlinedMsg = ref("")
const filledMsg = ref("")
const borderlessMsg = ref("")
const roundedMsg = ref("")

// — states —
const disabledMsg = ref("Disabled value")
const readonlyMsg = ref("Read-only value")
const loadingMsg = ref("Waiting for the server…")
const errorMsg = ref("")

// — slots : pièce jointe + bouton d'envoi par défaut, puis bouton personnalisé —
const attachMsg = ref("")
const customMsg = ref("")

// — autogrow : un texte long montre la croissance puis le défilement —
const longMsg = ref(
  "A composer grows with its content, up to max-rows lines, and then starts scrolling " +
    "instead of pushing the layout around. Keep typing to watch the box grow line by line " +
    "and settle on the cap — the send button stays pinned to the bottom edge.",
)

// — options : pastilles activables, `v-model:options` (le composant renvoie un nouveau tableau) —
const optionsMsg = ref("")
const chatOptions = ref<DemoOption[]>([
  { _id: "think", label: "DeepThink", icon: "lucide:brain", active: false },
  { _id: "search", label: "Search", icon: "lucide:globe", active: true },
  { _id: "code", label: "Code", icon: "lucide:code", active: false },
])
const optionLog = ref("")
const onOption = (payload: { option: DemoOption; active: boolean }) => {
  optionLog.value = `${payload.option.label} → ${payload.active ? "on" : "off"}`
}

// — files : pièce jointe via le menu du « + » (accept) + `v-model:files` —
const filesMsg = ref("")
const attachedFiles = ref<File[]>([])
const hiddenMsg = ref("")
const hiddenFiles = ref<File[]>([])
const labeledMsg = ref("")
const labeledFiles = ref<File[]>([])
const fileNames = (list: File[]) => (list.length ? list.map((f) => f.name).join(", ") : "—")

// — deepseek : maquette A (options + menu du « + » + envoi « ↑ ») —
const deepseekMsg = ref("")
const deepseekOptions = ref<DemoOption[]>([
  { _id: "think", label: "DeepThink", icon: "lucide:brain", active: false },
  { _id: "search", label: "Search", icon: "lucide:globe", active: true },
])
const deepseekFiles = ref<File[]>([])
const deepseekActions = ref<DemoAction[]>([{ label: "Web search", icon: "lucide:search" }])
const deepseekOptionLog = ref("")
const deepseekActionLog = ref("")
const onDeepseekOption = (payload: { option: DemoOption; active: boolean }) => {
  deepseekOptionLog.value = `${payload.option.label} → ${payload.active ? "on" : "off"}`
}
const onDeepseekAction = (payload: { action: DemoAction; value: unknown }) => {
  deepseekActionLog.value = payload.action.label ?? payload.action.icon ?? "action"
}

// — vibe : maquette B (le « + » vient du composant, `#append` = modèle + micro) —
const vibeMsg = ref("")
const vibeActions = ref<DemoAction[]>([{ label: "Web search", icon: "lucide:search" }])
const vibeFiles = ref<File[]>([])
const model = ref("fast")
const models = [
  { label: "Rapide", value: "fast" },
  { label: "Approfondi", value: "deep" },
]
const modelLabel = computed(() => models.find((m) => m.value === model.value)?.label ?? "Rapide")
const onModel = (value: string) => {
  model.value = value
}

// — tools : slot #tools (à droite de la barre, avant le bouton d'envoi) —
const toolsMsg = ref("")
const toolOptions = ref<DemoOption[]>([
  { _id: "search", label: "Search", icon: "lucide:globe", active: true },
])

// — actions : menu du « + » (actions + pièce jointe) sur un champ simple —
const actionsMsg = ref("")
const actionFiles = ref<File[]>([])
const actionsLog = ref("")
const chatActions = ref<DemoAction[]>([
  { label: "Web search", icon: "lucide:search" },
  { label: "New chat", icon: "lucide:message-circle" },
])
const onAction = (payload: { action: DemoAction; value: unknown }) => {
  actionsLog.value = payload.action.label ?? payload.action.icon ?? "action"
}
</script>

<template>
  <!-- 1. v-model + journal du dernier message envoyé -->
  <div v-if="demo === 'basic'" class="demo-field">
    <q-input-chat
      v-model:message="message"
      label="Message"
      placeholder="Type a message, then press Enter…"
      hint="Enter sends · Shift+Enter adds a new line"
      outlined
      @send="lastSent = $event"
    />
    <p class="demo-meta">
      Last sent: <code>{{ lastSent || "—" }}</code>
    </p>
  </div>

  <!-- 2. Variants du champ (famille input) -->
  <div v-else-if="demo === 'variants'" class="demo-col">
    <q-input-chat v-model:message="outlinedMsg" placeholder="Outlined" outlined />
    <q-input-chat v-model:message="filledMsg" placeholder="Filled" filled />
    <q-input-chat v-model:message="borderlessMsg" placeholder="Borderless" borderless />
    <q-input-chat v-model:message="roundedMsg" placeholder="Rounded (pill)" radius outlined />
  </div>

  <!-- 3. États : disable, readonly, loading, erreur + compteur -->
  <div v-else-if="demo === 'states'" class="demo-col">
    <q-input-chat v-model:message="disabledMsg" placeholder="Disabled" disable outlined />
    <q-input-chat v-model:message="readonlyMsg" placeholder="Read-only" readonly outlined />
    <q-input-chat v-model:message="loadingMsg" placeholder="Loading" loading outlined />
    <q-input-chat
      v-model:message="errorMsg"
      placeholder="Over the limit"
      :maxlength="40"
      counter
      error
      error-message="This message is too long."
      outlined
    />
  </div>

  <!-- 4. Slots : #prepend / #send personnalisé (options et fichiers ont leurs propres slots) -->
  <div v-else-if="demo === 'slots'" class="demo-col">
    <q-input-chat v-model:message="attachMsg" placeholder="Write a message…" outlined>
      <template #prepend>
        <q-btn flat round dense icon="lucide:paperclip" aria-label="Attach a file" />
      </template>
    </q-input-chat>

    <q-input-chat v-model:message="customMsg" placeholder="Custom send button…" outlined>
      <template #send="{ send, disabled }">
        <q-btn no-caps :disable="disabled" label="Send" icon-right="lucide:send" @click="send" />
      </template>
    </q-input-chat>
  </div>

  <!-- 5. Auto-extension : croissance jusqu'à max-rows, puis défilement -->
  <div v-else-if="demo === 'autogrow'" class="demo-field">
    <q-input-chat
      v-model:message="longMsg"
      label="Auto-grow (max 8 rows)"
      placeholder="Keep typing…"
      :rows="2"
      :max-rows="8"
      outlined
    />
  </div>

  <!-- 6. Options : pastilles activables gérées par le composant (v-model:options) -->
  <div v-else-if="demo === 'options'" class="demo-field">
    <q-input-chat
      v-model:message="optionsMsg"
      v-model:options="chatOptions"
      placeholder="Ask anything…"
      outlined
      @option="onOption"
    />
    <p class="demo-meta">
      v-model:options = <code>{{ chatOptions.map((o) => `${o.label}:${o.active}`).join(" · ") }}</code>
    </p>
    <p class="demo-meta">
      last option = <code>{{ optionLog || "—" }}</code>
    </p>
  </div>

  <!-- 7. Fichiers : menu du « + » (accept) + pastilles retirables (v-model:files) -->
  <div v-else-if="demo === 'files'" class="demo-col">
    <q-input-chat
      v-model:message="filesMsg"
      v-model:files="attachedFiles"
      accept="image/*,.pdf"
      placeholder="Attach a file with the + button…"
      outlined
    />
    <p class="demo-meta">
      v-model:files = <code>{{ attachedFiles.length }}</code> — <code>{{ fileNames(attachedFiles) }}</code>
    </p>

    <q-input-chat
      v-model:message="hiddenMsg"
      v-model:files="hiddenFiles"
      accept="image/*"
      :show-files="false"
      placeholder="show-files=false (chips hidden)"
      outlined
    />

    <q-input-chat
      v-model:message="labeledMsg"
      v-model:files="labeledFiles"
      accept="image/*"
      attach="Add a picture"
      placeholder="Custom attach label"
      outlined
    />
  </div>

  <!-- 8. Maquette A « DeepSeek » : options à gauche, menu du « + » + envoi « ↑ »
       Journal de la dernière option et de la dernière action de menu. -->
  <div v-else-if="demo === 'deepseek'" class="demo-field">
    <div class="composer-dark dark">
      <q-input-chat
        v-model:message="deepseekMsg"
        v-model:options="deepseekOptions"
        v-model:files="deepseekFiles"
        :actions="deepseekActions"
        accept="image/*,.pdf"
        placeholder="Send a message…"
        :padding="'16px 16px 6px'"
        padding-options="16px"
        send-icon="lucide:arrow-up"
        borderless
        @send="lastSent = $event"
        @option="onDeepseekOption"
        @action="onDeepseekAction"
      />
    </div>
    <p class="demo-meta">
      last sent = <code>{{ lastSent || "—" }}</code>
    </p>
    <p class="demo-meta">
      last option = <code>{{ deepseekOptionLog || "—" }}</code> · last action =
      <code>{{ deepseekActionLog || "—" }}</code>
    </p>
  </div>

  <!-- 9. Maquette B « Vibe » : le « + » est fourni par le composant (actions + attach),
       `#append` porte le menu « Rapide ⌄ » et le micro. -->
  <div v-else-if="demo === 'vibe'" class="demo-field">
    <div class="composer-dark composer-dark--compact dark">
      <q-input-chat
        v-model:message="vibeMsg"
        v-model:files="vibeFiles"
        :actions="vibeActions"
        accept="image/*"
        placeholder="Ask anything…"
        :padding="'8px 10px'"
        padding-options="10px"
        borderless
      >
        <template #append>
          <q-btn-actions
            class="vibe-btn vibe-model"
            flat
            dense
            no-caps
            :label="modelLabel"
            :actions="models"
            dropdown-icon="lucide:chevron-down"
            @select-action="onModel"
          />
          <q-btn class="vibe-btn" round flat dense icon="lucide:mic" aria-label="Voice input" />
        </template>
      </q-input-chat>
    </div>
    <p class="demo-meta">
      model = <code>{{ model }}</code> · files = <code>{{ vibeFiles.length }}</code>
    </p>
  </div>

  <!-- 10. Slot #tools : outils à droite de la barre, avant le bouton d'envoi -->
  <div v-else-if="demo === 'tools'" class="demo-field">
    <q-input-chat v-model:message="toolsMsg" v-model:options="toolOptions" placeholder="Message…" outlined>
      <template #tools>
        <q-btn round flat dense icon="lucide:mic" aria-label="Voice input" />
      </template>
    </q-input-chat>
    <p class="demo-meta">
      #tools sits in the right zone, next to the send button.
    </p>
  </div>

  <!-- 11. Actions : menu du « + » (actions + pièce jointe) ; le bouton d'envoi passe
       dans la barre. Champ simple, donc icône d'envoi par défaut (`lucide:send`). -->
  <div v-else-if="demo === 'actions'" class="demo-field">
    <q-input-chat
      v-model:message="actionsMsg"
      v-model:files="actionFiles"
      :actions="chatActions"
      accept="image/*,.pdf"
      placeholder="Ask a question, or pick an action from the + menu…"
      outlined
      @action="onAction"
    />
    <p class="demo-meta">
      last action = <code>{{ actionsLog || "—" }}</code> · files =
      <code>{{ actionFiles.length }}</code>
    </p>
  </div>
</template>

<style scoped>
.demo-field {
  width: 100%;
  max-width: 560px;
}

/* — Maquettes sur fond sombre : le conteneur arrondi vit dans la démo, le composer
   est en `borderless` (transparent) à l'intérieur. La classe `dark` bascule les tokens. — */
.composer-dark {
  width: 100%;
  padding: 4px;
  background: #1a1a1f;
  border-radius: 22px;
}
.composer-dark--compact {
  border-radius: 26px;
}

/* Pas d'anneau de focus rectangulaire à l'intérieur du conteneur de la maquette. */
.composer-dark :deep(.q-input-chat .q-field__control:focus-within) {
  border-color: transparent;
  box-shadow: none;
}

/* — Maquette B : boutons d'outils en gris clair — */
.vibe-btn {
  --q-btn-bg: var(--muted-foreground);
  color: var(--muted-foreground);
  font-size: 13px;
}
.vibe-model :deep(.q-btn-actions__trigger) {
  --q-btn-bg: var(--muted-foreground);
  color: var(--muted-foreground);
  font-size: 13px;
}
</style>
