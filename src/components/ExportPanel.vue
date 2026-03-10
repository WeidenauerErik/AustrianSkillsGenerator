<template>
  <div class="export-panel">
    <p class="panel-label">Exportieren</p>
    <div class="export-buttons">

      <button class="export-btn" @click="$emit('export-word')" :disabled="wordLoading">
        <div class="export-icon word-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="1" width="10" height="13" rx="1.5" fill="#2B579A"/>
            <path d="M5 5.5L6.5 10.5L8 7L9.5 10.5L11 5.5" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="export-text">
          <span class="export-label">Word-Dokument</span>
          <span class="export-desc">{{ wordLoading ? 'Wird erstellt...' : 'Vollständige Aufgabe (.docx)' }}</span>
        </div>
        <svg v-if="!wordLoading" width="16" height="16" viewBox="0 0 16 16" fill="none" class="chevron-right">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-else class="loading-dot">…</span>
      </button>

      <button class="export-btn" @click="$emit('export-json')">
        <div class="export-icon json-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4C3 4 2 5 2 6V7C2 8 1 8.5 1 8.5C1 8.5 2 9 2 10V11C2 12 3 12 4 12" stroke="#E67B00" stroke-width="1.3" stroke-linecap="round"/>
            <path d="M12 4C13 4 14 5 14 6V7C14 8 15 8.5 15 8.5C15 8.5 14 9 14 10V11C14 12 13 12 12 12" stroke="#E67B00" stroke-width="1.3" stroke-linecap="round"/>
            <circle cx="8" cy="8.5" r="1" fill="#E67B00"/>
            <circle cx="5.5" cy="8.5" r="1" fill="#E67B00"/>
            <circle cx="10.5" cy="8.5" r="1" fill="#E67B00"/>
          </svg>
        </div>
        <div class="export-text">
          <span class="export-label">JSON-Datei</span>
          <span class="export-desc">Rohdaten für eigene Nutzung</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="chevron-right">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- TODO: add Excel scoring export -->

    </div>
  </div>
</template>

<script setup>
defineProps({
  wordLoading: { type: Boolean, default: false }
})

defineEmits(['export-word', 'export-json'])
</script>

<style scoped>
.export-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--text-4);
  padding-left: 2px;
}

.export-buttons {
  background: var(--surface);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.export-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px var(--space-md);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font);
  border-bottom: 1px solid var(--divider);
  transition: background 0.12s;
}

.export-btn:last-child { border-bottom: none; }
.export-btn:active:not(:disabled) { background: var(--bg); }
.export-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.export-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.word-icon { background: rgba(43,87,154,0.08); }
.json-icon { background: rgba(230,123,0,0.08); }

.export-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.export-label { font-size: 14px; font-weight: 600; color: var(--text-1); }
.export-desc { font-size: 12px; color: var(--text-4); }

.chevron-right { color: var(--text-4); flex-shrink: 0; }
.loading-dot { color: var(--text-4); flex-shrink: 0; }
</style>
