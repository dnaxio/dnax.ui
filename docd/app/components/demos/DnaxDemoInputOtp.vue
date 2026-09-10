<script setup lang="ts">
// Live demos for the Input OTP page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "numeric" | "grouped" | "masked" | "states" | "complete"
}>()

const code = ref("")
const phone = ref("")
const grouped = ref("")
const secret = ref("")
const locked = ref("")
const lastComplete = ref("")
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-field">
    <q-input-otp v-model="code" :length="6" label="Verification code" />
    <p class="demo-p demo-value">Code: {{ code || "—" }}</p>
  </div>

  <div v-else-if="demo === 'numeric'" class="demo-field">
    <q-input-otp
      v-model="phone"
      :length="4"
      numeric
      autofocus
      label="Phone code"
      hint="Enter the 4-digit code sent by SMS"
    />
  </div>

  <div v-else-if="demo === 'grouped'" class="demo-field">
    <q-input-otp
      v-model="grouped"
      :length="6"
      :group-every="3"
      separator="-"
      label="Promo code"
    />
  </div>

  <div v-else-if="demo === 'masked'" class="demo-field">
    <q-input-otp v-model="secret" :length="6" password label="Masked code" />
  </div>

  <div v-else-if="demo === 'states'" class="demo-col">
    <q-input-otp v-model="code" :length="4" dense label="Dense" />
    <q-input-otp v-model="code" :length="4" filled label="Filled" />
    <q-input-otp v-model="code" :length="4" size="sm" label="Small" />
    <q-input-otp v-model="locked" :length="4" disable label="Disabled" />
    <q-input-otp v-model="code" :length="4" readonly label="Readonly" />
    <q-input-otp v-model="code" :length="4" error error-message="Wrong code" />
  </div>

  <div v-else-if="demo === 'complete'" class="demo-field">
    <q-input-otp
      v-model="code"
      :length="6"
      label="Complete to fire the event"
      @complete="lastComplete = $event"
    />
    <p class="demo-p demo-value">Last complete: {{ lastComplete || "—" }}</p>
  </div>
</template>

<style scoped>
.demo-field {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}
.demo-col {
  gap: 18px;
  max-width: 440px;
  margin: 0 auto;
}
.demo-value {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
</style>
