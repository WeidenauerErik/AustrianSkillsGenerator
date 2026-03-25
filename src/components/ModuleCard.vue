<template>
  <div class="module-card">
    <button class="card-header" @click="toggle" :aria-expanded="open">
      <div class="card-header-left">
        <span class="module-letter">{{ module.module }}</span>
        <div class="card-title-wrap">
          <span class="card-title">{{ module.title }}</span>
          <div class="card-chips">
            <span class="chip chip-time">{{ module.timebox }}</span>
            <span class="chip chip-pts">{{ module.points }} Pts</span>
          </div>
        </div>
      </div>
      <div class="card-header-actions">
        <button class="edit-toggle header-edit-toggle" @click.stop="startEditing" type="button">
          {{ editing ? 'Editor schließen' : 'Bearbeiten' }}
        </button>
        <svg
          class="chevron"
          :class="{ rotated: open }"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </button>

    <div class="card-body" v-show="open">
      <div class="body-section">
        <p class="body-label">Übersicht</p>
        <p class="body-text">{{ module.overview }}</p>
      </div>
      <div class="body-section">
        <div class="section-head">
          <p class="body-label">User Stories</p>
          <span class="edit-hint">Manuell oder per KI anpassen</span>
        </div>

        <div v-if="editing" class="editor-panel">
          <div class="editor-section">
            <label class="editor-label" :for="`manual-${module.module}`">Textbearbeitung</label>
            <p class="editor-hint">Eine User Story pro Zeile.</p>
            <textarea
              :id="`manual-${module.module}`"
              v-model="manualValue"
              class="editor-textarea"
              rows="8"
            ></textarea>
            <div class="editor-actions">
              <button class="editor-btn secondary" type="button" @click="resetManual">
                Zurücksetzen
              </button>
              <button class="editor-btn primary" type="button" @click="saveManual">
                Stories speichern
              </button>
            </div>
          </div>

          <div class="editor-divider"></div>

          <div class="editor-section">
            <label class="editor-label" :for="`ai-${module.module}`">KI-Überarbeitung</label>
            <p class="editor-hint">Beschreibe, wie die Stories angepasst werden sollen.</p>
            <textarea
              :id="`ai-${module.module}`"
              v-model="aiPrompt"
              class="editor-textarea prompt-textarea"
              rows="4"
              placeholder="z. B. fokussiere stärker auf Backend und formuliere die Stories technischer."
            ></textarea>
            <div class="editor-actions">
              <button
                class="editor-btn secondary"
                type="button"
                @click="applyAiEdit"
                :disabled="aiLoading || !aiPrompt.trim()"
              >
                {{ aiLoading ? 'KI bearbeitet…' : 'Mit KI überarbeiten' }}
              </button>
            </div>
          </div>

          <p v-if="editorError" class="editor-error">{{ editorError }}</p>
          <p v-else-if="saveMessage" class="editor-success">{{ saveMessage }}</p>
          <p v-else-if="hasManualChanges" class="editor-pending">Ungespeicherte Änderungen im Textfeld.</p>
          <p class="editor-note">Hinweis: Ein geändertes Bewertungsschema wird zurückgesetzt.</p>
        </div>

        <ul class="story-list">
          <li v-for="(story, i) in module.userStories" :key="`${module.module}-${i}`" class="story-item">
            <span class="story-idx">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="story-text">{{ story }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { rewriteUserStories } from '@/services/openai'

const props = defineProps({
  module: { type: Object, required: true }
})

const store = useAppStore()
const open = ref(false)
const editing = ref(false)
const aiLoading = ref(false)
const editorError = ref('')
const saveMessage = ref('')
const aiPrompt = ref('')
const manualValue = ref('')
let saveTimer = null

function toggle() { open.value = !open.value }

function serializeStories(stories) {
  return stories.join('\n')
}

function parseStories(text) {
  return text
    .split('\n')
    .map((story) => story.trim())
    .filter(Boolean)
}

function syncManualValue() {
  manualValue.value = serializeStories(props.module.userStories)
}

const hasManualChanges = computed(
  () => manualValue.value !== serializeStories(props.module.userStories)
)

function showSaveMessage(message) {
  saveMessage.value = message
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveMessage.value = ''
  }, 2600)
}

function startEditing() {
  editing.value = !editing.value
  editorError.value = ''
  saveMessage.value = ''
  aiPrompt.value = ''
  syncManualValue()
}

function resetManual() {
  editorError.value = ''
  saveMessage.value = ''
  syncManualValue()
}

function saveManual() {
  const stories = parseStories(manualValue.value)

  if (stories.length === 0) {
    editorError.value = 'Bitte mindestens eine User Story eingeben.'
    return
  }

  store.updateModuleUserStories(props.module.module, stories)
  editorError.value = ''
  syncManualValue()
  showSaveMessage('User Stories gespeichert.')
}

async function applyAiEdit() {
  if (!aiPrompt.value.trim()) return
  if (!store.apiKey) {
    editorError.value = 'Es ist kein API-Schlüssel gespeichert.'
    return
  }

  aiLoading.value = true
  editorError.value = ''

  try {
    const stories = await rewriteUserStories(
      store.apiKey,
      store.taskData,
      props.module,
      aiPrompt.value
    )
    store.updateModuleUserStories(props.module.module, stories)
    syncManualValue()
    showSaveMessage('User Stories per KI aktualisiert.')
  } catch (error) {
    editorError.value = error.message || 'Die KI-Bearbeitung ist fehlgeschlagen.'
  } finally {
    aiLoading.value = false
  }
}

watch(
  () => props.module.userStories,
  () => {
    if (editing.value) syncManualValue()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.module-card {
  background: var(--surface);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.card-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding: 14px var(--space-md);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font);
  transition: background 0.12s;
}

.card-header:active { background: var(--bg); }

.card-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.module-letter {
  width: 36px;
  height: 36px;
  background: var(--red-soft);
  color: var(--red);
  border-radius: var(--r-md);
  font-size: 17px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-1);
  line-height: 1.3;
}

.card-chips {
  display: flex;
  gap: 6px;
}

.chip {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: var(--r-full);
}

.chip-time {
  background: var(--bg);
  color: var(--text-3);
}

.chip-pts {
  background: var(--red-soft);
  color: var(--red);
  font-weight: 600;
}

.chevron {
  color: var(--text-4);
  flex-shrink: 0;
  transition: transform 0.22s ease;
}

.chevron.rotated { transform: rotate(180deg); }

/* Body */
.card-body {
  border-top: 1px solid var(--divider);
  display: flex;
  flex-direction: column;
  gap: 0;
}

.body-section {
  padding: var(--space-md);
  border-bottom: 1px solid var(--divider);
}

.body-section:last-child { border-bottom: none; }

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.body-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--text-4);
  margin-bottom: 8px;
}

.body-text {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.7;
}

.edit-toggle {
  border: 1px solid var(--divider);
  background: var(--surface2);
  color: var(--text-2);
  border-radius: var(--r-full);
  padding: 6px 10px;
  font-family: var(--font);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.edit-toggle:hover {
  background: var(--bg);
  border-color: var(--divider2);
}

.header-edit-toggle {
  white-space: nowrap;
}

.edit-hint {
  font-size: 12px;
  color: var(--text-4);
  line-height: 1.4;
}

.editor-panel {
  background: var(--bg);
  border: 1px solid var(--divider);
  border-radius: var(--r-md);
  padding: 14px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
}

.editor-hint,
.editor-note {
  font-size: 12px;
  color: var(--text-4);
  line-height: 1.5;
}

.editor-textarea {
  width: 100%;
  resize: vertical;
  min-height: 112px;
  border: 1px solid var(--divider);
  border-radius: var(--r-md);
  background: var(--surface);
  padding: 12px 14px;
  font-family: var(--font);
  font-size: 14px;
  color: var(--text-1);
  line-height: 1.6;
  outline: none;
}

.editor-textarea:focus {
  border-color: var(--red);
  box-shadow: 0 0 0 3px var(--red-soft);
}

.prompt-textarea {
  min-height: 88px;
}

.editor-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.editor-btn {
  border: none;
  border-radius: var(--r-md);
  padding: 10px 14px;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, background 0.15s;
}

.editor-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-btn.primary {
  background: var(--red);
  color: var(--text-inv);
}

.editor-btn.secondary {
  background: var(--surface);
  color: var(--text-2);
  border: 1px solid var(--divider);
}

.editor-divider {
  height: 1px;
  background: var(--divider);
}

.editor-error {
  font-size: 12px;
  color: #D70015;
  line-height: 1.5;
}

.editor-success,
.editor-pending {
  font-size: 12px;
  line-height: 1.5;
}

.editor-success {
  color: var(--success);
  font-weight: 600;
}

.editor-pending {
  color: var(--text-3);
}

.story-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.story-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 11px;
  background: var(--bg);
  border-radius: var(--r-sm);
  border-left: 2px solid var(--red);
}

.story-idx {
  font-size: 11px;
  font-weight: 700;
  color: var(--red);
  flex-shrink: 0;
  padding-top: 1px;
  min-width: 18px;
}

.story-text {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.6;
}

@media (min-width: 1100px) {
  .module-card {
    height: 100%;
  }

  .card-header {
    padding: 18px;
  }

  .card-title {
    font-size: 15px;
  }

  .body-section {
    padding: 18px;
  }
}
</style>
