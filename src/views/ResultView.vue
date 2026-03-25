<template>
  <div class="result-view">
    <AppHeader
      title="Ergebnis"
      :subtitle="store.taskData?.theme"
      :show-back="true"
      back-label="Generator"
      @back="router.push({ name: 'Generator' })"
    />

    <div class="view-content" v-if="store.taskData">

      <!-- Summary card -->
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-header-text">
            <p class="summary-label">Aufgabentitel</p>
            <h2 class="summary-title">{{ store.taskData.title }}</h2>
            <p class="summary-theme">{{ store.taskData.theme }}</p>
          </div>
          <div class="summary-badge">
            <span class="badge-num">{{ store.taskData.modules?.length ?? 0 }}</span>
            <span class="badge-label">Module</span>
          </div>
        </div>
        <div class="summary-stats">
          <div class="stat">
            <span class="stat-val">{{ store.totalPoints }}</span>
            <span class="stat-label">Punkte</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-val">{{ store.taskData.modules?.length ?? 0 }}</span>
            <span class="stat-label">Module</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-val">3.5h</span>
            <span class="stat-label">je Modul</span>
          </div>
        </div>
      </div>

      <!-- Export panel -->
      <div class="export-panel-wrap">
        <ExportPanel
          :word-loading="wordLoading"
          :scoring-loading="store.scoringLoading"
          :has-scoring-cache="store.hasMarkingScheme"
          @export-word="handleWordExport"
          @export-json="handleJsonExport"
          @export-scoring="handleScoringExport"
        />
      </div>

      <!-- Modules Overview table -->
      <div class="section">
        <p class="section-label">Modulübersicht</p>
        <div class="overview-table">
          <div class="table-header">
            <span>Modul</span>
            <span>Punkte</span>
            <span class="col-wide">Schwerpunkt</span>
          </div>
          <div
            v-for="m in store.taskData.modulesOverview"
            :key="m.module"
            class="table-row"
          >
            <div class="row-module">
              <span class="mod-pill">{{ m.module }}</span>
              <span class="row-duration">{{ m.duration }}</span>
            </div>
            <span class="row-pts">{{ m.points }}</span>
            <span class="col-wide row-focus">{{ m.focus }}</span>
          </div>
          <div class="table-total">
            <span class="total-label">Gesamt</span>
            <span class="total-pts">{{ store.totalPoints }}</span>
            <span class="col-wide"></span>
          </div>
        </div>
      </div>

      <!-- Introduction -->
      <div class="section">
        <p class="section-label">Einführung</p>
        <div class="text-card">
          <p class="text-card-heading">Szenario</p>
          <p class="text-card-body">{{ store.taskData.introduction.overallScenario }}</p>
        </div>
        <div class="text-card" style="margin-top:8px">
          <p class="text-card-heading">Bewertung</p>
          <p class="text-card-body">{{ store.taskData.introduction.marking }}</p>
        </div>
      </div>

      <!-- Modules -->
      <div class="section">
        <p class="section-label">Module</p>
        <div class="modules-list">
          <ModuleCard
            v-for="mod in store.taskData.modules"
            :key="mod.module"
            :module="mod"
          />
        </div>
      </div>

      <!-- New task -->
      <div class="bottom-action">
        <BaseButton variant="ghost" size="md" :full="true" @click="newTask">
          Neue Aufgabe erstellen
        </BaseButton>
      </div>

    </div>

    <!-- Toast notification -->
    <Transition name="toast">
      <div class="toast" v-if="toastMsg" :class="toastType" role="alert">
        <svg v-if="toastType === 'error'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5V9M8 11V11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { exportToDocx, exportToJson } from '@/services/export'
import { exportToXlsx } from '@/services/exportXlsx'
import { generateMarkingScheme } from '@/services/scoring'
import AppHeader from '@/components/AppHeader.vue'
import ModuleCard from '@/components/ModuleCard.vue'
import ExportPanel from '@/components/ExportPanel.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const store  = useAppStore()

const wordLoading = ref(false)
const toastMsg    = ref('')
const toastType   = ref('error') // 'error' | 'success'

let toastTimer = null

function showToast(msg, type = 'error') {
  toastMsg.value  = msg
  toastType.value = type
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 3800)
}

// ── Word export ──────────────────────────────────────────────────────────
async function handleWordExport() {
  wordLoading.value = true
  try {
    await exportToDocx(store.taskData)
  } catch (err) {
    showToast('Word-Export fehlgeschlagen: ' + err.message)
  } finally {
    wordLoading.value = false
  }
}

// ── JSON export ──────────────────────────────────────────────────────────
function handleJsonExport() {
  try {
    exportToJson(store.taskData)
  } catch (err) {
    showToast('JSON-Export fehlgeschlagen: ' + err.message)
  }
}

// ── Auswertungsfile / Excel export ───────────────────────────────────────
async function handleScoringExport() {
  // If already cached, just download immediately
  if (store.hasMarkingScheme) {
    try {
      await exportToXlsx(store.markingSchemeData)
      showToast('Excel erfolgreich heruntergeladen.', 'success')
    } catch (err) {
      showToast('Excel-Export fehlgeschlagen: ' + err.message)
    }
    return
  }

  // Otherwise: generate via AI, then download
  store.scoringLoading = true
  store.clearError()

  try {
    const scheme = await generateMarkingScheme(store.apiKey, store.taskData)
    store.setMarkingScheme(scheme)
    await exportToXlsx(scheme)
    showToast('Bewertungsschema generiert und heruntergeladen.', 'success')
  } catch (err) {
    showToast('Fehler: ' + (err.message || 'Unbekannter Fehler'))
  } finally {
    store.scoringLoading = false
  }
}

// ── New task ─────────────────────────────────────────────────────────────
function newTask() {
  store.clearTask()
  router.push({ name: 'Generator' })
}
</script>

<style scoped>
.result-view {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--bg);
}

.view-content {
  flex: 1;
  padding: var(--space-md) var(--space-md) calc(var(--sab) + var(--space-2xl));
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* ── Summary Card ── */
.summary-card {
  background: var(--red);
  border-radius: var(--r-xl);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  box-shadow: 0 4px 20px rgba(192,59,59,0.22);
  overflow: hidden;
  position: relative;
}

.summary-card::before {
  content: '';
  position: absolute;
  right: -30px; top: -30px;
  width: 120px; height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
  pointer-events: none;
}

.summary-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
  position: relative;
}

.summary-label {
  font-size: 11px; font-weight: 600;
  letter-spacing: 1px; text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  margin-bottom: 6px;
}

.summary-title {
  font-size: 18px; font-weight: 700;
  color: white; line-height: 1.3;
  margin-bottom: 4px; letter-spacing: -0.2px;
}

.summary-theme { font-size: 13px; color: rgba(255,255,255,0.7); }

.summary-badge {
  background: rgba(255,255,255,0.15);
  border-radius: var(--r-md);
  padding: 10px 14px; text-align: center; flex-shrink: 0;
}

.badge-num { display: block; font-size: 22px; font-weight: 700; color: white; line-height: 1; }
.badge-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.8px; text-transform: uppercase; }

.summary-stats {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.12);
  border-radius: var(--r-md);
  padding: 12px var(--space-md);
  position: relative;
}

.stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-val { font-size: 18px; font-weight: 700; color: white; line-height: 1; }
.stat-label { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; }
.stat-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.18); flex-shrink: 0; }

/* ── Sections ── */
.section { display: flex; flex-direction: column; gap: 8px; }

.section-label {
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.6px; text-transform: uppercase;
  color: var(--text-4); padding-left: 2px;
}

.export-panel-wrap {
  position: sticky;
  top: calc(var(--sat) + 68px);
  z-index: 15;
}

/* ── Overview Table ── */
.overview-table {
  background: var(--surface);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-header {
  display: grid;
  grid-template-columns: 90px 64px 1fr;
  padding: 10px var(--space-md);
  background: var(--bg);
  border-bottom: 1px solid var(--divider);
}

.table-header span {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.8px; text-transform: uppercase;
  color: var(--text-4);
}

.table-row {
  display: grid;
  grid-template-columns: 90px 64px 1fr;
  align-items: center;
  padding: 13px var(--space-md);
  border-bottom: 1px solid var(--divider);
  transition: background 0.12s;
}

.table-row:last-of-type { border-bottom: none; }
.table-row:active { background: var(--bg); }

.row-module { display: flex; align-items: center; gap: 8px; }

.mod-pill {
  width: 28px; height: 28px;
  background: var(--red-soft); color: var(--red);
  border-radius: var(--r-sm);
  font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.row-duration { font-size: 12px; color: var(--text-4); }
.row-pts { font-size: 15px; font-weight: 700; color: var(--red); }
.row-focus { font-size: 13px; color: var(--text-2); line-height: 1.4; }

.table-total {
  display: grid;
  grid-template-columns: 90px 64px 1fr;
  padding: 11px var(--space-md);
  background: var(--bg);
  border-top: 1px solid var(--divider2);
}

.total-label { font-size: 13px; font-weight: 600; color: var(--text-2); }
.total-pts { font-size: 15px; font-weight: 700; color: var(--red); }

/* ── Text cards ── */
.text-card {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.text-card-heading {
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.6px; text-transform: uppercase;
  color: var(--text-4); margin-bottom: 8px;
}

.text-card-body { font-size: 14px; color: var(--text-2); line-height: 1.75; }

/* ── Modules list ── */
.modules-list { display: flex; flex-direction: column; gap: 8px; }

/* ── Bottom action ── */
.bottom-action { padding-top: var(--space-sm); }

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: calc(var(--sab) + 24px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px; font-weight: 500;
  padding: 12px 18px;
  border-radius: var(--r-xl);
  display: flex; align-items: center; gap: 8px;
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
  z-index: 300;
  max-width: calc(100vw - 32px);
  white-space: normal;
  text-align: center;
}

.toast.error {
  background: #1C1C1E;
  color: #ff6b6b;
}

.toast.success {
  background: #1C1C1E;
  color: #6BCB77;
}

.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

@media (min-width: 768px) {
  .view-content {
    width: min(100%, 1100px);
    margin: 0 auto;
    padding: 28px 28px calc(var(--sab) + 40px);
    gap: 20px;
  }

  .summary-card {
    padding: 28px;
  }

  .summary-title {
    font-size: 24px;
  }

  .summary-theme {
    font-size: 14px;
  }

  .summary-stats {
    max-width: 420px;
  }

  .text-card {
    padding: 20px;
  }

  .export-panel-wrap {
    top: calc(var(--sat) + 84px);
  }
}

@media (min-width: 1100px) {
  .result-view {
    min-height: 100%;
  }

  .view-content {
    width: min(100%, 1320px);
    display: grid;
    grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
    grid-template-areas:
      "summary summary"
      "exports overview"
      "exports intro"
      "exports modules"
      "action action";
    align-items: start;
    gap: 24px;
    padding: 40px;
  }

  .view-content > :nth-child(1) {
    grid-area: summary;
  }

  .view-content > :nth-child(2) {
    grid-area: exports;
  }

  .export-panel-wrap {
    grid-area: exports;
    align-self: start;
    top: calc(var(--sat) + 100px);
  }

  .view-content > :nth-child(3) {
    grid-area: overview;
  }

  .view-content > :nth-child(4) {
    grid-area: intro;
  }

  .view-content > :nth-child(5) {
    grid-area: modules;
  }

  .view-content > :nth-child(6) {
    grid-area: action;
  }

  .summary-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 24px;
    align-items: end;
  }

  .summary-stats {
    max-width: none;
  }

  .section {
    gap: 12px;
  }

  .bottom-action {
    display: flex;
    justify-content: flex-end;
  }

  .bottom-action :deep(.base-btn) {
    width: auto;
    min-width: 260px;
  }
}
</style>
