<template>
  <div>
    <!-- <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone> -->
    <div class="chat-wrapper" ref="chatWrapper">
      <div v-for="mensagem in partida.mensagens" :key="mensagem.id">
        <div class="mensagem-wrapper" :class="{'has-text-right' : mensagem.from_id === eu.id}">
          <div class="mensagem" :class="[mensagem.from_id === eu. id ? 'mensagem-minha' : 'mensagem-amigo']">{{ mensagem.mensagem }}</div>
        </div>
      </div>
    </div>
    <div class="mensagem-composer">
      <b-field>
        <b-input placeholder="Mensagem ..." v-model="mensagem" @keyup.native.enter="enviar()"></b-input>
      </b-field>
    </div>
  </div>
</template>
<script>
import vue2Dropzone from 'vue2-dropzone'

export default {
  name: 'chat',
  props: ['eu', 'partida'],
  components: {
    vueDropzone: vue2Dropzone
  },
  data () {
    return {
      mensagem: null,
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: { 'My-Awesome-Header': 'header value' }
      }
    }
  },
  watch: {
    'partida.mensagens' () {
      this.scroll()
    }
  },
  computed: {
    adversario () {
      let adversario = null

      if (this.partida && this.eu) {
        adversario = (this.eu.id === this.partida.user1_id) ? this.partida.user2 : this.partida.user1
      }

      return adversario
    }
  },
  methods: {
    enviar () {
      let params = {
        mensagem: this.mensagem,
        chat_id: this.partida.id,
        from_id: this.eu.id,
        to_id: this.adversario.id
      }

      this.$axios.post(`/mensagens`, params)

      this.mensagem = null
    },
    scroll () {
      let container = this.$refs.chatWrapper
      container.scrollTop = container.scrollHeight
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-wrapper {
  height: 200px;
  overflow: scroll;
}

.mensagem-composer {
  clear: both;
  margin-top: 10px;
}

.mensagem-wrapper {
  clear: both;
}

.mensagem {
  margin-bottom: 5px;
  color: white;
  border-radius: 10px;
  padding: 1px 8px;
  font-size: 9pt;
}

.mensagem-minha {
  background: #5d62ad;
  float: right;
}

.mensagem-amigo {
  background: #85af85;
  float: left;
}
</style>
