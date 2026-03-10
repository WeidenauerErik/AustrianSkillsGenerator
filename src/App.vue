<template>
  <div id="main">
    <SetupView v-if="!apiKey" @key-saved="onKeySaved" />
    <GeneratorView v-else :api-key="apiKey" @reset="apiKey = ''" />
  </div>
</template>

<script>
import SetupView from './views/SetupView.vue'
import GeneratorView from './views/GeneratorView.vue'

export default {
  name: 'App',
  components: { SetupView, GeneratorView },
  data() {
    return {
      // TODO: persist this in localStorage later
      apiKey: localStorage.getItem('apiKey') || ''
    }
  },
  methods: {
    onKeySaved(key) {
      this.apiKey = key
      localStorage.setItem('apiKey', key)
    }
  }
}
</script>

<style>
#main {
  max-width: 480px;
  margin: 0 auto;
}
</style>
