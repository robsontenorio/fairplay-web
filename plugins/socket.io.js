import Vue from 'vue'
import VueEcho from 'vue-echo'
import io from 'socket.io-client'
window.io = io

Vue.use(VueEcho, {
  broadcaster: 'socket.io',
  host: 'http://fairplay-api.dev:6001'
})
