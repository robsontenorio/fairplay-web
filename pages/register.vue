<template>
  <div class="pa-3 text-xs-center">
    <v-avatar :size="96" class="mb-3">
      <img :src="form.avatar" alt="avatar">
    </v-avatar>
    <v-form ref="form" lazy-validation>
      <v-select :items="jogos" label="Jogo" v-model="form.jogo_id" prepend-icon="album" item-text="nome" item-value="id" required></v-select>
      <v-select :items="plataformas" label="Plataforma" v-model="form.plataforma_id" prepend-icon="games" item-text="nome" item-value="id" required></v-select>
      <v-text-field label="PSN ou GAMERTAG" v-model="form.identificador" required prepend-icon="person"></v-text-field>
      <v-btn block color="primary" @click="registrar" :loading="carregando">registrar</v-btn>
    </v-form>
    <v-snackbar multi-line color="red" :value="error"> {{ error }} </v-snackbar>
  </div>
</template>

<script>
// import Avatar from '~/components/Avatar'

export default {
  // components: { Avatar },
  data () {
    return {
      error: null,
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
    // this.$modal.open(`Preencha atentamente as informações. Caso você modifique posteriormente, seu histórico será perdido em todas as temporadas e você voltará para a última posição.`)
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
        this.error = error.response.data.errors
      }
    }
  }
}
</script>

<style  scoped>
.field {
  margin-bottom: 20px;
}
</style>