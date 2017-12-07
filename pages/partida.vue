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
      <b-tabs size="is-small" type="is-toggle" position="is-centered" expanded>
        <b-tab-item label="Instruções" icon="list">
          <div class="instrucoes has-text-left">
            <ol>
              <li>Use o
                <strong>chat</strong> para combinar a partida.</li>
              <li>Conversas, fotos e vídeos são
                <strong>públicos</strong>.</li>
              <li>Ao
                <strong>final da partida</strong> informe o resultado.</li>
              <li>Resultados divergentes são
                <strong>julgados pela comunidade</strong>.</li>
              <li>Jogadores de péssima reputação serão
                <strong>banidos</strong>.</li>
              <li>Vencendo ou perdendo sua
                <strong>reputação é mantida</strong>.</li>
              <li>Você joga limpo!</li>
            </ol>
          </div>

        </b-tab-item>
        <b-tab-item label="Chat" icon="comment">
          <div class="chat">
            <chat :eu="user" :partida="partida"></chat>
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

          <button class="button is-light is-fullwidth" @click="solicitarCancelamento()">solicitar cancelamento</button>

          <br><br>

          <div class="resultado-info is-default has-text-justified">
            <strong>Caso informe um resultado falso você será banido.</strong> Lembre-se que perdendo ou vencendo sua reputação será mantida.
          </div>
          <div class="resultado-info is-default has-text-justified">
            Se houver
            <strong>divergência</strong> entre os resultados ambos jogadores vão a julgamento pela comunidade, podendo ser banido.
          </div>
          <div class="resultado-info is-default has-text-justified">
            No momento em que um dos jogadores informa o resultado, o adversário tem
            <strong>30 minutos</strong> para também informar o resultado. Após este prazo o resultado será confirmado automaticamente pelo sistema.
          </div>
          <div class="resultado-info is-default has-text-justified">
            A partida somente será cancelada se o seu adversário também solicitar o cancelamento. Caso o adversário tenha informado qualquer outro resultado, ele prevalecerá ao invés do cancelamento. Use o
            <strong>chat</strong> chegar a um acordo.
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
  },
  async mounted () {
    let { data } = await this.$axios.get(`/partida?appends=mensagens`)

    if (data === '' || (data.status !== 'JOGANDO' && data.status !== 'RESULTADO')) {
      this.$router.replace({ path: '/home' })
    } else {
      this.partida = data
      this.carregado = true

      this.$echo.channel('partida-' + this.partida.id)
        .listen('.PartidaAtualizadaEvent', (payload) => {
          this.partida = payload.partida
          this.tratar()
        })
        .listen('.MensagemRecebidaEvent', (payload) => {
          // if (payload.mensagem.from_id !== this.user.id) {
          this.partida.mensagens.push(payload.mensagem)
          // }
        })
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    },
    finalizaEm () {
      let trinta = 1000 * 60 * 30
      let agora = moment()
      let resultadoEm = moment(this.partida.resultado_em)
      let diff = trinta - agora.diff(resultadoEm)

      return diff
    },
    meuResultado () {
      // let resultado = this.resultado

      // if (this.user.id === this.partida.user1_id) {
      //   return resultado.user1
      // } else {
      //   return resultado.user2
      // }
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

        this.$toast.open({
          message: 'Os resultados informados foram divergentes. Partida vai a JULGAMENTO',
          type: 'is-danger',
          position: 'is-bottom'
        })
      }

      if (this.partida.status === 'ANULADA') {
        this.$router.replace({ path: '/home' })

        this.$toast.open({
          message: 'A partida foi anulada, pois ambos jogadores concordaram',
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
    },
    async solicitarCancelamento () {
      if (!confirm('Solicitar o cancelamento da partida?\n\nA partida somente será cancelada se o seu adversário também solicitar o cancelamento. Caso o adversário tenha informado qualquer outro resultado, ele prevalecerá ao invés do cancelamento. Use o chat para chegar a um acordo.')) {
        return false
      }

      let params = {
        solicitou_cancelamento: true
      }
      try {
        await this.$axios.patch(`/partidas/${this.partida.id}`, params)
      } catch (error) {
        this.$toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
    },
    async informarResultado (tipo) {
      let userId

      if (!confirm('Você confirma o resultado informado?\nCaso informe um resultado falso você será banido')) {
        return false
      }

      if (tipo === 'vitoria') {
        userId = this.user.id
      } else if (tipo === 'derrota') {
        if (this.user.id === this.partida.user1.id) {
          userId = this.partida.user2.id
        } else {
          userId = this.partida.user1.id
        }
      } else {
        userId = -1
      }

      let params = {
        vencedor: userId
      }
      try {
        await this.$axios.patch(`/partidas/${this.partida.id}`, params)
      } catch (error) {
        this.$toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
    }
  }
}
</script>

<style scoped>
.instrucoes {
  font-size: 9pt;
}

.instrucoes li {
  margin-bottom: 5px;
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