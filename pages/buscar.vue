<template>
  <div class="has-text-centered">
    <div v-show="procurando">
      <img src="/spinner.gif" />
      <h2>Procurando adversário ... </h2>
      <button class="button is-primary" @click="cancelar()">cancelar </button>
    </div>
    <div v-if="encontrado">
      <div class="columns is-gapless is-mobile has-text-centered">
        <div class="column">
          <div class="user-avatar ">
            <user :user="pareamento.user1" size="128"></user>
          </div>
          <div v-show="pareamento.user1.id == user.id">
            <div v-show="!pareamento.user1_aceitou">
              <button class="button is-success is-large" @click="responder(true)" :disabled="respondeu">
                <i class="fa fa-check"></i>
              </button> &nbsp;
              <button class="button is-danger is-large" @click="responder(false)" :disabled="respondeu">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <resposta-desafio :resposta="pareamento.user1_aceitou" v-show="pareamento.user1_aceitou"></resposta-desafio>
            <button style="margin-top: 20px" class="button is-danger is-small is-outlined" @click="responder(false)" v-show="pareamento.user1_aceitou">
              <i class="fa fa-times"></i> &nbsp; desistir
            </button>
          </div>
          <div v-show="pareamento.user2.id == user.id">
            <resposta-desafio :resposta="pareamento.user1_aceitou"></resposta-desafio>
          </div>
        </div>
        <div class="column">
          <div class="user-avatar">
            <user :user="pareamento.user2" size="128"></user>
          </div>
          <div v-show="pareamento.user2.id == user.id">
            <div v-show="!pareamento.user2_aceitou">
              <button class="button is-success is-large" @click="responder(true)" :disabled="respondeu">
                <i class="fa fa-check"></i>
              </button> &nbsp;
              <button class="button is-danger is-large" @click="responder(false)" :disabled="respondeu">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <resposta-desafio :resposta="pareamento.user2_aceitou" v-show="pareamento.user2_aceitou"></resposta-desafio>
            <button style="margin-top: 20px" class="button is-danger is-small is-inverted" @click="responder(false)" v-show="pareamento.user2_aceitou">
              <i class="fa fa-times"></i> &nbsp; desistir
            </button>
          </div>
          <div v-show="pareamento.user1.id == user.id">
            <resposta-desafio :resposta="pareamento.user2_aceitou"></resposta-desafio>
          </div>
        </div>
      </div>
      <br><br>
      <h2>Você está pronto?</h2>
      <small>Na tela seguinte você poderá conversar com o jogador antes de iniciar a partida.</small>
    </div>
  </div>
</template>

<script>

import User from '~/components/User'
import RespostaDesafio from '~/components/RespostaDesafio'

export default {
  middleware: 'auth',
  components: { User, RespostaDesafio },
  data () {
    return {
      procurando: false,
      encontrado: false,
      respondeu: false,
      pareamento: {}
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    let { data } = await this.$axios.get(`/partida`)

    if (data !== '' && data.status === 'JOGANDO') {
      this.$router.replace({ path: '/partida' })
    } else {
      this.procurando = true
      let { data } = await this.$axios.post(`/pareamentos`)
      this.pareamento = data
      this.tratar()

      this.$echo.channel('pareamento-' + this.pareamento.id)
        .listen('.PareamentoAtualizadoEvent', (payload) => {
          console.log(payload.pareamento)
          this.pareamento = payload.pareamento
          this.tratar()
        })

      let socket = this.$echo.connector.socket
      socket.on('disconnect', function () {
        alert('Reconectando ...')
        location.reload()
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    async cancelar () {
      await this.$axios.patch(`/pareamentos/${this.pareamento.id}`, { status: 'CANCELADO' })
      this.$router.replace({ path: '/home' })
    },
    responder (decisao) {
      if (decisao === true && !confirm('Ao aceitar o desafio você se compromente com os termos FAIR PLAY')) {
        return false
      }

      if (decisao === false && !confirm('Seu adversário ainda não respondeu. Deseja abandonar o confronto?')) {
        return false
      }

      this.respondeu = true
      let user = (this.user.id === this.pareamento.user1_id) ? 1 : 2
      user = 'user' + user + '_aceitou'

      let params = {
        [user]: decisao
      }

      this.$axios.patch(`/pareamentos/${this.pareamento.id}`, params)
    },
    async tratar () {
      if (this.pareamento.status === 'MATCH') {
        this.encontrado = true
        this.procurando = false
      }

      if (this.pareamento.status === 'SUCESSO') {
        this.$router.replace({ path: '/partida' })
      }

      if (this.pareamento.status === 'CANCELADO') {
        this.$router.replace({ path: '/home' })
        this.$toast.open({
          message: 'O desafio foi cancelado, pois um dos jogadores recusou o confronto.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
    }
  }
}
</script>

<style scoped>
.user-avatar {
  margin-bottom: 20px;
}

.user-avatar img {
  width: 96px !important;
}

h2 {
  font-size: 14pt;
  font-weight: bold;
  margin-top: 0px !important;
}
</style>