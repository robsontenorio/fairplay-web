<template>
  <div>
    <v-list two-line dense>
      <template v-for="partida in partidas">
        <v-divider></v-divider>
        <v-list-tile avatar :key="partida.id" @click="verPartida(partida)">
          <v-list-tile-avatar>
            <img v-bind:src="adversario(partida).avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <strong>{{ adversario(partida).identificador }}</strong>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <span :class="resultado(partida).cor">{{ resultado(partida).status }}</span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <span :class="resultado(partida).cor">
              <strong>{{ resultado(partida).pontos }}</strong>
            </span>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
    <div class="text-xs-center">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
      <span v-if="!loading && partidas.length === 0">Nenhuma partida recente</span>
    </div>
    <div v-if="partidas.length > 0" class="dark--text text-xs-center mt-3">
      Pontuações obtidas em partidas recentes.
    </div>
  </div>
</template>
<script>
export default {
  props: ['partidas', 'user', 'loading'],
  methods: {
    adversario (partida) {
      return (this.user.id === partida.user1_id) ? partida.user2 : partida.user1
    },
    resultado (partida) {
      let resultado = {
        status: '',
        pontos: '',
        cor: ''
      }

      if (partida.status === 'FINALIZADA') {
        if (partida.vencedor === 0) {
          resultado.status = 'EMPATE'
          resultado.pontos = '+1'
          resultado.cor = 'black--text'
        } else if (partida.vencedor === this.user.id) {
          resultado.status = 'VITÓRIA'
          resultado.pontos = '+5'
          resultado.cor = 'success--text'
        } else if (partida.vencedor === this.adversario(partida).id) {
          resultado.status = 'DERROTA'
          resultado.pontos = '-2'
          resultado.cor = 'red--text'
        }
      } else if (partida.status === 'JULGAMENTO') {
        resultado.status = 'EM JULGAMENTO'
        resultado.pontos = '--'
        resultado.cor = 'warning--text'
      } else if (partida.status === 'ANULADA') {
        resultado.status = 'ANULADA'
        resultado.pontos = '--'
        resultado.cor = 'dark--text'
      } else {
        resultado.status = 'Aguardando resultados'
        resultado.pontos = '--'
        resultado.cor = 'dark--text'
      }

      return resultado
    },
    verPartida (value) {
      this.$emit('partidaSelecionada', value)
    }
  }
}
</script>
<style lang="stylus"  scoped>
</style>
