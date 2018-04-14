import Vue from 'vue'

Vue.mixin({
  computed: {
    API_URL_STORAGE () {
      return process.env.API_URL_STORAGE
    },
    API_URL () {
      return process.env.API_URL
    },
    API_URL_SOCKET () {
      return process.env.API_URL_SOCKET
    }
  }
})
