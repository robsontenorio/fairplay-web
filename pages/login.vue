<template>
  <div>
    <br><br>
    <div class="columns">
      <div class="column"></div>
      <div class="column">
        <h1>Login</h1>
        <b-field label="E-mail">
          <b-input v-model="email"></b-input>
        </b-field>
        <b-field label="Senha">
          <b-input type="password" v-model="password"></b-input>
        </b-field>
        <button class="button is-primary is-fullwidth" :class="{'is-loading' : loading}" @click.prevent="login">entrar</button>
      </div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loading: false,
      email: '',
      password: ''
    }
  },
  methods: {
    async login () {
      try {
        this.loading = true
        await this.$store.dispatch('auth/login', {
          fields: {
            email: this.email,
            password: this.password
          }
        })

        this.$router.push({ path: '/home' })
      } catch (error) {
        this.loading = false
        // console.log(error)
        this.$toast.open({
          message: error.response.data.error,
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
