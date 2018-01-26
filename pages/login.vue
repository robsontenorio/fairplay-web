<template>
  <div class="text-xs-center pa-3">
    <div v-if="!loading">
      <v-btn block color="blue" class="white--text mb-3" :disabled="loading" @click="login('facebook')">
        <v-icon dark left>fa-facebook</v-icon>
        Facebook
      </v-btn>
      <v-btn block color="red" class="white--text" :disabled="loading" @click="login('google')">
        <v-icon dark left>fa-google</v-icon>
        Google
      </v-btn>
      <br> Acesse sempre usando o mesmo provedor, caso contrário uma conta nova será criada no FAIRPLAY, se elas possuirem e-mails diferentes.
    </div>
    <div v-if="loading">
      <v-progress-circular indeterminate :size="100" color="primary"></v-progress-circular>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    if (this.$store.getters['auth/loggedIn']) {
      this.$router.replace({ path: '/home' })
    }
    // if (this.$route.query.ipx === undefined) {
    //   alert('Em breve')
    //   this.$router.replace({ path: '/' })
    // }
  },
  methods: {
    async login (provider) {
      this.loading = true
      window.location = process.env.API_URL + 'auth/social/login?provider=' + provider
    }
  }
}
</script>

<style  scoped>
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
