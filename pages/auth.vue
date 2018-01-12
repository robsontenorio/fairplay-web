<template>
  <div class="has-text-centered">
    <br><br>
    <img src="/spinner2.gif" width="100px">
    <h2>Autenticando ...</h2>
  </div>
</template>

<script>

export default {
  data () {
    return {
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
        this.$router.push({ path: '/home' })
      } catch (error) {
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

<style  scoped>

</style>
