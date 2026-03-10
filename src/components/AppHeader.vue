<template>
  <header class="app-header" :class="{ 'has-border': scrolled }">
    <div class="header-content">
      <button
        v-if="showBack"
        class="header-btn header-back"
        @click="$emit('back')"
        aria-label="Zurück"
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path d="M8.5 1L1.5 8L8.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-if="backLabel" class="back-label">{{ backLabel }}</span>
      </button>
      <div v-else class="header-btn placeholder"></div>

      <div class="header-center">
        <span class="header-title">{{ title }}</span>
        <span v-if="subtitle" class="header-subtitle">{{ subtitle }}</span>
      </div>

      <div class="header-right">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  title:     { type: String, required: true },
  subtitle:  { type: String, default: '' },
  showBack:  { type: Boolean, default: false },
  backLabel: { type: String, default: '' }
})

defineEmits(['back'])

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 4
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding-top: var(--sat);
  transition: border-color 0.2s;
  border-bottom: 1px solid transparent;
}

.app-header.has-border {
  border-bottom-color: var(--divider);
}

.header-content {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 var(--space-md);
  gap: var(--space-sm);
}

.header-btn {
  min-width: 64px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--red);
  font-size: 15px;
  font-weight: 500;
  font-family: var(--font);
  padding: 6px 0;
  transition: opacity 0.15s;
}

.header-btn:active { opacity: 0.6; }

.placeholder { pointer-events: none; }

.back-label {
  font-size: 15px;
  line-height: 1;
}

.header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.header-subtitle {
  font-size: 11px;
  font-weight: 400;
  color: var(--text-4);
  margin-top: 1px;
}

.header-right {
  min-width: 64px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
