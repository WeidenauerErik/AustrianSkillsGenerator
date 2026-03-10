import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_KEY_STORAGE = 'as_tg_api_key'

export const useAppStore = defineStore('app', () => {
  // ── State ──
  const apiKey            = ref(localStorage.getItem(API_KEY_STORAGE) || '')
  const taskData          = ref(null)
  const markingSchemeData = ref(null)   // cached marking scheme JSON
  const loading           = ref(false)
  const scoringLoading    = ref(false)  // separate loading state for scoring
  const error             = ref('')

  // ── Getters ──
  const hasApiKey       = computed(() => apiKey.value.trim().length > 0)
  const hasTask         = computed(() => taskData.value !== null)
  const hasMarkingScheme = computed(() => markingSchemeData.value !== null)
  const totalPoints     = computed(() => {
    if (!taskData.value) return 0
    return taskData.value.modulesOverview?.reduce((sum, m) => sum + m.points, 0) ?? 0
  })

  // ── Actions ──
  function saveApiKey(key) {
    apiKey.value = key.trim()
    localStorage.setItem(API_KEY_STORAGE, apiKey.value)
  }

  function clearApiKey() {
    apiKey.value = ''
    localStorage.removeItem(API_KEY_STORAGE)
  }

  function setTask(data) {
    taskData.value = data
    markingSchemeData.value = null  // reset marking scheme when task changes
    error.value = ''
  }

  function clearTask() {
    taskData.value = null
    markingSchemeData.value = null
    error.value = ''
  }

  function setMarkingScheme(data) {
    markingSchemeData.value = data
  }

  function setError(msg) {
    error.value = msg
  }

  function clearError() {
    error.value = ''
  }

  return {
    // state
    apiKey, taskData, markingSchemeData, loading, scoringLoading, error,
    // getters
    hasApiKey, hasTask, hasMarkingScheme, totalPoints,
    // actions
    saveApiKey, clearApiKey,
    setTask, clearTask,
    setMarkingScheme,
    setError, clearError
  }
})
