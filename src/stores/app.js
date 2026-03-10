import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'as_tg_api_key'

export const useAppStore = defineStore('app', () => {
  const apiKey  = ref(localStorage.getItem(STORAGE_KEY) || '')
  const loading = ref(false)
  const error   = ref('')
  const taskData = ref(null)

  const hasApiKey = computed(() => apiKey.value.trim().length > 0)
  const hasTask   = computed(() => taskData.value !== null)

  function saveApiKey(key) {
    apiKey.value = key.trim()
    localStorage.setItem(STORAGE_KEY, apiKey.value)
  }

  function clearApiKey() {
    apiKey.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  function setTask(data) {
    taskData.value = data
    error.value = ''
  }

  function setError(msg) { error.value = msg }
  function clearError()  { error.value = '' }

  return {
    apiKey, loading, error, taskData,
    hasApiKey, hasTask,
    saveApiKey, clearApiKey,
    setTask, setError, clearError
  }
})
