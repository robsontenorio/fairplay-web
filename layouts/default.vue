<template>
  <div>
    <section>
      <nav class="navbar is-primary">
        <div class="container is-fluid">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              <i class="fa fa-bullseye"></i> &nbsp;
              <span style="font-weight: 300">ARENA</span>&nbsp;
              <strong> FAIRPLAY</strong>
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
            <div class="navbar-end" @click="showNav = !showNav">
              <nuxt-link class="navbar-item" to="/home" v-show="loggedIn">
                <i class="fa fa-user"></i> &nbsp; Meu perfil
              </nuxt-link>
              <nuxt-link class="navbar-item" to="/buscar">
                <i class="fa fa-play"></i> &nbsp; Jogar
              </nuxt-link>
              <nuxt-link class="navbar-item" to="/divisoes">
                <i class="fa fa-signal"></i> &nbsp; Divisões
              </nuxt-link>
              <nuxt-link class="navbar-item" to="/login" v-show="!loggedIn">
                <i class="fa fa-sign-in"></i> &nbsp; Entrar
              </nuxt-link>
              <a class="navbar-item" href="###" v-show="loggedIn" @click="logout">
                <i class="fa fa-power-off"></i> &nbsp; Sair
              </a>
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
    <!-- <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            ARENA
            <strong>FAIR PLAY</strong>
          </p>
        </div>
      </div>
    </footer> -->
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