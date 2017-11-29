<template>
  <div>
    <section>
      <nav class="navbar is-primary">
        <div class="container is-fluid">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              <i class="fa fa-heart" style="color: #ff8f8f"></i> &nbsp;
              <strong> FAIR PLAY</strong>
            </a>

            <div class="navbar-burger burger" @click="showNav = !showNav" :class="{ 'is-active' : showNav }">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="navbar-menu" :class="{ 'is-active' : showNav }">
            <div class="navbar-start">
            </div>
            <div class="navbar-end">
              <nuxt-link class="navbar-item" to="/home">Home</nuxt-link>
              <nuxt-link class="navbar-item navbar-item-destacar" to="/buscar">
                <i class="fa fa-gamepad"></i> &nbsp; Jogar
              </nuxt-link>
              <nuxt-link v-show="!loggedIn" class="navbar-item" to="/login">Login</nuxt-link>
              <a class="navbar-item" href="###" v-show="loggedIn" @click="logout">Logout</a>
            </div>
          </div>
        </div>
      </nav>
    </section>
    <section class="content">
      <div class="container is-fuild">
        <div v-if="loggedIn">
          <strong>{{ user.identificador }}</strong>
        </div>
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
  data () {
    return {
      showNav: false
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    },
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