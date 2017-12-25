<template>
  <div>
    <b-field>
      <avatar class="has-text-centered" :imagem="form.avatar" size="128"></avatar>
    </b-field>
    <b-field>
      <b-select placeholder="Jogo" icon="bullseye" v-model="form.jogo_id" expanded>
        <option v-for="jogo in jogos" :value="jogo.id" :key="jogo.id">{{ jogo.nome }}</option>
      </b-select>
    </b-field>
    <b-field>
      <b-select placeholder="Plataforma" icon="gamepad" v-model="form.plataforma_id" expanded>
        <option v-for="plataforma in plataformas" :value="plataforma.id" :key="plataforma.id">{{ plataforma.nome }}</option>
      </b-select>
    </b-field>
    <b-field label="PSN / GAMERTAG">
      <b-input v-model="form.identificador" expanded></b-input>
    </b-field>
    <b-field>
      <button class="button is-primary is-fullwidth" :class="{'is-loading' : carregando}" expanded @click="registrar()">registrar</button>
    </b-field>
  </div>
</template>

<script>
import Avatar from '~/components/Avatar'

export default {
  components: { Avatar },
  data () {
    return {
      form: {
        identificador: null,
        email: null,
        avatar: null,
        plataforma_id: null,
        jogo_id: null,
        provider: {}
      },
      carregando: false,
      plataformas: [],
      jogos: []
    }
  },
  async asyncData ({ app, params }) {

  },
  async mounted () {
    this.$modal.open(`Preencha atentamente as informações. Caso você modifique posteriormente, seu histórico será reiniciado e você voltará para a última divisão da temporada.`)
    let response

    response = await this.$axios.get(`/plataformas`)
    this.plataformas = response.data

    response = await this.$axios.get(`/jogos`)
    this.jogos = response.data

    this.form.provider = this.$route.query
    this.form.email = this.$route.query.email
    this.form.avatar = this.$route.query.avatar
  },
  methods: {
    async registrar () {
      try {
        this.carregando = true
        await this.$axios.post(`/auth/register`, this.form)
        this.$router.replace({ path: '/auth', query: this.$route.query })
      } catch (error) {
        this.carregando = false
        this.$toast.open({
          message: error.response.data.errors,
          type: 'is-danger'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.field {
  margin-bottom: 20px;
}
</style>