<template>
  <div class="has-text-centered">
    <div v-show="procurando">
      <br><br>
      <img src="/spinner2.gif" width="100px">
      <br><br>
      <h3>Procurando adversário ... </h3>
      <br><br>
      <button class="button is-primary" @click="cancelar()">cancelar </button>
    </div>
    <div v-if="encontrado">
      <div class="columns is-gapless is-mobile has-text-centered">
        <div class="column">
          <div class="user-avatar ">
            <user :user="eu" size="128" />
          </div>
          <div>
            <resposta-pareamento :pareamento="pareamento" :eu="eu" @respondeu="responder" />
          </div>
        </div>
        <div class="column">
          <div class="user-avatar">
            <user :user="adversario" size="128" />
          </div>
          <div>
            <resposta-pareamento :pareamento="pareamento" :adversario="adversario" />
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
import RespostaPareamento from '~/components/RespostaPareamento'

export default {
  middleware: 'auth',
  components: { User, RespostaPareamento },
  data () {
    return {
      procurando: false,
      encontrado: false,
      pareamento: {}
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    let { data } = await this.$axios.get(`/partida`)

    if ((data !== '' && data.status === 'JOGANDO') || (data.status === 'RESULTADO' && data.detalhes[this.eu.id].vencedor === null)) {
      this.$router.replace({ path: '/partida' })
    } else {
      this.procurando = true
      let { data } = await this.$axios.post(`/pareamentos`)
      this.pareamento = data
      this.tratar()

      this.$echo.channel('pareamento-' + this.pareamento.id)
        .listen('.PareamentoAtualizadoEvent', (payload) => {
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
  beforeDestroy () {
    this.parar()
  },
  computed: {
    eu () {
      return this.$store.state.auth.user
    },
    adversario () {
      let adversario = null

      if (this.eu) {
        adversario = (this.eu.id === this.pareamento.user1_id) ? this.pareamento.user2 : this.pareamento.user1
      }

      return adversario
    }
  },
  methods: {
    async parar () {
      if (this.pareamento.id) {
        this.$echo.leave('pareamento-' + this.pareamento.id)
      }
    },
    async cancelar () {
      this.parar()
      await this.$axios.patch(`/pareamentos/${this.pareamento.id}`, { status: 'CANCELADO' })
      this.$router.replace({ path: '/home' })
    },
    async responder (params) {
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
        this.$snackbar.open({
          message: 'O desafio foi cancelado, pois um dos jogadores recusou o confronto.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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