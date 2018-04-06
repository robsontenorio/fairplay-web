<template>
  <div v-if="user.id">
    <profile :user="user"></profile>
    <v-tabs grow icons-and-text centered slider-color="blue-grey darken-3" class="mt-1">
      <v-tab href="#tab-1">
        Geral
        <v-icon>fa-globe</v-icon>
      </v-tab>
      <v-tab href="#tab-2">
        Temporadas
        <v-icon>event</v-icon>
      </v-tab>
      <v-tab href="#tab-3">
        Histórico
        <v-icon>access_time</v-icon>
      </v-tab>
      <!-- GERAL -->
      <v-tab-item id="tab-1">
        <v-card flat>
          <v-card-text>
            <pontuacao-jogador :objeto="user" class="mb-3"></pontuacao-jogador>
            <div v-if="user.id === eu.id">
              <v-subheader>TOP 50</v-subheader>
              <classificacoes :user="user" :classificacoes="classificacoes_geral" :loading="loading.classificacoes_geral" @perfilSelecionado="verPerfil"></classificacoes>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- TEMPORADAS -->
      <v-tab-item id="tab-2">
        <v-card flat>
          <v-card-text>
            <v-select :items="temporadas" :loading="loading.temporadas" v-model="temporada_ultima.id" item-text="nome" item-value="id" single-line bottom prepend-icon="event" @input="carregarTemporada" class="mb-2"></v-select>
            <pontuacao-jogador :objeto="eu_temporada" :loading="loading.eu_temporada" class="mb-3"></pontuacao-jogador>
            <div v-if="user.id === eu.id">
              <v-subheader>TOP 50</v-subheader>
              <classificacoes :user="user" :classificacoes="classificacoes_temporada" :loading="loading.classificacoes_temporada" @perfilSelecionado="verPerfil"></classificacoes>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- HISTÓRICO -->
      <v-tab-item id="tab-3">
        <v-card flat>
          <v-card-text>
            <v-subheader>TEMPORADA ATUAL</v-subheader>
            <historico-partidas :partidas="historico" :user="user" :loading="loading.historico" @partidaSelecionada="verPartida"></historico-partidas>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Profile from '~/components/Profile'
import Classificacoes from '~/components/Classificacoes'
import PontuacaoJogador from '~/components/PontuacaoJogador'
import HistoricoPartidas from '~/components/HistoricoPartidas'
import User from '@/models/User'
import Temporada from '@/models/Temporada'

export default {
  middleware: 'auth',
  components: { Profile, Classificacoes, PontuacaoJogador, HistoricoPartidas },
  data () {
    return {
      loading: {
        classificacoes_geral: true,
        classificacoes_temporada: true,
        eu_temporada: true,
        temporadas: true,
        historico: true
      },
      eu: {},
      user: {},
      temporadas: [],
      temporada_ultima: {},
      eu_temporada: {},
      classificacoes_temporada: [],
      classificacoes_geral: [],
      historico: []
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    this.eu = this.$store.state.auth.user

    let identificador = this.$route.params.slug.replace('@', '')

    this.user = await User
      .include('plataforma', 'jogo')
      .append('posicao')
      .where('identificador', identificador)
      .first()

    if (this.user.id === undefined) {
      this.$router.replace({ path: '/' })
      return
    }

    if (this.user.id === this.eu.id) {
      this.classificacoes_geral = await Temporada
        .custom('temporadas/ladder')
        .where('plataforma_id', this.user.plataforma_id)
        .where('jogo_id', this.user.jogo_id)
        .limit(50)
        .orderBy('-pontos', '-vitorias', '-empates', 'derrotas')
        .$get()

      this.loading.classificacoes_geral = false
    }

    this.temporada_ultima = await Temporada
      .custom('temporadas/ultima')
      .first()

    this.carregarTemporada(this.temporada_ultima.id)

    this.temporadas = await Temporada.get()

    this.loading.temporadas = false

    this.historico = await this.user
      .partidas()
      .include('user1', 'user2')
      .orderBy('-created_at')
      .$get()

    this.loading.historico = false
  },
  methods: {
    async carregarTemporada (value) {
      this.loading.eu_temporada = true

      let temporada = await new Temporada({ id: value })

      this.eu_temporada = await temporada
        .classificacoes()
        .append('posicao')
        .where('user_id', this.user.id)
        .$get()

      this.loading.eu_temporada = false

      if (this.user.id === this.eu.id) {
        this.loading.classificacoes_temporada = true

        this.classificacoes_temporada = await temporada
          .classificacoes()
          .include('user')
          .where('plataforma_id', this.user.plataforma_id)
          .where('jogo_id', this.user.jogo_id)
          .limit(50)
          .orderBy('-pontos', '-vitorias', '-empates', 'derrotas')
          .$get()

        this.loading.classificacoes_temporada = false
      }
    },
    verPerfil (value) {
      this.$router.push('/@' + value)
    },
    verPartida (partida) {
      // this.$router.push(`partidas/${partida.id}`)
    }
  }
}
</script>
