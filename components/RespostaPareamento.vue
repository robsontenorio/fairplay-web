<template>
  <div>
    <div v-if="eu">
      <div v-show="!resposta">
        <button class="button is-success is-large" @click="responder(true)" :disabled="respondi">
          <i class="fa fa-check" />
        </button> &nbsp;
        <button class="button is-danger is-large" @click="responder(false)" :disabled="respondi">
          <i class="fa fa-times" />
        </button>
      </div>
      <div v-show="resposta">
        <resposta-desafio :resposta="resposta" />
        <button style="margin-top: 20px" class="button is-danger is-small is-outlined" @click="responder(false)">
          <i class="fa fa-times" /> &nbsp; desistir
        </button>
      </div>
    </div>
    <div v-if="adversario">
      <resposta-desafio :resposta="resposta" />
    </div>
  </div>
</template>
<script>
import RespostaDesafio from '~/components/RespostaDesafio'

export default {
  props: ['pareamento', 'eu', 'adversario'],
  components: { RespostaDesafio },
  data () {
    return {
      respondi: false
    }
  },
  computed:
  {
    resposta () {
      let resposta
      if (this.eu) {
        resposta = (this.eu.id === this.pareamento.user1_id) ? this.pareamento.user1_aceitou : this.pareamento.user2_aceitou
      } else {
        resposta = (this.adversario.id === this.pareamento.user1_id) ? this.pareamento.user1_aceitou : this.pareamento.user2_aceitou
      }

      return resposta
    }
  },
  methods: {
    responder (decisao) {
      if (decisao === true && !confirm('Ao aceitar o desafio você se compromente com os termos FAIR PLAY')) {
        return false
      }

      if (decisao === false && !confirm('Seu adversário ainda não respondeu. Deseja abandonar o confronto?')) {
        return false
      }

      this.respondi = true
      let user = (this.eu.id === this.pareamento.user1_id) ? 1 : 2

      user = 'user' + user + '_aceitou'

      let params = {
        [user]: decisao
      }

      this.$emit('respondeu', params)
    }
  }
}
</script>
<style  scoped>

</style>
