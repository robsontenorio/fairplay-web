<template>
  <v-app>
    <div class="hidden-xs-only text-xs-center mt-5">
      <br><br>
      <v-icon large>phone_iphone</v-icon>
      <h3 class="mt-3">Disponível somente para dispositivos móveis.</h3>
    </div>
    <div class="hidden-sm-and-up">
      <v-navigation-drawer v-model="drawer" app>
        <v-list>
          <div v-if="loggedIn">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="`${API_URL_STORAGE}/${user.avatar}`" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ user.identificador }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile router to="/home">
              <v-list-tile-action>
                <v-icon>person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Meu perfil</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile router to="/buscar">
              <v-list-tile-action>
                <v-icon>play_arrow</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Jogar</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile router to="/ajuda">
              <v-list-tile-action>
                <v-icon>help</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Ajuda</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="logout">
              <v-list-tile-action>
                <v-icon>power_settings_new</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Sair</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>
          <v-list-tile router to="/login" v-if="!loggedIn">
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Entrar</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app absolute dense flat dark color="blue-grey darken-1">
        <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title><img style="vertical-align: middle" height="25px" src="~/static/fairplay.png"></v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container class="py-2 px-2">
          <nuxt />
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    },
    API_URL_STORAGE () {
      return process.env.API_URL_STORAGE
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