<template>
  <div v-show="carregado">
    <div v-if="finalizaEm > 0" class="resultado-timer has-text-centered">
      <countdown :time="finalizaEm">
        <template slot-scope="props">Finaliza em
          <strong>{{ props.minutes }}</strong> minutos e {{ props.seconds }}s</template>
      </countdown>
    </div>
    <div class="columns is-gapless is-mobile has-text-centered" v-if="partida.user1">
      <div class="column">
        <user :user="partida.user1" size="58"></user>
        <resposta-partida :partida="partida" :user="partida.user1"></resposta-partida>
      </div>
      <div class="column">
        <user :user="partida.user2" size="58"></user>
        <resposta-partida :partida="partida" :user="partida.user2"></resposta-partida>
      </div>
    </div>

    <div>
      <b-tabs size="is-small" position="is-centered" expanded>
        <b-tab-item label="Instruções" icon="list">
          <div class="instrucoes has-text-left">
            <ol>
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
            </ol>
          </div>

        </b-tab-item>
        <b-tab-item label="Chat" icon="comments">
          <div class="chat">
            <chat :eu="eu" :adversario="adversario" :partidaId="partida.id" :mensagens="mensagens" @enviarMensagem="enviarMensagem"></chat>
          </div>
        </b-tab-item>
        <b-tab-item label="Resultado" icon="pencil">
          <div class="columns is-mobile" ref="abaResultado">
            <div class="column has-text-right">
              <button class="button is-success is-fullwidth" @click="informarResultado('vitoria')">ganhei</button>
            </div>
            <div class="column has-text-centered">
              <button class="button is-dark is-fullwidth" @click="informarResultado('empate')">empate</button>
            </div>
            <div class="column has-text-left">
              <button class="button is-danger is-fullwidth" @click="informarResultado('derrota')">perdi</button>
            </div>
          </div>

          <button class="button is-light is-fullwidth" @click="informarResultado('cancelamento')">solicitar cancelamento</button>

          <br><br>

          <div class="resultado-info is-default has-text-justified">
            <strong>Caso informe um resultado falso você será banido.</strong> Lembre-se que perdendo ou vencendo sua reputação será mantida.
          </div>
          <div class="resultado-info is-default has-text-justified">
            Se houver
            <strong>divergência</strong> entre os resultados ambos jogadores vão a
            <strong>julgamento</strong> pela comunidade, podendo ser banido.
          </div>
          <div class="resultado-info is-default has-text-justified">
            No momento em que um dos jogadores informa o resultado, o adversário tem
            <strong>30 minutos</strong> para também informar o resultado. Após este prazo o resultado será confirmado automaticamente pelo sistema.
          </div>
          <div class="resultado-info is-default has-text-justified">
            A partida somente será cancelada se o seu adversário também solicitar o cancelamento. Caso o adversário informe qualquer outro resultado, a partida irá a
            <strong>julgamento</strong>. Use o
            <strong>chat</strong> para chegar a um acordo
          </div>
        </b-tab-item>
      </b-tabs>
    </div>
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
    let { data } = await this.$axios.get(`/partidas/ultima`)

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

<style lang="scss" scoped>
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