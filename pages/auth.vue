<template>
  <div class="text-xs-center pa-3">
    <br><br>
    <v-progress-circular indeterminate :size="100" color="primary"></v-progress-circular>
    <h2>Autenticando ...</h2>
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
        await this.$auth.loginWith('local', {
          data: this.form
        })
        this.$router.replace({ path: '/home' })
      } catch (error) {
        alert(error.response.data.error)
      }
    }
  }
}
</script>

<style  scoped>

</style>
