<script setup lang="ts">
// Date Picker — QDatePicker : sélecteur de date, API Quasar.
// Modes : inline (calendrier en place) | sheet (bottom sheet) | modal (centré) | dialog (plein écran).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const datePicker = useComponent(() => "QDatePicker")
const datePickerSource = componentSource("QDatePicker")
const tag = componentTag("QDatePicker")

// — Démos —
const dateInline = ref<Date | null>(null)
const dateSheet = ref<Date | null>(null)
const dateModal = ref<Date | null>(null)
const dateDialog = ref<Date | null>(null)
const dateRange = ref<Date | null>(null)
const dateFormat = ref<Date | null>(new Date(1990, 4, 12))

const fmt = (d: Date | null) => (d ? d.toLocaleDateString("en-GB") : "—")

const inlineCode = `<q-date-picker v-model="date" mode="inline" />`

const sheetCode = `<q-date-picker
  v-model="date"
  mode="sheet"
  label="Due date"
  placeholder="Pick a date"
  outlined
  clearable
/>`

const modalCode = `<q-date-picker
  v-model="date"
  mode="modal"
  label="Appointment"
  title="Select a date"
  outlined
/>`

const dialogCode = `<q-date-picker
  v-model="date"
  mode="dialog"
  label="Departure"
  title="When do you leave?"
  outlined
/>`

const rangeCode = `<q-date-picker
  v-model="date"
  mode="inline"
  :min-date="new Date(2026, 7, 1)"
  :max-date="new Date(2026, 7, 28)"
  :disabled-dates="(d) => d.getDay() === 0 || d.getDay() === 6"
/>
<!-- window limited to August 2026, weekends disabled -->`

const formatCode = `<q-date-picker
  v-model="date"
  mode="sheet"
  label="Birthday"
  :format="(d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })"
  outlined
/>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Date Picker</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A date selector with four display modes. <b>&lt;q-date-picker&gt;</b> binds a
      <code>Date</code> (or <code>null</code>) via <code>v-model</code> —
      <code>mode="inline"</code> renders the calendar in place, while
      <code>sheet</code> / <code>modal</code> / <code>dialog</code> show a field
      trigger that opens a panel.
    </p>

    <!-- ═══════ Inline ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Inline</h2>
      <p class="doc-note">
        The calendar is rendered directly in the page — no field, no overlay.
        Useful for filters, widgets and small forms.
      </p>

      <docs-demo :code="inlineCode" lang="html" filename="App.vue">
        <div class="demo-cal">
          <q-date-picker v-model="dateInline" mode="inline" />
          <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateInline) }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Sheet ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sheet</h2>
      <p class="doc-note">
        A field trigger (label, placeholder, clear button — same variants as
        <code>q-input</code>) opens a bottom sheet anchored to the bottom edge,
        with the safe-area handled.
      </p>

      <docs-demo :code="sheetCode" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-date-picker
            v-model="dateSheet"
            mode="sheet"
            label="Due date"
            placeholder="Pick a date"
            outlined
            clearable
          />
          <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateSheet) }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Modal ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Modal</h2>
      <p class="doc-note">
        A centered dialog panel with an optional <code>title</code> — the
        <code>width</code> prop controls the panel size.
      </p>

      <docs-demo :code="modalCode" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-date-picker
            v-model="dateModal"
            mode="modal"
            label="Appointment"
            title="Select a date"
            outlined
          />
          <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateModal) }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Dialog ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Dialog</h2>
      <p class="doc-note">
        A fullscreen panel — ideal for mobile-first flows where the calendar needs
        the whole screen (safe-area top &amp; bottom handled).
      </p>

      <docs-demo :code="dialogCode" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-date-picker
            v-model="dateDialog"
            mode="dialog"
            label="Departure"
            title="When do you leave?"
            outlined
          />
          <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateDialog) }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Restrictions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Restrictions</h2>
      <p class="doc-note">
        <code>min-date</code> / <code>max-date</code> bound the selectable window and
        <code>disabled-dates</code> disables arbitrary days (here: weekends).
      </p>

      <docs-demo :code="rangeCode" lang="html" filename="App.vue">
        <div class="demo-cal">
          <q-date-picker
            v-model="dateRange"
            mode="inline"
            :min-date="new Date(2026, 7, 1)"
            :max-date="new Date(2026, 7, 28)"
            :disabled-dates="(d) => d.getDay() === 0 || d.getDay() === 6"
          />
          <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateRange) }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Custom format ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom format</h2>
      <p class="doc-note">
        The <code>format</code> prop customizes how the selected date is displayed
        in the field (default: <code>dd MMM yyyy</code>).
      </p>

      <docs-demo :code="formatCode" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-date-picker
            v-model="dateFormat"
            mode="sheet"
            label="Birthday"
            :format="(d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })"
            outlined
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QDatePicker</h2>
      <docs-api :comp="datePicker" :source="datePickerSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.demo-cal {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}
.demo-field {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
.demo-p--value {
  margin: 14px 0 0;
  text-align: center;
}
</style>
