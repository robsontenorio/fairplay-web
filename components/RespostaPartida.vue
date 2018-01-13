<template>
  <div>
    R?
    <!-- <b-tooltip label="Resultado informado pelo jogador" type="is-dark" position="is-top" size="is-small" multilined>
      <button v-show="tag" class="button tag" :class="tag">{{ resultado }}</button>
      <button v-show="!tag" class="button tag is-empty">?</button>
    </b-tooltip> -->
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
