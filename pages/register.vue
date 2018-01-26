<template>
  <div>
    <v-card>
      <v-card-text class="text-xs-center">
        <v-avatar :size="96" class="mb-3">
          <img :src="form.avatar" alt="avatar">
        </v-avatar>
        <v-form ref="form" lazy-validation>
          <v-select :items="jogos" label="Jogo" v-model="form.jogo_id" prepend-icon="album" item-text="nome" item-value="id" :error-messages="erros.jogo_id"></v-select>
          <v-select :items="plataformas" label="Plataforma" v-model="form.plataforma_id" prepend-icon="games" item-text="nome" item-value="id" :error-messages="erros.plataforma_id"></v-select>
          <v-text-field label="PSN ou GAMERTAG" v-model="form.identificador" prepend-icon="person" :error-messages="erros.identificador"></v-text-field>
          <v-btn block color="primary" @click="registrar" :loading="carregando">registrar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// import Avatar from '~/components/Avatar'

export default {
  // components: { Avatar },
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      erros: {},
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

    this.form.provider.avatar = this.$route.query.avatar
    this.form.provider.email = this.$route.query.email
    this.form.provider.provider = this.$route.query.provider
    this.form.provider.provider_id = this.$route.query.provider_id
    this.form.provider.provider_token = this.$route.query.provider_token

    this.form.email = this.$route.query.email
    this.form.avatar = this.$route.query.avatar
  },
  methods: {
    async registrar () {
      try {
        this.carregando = true
        await this.$axios.post(`/auth/register`, this.form)
        this.$router.replace({ path: '/auth', query: this.form.provider })
      } catch (error) {
        this.carregando = false
        this.erros = error.response.data.errors

        if (error.response.data.code === 0) {
          alert(error.response.data.message)
        }
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