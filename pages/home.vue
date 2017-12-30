<template>
  <div class="has-text-centered">
    <div>
      <profile :user="user"></profile>
      <div class="tabs">
        <b-tabs size="is-small" position="is-centered" expanded>
          <b-tab-item label="Geral" icon="list">
            <div v-if="user.jogo">
              <pontuacao-jogador :objeto="user"></pontuacao-jogador>
              <classificacoes :user="user" :classificacoes="classificacoes_geral"></classificacoes>
              <br><br>
              <small>Mostrando os 100 melhores</small>
            </div>
          </b-tab-item>
          <b-tab-item label="Temporadas" icon="calendar">
            <div class="temporadas">
              <b-field>
                <b-select placeholder="Temporadas" icon="calendar" v-model="temporada_ultima.id" @input="carregarClassificacoes" expanded>
                  <option v-for="temporada in temporadas" :value="temporada.id" :key="temporada.id">
                    {{ temporada.nome }}
                  </option>
                </b-select>
              </b-field>
            </div>
            <div class="temporada">
              <pontuacao-jogador :objeto="eu_temporada"></pontuacao-jogador>
              <classificacoes :user="user" :classificacoes="classificacoes_temporada"></classificacoes>
              <br><br>
              <small>Mostrando os 100 melhores</small>
            </div>
          </b-tab-item>
          <b-tab-item label="Resumo" icon="clock-o">
            posição em cada temporada
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Profile from '~/components/Profile'
import Classificacoes from '~/components/Classificacoes'
import PontuacaoJogador from '~/components/PontuacaoJogador'

export default {
  middleware: 'auth',
  components: { Profile, Classificacoes, PontuacaoJogador },
  data () {
    return {
      user: {},
      temporadas: [],
      temporada_ultima: {},
      classificacoes_temporada: [],
      classificacoes_geral: []
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
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
      includes: 'user',
      plataforma_id: this.user.plataforma_id,
      jogo_id: this.user.jogo_id,
      order_by: 'pontos,desc',
      limit: 100
    }

    response = await this.$axios.get(`/temporadas/ladder`, { params })
    this.classificacoes_geral = response.data
  },
  computed: {
    eu_temporada () {
      return this.classificacoes_temporada.find(x => {
        return x.user_id === this.user.id
      })
    }
  },
  methods: {
    async carregarClassificacoes (value) {
      let loading = this.$loading.open()

      let params = {
        includes: 'user',
        plataforma_id: this.user.plataforma_id,
        jogo_id: this.user.jogo_id,
        order_by: 'pontos,desc',
        limit: 100
      }

      let response

      response = await this.$axios.get(`/temporadas/${this.temporada_ultima.id}/ladder`, { params })
      this.classificacoes_temporada = response.data

      loading.close()
    }
  }
}
</script>

<style lang="scss" scoped>
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
