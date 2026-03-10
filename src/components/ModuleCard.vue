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
      <svg
        class="chevron"
        :class="{ rotated: open }"
        width="16" height="16" viewBox="0 0 16 16" fill="none"
      >
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="card-body" v-show="open">
      <div class="body-section">
        <p class="body-label">Übersicht</p>
        <p class="body-text">{{ module.overview }}</p>
      </div>
      <div class="body-section">
        <p class="body-label">User Stories</p>
        <ul class="story-list">
          <li v-for="(story, i) in module.userStories" :key="i" class="story-item">
            <span class="story-idx">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="story-text">{{ story }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  module: { type: Object, required: true }
})

const open = ref(false)
function toggle() { open.value = !open.value }
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
</style>
