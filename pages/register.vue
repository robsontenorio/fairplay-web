<template>
  <div>
    <b-field>
      <b-select placeholder="Jogo" icon="plus" v-model="form.jogo_id" expanded>
        <option v-for="jogo in jogos" :value="jogo.id" :key="jogo.id">{{ jogo.nome }}</option>
      </b-select>
    </b-field>
    <b-field>
      <b-select placeholder="Plataforma" icon="user" v-model="form.plataforma_id" expanded>
        <option v-for="plataforma in plataformas" :value="plataforma.id" :key="plataforma.id">{{ plataforma.nome }}</option>
      </b-select>
    </b-field>
    <b-field label="TAG">
      <b-input v-model="form.identificador" expanded></b-input>
    </b-field>
    <b-field>
      <button class="button is-primary" expanded @click="registrar()">registrar</button>
    </b-field>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        identificador: null,
        email: null,
        plataforma_id: null,
        jogo_id: null,
        provider: {}
      },
      plataformas: [],
      jogos: []
    }
  },
  async asyncData ({ app, params }) {

  },
  async mounted () {
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
        await this.$axios.post(`/auth/register`, this.form)
        this.$router.replace({ path: '/auth', query: this.$route.query })
      } catch (error) {
        this.$toast.open({
          message: error.response.data.errors,
          type: 'is-danger'
        })
      }
    }
  }
}
</script>