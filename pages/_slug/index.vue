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

    let params = {
      identificador: identificador,
      includes: 'plataforma,jogo',
      appends: 'posicao'
    }

    let response

    response = await this.$axios.get(`/users`, { params })

    if (response.data.total === 0) {
      this.$router.replace({ path: '/' })
      return
    }

    this.user = response.data.data[0]

    if (this.user.id === this.eu.id) {
      params = {
        plataforma_id: this.user.plataforma_id,
        jogo_id: this.user.jogo_id,
        order_by: 'pontos,desc',
        limit: 50
      }

      this.$axios.get(`/temporadas/ladder`, { params }).then(response => {
        this.classificacoes_geral = response.data
        this.loading.classificacoes_geral = false
      })
    }

    this.$axios.get(`/temporadas/ultima`).then(response => {
      this.temporada_ultima = response.data
      this.carregarTemporada(this.temporada_ultima.id)
    })

    this.$axios.get(`/temporadas`).then(response => {
      this.temporadas = response.data
      this.loading.temporadas = false
    })

    params = {
      includes: 'user1,user2',
      order_by: 'created_at,desc'
    }
    this.$axios.get(`/users/${this.user.id}/partidas`, { params }).then(response => {
      this.historico = response.data.data
      this.loading.historico = false
    })
  },
  methods: {
    async carregarTemporada (value) {
      let params = {
        user_id: this.user.id,
        appends: 'posicao'
      }

      this.loading.eu_temporada = true
      this.$axios.get(`/temporadas/${value}/ladder`, { params }).then(response => {
        this.eu_temporada = response.data[0]
        this.loading.eu_temporada = false
      })

      if (this.user.id === this.eu.id) {
        params = {
          includes: 'user',
          plataforma_id: this.user.plataforma_id,
          jogo_id: this.user.jogo_id,
          order_by: 'pontos,desc',
          limit: 50
        }

        this.loading.classificacoes_temporada = true
        this.$axios.get(`/temporadas/${value}/ladder`, { params }).then(response => {
          this.classificacoes_temporada = response.data
          this.loading.classificacoes_temporada = false
        })
      }
    },
    verPerfil (value) {
      this.$router.push('/@' + value)
    },
    verPartida (partida) {
      this.$router.push(`partidas/${partida.id}`)
    }
  }
}
</script>

<style  scoped>
/* .tabs {
  margin-top: 30px;
}

.temporadas {
  margin-bottom: 20px;
}

h3 {
  margin-top: 20px !important;
} */
</style>
