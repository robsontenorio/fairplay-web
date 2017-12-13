<template>
  <div>
    <div v-if="mensagens" class="chat-wrapper" ref="chatWrapper" v-chat-scroll>
      <div v-for="mensagem in mensagens" :key="mensagem.id">
        <div class="mensagem-wrapper" :class="{'has-text-right' : mensagem.from_id === eu.id}">
          <div class="mensagem" :class="[mensagem.from_id === eu.id ? 'mensagem-minha' : 'mensagem-amigo']">
            <div v-if="mensagem.mensagem">
              {{ mensagem.mensagem }}
            </div>
            <div v-if="mensagem.media">
              <img :src="`${API_URL_STORAGE}/${mensagem.media}`" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mensagem-composer">
      <b-field>
        <div class="control">
          <div class="button">
            <vue-dropzone ref="dropZone" id="dropzone" :options="dropzoneOptions" @vdropzone-success="syncMensagem" @vdropzone-file-added="fazendoUpload" @vdropzone-sending="fazendoUpload">
            </vue-dropzone>
          </div>
        </div>
        <b-input placeholder="Mensagem ..." type="text" v-model="params.mensagem" @keyup.native.enter="enviar()" expanded></b-input>
      </b-field>
    </div>
    <b-loading :active.sync="loading"></b-loading>

  </div>
</template>
<script>
import vue2Dropzone from 'vue2-dropzone'

export default {
  name: 'chat',
  props: ['eu', 'adversario', 'chatId', 'mensagens'],
  components: {
    vueDropzone: vue2Dropzone
  },
  data () {
    return {
      loading: false,
      params: {
        chat_id: null,
        from_id: null,
        to_id: null,
        mensagem: null,
        media: null
      },
      dropzoneOptions: {
        url: process.env.API_URL + 'upload',
        dictDefaultMessage: '<i class="fa fa-camera"></i>',
        previewsContainer: false,
        thumbnailWidth: 150,
        maxFilesize: 10,
        resizeWidth: 800,
        acceptedFiles: 'image/*'
      }
    }
  },
  watch: {
    'mensagens' () {
      // this.scroll()
    }
  },
  computed: {
    API_URL_STORAGE () {
      return process.env.API_URL_STORAGE
    }
  },
  methods: {
    syncMensagem (file, response) {
      this.params.media = response
      this.enviar()
      this.loading = false
    },
    fazendoUpload () {
      this.loading = true
    },
    async enviar () {
      if (this.params.mensagem === null && this.params.media === null) {
        return
      }

      this.params.chat_id = this.chatId
      this.params.from_id = this.eu.id
      this.params.to_id = this.adversario.id

      await this.$axios.post(`/mensagens`, this.params)

      this.params.mensagem = null
      this.params.media = null
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
  padding: 0 10px;
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
