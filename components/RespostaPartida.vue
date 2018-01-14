<template>
  <div>
    <v-tooltip top>
      <v-btn slot="activator" flat small v-if="resultado" :ripple="false" :color="tag">{{ resultado }}</v-btn>
      <span>Resultado informado pelo jogador</span>
    </v-tooltip>
    <v-tooltip top>
      <v-chip v-if="!resultado" slot="activator" small :ripple="false">---</v-chip>
      <span>Resultado informado pelo jogador</span>
    </v-tooltip>
  </div>
</template>
<script>
export default {
  props: ['partida', 'user'],
  data () {
    return {
      tag: null
    }
  },
  computed:
  {
    resultado () {
      let resultado = null

      if (this.partida.detalhes) {
        resultado = this.parseResultado(this.partida.detalhes[this.user.id], this.user.id)
      }

      return resultado
    }
  },
  methods: {
    parseResultado (detalhes, userId) {
      let resultado = null

      if (detalhes.vencedor !== null) {
        if (detalhes.vencedor === -1) {
          resultado = 'cancelamento'
          this.tag = 'default'
        } else if (detalhes.vencedor === 0) {
          resultado = 'empate'
          this.tag = 'default'
        } else if (detalhes.vencedor === userId) {
          resultado = 'ganhei'
          this.tag = 'success'
        } else {
          resultado = 'perdi'
          this.tag = 'error'
        }
      }

      return resultado
    }
  }
}
</script>
<style  scoped>
/* .is-empty {
  border: 1px dashed #c0c0c0;
}

.tag {
  font-weight: bold;
  padding: 0px 5px;
  border-radius: 10px;
} */
</style>
