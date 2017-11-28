<template>
  <div>
    <section>
      <nav class="navbar is-primary">
        <div class="container is-fluid">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              <i class="fa fa-database"></i> &nbsp;
              <strong>Arena Fair Play</strong>
            </a>

            <div class="navbar-burger burger" data-target="navMenuTransparentExample">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="navbar-menu">
            <div class="navbar-start">
              <nuxt-link class="navbar-item" to="/home">Home</nuxt-link>
            </div>
            <div class="navbar-end">
              <nuxt-link v-show="!loggedIn" class="navbar-item" to="/login">Login</nuxt-link>
              <a class="navbar-item" href="###" v-show="loggedIn" @click="logout">Logout</a>
            </div>
          </div>
        </div>
      </nav>
    </section>
    <section class="content">
      <div class="container is-fuild">
        <nuxt/>
      </div>
    </section>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            ARENA
            <strong>FAIR PLAY</strong>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  computed: {
    loggedIn () {
      return this.$store.getters['auth/loggedIn']
      // return true
    }
  },
  methods: {
    async logout () {
      await this.$store.dispatch('auth/logout')
      this.$router.push({ path: '/' })
    }
  }
}
</script>