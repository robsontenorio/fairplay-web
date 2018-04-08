<template>
  <div>
    --> {{ resposta }}
    <div v-if="jogador === 'eu'">
      <div v-show="!resposta">
        <v-btn block class="success mb-3" @click="responder(true)" :disabled="respondi">
          <v-icon>check</v-icon> aceitar
        </v-btn>
        <v-btn block class="error" @click="responder(false)" :disabled="respondi">
          <v-icon>close</v-icon> desistir
        </v-btn>
      </div>
      <div v-show="resposta">
        <resposta-desafio :resposta="resposta" />
        <v-btn class="error" @click="responder(false)">
          <v-icon>close</v-icon> desistir
        </v-btn>
      </div>
    </div>
    <div v-else>
      <resposta-desafio :resposta="resposta" />
    </div>
  </div>
</template>
<script>
import RespostaDesafio from '~/components/RespostaDesafio'

export default {
  props: ['pareamento', 'jogador'],
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
        if (this.jogador === 'eu') {
          resposta = (this.pareamento.eu.id === this.pareamento.user1_id) ? this.pareamento.user1_aceitou : this.pareamento.user2_aceitou
        } else {
          resposta = (this.pareamento.adversario.id === this.pareamento.user1_id) ? this.pareamento.user1_aceitou : this.pareamento.user2_aceitou
        }

        return resposta
      }
    },
  methods: {
    responder (decisao) {
      if (decisao === true && !confirm('Ao aceitar o desafio você se compromete com os termos FAIR PLAY')) {
        return false
      }

      if (decisao === false && !confirm('Seu adversário ainda não respondeu. Deseja abandonar o confronto?')) {
        return false
      }

      this.respondi = true
      let user = (this.pareamento.eu.id === this.pareamento.user1_id) ? 1 : 2

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
