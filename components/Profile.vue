<template>
  <div class="profile-container">
    <div class="has-text-centered">
      <avatar :imagem="user.avatar"></avatar>
      <p class="identificador">{{ user.identificador }}</p>
      <div class="categoria" v-if="user.jogo">
        <b-tag type="is-info">{{ user.jogo.nome }}</b-tag>
        <b-tag type="is-light">{{ user.plataforma.nome }}</b-tag>
      </div>
    </div>
  </div>
</template>
<script>

import Avatar from '~/components/Avatar'

export default {
  props: ['user'],
  components: { Avatar }
}
</script>
<style lang="scss" scoped>
.profile-container {
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
}
</style>
