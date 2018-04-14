<template>
  <div>
    <v-card flat>
      <v-layout text-xs-center class="pt-3 mb-2 pb-2">
        <v-flex xs6 v-if="partida.user1">
          <v-avatar size="96" class="mb-2">
            <img :src="`${API_URL_STORAGE}/${partida.user1.avatar}`" />
          </v-avatar>
          <div>
            {{ partida.user1.identificador }}
          </div>
          <resposta-partida :partida="partida" :user="partida.user1"></resposta-partida>
        </v-flex>
        <v-flex xs6 v-if="partida.user1">
          <v-avatar size="96" class="mb-2">
            <img :src="`${API_URL_STORAGE}/${partida.user2.avatar}`" />
          </v-avatar>
          <div>
            {{ partida.user2.identificador }}
          </div>
          <resposta-partida :partida="partida" :user="partida.user2"></resposta-partida>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- TABS -->
    <v-tabs grow icons-and-text centered slider-color="blue-grey darken-3">
      <v-tab href="#tab-1">
        Instruções
        <v-icon>fa-book</v-icon>
      </v-tab>
      <v-tab href="#tab-2">
        Chat
        <v-icon>chat</v-icon>
      </v-tab>
      <v-tab href="#tab-3">
        Voto
        <v-icon>mode_edit</v-icon>
      </v-tab>
      <!-- INSTRUÇÕES -->
      <v-tab-item id="tab-1">
        <v-card flat>
          <v-card-text>
            <ul class="ml-3">
              <li>Nesta partida os jogadores informaram resultados divergentes.</li>
              <li>Analise o histórico da conversa no
                <strong>Chat</strong> e em seguida
                <strong>Vote</strong>.</li>
              <li>Você ganha pontos no ranking se o seu voto for correto.</li>
              <li>
                <strong>Vote com sabedoria.</strong>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- CHAT -->
      <v-tab-item id="tab-2">
        <v-card flat>
          <v-card-text>
            <chat :partida="partida" :mensagens="mensagens" :desativado="true"></chat>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- VOTAR -->
      <v-tab-item id="tab-3">
        <v-card flat>
          <v-card-text v-if="partida.user1">
            <v-alert type="warning" :value="true" class="mb-3">
              Qual o seu voto?
            </v-alert>
            <p>
              <v-btn block color="info" @click="votar(partida.user1_id)">{{ partida.user1.identificador }}</v-btn>
            </p>
            <p>
              <v-btn block color="info" @click="votar(partida.user2_id)">{{ partida.user2.identificador }}</v-btn>
            </p>
            <p>
              <v-btn block class="black white--text" @click="votar('empate')">Empate</v-btn>
            </p>
            <p>
              <v-btn block @click="votar('cancelamento')">Anular partida</v-btn>
            </p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Chat from '~/components/Chat'
import RespostaPartida from '~/components/RespostaPartida'
import Julgamento from '@/models/Julgamento'
import Partida from '@/models/Partida'

export default {
  middleware: 'auth',
  components: { Chat, RespostaPartida },

  data () {
    return {
      partida: {},
      julgamento: {},
      mensagens: []
    }
  },
  async mounted () {
    let id = this.$route.params.id

    this.julgamento = await Julgamento.find(id)
    this.partida = await Partida.find(this.julgamento.partida.id)
    this.partida.eu = this.partida.user1
    this.mensagens = await this.partida.mensagens().get()
  },
  methods: {
    recarregar () {
      location.reload()
    },
    async votar (valor) {
      if (!confirm('Seu voto não poderá ser modificado')) {
        return
      }

      try {
        this.julgamento.voto = valor
        await this.julgamento.save()
      } catch (error) {
        alert(error.response.data.message)
        return
      }

      this.$router.replace({ path: `/julgamentos` })
    }
  }
}
</script>

<style  scoped>
li {
  margin-bottom: 10px;
}
</style>