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
        <br><br> Somente aceite o desafio caso você possa jogar a partida
        <strong>neste momento</strong>. Caso contrário poderá ser punido no julgamento.
      </div>
      <div v-if="encontrado">
        <v-layout>
          <v-flex xs6>
            <v-avatar size="96" class="mb-3">
              <img :src="`${API_URL_STORAGE}/${eu.avatar}`" />
            </v-avatar>
            <div class="mb-3">{{ eu.identificador }}</div>
            <resposta-pareamento :pareamento="pareamento" :eu="eu" @respondeu="responder" />
          </v-flex>
          <v-flex xs6>
            <v-avatar size="96" class="mb-3">
              <img :src="`${API_URL_STORAGE}/${adversario.avatar}`" />
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

// import {User as UserProfile} from '~/components/User'
import RespostaPareamento from '~/components/RespostaPareamento'
import User from '@/models/User'
import Pareamento from '@/models/Pareamento'

export default {
  middleware: 'auth',
  components: { User, RespostaPareamento },
  data () {
    return {
      user: {},
      ultima_partida: {},
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
    this.ultima_partida = await (new User({ id: this.user.id })).partidas().where('ultima', 1).first()

    if ((this.ultima_partida !== '' && this.ultima_partida.status === 'JOGANDO') || (this.ultima_partida.status === 'RESULTADO' && this.ultima_partida.detalhes[this.eu.id].vencedor === null)) {
      this.$router.replace({ path: `/partidas/${this.ultima_partida.id}` })
    } else {
      this.procurando = true

      try {
        this.pareamento = new Pareamento({})
        await this.pareamento.save()
      } catch (error) {
        console.log(error)
        alert(error.response.data.message)

        if (error.response.data.code === 702) {
          this.$router.replace({ path: '/julgamentos' })
        }

        if (error.response.data.code === 701) {
          this.$router.replace({ path: `/partidas/${this.ultima_partida.id}` })
        }
      }
      console.log(this.pareamento)
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
    API_URL_STORAGE () {
      return process.env.API_URL_STORAGE
    },
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
      this.pareamento.status = 'CANCELADO'
      this.pareamento.save()
      this.$router.replace({ path: '/home' })
    },
    async responder (params) {
      console.log(this.pareamento)
      Object.assign(this.pareamento, { ...params })
      console.log(this.pareamento)
      await this.pareamento.save()
    },
    async tratar () {
      if (this.pareamento.status === 'MATCH') {
        this.encontrado = true
        this.procurando = false
      }

      if (this.pareamento.status === 'SUCESSO') {
        let ultima = await (new User({ id: this.user.id })).partidas().where('ultima', 1).first()
        this.$router.replace({ path: `/partidas/${ultima.id}` })
      }

      if (this.pareamento.status === 'CANCELADO') {
        alert('O desafio foi cancelado, pois um dos jogadores recusou o confronto.')
        this.$router.replace({ path: '/home' })
      }
    }
  }
}
</script>