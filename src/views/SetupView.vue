<template>
  <div class="setup-view">
    <div class="setup-hero">
      <div class="logo-mark">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="#C03B3B"/>
          <polygon points="24,9 41,39 7,39" fill="white"/>
        </svg>
      </div>
      <h1 class="setup-title">AustrianSkills</h1>
      <p class="setup-subtitle">Task Generator</p>
    </div>

    <div class="setup-card">
      <div class="card-inner">
        <h2 class="card-heading">Willkommen</h2>
        <p class="card-desc">
          Gib deinen OpenAI API-Schlüssel ein, um den Task Generator zu nutzen.
          Der Schlüssel wird sicher auf diesem Gerät gespeichert.
        </p>

        <div class="form-group">
          <label class="form-label">OpenAI API-Schlüssel</label>
          <input
            v-model="keyInput"
            type="password"
            placeholder="sk-..."
            class="form-input"
            :class="{ 'has-error': inputError }"
            autocomplete="off"
            @keydown.enter="submit"
          />
          <span v-if="inputError" class="error-hint">{{ inputError }}</span>
          <span v-else class="input-hint">Einmalige Eingabe — wird lokal gespeichert</span>
        </div>

        <button
          class="btn-primary"
          @click="submit"
          :disabled="!keyInput.trim() || validating"
        >
          {{ validating ? 'Wird geprüft...' : 'Weiter' }}
        </button>
      </div>
    </div>

    <p class="info-footer">
      Der API-Schlüssel wird ausschließlich lokal auf deinem Gerät gespeichert.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router    = useRouter()
const store     = useAppStore()
const keyInput  = ref('')
const validating = ref(false)
const inputError = ref('')

async function submit() {
  inputError.value = ''
  const key = keyInput.value.trim()

  if (!key.startsWith('sk-')) {
    inputError.value = 'Ungültiger API-Schlüssel. Schlüssel beginnen mit "sk-".'
    return
  }

  validating.value = true

  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` }
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      inputError.value = body?.error?.message ?? 'Ungültiger API-Schlüssel.'
      return
    }
  } catch {
    inputError.value = 'Netzwerkfehler. Bitte Verbindung prüfen.'
    return
  } finally {
    validating.value = false
  }

  store.saveApiKey(key)
  router.replace({ name: 'Generator' })
}
</script>

<style scoped>
.setup-view {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: calc(var(--sat) + 32px) var(--space-lg) calc(var(--sab) + 32px);
  background: var(--bg);
}

.setup-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2xl) 0 var(--space-xl);
  gap: var(--space-sm);
}

.logo-mark {
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 12px rgba(192,59,59,0.25));
}

.setup-title { font-size: 26px; font-weight: 700; color: var(--text-1); letter-spacing: -0.4px; }
.setup-subtitle { font-size: 15px; color: var(--text-3); }

.setup-card {
  background: var(--surface);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-md);
}

.card-inner {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.card-heading { font-size: 20px; font-weight: 700; color: var(--text-1); }
.card-desc { font-size: 14px; color: var(--text-3); line-height: 1.7; margin-top: -8px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 600; color: var(--text-2); padding-left: 2px; }

.form-input {
  border: 1.5px solid var(--divider);
  border-radius: var(--r-md);
  padding: 12px 14px;
  font-size: 15px;
  font-family: var(--font);
  background: var(--bg);
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}

.form-input:focus { border-color: var(--red); }
.form-input.has-error { border-color: #D70015; }

.error-hint { font-size: 12px; color: #D70015; padding-left: 2px; }
.input-hint { font-size: 12px; color: var(--text-4); padding-left: 2px; }

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
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

.info-footer {
  font-size: 12px;
  color: var(--text-4);
  line-height: 1.6;
  text-align: center;
  padding-top: var(--space-xl);
}
</style>
