<template>
  <div class="text-xs-center pa-3">
    <br><br>
    <img src="/spinner2.gif" width="100px">
    <h2>Autenticando ...</h2>

    <v-snackbar color="red" :value="error"> {{ error }} </v-snackbar>
  </div>
</template>

<script>

export default {
  data () {
    return {
      error: null,
      form: {
        provider: {}
      }
    }
  },
  mounted () {
    this.form.provider = this.$route.query
    this.login()
  },
  methods: {
    async login () {
      try {
        await this.$store.dispatch('auth/login', {
          fields: this.form
        })
      } catch (error) {
        this.error = error.response.data.error
      }
      this.$router.replace({ path: '/home' })
    }
  }
}
</script>

<style  scoped>

</style>
