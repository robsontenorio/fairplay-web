<template>
  <div>
    <b-tooltip label="Resultado informado pelo jogador" type="is-dark" position="is-top" size="is-small" multilined>
      <span v-show="tag" class="tag" :class="tag">{{ resultado }}</span>
      <span v-show="!tag" class="tag is-empty">?</span>
    </b-tooltip>
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
          this.tag = 'is-light'
        } else if (detalhes.vencedor === 0) {
          resultado = 'empate'
          this.tag = 'is-dark'
        } else if (detalhes.vencedor === userId) {
          resultado = 'ganhei'
          this.tag = 'is-success'
        } else {
          resultado = 'perdi'
          this.tag = 'is-danger'
        }
      }

      return resultado
    }
  }
}
</script>
<style lang="scss" scoped>
.is-empty {
  border: 1px dashed #c0c0c0;
}

.tag {
  font-weight: bold;
}
</style>
