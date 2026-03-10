<template>
  <div class="generator">
    <div class="header">
      <h1>Task Generator</h1>
      <button class="btn-link" @click="$emit('reset')">Abmelden</button>
    </div>

    <div class="form-card">
      <div class="form-group">
        <label>Thema</label>
        <input
          v-model="theme"
          type="text"
          placeholder="z. B. Webshop für eine Bäckerei"
        />
      </div>

      <div class="form-group">
        <label>Anzahl Module: {{ moduleCount }}</label>
        <input
          v-model.number="moduleCount"
          type="range"
          min="1"
          max="8"
        />
      </div>

      <!-- TODO: actually call the API here -->
      <button
        class="btn-primary"
        @click="generate"
        :disabled="!theme.trim() || loading"
      >
        {{ loading ? 'Wird generiert...' : 'Aufgabe generieren' }}
      </button>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>

    <!-- Result output (raw JSON for now) -->
    <div v-if="result" class="result-raw">
      <h2>Ergebnis (raw JSON):</h2>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeneratorView',
  props: {
    apiKey: String
  },
  emits: ['reset'],
  data() {
    return {
      theme: '',
      moduleCount: 5,
      loading: false,
      error: '',
      result: null
    }
  },
  methods: {
    async generate() {
      if (!this.theme.trim()) return
      this.loading = true
      this.error = ''
      this.result = null

      try {
        // TODO: implement real OpenAI call
        // For now just show a placeholder
        await new Promise(r => setTimeout(r, 1000))
        alert('API-Aufruf kommt noch! Theme: ' + this.theme)
      } catch (err) {
        this.error = err.message || 'Fehler aufgetreten'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.generator {
  min-height: 100dvh;
  padding: 24px 20px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 22px;
  font-weight: 700;
}

.btn-link {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--red);
  font-size: 14px;
  font-family: var(--font);
}

.form-card {
  background: var(--surface);
  border-radius: var(--r-xl);
  padding: 24px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
}

.form-group input[type="text"] {
  border: 1.5px solid var(--divider);
  border-radius: var(--r-md);
  padding: 12px 14px;
  font-size: 15px;
  font-family: var(--font);
  background: var(--bg);
  outline: none;
  transition: border-color 0.15s;
}

.form-group input[type="text"]:focus {
  border-color: var(--red);
}

.form-group input[type="range"] {
  accent-color: var(--red);
}

.btn-primary {
  background: var(--red);
  color: white;
  border: none;
  border-radius: var(--r-md);
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--red-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  font-size: 13px;
  color: #D70015;
}

.result-raw {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: 16px;
}

.result-raw h2 {
  font-size: 16px;
  margin-bottom: 12px;
}

.result-raw pre {
  font-size: 11px;
  overflow-x: auto;
  line-height: 1.5;
  color: var(--text-2);
}
</style>
