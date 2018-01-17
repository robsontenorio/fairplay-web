<template>
  <div>
    <v-list dense two-line>
      <template v-for="(item, index) in classificacoes">
        <v-divider :key="index"></v-divider>
        <v-list-tile avatar :key="item.id" @click="verPerfil(item.identificador || item.user.identificador)">
          <v-list-tile-avatar>
            <img :src="item.avatar || item.user.avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <strong>{{ item.identificador || item.user.identificador }}</strong>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{ item.pontos }}P&nbsp; {{ item.vitorias }}V&nbsp; {{ item.empates }}E&nbsp; {{ item.derrotas }}D&nbsp;
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <strong>{{ index + 1 }}</strong>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
    <div class="text-xs-center">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
      <span v-if="!loading && classificacoes.length === 0">Nenhum jogador pontuou</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['classificacoes', 'user', 'loading'],
  methods: {
    verPerfil (value) {
      this.$emit('perfilSelecionado', value)
    }
  }

}
</script>
<style lang="stylus"  scoped>
</style>
