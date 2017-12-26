<template>
  <div class="has-text-centered">
    <h1>ENTRAR</h1>
    <br>
    <b-field>
      <a class="button facebook is-fullwidth" @click="login('facebook')">
        <span class="icon">
          <i class="fa fa-facebook"></i>
        </span>
        <span>Facebook</span>
      </a>
    </b-field>
    <b-field>
      <a class="button google is-fullwidth" @click="login('google')">
        <span class="icon">
          <i class="fa fa-google"></i>
        </span>
        <span>Google</span>
      </a>
    </b-field>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  mounted () {
    if (this.$store.getters['auth/loggedIn']) {
      this.$router.replace({ path: '/home' })
    }
  },
  methods: {
    async login (provider) {
      this.$loading.open()
      window.location = process.env.API_URL + 'auth/social/login?provider=' + provider
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  color: white;
}

.facebook {
  background: #5b7bd5;
}
.google {
  background: #dd4b39;
}
</style>
