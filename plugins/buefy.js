import Vue from 'vue'
import Buefy from 'buefy'
import VueChatScroll from 'vue-chat-scroll'
import 'buefy/lib/buefy.css'
import '~/assets/app.scss'

Vue.use(Buefy, {
  defaultIconPack: 'fa',
  defaultToastDuration: 5000
})

Vue.use(VueChatScroll)
