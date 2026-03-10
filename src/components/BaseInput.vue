<template>
  <div class="base-input-wrap" :class="{ focused, hasError: error, disabled }">
    <label v-if="label" :for="uid" class="input-label">{{ label }}</label>
    <div class="input-field">
      <span v-if="prefix" class="field-prefix">{{ prefix }}</span>
      <input
        :id="uid"
        class="input-el"
        v-bind="$attrs"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="field-toggle"
        @click="showPassword = !showPassword"
        tabindex="-1"
        :aria-label="showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'"
      >
        <svg v-if="showPassword" width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path d="M1 7C1 7 4 1 9 1C14 1 17 7 17 7C17 7 14 13 9 13C4 13 1 7 1 7Z" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="9" cy="7" r="2.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M2 2L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <svg v-else width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path d="M1 7C1 7 4 1 9 1C14 1 17 7 17 7C17 7 14 13 9 13C4 13 1 7 1 7Z" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="9" cy="7" r="2.5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>
    </div>
    <p v-if="error" class="input-error">{{ error }}</p>
    <p v-else-if="hint" class="input-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue:   { type: String, default: '' },
  label:        { type: String, default: '' },
  placeholder:  { type: String, default: '' },
  type:         { type: String, default: 'text' },
  hint:         { type: String, default: '' },
  error:        { type: String, default: '' },
  prefix:       { type: String, default: '' },
  disabled:     { type: Boolean, default: false },
  autocomplete: { type: String, default: 'off' }
})

defineEmits(['update:modelValue'])

const uid          = `input-${Math.random().toString(36).slice(2, 8)}`
const focused      = ref(false)
const showPassword = ref(false)
const inputType    = computed(() =>
  props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type
)
</script>

<style scoped>
.base-input-wrap { display: flex; flex-direction: column; gap: 6px; }

.input-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  padding-left: 2px;
}

.input-field {
  display: flex;
  align-items: center;
  background: var(--surface);
  border: 1.5px solid var(--divider);
  border-radius: var(--r-md);
  transition: border-color 0.15s, box-shadow 0.15s;
  overflow: hidden;
}

.base-input-wrap.focused .input-field {
  border-color: var(--red);
  box-shadow: 0 0 0 3px var(--red-soft);
}

.base-input-wrap.hasError .input-field {
  border-color: #D70015;
  box-shadow: 0 0 0 3px rgba(215,0,21,0.08);
}

.base-input-wrap.disabled .input-field {
  background: var(--bg);
  opacity: 0.6;
}

.field-prefix {
  padding: 0 0 0 14px;
  font-size: 14px;
  color: var(--text-4);
  white-space: nowrap;
  flex-shrink: 0;
}

.input-el {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font);
  font-size: 15px;
  color: var(--text-1);
  padding: 13px 14px;
  width: 100%;
  min-width: 0;
}

.input-el::placeholder { color: var(--text-4); }

.field-toggle {
  background: none;
  border: none;
  padding: 0 14px;
  cursor: pointer;
  color: var(--text-4);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.15s;
}

.field-toggle:hover { color: var(--text-2); }

.input-error {
  font-size: 12px;
  color: #D70015;
  padding-left: 2px;
}

.input-hint {
  font-size: 12px;
  color: var(--text-4);
  padding-left: 2px;
}
</style>
