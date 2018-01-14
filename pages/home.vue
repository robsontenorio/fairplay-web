<template>
  <div>
    <profile :user="user"></profile>
    <!-- <v-progress-linear class="ma-0" height="2" v-bind:indeterminate="loading"></v-progress-linear> -->
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
            <classificacoes :user="user" :classificacoes="classificacoes_geral"></classificacoes>
            <div v-if="classificacoes_geral === 100">Mostrando os 100 melhores</div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- TEMPORADAS -->
      <v-tab-item id="tab-2">
        <v-card flat>
          <v-card-text>
            <pontuacao-jogador :objeto="eu_temporada" class="mb-3"></pontuacao-jogador>
            <v-select :items="temporadas" v-model="temporada_ultima.id" item-text="nome" item-value="id" single-line bottom prepend-icon="event" @input="carregarTemporada" class="mb-2"></v-select>
            <classificacoes :user="user" :classificacoes="classificacoes_temporada"></classificacoes>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- HISTÓRICO -->
      <v-tab-item id="tab-3">
        <v-card flat>
          <v-card-text>
            {{ historico }}
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
import HistoricoJogador from '~/components/HistoricoJogador'

export default {
  middleware: 'auth',
  components: { Profile, Classificacoes, PontuacaoJogador, HistoricoJogador },
  data () {
    return {
      loading: false,
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
    this.loading = true

    let user = await this.$store.state.auth.user

    let params = {
      includes: 'plataforma,jogo',
      appends: 'posicao'
    }

    let response

    response = await this.$axios.get(`/users/${user.id}`, { params })
    this.user = response.data

    response = await this.$axios.get(`/temporadas`)
    this.temporadas = response.data

    response = await this.$axios.get(`/temporadas/ultima`)
    this.temporada_ultima = response.data

    params = {
      plataforma_id: this.user.plataforma_id,
      jogo_id: this.user.jogo_id,
      order_by: 'pontos,desc',
      limit: 100
    }

    response = await this.$axios.get(`/temporadas/ladder`, { params })
    this.classificacoes_geral = response.data

    params = {
      order_by: 'created_at,desc'
    }
    response = await this.$axios.get(`/users/${this.user.id}/partidas`, { params })
    this.historico = response.data

    this.carregarTemporada(this.temporada_ultima.id)

    this.loading = false
  },
  methods: {
    async carregarTemporada (value) {
      this.loading = true

      let params = {
        user_id: this.user.id,
        appends: 'posicao'
      }

      let response

      this.$axios.get(`/temporadas/${value}/ladder`, { params }).then(response => {
        this.eu_temporada = response.data[0]
      })

      params = {
        includes: 'user',
        plataforma_id: this.user.plataforma_id,
        jogo_id: this.user.jogo_id,
        order_by: 'pontos,desc',
        limit: 100
      }

      response = await this.$axios.get(`/temporadas/${value}/ladder`, { params })
      this.classificacoes_temporada = response.data

      this.loading = false
    }
  }
}
</script>

<style  scoped>
.tabs {
  margin-top: 30px;
}

.temporadas {
  margin-bottom: 20px;
}

h3 {
  margin-top: 20px !important;
}
</style>
