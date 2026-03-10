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
            <span class="stat-val">{{ totalPoints }}</span>
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

      <!-- TODO: add export buttons in next version -->
      <div class="export-placeholder">
        <p>Export-Funktionen kommen bald…</p>
      </div>

      <!-- Modules overview table -->
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
            <span class="total-pts">{{ totalPoints }}</span>
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

      <div class="bottom-action">
        <BaseButton variant="ghost" size="md" :full="true" @click="newTask">
          Neue Aufgabe erstellen
        </BaseButton>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import AppHeader from '@/components/AppHeader.vue'
import ModuleCard from '@/components/ModuleCard.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const store  = useAppStore()

const totalPoints = computed(() => {
  if (!store.taskData) return 0
  return store.taskData.modulesOverview?.reduce((sum, m) => sum + m.points, 0) ?? 0
})

function newTask() {
  store.clearTask()
  router.push({ name: 'Generator' })
}
</script>

<style scoped>
.result-view { display: flex; flex-direction: column; min-height: 100dvh; background: var(--bg); }
.view-content { flex: 1; padding: var(--space-md) var(--space-md) calc(var(--sab) + var(--space-2xl)); display: flex; flex-direction: column; gap: var(--space-md); }

.summary-card { background: var(--red); border-radius: var(--r-xl); padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md); box-shadow: 0 4px 20px rgba(192,59,59,0.22); overflow: hidden; position: relative; }
.summary-card::before { content: ''; position: absolute; right: -30px; top: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.07); pointer-events: none; }
.summary-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-md); position: relative; }
.summary-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
.summary-title { font-size: 18px; font-weight: 700; color: white; line-height: 1.3; margin-bottom: 4px; }
.summary-theme { font-size: 13px; color: rgba(255,255,255,0.7); }
.summary-badge { background: rgba(255,255,255,0.15); border-radius: var(--r-md); padding: 10px 14px; text-align: center; flex-shrink: 0; }
.badge-num { display: block; font-size: 22px; font-weight: 700; color: white; line-height: 1; }
.badge-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.8px; text-transform: uppercase; }
.summary-stats { display: flex; align-items: center; background: rgba(255,255,255,0.12); border-radius: var(--r-md); padding: 12px var(--space-md); }
.stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-val { font-size: 18px; font-weight: 700; color: white; line-height: 1; }
.stat-label { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; }
.stat-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.18); flex-shrink: 0; }

.export-placeholder { background: var(--surface); border-radius: var(--r-lg); padding: var(--space-md); text-align: center; font-size: 13px; color: var(--text-4); border: 1.5px dashed var(--divider2); box-shadow: var(--shadow-sm); }

.section { display: flex; flex-direction: column; gap: 8px; }
.section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--text-4); padding-left: 2px; }

.overview-table { background: var(--surface); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-sm); }
.table-header { display: grid; grid-template-columns: 90px 64px 1fr; padding: 10px var(--space-md); background: var(--bg); border-bottom: 1px solid var(--divider); }
.table-header span { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-4); }
.table-row { display: grid; grid-template-columns: 90px 64px 1fr; align-items: center; padding: 13px var(--space-md); border-bottom: 1px solid var(--divider); }
.table-row:last-of-type { border-bottom: none; }
.row-module { display: flex; align-items: center; gap: 8px; }
.mod-pill { width: 28px; height: 28px; background: var(--red-soft); color: var(--red); border-radius: var(--r-sm); font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.row-duration { font-size: 12px; color: var(--text-4); }
.row-pts { font-size: 15px; font-weight: 700; color: var(--red); }
.col-wide { }
.row-focus { font-size: 13px; color: var(--text-2); line-height: 1.4; }
.table-total { display: grid; grid-template-columns: 90px 64px 1fr; padding: 11px var(--space-md); background: var(--bg); border-top: 1px solid var(--divider2); }
.total-label { font-size: 13px; font-weight: 600; color: var(--text-2); }
.total-pts { font-size: 15px; font-weight: 700; color: var(--red); }

.text-card { background: var(--surface); border-radius: var(--r-lg); padding: var(--space-md); box-shadow: var(--shadow-sm); }
.text-card-heading { font-size: 12px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--text-4); margin-bottom: 8px; }
.text-card-body { font-size: 14px; color: var(--text-2); line-height: 1.75; }

.modules-list { display: flex; flex-direction: column; gap: 8px; }
.bottom-action { padding-top: var(--space-sm); }
</style>
