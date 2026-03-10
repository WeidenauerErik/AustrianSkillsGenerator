<template>
  <div class="result-view">
    <header class="app-header">
      <div class="header-content">
        <button class="back-btn" @click="router.push({ name: 'Generator' })">
          ← Generator
        </button>
        <span class="header-title">Ergebnis</span>
        <div class="header-placeholder"></div>
      </div>
    </header>

    <div class="view-content" v-if="store.taskData">

      <!-- Basic summary -->
      <div class="summary-card">
        <h2 class="task-title">{{ store.taskData.title }}</h2>
        <p class="task-theme">{{ store.taskData.theme }}</p>
        <div class="stats-row">
          <span>{{ store.taskData.modules?.length }} Module</span>
          <span>·</span>
          <span>{{ totalPoints }} Punkte</span>
        </div>
      </div>

      <!-- Modules list - basic version -->
      <div class="section">
        <h3 class="section-title">Module</h3>
        <div
          v-for="mod in store.taskData.modules"
          :key="mod.module"
          class="module-item"
        >
          <div class="module-header">
            <span class="module-letter">{{ mod.module }}</span>
            <div>
              <p class="module-title">{{ mod.title }}</p>
              <p class="module-meta">{{ mod.timebox }} · {{ mod.points }} Punkte</p>
            </div>
          </div>
          <p class="module-overview">{{ mod.overview }}</p>

          <div class="user-stories">
            <p class="stories-label">User Stories</p>
            <ul>
              <li v-for="(story, i) in mod.userStories" :key="i">{{ story }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Raw JSON (debug) - TODO: remove later or make toggleable -->
      <details class="raw-section">
        <summary>Raw JSON anzeigen</summary>
        <pre>{{ JSON.stringify(store.taskData, null, 2) }}</pre>
      </details>

      <button class="btn-ghost" @click="newTask">Neue Aufgabe erstellen</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

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

.app-header {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  padding-top: var(--sat);
  border-bottom: 1px solid var(--divider);
  position: sticky; top: 0; z-index: 50;
}

.header-content { display: flex; align-items: center; justify-content: space-between; height: 52px; padding: 0 var(--space-md); }
.back-btn { background: none; border: none; cursor: pointer; color: var(--red); font-size: 15px; font-weight: 500; font-family: var(--font); }
.header-title { font-size: 16px; font-weight: 600; color: var(--text-1); }
.header-placeholder { min-width: 80px; }

.view-content { flex: 1; padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-md); }

.summary-card { background: var(--red); border-radius: var(--r-xl); padding: var(--space-lg); box-shadow: 0 4px 20px rgba(192,59,59,0.22); }
.task-title { font-size: 20px; font-weight: 700; color: white; margin-bottom: 4px; }
.task-theme { font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 12px; }
.stats-row { display: flex; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 500; }

.section { display: flex; flex-direction: column; gap: 8px; }
.section-title { font-size: 16px; font-weight: 700; color: var(--text-1); }

.module-item { background: var(--surface); border-radius: var(--r-lg); padding: var(--space-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 12px; }

.module-header { display: flex; align-items: flex-start; gap: 12px; }
.module-letter { width: 36px; height: 36px; background: var(--red-soft); color: var(--red); border-radius: var(--r-md); font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.module-title { font-size: 15px; font-weight: 600; color: var(--text-1); }
.module-meta { font-size: 12px; color: var(--text-4); margin-top: 2px; }
.module-overview { font-size: 14px; color: var(--text-2); line-height: 1.6; }

.user-stories { border-top: 1px solid var(--divider); padding-top: 10px; }
.stories-label { font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--text-4); margin-bottom: 8px; }
.user-stories ul { padding-left: 16px; display: flex; flex-direction: column; gap: 4px; }
.user-stories li { font-size: 13px; color: var(--text-2); line-height: 1.5; }

.raw-section { background: var(--surface); border-radius: var(--r-lg); padding: var(--space-md); }
.raw-section summary { font-size: 13px; color: var(--text-4); cursor: pointer; }
.raw-section pre { font-size: 11px; margin-top: 12px; overflow-x: auto; color: var(--text-2); line-height: 1.5; }

.btn-ghost { background: none; border: 1.5px solid var(--divider); color: var(--text-2); border-radius: var(--r-md); padding: 13px; font-size: 14px; font-weight: 500; font-family: var(--font); cursor: pointer; width: 100%; transition: background 0.15s; }
.btn-ghost:hover { background: var(--surface); }
</style>
