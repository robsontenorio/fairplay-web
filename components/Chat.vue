<template>
  <div>
    <div class="chat-wrapper" ref="chatWrapper">
      <div class="messages-wrapper">
        <div v-for="mensagem in mensagens" :key="mensagem.id" class="message" :class="[mensagem.from_id === eu.id ? 'to' : 'from']">
          <span v-if="mensagem.mensagem">
            {{ mensagem.mensagem }}
          </span>
          <span v-if="mensagem.media">
            <img :src="`${API_URL_STORAGE}/${mensagem.media}`" />
          </span>
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
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-wrapper {
  overflow-x: hidden;
  overflow-y: scroll;
}
.messages-wrapper {
  color: #ffffff;
}
.message {
  border-radius: 10px;
  margin: 0 15px 10px;
  padding: 5px 10px;
  font-size: 10pt;
  clear: both;
}
.message.to {
  background-color: #2095fe;
  color: #fff;
  float: right;
}
.message.from {
  background-color: #e5e4e9;
  color: #363636;
  float: left;
}

.message img {
  border-radius: 10px;
  padding-top: 5px;
}

.message.to + .message.to,
.message.from + .message.from {
  margin-top: -7px;
}

.mensagem-composer {
  margin-bottom: 100px;
}
</style>
