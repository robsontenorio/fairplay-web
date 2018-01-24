<template>
  <div>
    <v-container text-xs-center px-2>
      <div v-show="procurando">

        <div>
          <v-progress-circular indeterminate :size="100" color="primary"></v-progress-circular>
        </div>

        <h3 class="mb-5">Procurando adversário ... </h3>
        <div>
          <v-btn block color="primary" @click="cancelar()">cancelar</v-btn>
        </div>

      </div>
      <div v-if="encontrado">
        <v-layout>
          <v-flex xs6>
            <v-avatar size="96" class="mb-3">
              <img :src="eu.avatar" />
            </v-avatar>
            <div class="mb-3">{{ eu.identificador }}</div>
            <resposta-pareamento :pareamento="pareamento" :eu="eu" @respondeu="responder" />
          </v-flex>
          <v-flex xs6>
            <v-avatar size="96" class="mb-3">
              <img :src="adversario.avatar" />
            </v-avatar>
            <div class="mb-3">{{ adversario.identificador }}</div>
            <resposta-pareamento :pareamento="pareamento" :adversario="adversario" />
          </v-flex>
        </v-layout>
        <br><br>
        <h2>Você está pronto?</h2>
        <small>Na tela seguinte você poderá conversar com o jogador antes de iniciar a partida.</small>
      </div>
    </v-container>
    <v-dialog persistent v-model="conexao.show">
      <v-card tile>
        <v-card-text>
          A conexão foi perdida ...
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="primary" flat @click.native="recarregar">reconectar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      user: {},
      procurando: false,
      encontrado: false,
      pareamento: {},
      conexao: {
        show: false
      }
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    this.user = this.$store.state.auth.user
    let { data } = await this.$axios.get(`/users/${this.user.id}/partidas?ultima`)

    if ((data !== '' && data.status === 'JOGANDO') || (data.status === 'RESULTADO' && data.detalhes[this.eu.id].vencedor === null)) {
      this.$router.replace({ path: `/partidas/${data.id}` })
    } else {
      this.procurando = true
      let response
      try {
        response = await this.$axios.post(`/pareamentos`)
      } catch (error) {
        alert(error.response.data.message)

        if (error.response.data.code === 702) {
          this.$router.replace({ path: '/julgamentos' })
        }
      }

      this.pareamento = response.data
      this.tratar()

      this.$echo.channel('pareamento-' + this.pareamento.id)
        .listen('.PareamentoAtualizadoEvent', (payload) => {
          this.pareamento = payload.pareamento
          this.tratar()
        })

      let socket = this.$echo.connector.socket
      let self = this
      socket.on('disconnect', function () {
        self.conexao.show = true
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
    recarregar () {
      location.reload()
    },
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
        let { data } = await this.$axios.get(`/users/${this.user.id}/partidas?ultima`)
        this.$router.replace({ path: `/partidas/${data.id}` })
      }

      if (this.pareamento.status === 'CANCELADO') {
        alert('O desafio foi cancelado, pois um dos jogadores recusou o confronto.')
        this.$router.replace({ path: '/home' })
      }
    }
  }
}
</script>

<style  scoped>
/* .user-avatar {
  margin-bottom: 20px;
}

.user-avatar img {
  width: 96px !important;
}

h2 {
  font-size: 14pt;
  font-weight: bold;
  margin-top: 0px !important;
} */
</style>