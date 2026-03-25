<template>
  <div class="setup-view">
    <!-- Logo area -->
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

    <!-- Card -->
    <div class="setup-card">
      <div class="card-inner">
        <h2 class="card-heading">Willkommen</h2>
        <p class="card-desc">
          Gib deinen OpenAI API-Schlüssel ein, um den Task Generator zu nutzen. Der Schlüssel wird sicher auf diesem Gerät gespeichert.
        </p>

        <form class="setup-form" @submit.prevent="submit">
          <BaseInput
            v-model="keyInput"
            label="OpenAI API-Schlüssel"
            type="password"
            placeholder="sk-..."
            hint="Einmalige Eingabe — wird lokal gespeichert"
            :error="inputError"
            autocomplete="off"
          />

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :full="true"
            :loading="validating"
            :disabled="!keyInput.trim()"
          >
            Weiter
          </BaseButton>
        </form>
      </div>
    </div>

    <!-- Info -->
    <div class="setup-footer">
      <p class="info-text">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="flex-shrink:0;margin-top:1px">
          <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/>
          <path d="M7 6V10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          <circle cx="7" cy="4.5" r="0.75" fill="currentColor"/>
        </svg>
        Der API-Schlüssel wird ausschließlich lokal auf deinem Gerät gespeichert und nie an Dritte übertragen.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const router   = useRouter()
const store    = useAppStore()

const keyInput   = ref('')
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

  // Light validation: attempt a minimal API call
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

/* Hero */
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

.setup-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: -0.4px;
}

.setup-subtitle {
  font-size: 15px;
  color: var(--text-3);
  font-weight: 400;
}

/* Card */
.setup-card {
  background: var(--surface);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.card-inner {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.card-heading {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: -0.3px;
}

.card-desc {
  font-size: 14px;
  color: var(--text-3);
  line-height: 1.7;
  margin-top: -8px;
}

.setup-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Footer info */
.setup-footer {
  padding: var(--space-xl) 0 0;
}

.info-text {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12px;
  color: var(--text-4);
  line-height: 1.6;
  text-align: left;
}

@media (min-width: 768px) {
  .setup-view {
    justify-content: center;
    padding: calc(var(--sat) + 48px) clamp(28px, 6vw, 72px) calc(var(--sab) + 48px);
  }

  .setup-hero {
    padding: 0 0 var(--space-2xl);
  }

  .setup-card {
    width: min(100%, 640px);
    margin: 0 auto;
  }

  .setup-footer {
    width: min(100%, 640px);
    margin: 0 auto;
  }

  .card-inner {
    padding: 36px;
  }

  .card-heading {
    font-size: 24px;
  }

  .card-desc {
    font-size: 15px;
  }
}

@media (min-width: 1100px) {
  .setup-view {
    display: grid;
    grid-template-columns: minmax(280px, 420px) minmax(520px, 640px);
    align-content: center;
    justify-content: center;
    gap: clamp(40px, 5vw, 88px);
    min-height: 100%;
  }

  .setup-hero {
    align-items: flex-start;
    text-align: left;
    padding: 0;
  }

  .setup-title {
    font-size: 40px;
  }

  .setup-subtitle {
    font-size: 18px;
  }

  .setup-card,
  .setup-footer {
    width: 100%;
    margin: 0;
  }

  .setup-footer {
    padding-top: var(--space-lg);
  }
}
</style>
