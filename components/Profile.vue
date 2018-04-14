<template>
  <div>
    <v-card flat>
      <v-card-media :src="`${API_URL_STORAGE}/${user.avatar}`" height="300px"></v-card-media>
      <v-card-title class="pr-1">
        <v-flex xs7>
          <div class="title">
            {{ user.identificador }}
          </div>
        </v-flex>
        <v-flex xs5 class="text-xs-right">
          <span v-if="user.jogo">
            <v-chip small text-color="white" color="mr-0 blue-grey darken-3">{{ user.jogo.nome }}</v-chip>
            <v-chip small text-color="white" color="blue-grey lighten-3">{{ user.plataforma.nome }}</v-chip>
          </span>
        </v-flex>
      </v-card-title>
    </v-card>
  </div>
</template>
<script>

// import Avatar from '~/components/Avatar'

export default {
  props: ['user']
}
</script>
<style  scoped>
/* .profile-container {
  margin: -20px -10px;
  background-image: url("/static/profile-background.jpg");
  background-size: cover;
  padding-top: 30px;
  padding-bottom: 10px;
}

.profile-container p {
  margin-bottom: 10px !important;
}

.categoria {
  margin-bottom: 20px;
}

.identificador {
  color: white;
  font-weight: bold;
  font-size: 18pt;
} */
</style>
