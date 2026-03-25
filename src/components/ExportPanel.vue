<template>
  <div class="export-panel">
    <p class="panel-label">Export</p>
    <div class="export-list">

      <!-- Word Export -->
      <button class="export-row" @click="$emit('exportWord')" :disabled="wordLoading">
        <div class="export-icon icon-word">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="3" fill="#C03B3B"/>
            <path d="M4 5H14M4 9H14M4 13H10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="export-text">
          <span class="export-title">Word-Dokument</span>
          <span class="export-sub">Vollständige Aufgabe als .docx</span>
        </div>
        <span v-if="wordLoading" class="row-spinner" aria-hidden="true"></span>
        <svg v-else class="export-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 8H12M12 8L9 5M12 8L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="row-divider"></div>

      <!-- JSON Export -->
      <button class="export-row" @click="$emit('exportJson')">
        <div class="export-icon icon-json">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="3" fill="#636366"/>
            <path d="M5 6C4 6 3.5 6.5 3.5 7V8C3.5 8.5 3 9 3 9C3 9 3.5 9.5 3.5 10V11C3.5 11.5 4 12 5 12" stroke="white" stroke-width="1.3" stroke-linecap="round"/>
            <path d="M13 6C14 6 14.5 6.5 14.5 7V8C14.5 8.5 15 9 15 9C15 9 14.5 9.5 14.5 10V11C14.5 11.5 14 12 13 12" stroke="white" stroke-width="1.3" stroke-linecap="round"/>
            <circle cx="9" cy="9" r="1" fill="white"/>
            <circle cx="6.5" cy="9" r="1" fill="white"/>
            <circle cx="11.5" cy="9" r="1" fill="white"/>
          </svg>
        </div>
        <div class="export-text">
          <span class="export-title">JSON-Datei</span>
          <span class="export-sub">Rohdaten als .json</span>
        </div>
        <svg class="export-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 8H12M12 8L9 5M12 8L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="row-divider"></div>

      <!-- Auswertungsfile Generator -->
      <button
        class="export-row scoring-row"
        :class="{ 'has-cache': hasScoringCache }"
        @click="$emit('exportScoring')"
        :disabled="scoringLoading"
      >
        <div class="export-icon icon-scoring">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="3" fill="#34A853"/>
            <path d="M4 13L7 10L10 12L14 7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 6H10M4 9H7" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="export-text">
          <span class="export-title">Auswertungsfile-Generator</span>
          <span class="export-sub" v-if="scoringLoading">KI generiert Bewertungsschema…</span>
          <span class="export-sub" v-else-if="hasScoringCache">Bewertungsschema als CIS .xlsx</span>
          <span class="export-sub" v-else>Bewertungsschema via KI generieren + .xlsx</span>
        </div>
        <span v-if="scoringLoading" class="row-spinner scoring-spinner" aria-hidden="true"></span>
        <template v-else>
          <span v-if="hasScoringCache" class="badge-cached">Bereit</span>
          <svg v-else class="export-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8H12M12 8L9 5M12 8L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
      </button>

    </div>

    <!-- Scoring info note -->
    <p class="scoring-note" v-if="!hasScoringCache && !scoringLoading">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;margin-top:1px">
        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/>
        <path d="M6 5V8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="6" cy="4" r="0.6" fill="currentColor"/>
      </svg>
      Beim ersten Klick wird ein Bewertungsschema via KI generiert und direkt als Excel heruntergeladen.
    </p>
  </div>
</template>

<script setup>
defineProps({
  wordLoading:    { type: Boolean, default: false },
  scoringLoading: { type: Boolean, default: false },
  hasScoringCache:{ type: Boolean, default: false }
})

defineEmits(['exportWord', 'exportJson', 'exportScoring'])
</script>

<style scoped>
.export-panel { display: flex; flex-direction: column; gap: 8px; }

.panel-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--text-4);
  padding-left: 2px;
}

.export-list {
  background: var(--surface);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.export-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px var(--space-md);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font);
  text-align: left;
  transition: background 0.12s;
}

.export-row:active:not(:disabled) { background: var(--bg); }
.export-row:disabled { cursor: default; opacity: 0.6; }

/* Scoring row gets a subtle highlight */
.scoring-row { background: rgba(52,168,83,0.03); }
.scoring-row:active:not(:disabled) { background: rgba(52,168,83,0.08); }

.export-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.export-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.export-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-1);
  line-height: 1.2;
}

.export-sub {
  font-size: 12px;
  color: var(--text-4);
}

.export-arrow { color: var(--text-4); flex-shrink: 0; }

.row-divider {
  height: 1px;
  background: var(--divider);
  margin-left: calc(var(--space-md) + 36px + 14px);
}

/* Spinners */
.row-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--divider2);
  border-top-color: var(--red);
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}

.scoring-spinner {
  border-top-color: #34A853;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Cache badge */
.badge-cached {
  font-size: 11px;
  font-weight: 600;
  color: #34A853;
  background: rgba(52,168,83,0.1);
  border: 1px solid rgba(52,168,83,0.25);
  padding: 3px 8px;
  border-radius: var(--r-full);
  flex-shrink: 0;
}

/* Info note */
.scoring-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: var(--text-4);
  line-height: 1.55;
  padding: 0 2px;
}

@media (min-width: 1100px) {
  .export-panel {
    gap: 12px;
  }

  .export-list {
    border-radius: var(--r-xl);
  }

  .export-row {
    padding: 18px;
  }

  .export-title {
    font-size: 16px;
  }

  .export-sub {
    font-size: 13px;
  }
}
</style>
