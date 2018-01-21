<template>
  <div>
    <v-card flat>
      <v-layout text-xs-center class="pt-3 mb-2 pb-2">
        <v-flex xs6 v-if="partida.user1">
          <v-avatar size="96" class="mb-2">
            <img :src="partida.user1.avatar" />
          </v-avatar>
          <div>
            {{ partida.user1.identificador }}
          </div>
          <resposta-partida :partida="partida" :user="partida.user1"></resposta-partida>
        </v-flex>
        <v-flex xs6 v-if="partida.user1">
          <v-avatar size="96" class="mb-2">
            <img :src="partida.user2.avatar" />
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
            <chat :eu="partida.user1" :adversario="partida.user2" :partidaId="partida.id" :mensagens="mensagens" :desativado="true"></chat>
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
import User from '~/components/User'
import Chat from '~/components/Chat'
import RespostaPartida from '~/components/RespostaPartida'

export default {
  middleware: 'auth',
  components: { User, Chat, RespostaPartida },

  data () {
    return {
      partida: {},
      julgamento: {},
      mensagens: []
    }
  },
  async mounted () {
    // let user = this.$store.state.auth.user
    let id = this.$route.params.id

    let response

    response = await this.$axios.get(`/julgamentos/${id}`)
    this.julgamento = response.data

    response = await this.$axios.get(`/partidas/${this.julgamento.partida.id}`)
    this.partida = response.data

    response = await this.$axios.get(`/partidas/${this.julgamento.partida.id}/mensagens`)
    this.mensagens = response.data
  },
  computed: {
  },
  methods: {
    recarregar () {
      location.reload()
    },
    async votar (valor) {
      try {
        if (!confirm('Seu voto não poderá ser modificado')) {
          return
        }

        let params = {
          voto: valor
        }

        await this.$axios.patch(`/julgamentos/${this.julgamento.id}`, params)
        this.$router.replace({ path: `/julgamentos` })
      } catch (error) {
        alert(error.response.data.message)
      }
    }
  }
}
</script>

<style  scoped>
li {
  margin-bottom: 10px;
}
</style>