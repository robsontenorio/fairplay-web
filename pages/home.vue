<template>
  <div class="has-text-centered">
    <div>
      <profile :user="user"></profile>
      <div class="tabs">
        <b-tabs size="is-small" type="is-toggle" position="is-centered" expanded>
          <b-tab-item label="Geral" icon="list">
            <div v-if="user.jogo">
              <p class="posicao">
                <b-tag type="is-warning">
                  <i class="fa fa-line-chart"></i>&nbsp;
                  <small>geral</small>
                </b-tag>
                <b-tag type="is-dark">{{ user.posicao }} °</b-tag>
                &nbsp;&nbsp;

                <!-- <i class="fa fa-line-chart"></i>&nbsp;
                <span>{{ user.posicao }}</span> posição &nbsp; &nbsp;
                <i class="fa fa-star"></i>
                <span> {{ user.pontos }} </span> pontos -->
              </p>

              <p class="pontuacoes">
                <b-tag type="is-info">P</b-tag>
                <b-tag type="is-dark">{{ user.pontos }}</b-tag>&nbsp;
                <b-tag type="is-success">V</b-tag>
                <b-tag type="is-dark">{{ user.vitorias }}</b-tag>&nbsp;
                <b-tag type="is-light">E</b-tag>
                <b-tag type="is-dark">{{ user.empates }}</b-tag>&nbsp;
                <b-tag type="is-danger">D</b-tag>
                <b-tag type="is-dark">{{ user.derrotas }}</b-tag>&nbsp;
              </p>

            </div>
          </b-tab-item>
          <b-tab-item label="Temporadas" icon="calendar">
            <div class="temporadas">
              <b-select placeholder="Temporadas" icon="calendar" v-model="temporada_ultima.id" @input="carregarClassificacoes" expanded>
                <option v-for="temporada in temporadas" :value="temporada.id" :key="temporada.id">
                  {{ temporada.nome }}
                </option>
              </b-select>
            </div>
            <div class="temporada">
              <classificacoes :user="user" :classificacoes="classificacoes"></classificacoes>
            </div>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Profile from '~/components/Profile'
import Classificacoes from '~/components/Classificacoes'

export default {
  middleware: 'auth',
  components: { Profile, Classificacoes },
  data () {
    return {
      user: {},
      temporadas: [],
      temporada_ultima: {},
      classificacoes: []
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    let user = await this.$store.state.auth.user
    let params = {
      includes: 'plataforma,jogo'
    }
    let response
    response = await this.$axios.get(`/users/${user.id}`, { params })
    this.user = response.data

    response = await this.$axios.get(`/temporadas`)
    this.temporadas = response.data

    response = await this.$axios.get(`/temporadas/ultima`)
    this.temporada_ultima = response.data
  },
  methods: {
    async carregarClassificacoes (value) {
      let params = {
        includes: 'user',
        plataforma_id: this.user.plataforma_id,
        jogo_id: this.user.jogo_id,
        order_by: 'posicao,asc'
      }
      let { data } = await this.$axios.get(`/temporadas/${this.temporada_ultima.id}/ladder`, { params })
      this.classificacoes = data
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  margin-top: 30px;
}

.posicao {
  color: #888;
}

.posicao span {
  font-weight: bold;
  font-size: 14pt;
}

.tag:not(body).is-light {
  border: 1px solid #c0c0c0;
}
</style>
