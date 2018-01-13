<template>
  <div class="pa-2">
    <div v-if="carregado && finalizaEm > 0" class="resultado-timer has-text-centered">
      <countdown :time="finalizaEm">
        <template slot-scope="props">Finaliza em
          <strong>{{ props.minutes }}</strong> minutos e {{ props.seconds }}s</template>
      </countdown>
    </div>
    <v-card flat>
      <v-layout text-xs-center class="pt-3 mb-1">
        <v-flex xs6 v-if="partida.user1">
          <v-avatar size="58" class="mb-2">
            <img :src="partida.user1.avatar" />
          </v-avatar>
          <div>
            {{ partida.user1.identificador }}
          </div>
          <resposta-partida :partida="partida" :user="partida.user1"></resposta-partida>
        </v-flex>
        <v-flex xs6 v-if="partida.user1">
          <v-avatar size="58" class="mb-2">
            <img :src="partida.user2.avatar" />
          </v-avatar>
          <div>
            {{ partida.user2.identificador }}
          </div>
          <resposta-partida :partida="partida" :user="partida.user2"></resposta-partida>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- TABS -->
    <v-tabs grow icons-and-text centered slider-color="blue-grey darken-3">
      <v-tab href="#tab-1">
        Instruções
        <v-icon>fa-book</v-icon>
      </v-tab>
      <v-tab href="#tab-2">
        Chat
        <v-icon>chat</v-icon>
      </v-tab>
      <v-tab href="#tab-3">
        Resultado
        <v-icon>mode_edit</v-icon>
      </v-tab>
      <!-- INSTRUÇÕES -->
      <v-tab-item id="tab-1">
        <v-card flat>
          <v-card-text>
            <ul class="ml-3">
              <li>Você joga limpo!</li>
              <li>Vencendo ou perdendo sua
                <strong>reputação é mantida</strong>.</li>
              <li>Use o
                <strong>chat</strong> para combinar a partida.</li>
              <li>Conversas são
                <strong>públicas</strong>.</li>
              <li>Ao final da partida informe o resultado.</li>
              <li>Resultados divergentes são
                <strong>julgados pela comunidade</strong>.</li>
              <li>Capture algumas imagens do jogo, caso seja necessário comprovar o resultado.</li>
              <li>Jogadores de péssima reputação serão
                <strong>banidos</strong>.</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- CHAT -->
      <v-tab-item id="tab-2">
        <v-card flat>
          <v-card-text>
            X
            <!-- <chat :eu="eu" :adversario="adversario" :partidaId="partida.id" :mensagens="mensagens" @enviarMensagem="enviarMensagem"></chat> -->
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- RESULTADO -->
      <v-tab-item id="tab-3">
        <v-card flat>
          <v-card-text>
            <v-layout>
              <v-flex xs4>
                <v-btn block color="success" @click="informarResultado('vitoria')">ganhei</v-btn>
              </v-flex>
              <v-flex xs4>
                <v-btn block class="mx-2" color="black" @click="informarResultado('empate')">ganhei</v-btn>
              </v-flex>
              <v-flex xs4>
                <v-btn block color="error" class="white--text" @click="informarResultado('derrota')">perdi</v-btn>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12>
                <v-btn block color="danger" @click="informarResultado('cancelamento')">solicitar cancelamento</v-btn>
              </v-flex>
            </v-layout>
            <p class="mt-5">
              <strong>Caso informe um resultado falso você será banido.</strong> Lembre-se que perdendo ou vencendo sua reputação será mantida.
            </p>
            <p>
              Se houver
              <strong>divergência</strong> entre os resultados ambos jogadores vão a
              <strong>julgamento</strong> pela comunidade, podendo ser banido.
            </p>
            <p>
              No momento em que um dos jogadores informa o resultado, o adversário tem
              <strong>30 minutos</strong> para também informar o resultado. Após este prazo o resultado será confirmado automaticamente pelo sistema.
            </p>
            <p>
              A partida somente será cancelada se o seu adversário também solicitar o cancelamento. Caso o adversário informe qualquer outro resultado, a partida irá a
              <strong>julgamento</strong>. Use o
              <strong>chat</strong> para chegar a um acordo
            </p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import User from '~/components/User'
import Chat from '~/components/Chat'
import RespostaPartida from '~/components/RespostaPartida'
import Countdown from '@xkeshi/vue-countdown'
import moment from 'moment'

export default {
  middleware: 'auth',
  components: { User, Chat, Countdown, RespostaPartida },

  data () {
    return {
      carregado: false,
      partida: {},
      mensagens: []
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
    // TODO usar metodo FETCH() ??
  },
  async mounted () {
    let user = this.$store.state.auth.user
    let { data } = await this.$axios.get(`/users/${user.id}/partidas?ultima`)

    if (data === '' || (data.status !== 'JOGANDO' && data.status !== 'RESULTADO')) {
      this.$router.replace({ path: '/home' })
    } else {
      this.partida = data
      this.carregado = true

      let mensagens = await this.$axios.get(`/partidas/${this.partida.id}/mensagens`)
      this.mensagens = mensagens.data

      this.$echo.channel('partida-' + this.partida.id)
        .listen('.PartidaAtualizadaEvent', (payload) => {
          this.partida = payload.partida
          this.tratar()
        })

      this.$echo.channel('chat-' + this.partida.id)
        .listen('.MensagemRecebidaEvent', (payload) => {
          this.mensagens.push(payload.mensagem)
        })

      let socket = this.$echo.connector.socket
      socket.on('disconnect', function () {
        alert('Reconectando ...')
        location.reload()
      })
    }
  },
  beforeDestroy () {
    this.$echo.leave('partida-' + this.partida.id)
    this.$echo.leave('chat-' + this.partida.id)
  },
  computed: {
    eu () {
      return this.$store.state.auth.user
    },
    adversario () {
      let adversario = null

      if (this.eu) {
        adversario = (this.eu.id === this.partida.user1_id) ? this.partida.user2 : this.partida.user1
      }

      return adversario
    },
    finalizaEm () {
      let trinta = 1000 * 60 * 30
      let agora = moment()
      let resultadoEm = moment(this.partida.resultado_em)
      let diff = trinta - agora.diff(resultadoEm)

      return diff
    }
  },
  methods: {
    async tratar () {
      if (this.partida.status === 'FINALIZADA') {
        this.$router.replace({ path: '/home' })

        this.$toast.open({
          message: 'Partida finalizada',
          type: 'is-success',
          position: 'is-bottom'
        })
      }

      if (this.partida.status === 'JULGAMENTO') {
        this.$router.replace({ path: '/home' })

        this.$snackbar.open({
          message: 'Os resultados informados foram divergentes. Partida vai a JULGAMENTO',
          type: 'is-danger',
          position: 'is-bottom'
        })
      }

      if (this.partida.status === 'ANULADA') {
        this.$router.replace({ path: '/home' })

        this.$snackbar.open({
          message: 'A partida foi anulada, pois ambos jogadores concordaram',
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
    },
    informarResultado (tipo) {
      let texto
      if (tipo === 'cancelamento') {
        texto = 'A partida somente será cancelada se o seu adversário também solicitar o cancelamento. Caso o adversário informe qualquer outro resultado, a partida irá a <strong>julgamento</strong>. Use o chat para chegar a um acordo.'
      } else {
        texto = 'Caso informe um resultado falso você será <strong>banido.</strong>'
      }

      this.$dialog.confirm({
        message: texto,
        type: 'is-warning',
        hasIcon: true,
        onConfirm: () => this.postResultado(tipo)
      })
    },
    async postResultado (tipo) {
      let userId

      if (tipo === 'vitoria') {
        userId = this.eu.id
      } else if (tipo === 'derrota') {
        if (this.eu.id === this.partida.user1.id) {
          userId = this.partida.user2.id
        } else {
          userId = this.partida.user1.id
        }
      } else if (tipo === 'empate') {
        userId = 0
      } else if (tipo === 'cancelamento') {
        userId = -1
      }

      let params = {
        vencedor: userId
      }
      try {
        let { data } = await this.$axios.patch(`/partidas/${this.partida.id}`, params)

        if (data.status === 'RESULTADO') {
          this.$modal.open(`O adversário tem 30 minutos para confirmar ou recusar o resultado. Você ainda pode alterar o resultado informado, continuar conversando com o aversário ou procurar por uma nova partida.`)
        }
      } catch (error) {
        this.$snackbar.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
    },
    async enviarMensagem (params) {
      await this.$axios.post(`/partidas/${this.partida.id}/mensagens`, params)
    }
  }
}
</script>

<style  scoped>
.instrucoes {
  font-size: 9pt;
}

.instrucoes li {
  margin-bottom: 5px;
}

.instrucoes ol {
  margin-top: 0 !important;
}

.resultado-info {
  font-size: 9pt;
  padding: 10px !important;
}

.resultado-timer {
  padding: 5px;
  background-color: #ffdd57;
  color: rgba(0, 0, 0, 0.7);
  margin-left: -10px;
  margin-right: -10px;
  margin-top: -20px;
  margin-bottom: 20px;
  font-size: 9pt;
}
</style>