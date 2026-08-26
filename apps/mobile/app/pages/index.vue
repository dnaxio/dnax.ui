<template>
  <q-config-provider
    :theme="{
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        positive: '#22c55e',
        negative: '#ef4444',
        warning: '#f59e0b',
        info: '#06b6d4',
        dark: '#0f172a',
      },
      componentProps: {
        default: { radius },
      },
    }"
  >
    <q-app>
        <q-header style="background:white" fixed>
            <div>Neo Sana</div>
        </q-header>
      <q-page>

      <div class="stack row-rounded">
        <span class="rounded-label">Arrondi global (default) :</span>
        <q-btn
          v-for="r in ['none', 'xs', 'sm', 'md', 'lg']"
          :key="r"
          size="sm"
          :color="radius === r ? 'primary' : 'grey'"
          flat
          :label="r"
          @click="radius = r"
        />
      </div>

      <div class="stack row-rounded">
        <span class="rounded-label">Arrondi QBtn (prime sur default) :</span>
        <q-btn
          v-for="r in ['none', 'xs', 'sm', 'md', 'lg']"
          :key="r"
          size="sm"
          :color="btnRadius === r ? 'primary' : 'grey'"
          flat
          :label="r"
          @click="btnRadius = r"
        />
      </div>

    <div v-for="i of 3">
        <div class="stack">
          <q-btn color="primary" label="Ouvrir le dialogue (zoom)" @click="zoomOpen = true" />
          <q-btn color="secondary" label="Confirmer (slide-up)" @click="confirmOpen = true" />
          <q-btn color="accent" label="Plein écran (maximized)" @click="fullOpen = true" />
          <q-btn color="warning" label="Bottom sheet" @click="sheetOpen = true" />
        </div>

        <!-- Dialogue 1 : zoom -->
        <q-dialog v-model="zoomOpen" transition="zoom">
          <q-dialog-header title="Bienvenue" description="Ceci est un dialogue avec transition zoom." />
          <q-card-content>
            <p class="desc">
              Cliquez sur un bouton ci-dessous ou appuyez sur Échap pour fermer.
            </p>
          </q-card-content>
          <q-dialog-footer>
            <q-btn flat label="Annuler" @click="zoomOpen = false" />
            <q-btn color="primary" label="OK" @click="zoomOpen = false" />
          </q-dialog-footer>
        </q-dialog>

        <!-- Dialogue 2 : confirmation, slide-up -->
        <q-dialog v-model="confirmOpen" transition="slide-up" persistent>
          <q-dialog-header
            title="Êtes-vous sûr ?"
            description="Cette action ne peut pas être annulée."
          />
          <q-card-content>
            <p class="desc">Le contenu de cette page sera définitivement supprimé.</p>
          </q-card-content>
          <q-dialog-footer>
            <q-btn flat label="Annuler" @click="confirmOpen = false" />
            <q-btn color="negative" label="Supprimer" @click="confirmOpen = false" />
          </q-dialog-footer>
        </q-dialog>

        <!-- Dialogue 3 : plein écran (maximized) -->
        <q-dialog v-model="fullOpen" maximized transition="slide-up">
          <q-dialog-header title="Plein écran" description="Le dialogue occupe tout l'écran." />
          <q-card-content>
            <p class="desc">
              `maximized` → 100dvh, sans coins, safe-area gérées (encoche en haut,
              barre d'accueil en bas).
            </p>
          </q-card-content>
          <q-dialog-footer>
            <q-btn flat label="Fermer" @click="fullOpen = false" />
          </q-dialog-footer>
        </q-dialog>

        <!-- Dialogue 4 : bottom sheet natif (QBottomSheet) -->
        <q-bottom-sheet v-model="sheetOpen">
          <template #trigger>
            <q-btn color="warning" label="Bottom sheet" />
          </template>
          <q-dialog-header title="Choisir une action" description="Tirez le handle vers le bas pour fermer." />
          <q-card-content>
            <q-list separator>
              <q-item clickable @click="sheetOpen = false">
                <q-item-section>📷 Prendre une photo</q-item-section>
              </q-item>
              <q-item clickable @click="sheetOpen = false">
                <q-item-section>🖼️ Choisir dans la galerie</q-item-section>
              </q-item>
            </q-list>
          </q-card-content>
        </q-bottom-sheet>
    </div>

    <div class="stack">
      <q-image-picker
        v-model="images"
        multiple
        label="Photos"
        hint="Touchez + pour ajouter (max 5 Mo / fichier)"
        :max-file-size="5 * 1024 * 1024"
        :max-files="5"
      />

      <q-file-picker
        v-model="files"
        multiple
        label="Pièces jointes"
        hint="Tous types de fichiers, max 10 Mo / fichier"
        :max-file-size="10 * 1024 * 1024"
      />

      <q-input-password
        v-model="password"
        label="Mot de passe"
        outlined
        stack-label
        hint="Touchez l'œil pour afficher/masquer"
      />

      <q-select
        v-model="fruit"
        :options="fruits"
        label="Fruit"
        outlined
        stack-label
        hint="Hérite de default.radius"
      />

      <q-autocomplete
        v-model="color"
        :options="colors"
        label="Couleur"
        outlined
        stack-label
      />
    </div>
      </q-page>
      <q-footer fixed>


      </q-footer>
    </q-app>
  </q-config-provider>
</template>

<script setup>
import { ref } from "vue"

const zoomOpen = ref(false)
const confirmOpen = ref(false)
const fullOpen = ref(false)
const sheetOpen = ref(false)
const images = ref([])
const files = ref([])
const password = ref("")
const fruit = ref(null)
const color = ref(null)
const fruits = [
  { label: "Pomme", value: "pomme" },
  { label: "Poire", value: "poire" },
  { label: "Banane", value: "banane" },
]
const colors = [
  { label: "Rouge", value: "rouge" },
  { label: "Vert", value: "vert" },
  { label: "Bleu", value: "bleu" },
]
const radius = ref("md")
const btnRadius = ref("none")
</script>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.row-rounded {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.rounded-label {
  font-size: 13px;
  color: rgb(0 0 0 / 0.6);
}
</style>
