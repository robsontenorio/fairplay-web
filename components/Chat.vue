<template>
  <div>
    <div class="chat-wrapper" ref="chatWrapper">
      <div v-if="desativado">
        <v-alert type="warning" :value="true" class="mb-3">
          Histórico da conversa
        </v-alert>
      </div>
      <div v-if="mensagens.length === 0" class="empty">
        <i class="fa fa-comments"></i> Conversas são publicas
      </div>
      <div class="messages-wrapper">
        <div v-for="mensagem in mensagens" :key="mensagem.id" class="message" :class="[mensagem.from_id === partida.eu.id ? 'to' : 'from']">
          <v-avatar size="32">
            <img :src="`${API_URL_STORAGE}/${mensagem.from.avatar}`">
          </v-avatar>
          <span v-if="mensagem.mensagem">
            {{ mensagem.mensagem }}
          </span>
          <span v-if="mensagem.media">
            <img class="imagem" :src="`${API_URL_STORAGE}/${mensagem.media}`" />
          </span>
        </div>
      </div>
    </div>
    <div class="mensagem-composer" v-if="!desativado">
      <v-layout>
        <v-flex xs1 class="pt-4">
          <vue-dropzone id="dropzone" :options="dropzoneOptions" @vdropzone-success="syncMensagem" @vdropzone-file-added="fazendoUpload" @vdropzone-sending="fazendoUpload"></vue-dropzone>
        </v-flex>
        <v-flex>
          <v-text-field ref="mensagem" v-model="params.mensagem" auto-grow multi-line :loading="loading" rows="1" label="Mensagem..." append-icon="send" :append-icon-cb="enviar" @keydown.enter.prevent></v-text-field>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
<script>
import vue2Dropzone from 'vue2-dropzone'

export default {

  props: ['partida', 'mensagens', 'desativado'],
  components: {
    vueDropzone: vue2Dropzone
  },
  data () {
    return {
      loading: false,
      params: {
        partida_id: null,
        from_id: null,
        to_id: null,
        mensagem: null,
        media: null
      },
      dropzoneOptions: {
        url: process.env.API_URL + '/upload',
        dictDefaultMessage: "<i class='fa fa-camera'></i>",
        previewsContainer: false,
        thumbnailWidth: 150,
        maxFilesize: 10,
        resizeWidth: 800,
        acceptedFiles: 'image/*'
      }
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
      this.$refs.mensagem.focus()

      if (this.params.mensagem === null && this.params.media === null) {
        return
      }

      this.params.partida_id = this.partida.id
      this.params.from_id = this.partida.eu.id
      this.params.to_id = this.partida.adversario.id

      let params = { ...this.params }

      this.$emit('enviarMensagem', params)

      this.params.mensagem = null
      this.params.media = null
    }
  }
}
</script>
<style  scoped>
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

.message .imagem {
  border-radius: 10px;
  padding-top: 5px;
  max-width: 100%;
}

.message.to + .message.to,
.message.from + .message.from {
  margin-top: -7px;
}

.mensagem-composer {
  margin-bottom: 100px;
}

.empty {
  color: silver;
  font-size: 14pt;
  text-align: center;
  margin-bottom: 50px;
  margin-top: 20px;
}
</style>
