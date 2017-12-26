<template>
  <div class="has-text-centered">
    <div>
      <profile :user="user"></profile>
      <div class="temporadas">
        <b-select placeholder="Temporadas" icon="calendar" v-model="temporada_ativa.id" @input="carregarClassificacoes" expanded>
          <option v-for="temporada in temporadas" :value="temporada.id" :key="temporada.id">
            {{ temporada.nome }}
          </option>
        </b-select>
      </div>
      <div class="temporada">
        <classificacoes :user="user" :classificacoes="classificacoes"></classificacoes>
      </div>

      <small v-if="user.jogo">Sua colocação geral e estatísticas para
        <strong> {{ user.jogo.nome }} </strong>
        <strong>{{ user.plataforma.nome }}</strong>.
      </small>
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
      temporada_ativa: {},
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

    response = await this.$axios.get(`/temporadas/ativa`)
    this.temporada_ativa = response.data
  },
  methods: {
    async carregarClassificacoes (value) {
      alert(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.temporadas {
  margin-top: 30px;
}
</style>
