<template>
  <button
    class="base-btn"
    :class="[`variant-${variant}`, `size-${size}`, { loading, full }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
    <span v-if="icon && !loading" class="btn-icon" aria-hidden="true">{{ icon }}</span>
    <span class="btn-label">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant:  { type: String, default: 'primary' }, // primary | secondary | ghost | danger
  size:     { type: String, default: 'md' },       // sm | md | lg
  icon:     { type: String, default: '' },
  loading:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  full:     { type: Boolean, default: false }
})
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: none;
  border-radius: var(--r-md);
  font-family: var(--font);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s, transform 0.1s;
  white-space: nowrap;
  position: relative;
  text-align: center;
  -webkit-appearance: none;
}

.base-btn:active:not(:disabled) {
  transform: scale(0.97);
  opacity: 0.88;
}

.base-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.base-btn.full {
  width: 100%;
  border-radius: var(--r-lg);
}

/* Sizes */
.size-sm { font-size: 13px; padding: 8px 14px; }
.size-md { font-size: 15px; padding: 13px 20px; }
.size-lg { font-size: 16px; padding: 16px 28px; }

/* Variants */
.variant-primary {
  background: var(--red);
  color: #fff;
}
.variant-primary:hover:not(:disabled) {
  background: var(--red-hover);
}

.variant-secondary {
  background: var(--red-soft);
  color: var(--red);
}
.variant-secondary:hover:not(:disabled) {
  background: var(--red-soft2);
}

.variant-ghost {
  background: var(--surface2);
  color: var(--text-2);
  border: 1px solid var(--divider);
}
.variant-ghost:hover:not(:disabled) {
  background: var(--divider);
}

.variant-danger {
  background: rgba(255,59,48,0.1);
  color: #D70015;
}
.variant-danger:hover:not(:disabled) {
  background: rgba(255,59,48,0.18);
}

/* Spinner */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}

.variant-secondary .btn-spinner,
.variant-ghost .btn-spinner {
  border-color: rgba(0,0,0,0.15);
  border-top-color: var(--text-2);
}

@keyframes spin { to { transform: rotate(360deg); } }

.btn-icon {
  font-size: 15px;
  line-height: 1;
  flex-shrink: 0;
}

.btn-label { line-height: 1; }
</style>
