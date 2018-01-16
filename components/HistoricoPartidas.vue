<template>
  <div>
    <v-list dense two-line>
      <template v-for="partida in partidas">
        <v-divider></v-divider>
        <v-list-tile dense avatar :key="partida.id" @click="verPerfil(adversario(partida).identificador)">
          <v-list-tile-avatar>
            <img v-bind:src="adversario(partida).avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ adversario(partida).identificador }} </v-list-tile-title>
            <v-list-tile-sub-title>{{ resultado(partida).status }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <span :class="resultado(partida).cor">
              <strong>{{ resultado(partida).pontos }}</strong>
            </span>
          </v-list-tile-action>
        </v-list-tile>
        </v-list-tile>
      </template>
    </v-list>
  </div>
</template>
<script>
export default {
  props: ['partidas', 'user'],
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

      if (partida.vencedor === 0) {
        resultado.status = 'EMPATE'
        resultado.pontos = '+1'
        resultado.cor = 'dark--text'
      } else if (partida.vencedor === this.user.id) {
        resultado.status = 'VITÓRIA'
        resultado.pontos = '+5'
        resultado.cor = 'success--text'
      } else if (partida.vencedor === this.adversario(partida).id) {
        resultado.status = 'DERROTA'
        resultado.pontos = '-2'
        resultado.cor = 'red--text'
      } else if (partida.vencedor === null) {
        resultado.status = 'PENDENTE'
        resultado.pontos = '--'
        resultado.cor = 'dark--text'
      }

      return resultado
    },
    pontos (partida) {
      return '+5'
    },
    verPerfil (value) {
      this.$emit('perfilSelecionado', value)
    }
  }
}
</script>
<style lang="stylus"  scoped>
</style>
