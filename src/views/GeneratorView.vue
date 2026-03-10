<template>
  <div class="generator-view">
    <header class="app-header">
      <div class="header-content">
        <div class="header-placeholder"></div>
        <div class="header-center">
          <span class="header-title">Task Generator</span>
          <span class="header-subtitle">AustrianSkills Web Dev</span>
        </div>
        <button class="settings-btn" @click="showSettings = !showSettings">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.22 4.22L5.64 5.64M14.36 14.36L15.78 15.78M15.78 4.22L14.36 5.64M5.64 14.36L4.22 15.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="view-content">

      <!-- Settings dropdown (basic) -->
      <div v-if="showSettings" class="settings-card">
        <p class="settings-label">API-Schlüssel</p>
        <p class="settings-key">{{ maskedKey }}</p>
        <button class="btn-danger-sm" @click="resetKey">Schlüssel ändern</button>
      </div>

      <div class="form-section">
        <div class="form-group">
          <label class="field-label">Thema</label>
          <input
            v-model="theme"
            type="text"
            class="form-input"
            placeholder="z. B. Webshop für eine Bäckerei"
            :class="{ 'has-error': themeError }"
            @keydown.enter="generate"
          />
          <span v-if="themeError" class="error-hint">{{ themeError }}</span>
        </div>

        <!-- Module stepper -->
        <div class="field-group">
          <label class="field-label">Anzahl Module</label>
          <div class="stepper">
            <button class="stepper-btn" @click="decrement" :disabled="moduleCount <= 1">
              <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                <path d="M1 1H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <span class="stepper-val">{{ moduleCount }}</span>
            <button class="stepper-btn" @click="increment" :disabled="moduleCount >= 8">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1V13M1 7H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <p class="field-hint">Empfohlen: 5 Module (~3,5 Std. je Modul)</p>
        </div>
      </div>

      <p v-if="store.error" class="error-banner">{{ store.error }}</p>

      <button
        class="btn-primary"
        @click="generate"
        :disabled="!theme.trim() || store.loading"
      >
        {{ store.loading ? 'Wird generiert…' : 'Aufgabe generieren' }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const store  = useAppStore()

const theme       = ref('')
const moduleCount = ref(5)
const themeError  = ref('')
const showSettings = ref(false)

const maskedKey = computed(() => {
  const k = store.apiKey
  if (!k) return '—'
  return k.slice(0, 7) + '••••••' + k.slice(-4)
})

function increment() { if (moduleCount.value < 8) moduleCount.value++ }
function decrement() { if (moduleCount.value > 1) moduleCount.value-- }

function resetKey() {
  store.clearApiKey()
  router.replace({ name: 'Setup' })
}

async function generate() {
  themeError.value = ''
  store.clearError()

  if (!theme.value.trim()) {
    themeError.value = 'Bitte ein Thema eingeben.'
    return
  }

  store.loading = true

  try {
    // TODO: implement OpenAI call in services/openai.js
    // const task = await generateTask(store.apiKey, theme.value, moduleCount.value)
    // store.setTask(task)
    // router.push({ name: 'Result' })
    await new Promise(r => setTimeout(r, 800))
    store.setError('API-Aufruf noch nicht implementiert.')
  } catch (err) {
    store.setError(err.message || 'Fehler aufgetreten.')
  } finally {
    store.loading = false
  }
}
</script>

<style scoped>
.generator-view {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--bg);
}

.app-header {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  padding-top: var(--sat);
  border-bottom: 1px solid var(--divider);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 var(--space-md);
  gap: var(--space-sm);
}

.header-placeholder { min-width: 64px; }
.header-center { flex: 1; text-align: center; }
.header-title { font-size: 16px; font-weight: 600; color: var(--text-1); display: block; }
.header-subtitle { font-size: 11px; color: var(--text-4); }

.settings-btn {
  min-width: 64px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-3);
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
}

.view-content {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.settings-card {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-label { font-size: 12px; font-weight: 600; color: var(--text-4); text-transform: uppercase; }
.settings-key { font-size: 13px; color: var(--text-2); font-family: monospace; }

.btn-danger-sm {
  background: none;
  border: 1px solid #D70015;
  color: #D70015;
  border-radius: var(--r-md);
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
  font-family: var(--font);
  align-self: flex-start;
}

.form-section {
  background: var(--surface);
  border-radius: var(--r-xl);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.form-group, .field-group { display: flex; flex-direction: column; gap: 8px; }

.field-label { font-size: 13px; font-weight: 600; color: var(--text-2); padding-left: 2px; }
.field-hint { font-size: 12px; color: var(--text-4); padding-left: 2px; }

.form-input {
  border: 1.5px solid var(--divider);
  border-radius: var(--r-md);
  padding: 12px 14px;
  font-size: 15px;
  font-family: var(--font);
  background: var(--bg);
  outline: none;
  transition: border-color 0.15s;
}

.form-input:focus { border-color: var(--red); }
.form-input.has-error { border-color: #D70015; }
.error-hint { font-size: 12px; color: #D70015; padding-left: 2px; }

.stepper {
  display: flex;
  align-items: center;
  background: var(--bg);
  border: 1.5px solid var(--divider);
  border-radius: var(--r-md);
  overflow: hidden;
  height: 46px;
}

.stepper-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 18px;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--red);
}

.stepper-btn:disabled { color: var(--divider2); cursor: not-allowed; }

.stepper-val {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-1);
  border-left: 1px solid var(--divider);
  border-right: 1px solid var(--divider);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-banner {
  background: #fff5f5;
  border: 1px solid rgba(215,0,21,0.2);
  border-left: 3px solid #D70015;
  border-radius: var(--r-md);
  padding: 12px var(--space-md);
  font-size: 13px;
  color: #D70015;
}

.btn-primary {
  background: var(--red);
  color: white;
  border: none;
  border-radius: var(--r-md);
  padding: 15px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}

.btn-primary:hover:not(:disabled) { background: var(--red-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
