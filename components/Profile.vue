<template>
  <div class="profile-container">
    <div class="has-text-centered">

      <avatar :imagem="user.avatar"></avatar>

      <p class="identificador">{{ user.identificador }}</p>
      <p class="posicao">
        <i class="fa fa-signal"></i>&nbsp;
        <span>{{ user.pontos }} º</span>
      </p>
      <!-- TODO usar posição -->
      <div class="categoria" v-if="user.jogo">
        <b-tag type="is-info">{{ user.jogo.nome }}</b-tag>
        <b-tag type="is-warning">{{ user.plataforma.nome }}</b-tag>
      </div>
      <div>
        <b-tag type="is-dark">V</b-tag>
        <b-tag type="is-success">{{ user.vitorias }}</b-tag> &nbsp;&nbsp;
        <b-tag type="is-dark">E</b-tag>
        <b-tag type="is-light">{{ user.empates }}</b-tag> &nbsp;&nbsp;
        <b-tag type="is-dark">D</b-tag>
        <b-tag type="is-danger">{{ user.derrotas }}</b-tag> &nbsp;&nbsp;
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
  padding-bottom: 30px;
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

.posicao {
  color: white;
}

.posicao span {
  font-weight: bold;
  font-size: 18pt;
}
</style>
