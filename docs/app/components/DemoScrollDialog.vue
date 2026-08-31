<script setup lang="ts">
// DemoScrollDialog — exemple $q.dialog.open() avec q-dialog-header + q-dialog-content
// (scrollable) + q-dialog-footer : le corps défile entre un header et un footer fixes.
import { useDialogPluginComponent } from "@dnax/ui/runtime"

const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const paragraphs = [
  "1. Acceptance of terms — by opening or using the service you agree to be bound by these terms, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.",
  "2. Use licence — permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only. This is the grant of a licence, not a transfer of title.",
  "3. Restrictions — you may not modify or copy the materials, use them for any commercial purpose, attempt to decompile or reverse engineer any software, remove copyright notices, or transfer the materials to another person.",
  "4. Accuracy of materials — the materials may contain technical, typographical or photographic errors. The service does not warrant that any of the materials are accurate, complete or current.",
  "5. Links — the service has not reviewed all the sites linked to it and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement.",
  "6. Modifications — the service may revise these terms at any time without notice. By using the service you agree to be bound by the then-current version of these terms.",
  "7. Governing law — these terms are governed by and construed in accordance with the laws of the jurisdiction in which the service operates, without regard to conflict-of-law provisions.",
  "8. Privacy — your data is processed according to the privacy policy. We only store what is strictly necessary to operate the service and never sell personal information.",
  "9. Limitation of liability — in no event shall the service be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials.",
  "10. Indemnification — you agree to indemnify and hold harmless the service providers from any claim or demand arising out of your use of the service or violation of these terms.",
  "11. Termination — we may terminate or suspend your access immediately, without prior notice or liability, for any reason, including breach of these terms.",
  "12. Contact — questions about these terms can be sent to legal@example.com. We usually answer within two business days.",
]
</script>

<template>
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header
      title="Terms of service"
      description="Scroll to read the full agreement"
    />
    <q-dialog-content scrollable>
      <div class="demo-scroll">
        <p v-for="(p, i) in paragraphs" :key="i" class="demo-scroll__p">{{ p }}</p>
      </div>
    </q-dialog-content>
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn unelevated no-caps color="primary" label="Accept" @click="onDialogOK" />
    </q-dialog-footer>
  </q-dialog>
</template>

<style scoped>
.demo-scroll {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.demo-scroll__p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
