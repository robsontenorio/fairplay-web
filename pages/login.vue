<template>
  <div class="text-xs-center">
    <v-btn color="blue" @click="login('facebook')">
      <v-icon dark>facebook-box</v-icon>
      Facebook
    </v-btn>
    <v-btn color="red" @click="login('google')">
      <v-icon dark>google</v-icon>
      Google
    </v-btn>
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
