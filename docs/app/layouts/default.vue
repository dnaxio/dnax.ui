<script setup lang="ts">
// Default layout — app shell : header fixe + contenu (slot) + footer.
// Utilisé par la landing page (index). Les pages docs utilisent le layout "docs".
import ThemeToggle from "~/components/ThemeToggle.vue"

const scrollTo = (sel: string) => {
  const el = document.querySelector<HTMLElement>(sel)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" })
}
</script>

<template>
  <q-app>
    <q-header fixed translucent>
      <q-toolbar>
        <a href="/" class="logo-link" aria-label="Dnax UI — home">
          <q-icon name="lucide:box" color="primary" size="24px" />
          <span class="dnax-logo">Dnax<b>UI</b></span>
        </a>
        <q-space />
        <q-btn flat no-caps label="Components" href="/docs" />
        <q-btn flat no-caps label="Mockup" href="/mockup" />
        <q-btn flat no-caps label="Features" @click="scrollTo('#features')" />
        <q-btn color="primary" unelevated no-caps icon="lucide:rocket" label="Get started" href="/docs" />
        <theme-toggle />
      </q-toolbar>
    </q-header>

    <q-page>
      <slot />
    </q-page>

    <q-footer>
      <q-toolbar class="footer">
        <a href="/" class="logo-link" aria-label="Dnax UI — home">
          <q-icon name="lucide:box" color="primary" size="20px" />
          <span class="dnax-logo dnax-logo--sm">Dnax<b>UI</b></span>
        </a>
        <q-space />
        <span class="footer-note">Powered by dnax Inc</span>
      </q-toolbar>
    </q-footer>
  </q-app>
</template>

<style scoped>
.logo-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  border-radius: 8px;
  padding: 2px 4px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.logo-link:hover {
  opacity: 0.8;
}
.dnax-logo {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--foreground);
}
.dnax-logo b {
  color: var(--primary);
  font-weight: 700;
}
.dnax-logo--sm {
  font-size: 15px;
}

.footer {
  min-height: 56px;
  padding: 0 16px;
}
.footer-note {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}
</style>
