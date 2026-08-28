<script setup lang="ts">
// Docs — Plugins API : $q.dialog / $q.bottomSheet / $q.notify / $q.loading.
definePageMeta({ layout: "docs" })

const setupCode = `import { useQ } from "@dnax/ui"

const $q = useQ()

// Ou, à l'ancienne : app.use(QPlugin) → this.$q partout
import { QPlugin } from "@dnax/ui"`

const dialogCode = `const $q = useQ()

$q.dialog({
  component: ConfirmDialog, // SFC importé ou nom de composant global
  componentProps: { title: "Supprimer ?", message: "Cette action est irréversible." },
  persistent: true,
})
  .onOK(() => console.log("confirmé"))
  .onCancel(() => console.log("annulé"))`

const bottomSheetCode = `const $q = useQ()

$q.bottomSheet({
  component: ShareSheet,
  componentProps: { file },
  title: "Partager",
  rounded: true,
})
  .onOK((data) => console.log("choix :", data))`

const notifyCode = `const $q = useQ()

$q.notify({
  type: "positive", // positive | negative | warning | info
  message: "Saved successfully",
  caption: "All changes are up to date",
  position: "top",
  timeout: 2500,
})

// Avec une action
$q.notify({
  message: "New version available",
  actions: [{ label: "Update", handler: () => update() }],
})`

const loadingCode = `const $q = useQ()

$q.loading.show({
  message: "Uploading…",
  spinnerColor: "primary",
})
// … puis
$q.loading.hide()`

const providersCode = `<q-config-provider>
  <!-- rend automatiquement QDialogProvider, QNotifyProvider,
       QLoadingProvider et QBottomSheetProvider -->
  <NuxtPage />
</q-config-provider>`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Plugins API</h1>
    <p class="guide__lead">
      Accès programmatique aux composants via le singleton <code>$q</code> :
      dialog, bottom sheet, notify et loading — sans balise dans le template.
    </p>

    <section class="guide__section">
      <h2 class="guide__h2" id="setup">Setup</h2>
      <p class="guide__note">
        Récupérez <code>$q</code> avec le composable <code>useQ()</code>, ou installez
        le plugin <code>QPlugin</code> pour un accès global <code>this.$q</code>.
      </p>
      <q-syntax :code="setupCode" lang="ts" filename="app.vue" copy />
      <p class="guide__note">
        Les providers (<code>QDialogProvider</code>, <code>QNotifyProvider</code>,
        <code>QLoadingProvider</code>, <code>QBottomSheetProvider</code>) sont rendus
        automatiquement par le <code>&lt;q-config-provider&gt;</code> le plus externe :
      </p>
      <q-syntax :code="providersCode" lang="html" filename="app.vue" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2" id="dialog">Dialog</h2>
      <p class="guide__note">
        Ouvre un dialogue <em>par composant</em> : passez une SFC (ou un nom de
        composant global) dans <code>component</code>. Retourne un contrôleur
        chaînable <code>onOK / onCancel / onDismiss</code>.
      </p>
      <q-syntax :code="dialogCode" lang="ts" filename="confirm.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2" id="bottom-sheet">Bottom Sheet</h2>
      <p class="guide__note">
        Panneau bas ancré au bord inférieur (safe-area intégrée) — même principe
        que <code>$q.dialog</code>, avec options de panneau (largeur, arrondi, drag).
      </p>
      <q-syntax :code="bottomSheetCode" lang="ts" filename="share.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2" id="notify">Notify</h2>
      <p class="guide__note">
        Notification toast (vue-sonner) avec type de couleur, position et actions.
      </p>
      <q-syntax :code="notifyCode" lang="ts" filename="notify.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2" id="loading">Loading</h2>
      <p class="guide__note">
        Overlay plein écran compté : <code>show()</code> / <code>hide()</code>.
      </p>
      <q-syntax :code="loadingCode" lang="ts" filename="upload.ts" copy />
    </section>
  </div>
</template>

<style scoped>
.guide {
  max-width: 760px;
}
.guide__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.guide__lead {
  margin: 12px 0 0;
  font-size: 15.5px;
  line-height: 1.65;
  color: #5b6472;
}
.guide__section {
  margin-top: 32px;
}
.guide__h2 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}
.guide__note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.guide__note code,
.guide__lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
