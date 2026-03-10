<template>
  <div class="setup">
    <div class="setup-hero">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#C03B3B"/>
        <polygon points="24,9 41,39 7,39" fill="white"/>
      </svg>
      <h1>AustrianSkills</h1>
      <p>Task Generator</p>
    </div>

    <div class="setup-card">
      <h2>Willkommen</h2>
      <p class="desc">Gib deinen OpenAI API-Schlüssel ein, um den Task Generator zu nutzen.</p>

      <div class="form-group">
        <label>OpenAI API-Schlüssel</label>
        <input
          v-model="keyInput"
          type="password"
          placeholder="sk-..."
          @keydown.enter="submit"
        />
        <span v-if="error" class="error-msg">{{ error }}</span>
      </div>

      <button
        class="btn-primary"
        @click="submit"
        :disabled="!keyInput.trim()"
      >
        Weiter
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetupView',
  emits: ['key-saved'],
  data() {
    return {
      keyInput: '',
      error: ''
    }
  },
  methods: {
    submit() {
      this.error = ''
      const key = this.keyInput.trim()
      if (!key.startsWith('sk-')) {
        this.error = 'Ungültiger API-Schlüssel. Schlüssel beginnen mit "sk-".'
        return
      }
      // TODO: validate key against OpenAI API
      this.$emit('key-saved', key)
    }
  }
}
</script>

<style scoped>
.setup {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: 32px 20px;
  background: var(--bg);
}

.setup-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 32px;
  gap: 8px;
}

.setup-hero h1 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-1);
}

.setup-hero p {
  font-size: 15px;
  color: var(--text-3);
}

.setup-card {
  background: var(--surface);
  border-radius: var(--r-xl);
  padding: 24px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setup-card h2 {
  font-size: 20px;
  font-weight: 700;
}

.desc {
  font-size: 14px;
  color: var(--text-3);
  line-height: 1.7;
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

.form-group input {
  border: 1.5px solid var(--divider);
  border-radius: var(--r-md);
  padding: 12px 14px;
  font-size: 15px;
  font-family: var(--font);
  background: var(--bg);
  outline: none;
  transition: border-color 0.15s;
}

.form-group input:focus {
  border-color: var(--red);
}

.error-msg {
  font-size: 12px;
  color: #D70015;
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
  width: 100%;
  transition: background 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--red-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
