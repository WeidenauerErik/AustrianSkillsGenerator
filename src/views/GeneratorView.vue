<template>
  <div class="generator-view">
    <AppHeader title="Task Generator" subtitle="AustrianSkills Web Dev">
      <template #right>
        <button class="settings-btn" @click="showSettings = true" aria-label="Einstellungen">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.22 4.22L5.64 5.64M14.36 14.36L15.78 15.78M15.78 4.22L14.36 5.64M5.64 14.36L4.22 15.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </template>
    </AppHeader>

    <div class="view-content">

      <!-- Form -->
      <div class="form-section">
        <BaseInput
          v-model="form.theme"
          label="Thema"
          placeholder="z. B. Webshop für eine Bäckerei"
          :error="errors.theme"
          @keydown.enter="generate"
        />

        <!-- Module count -->
        <div class="field-group">
          <label class="field-label">Anzahl Module</label>
          <div class="stepper">
            <button
              class="stepper-btn"
              @click="decrement"
              :disabled="form.moduleCount <= 1"
              aria-label="Weniger Module"
            >
              <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                <path d="M1 1H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <span class="stepper-val">{{ form.moduleCount }}</span>
            <button
              class="stepper-btn"
              @click="increment"
              :disabled="form.moduleCount >= 8"
              aria-label="Mehr Module"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1V13M1 7H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <p class="field-hint">Empfohlen: 5 Module (~3,5 Std. je Modul)</p>
        </div>
      </div>

      <!-- Error -->
      <div class="error-banner" v-if="store.error" role="alert">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#D70015" stroke-width="1.5"/>
          <path d="M8 5V9" stroke="#D70015" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="8" cy="11.5" r="0.75" fill="#D70015"/>
        </svg>
        <span>{{ store.error }}</span>
      </div>

      <!-- Generate button -->
      <BaseButton
        variant="primary"
        size="lg"
        :full="true"
        :loading="store.loading"
        :disabled="!form.theme.trim()"
        @click="generate"
      >
        {{ store.loading ? 'Wird generiert…' : 'Aufgabe generieren' }}
      </BaseButton>

      <!-- Meta info -->
      <div class="meta-row">
        <span class="meta-item">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M6 4V7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          GPT-4.1-mini
        </span>
        <span class="meta-dot">·</span>
        <span class="meta-item">{{ form.moduleCount }} Module</span>
        <span class="meta-dot">·</span>
        <span class="meta-item">~100 Punkte</span>
      </div>

    </div>

    <!-- Settings Sheet -->
    <Transition name="sheet">
      <div class="sheet-overlay" v-if="showSettings" @click.self="showSettings = false">
        <div class="sheet">
          <div class="sheet-handle"></div>
          <h3 class="sheet-title">Einstellungen</h3>

          <div class="setting-item">
            <div class="setting-text">
              <span class="setting-label">API-Schlüssel</span>
              <span class="setting-val">{{ maskedKey }}</span>
            </div>
            <BaseButton variant="danger" size="sm" @click="resetKey">
              Ändern
            </BaseButton>
          </div>

          <div class="sheet-divider"></div>

          <BaseButton variant="ghost" size="md" :full="true" @click="showSettings = false">
            Schließen
          </BaseButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { generateTask } from '@/services/openai'
import AppHeader from '@/components/AppHeader.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const store  = useAppStore()

const showSettings = ref(false)

const form = reactive({
  theme: '',
  moduleCount: 5
})

const errors = reactive({ theme: '' })

const maskedKey = computed(() => {
  const k = store.apiKey
  if (!k) return '—'
  return k.slice(0, 7) + '••••••••' + k.slice(-4)
})

function increment() { if (form.moduleCount < 8) form.moduleCount++ }
function decrement() { if (form.moduleCount > 1) form.moduleCount-- }

function resetKey() {
  store.clearApiKey()
  showSettings.value = false
  router.replace({ name: 'Setup' })
}

async function generate() {
  errors.theme = ''
  store.clearError()

  if (!form.theme.trim()) {
    errors.theme = 'Bitte ein Thema eingeben.'
    return
  }

  store.loading = true
  try {
    const task = await generateTask(store.apiKey, form.theme.trim(), form.moduleCount)
    store.setTask(task)
    router.push({ name: 'Result' })
  } catch (err) {
    store.setError(err.message || 'Ein Fehler ist aufgetreten.')
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

.view-content {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* Settings button */
.settings-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-3);
  padding: 6px;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}
.settings-btn:active { background: var(--bg); color: var(--text-1); }

/* Intro card */
.intro-card {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: var(--space-md);
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
}

.intro-icon {
  width: 44px;
  height: 44px;
  background: var(--red-soft);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.intro-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
}

.intro-desc {
  font-size: 13px;
  color: var(--text-4);
  margin-top: 2px;
}

/* Form section */
.form-section {
  background: var(--surface);
  border-radius: var(--r-xl);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.field-group { display: flex; flex-direction: column; gap: 8px; }

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  padding-left: 2px;
}

.field-hint {
  font-size: 12px;
  color: var(--text-4);
  padding-left: 2px;
}

/* Stepper */
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
  justify-content: center;
  color: var(--red);
  transition: background 0.12s;
  flex-shrink: 0;
}

.stepper-btn:active:not(:disabled) { background: var(--red-soft); }
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
  min-width: 60px;
}

/* Error banner */
.error-banner {
  background: #fff5f5;
  border: 1px solid rgba(215,0,21,0.18);
  border-left: 3px solid #D70015;
  border-radius: var(--r-md);
  padding: 12px var(--space-md);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #D70015;
  line-height: 1.5;
}

/* Meta row */
.meta-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding-top: 4px;
}

.meta-item {
  font-size: 12px;
  color: var(--text-4);
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-dot { color: var(--divider2); font-size: 14px; }

/* ── Settings Sheet ── */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}

.sheet {
  background: var(--surface);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  padding: var(--space-lg);
  padding-bottom: calc(var(--sab) + var(--space-lg));
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.sheet-handle {
  width: 36px;
  height: 4px;
  background: var(--divider2);
  border-radius: var(--r-full);
  margin: 0 auto var(--space-sm);
}

.sheet-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-1);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
}

.setting-text { display: flex; flex-direction: column; gap: 3px; }

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-1);
}

.setting-val {
  font-size: 12px;
  color: var(--text-4);
  font-family: 'Courier New', monospace;
}

.sheet-divider {
  height: 1px;
  background: var(--divider);
  margin: var(--space-xs) 0;
}

/* Sheet transition */
.sheet-enter-active,
.sheet-leave-active { transition: opacity 0.22s ease; }
.sheet-enter-active .sheet,
.sheet-leave-active .sheet { transition: transform 0.22s ease; }
.sheet-enter-from,
.sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet,
.sheet-leave-to .sheet { transform: translateY(100%); }
</style>
