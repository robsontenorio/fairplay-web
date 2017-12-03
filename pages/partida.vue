<template>
  <div v-show="carregado">
    <div v-if="resultado.adversario">
      <div class="resultado-adversario has-text-centered">
        O adversário diz que ele
        <strong>{{ resultado.adversario }}</strong>
      </div>
    </div>
    <div v-if="resultado.eu">
      <div class="resultado-adversario has-text-centered">
        Você diz que
        <strong>{{ resultado.eu }}</strong>
      </div>
    </div>
    <div class="columns is-gapless is-mobile has-text-centered" v-if="partida.user1">
      <div class="column">
        <user :user="partida.user1" size="58"></user>
      </div>
      <div class="column">
        <user :user="partida.user2" size="58"></user>
      </div>
    </div>

    <div>
      <b-tabs size="is-small" type="is-full-width" expanded>
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
            chat...
          </div>
        </b-tab-item>
        <b-tab-item label="Resultado" icon="pencil">
          <div class="columns is-mobile" ref="abaResultado">
            <div class="column has-text-right">
              <button class="button is-success is-fullwidth" :class="{'is-outlined' : resultado.eu !== 'ganhou'}" @click.stop="informarResultado('vitoria')">ganhei</button>
            </div>
            <div class="column has-text-centered">
              <button class="button is-dark is-fullwidth" :class="{'is-outlined' : resultado.eu !== 'empatou'}" @click.stop="informarResultado('empate')">empate</button>
            </div>
            <div class="column has-text-left">
              <button class="button is-danger is-fullwidth" :class="{'is-outlined' : resultado.eu !== 'perdeu'}" @click.stop="informarResultado('derrota')">perdi</button>
            </div>
          </div>

          <button class="button is-warning is-fullwidth" :class="{'is-outlined' : resultado.eu !== 'cancelamento'}" @click="solicitarCancelamento()">solicitar cancelamento</button>

          <br><br>

          <div class="resultado-info is-default has-text-justified">
            Perdendo ou vencendo sua reputação será mantida.
            <strong>Caso informe um resultado falso você será banido.</strong>
          </div>
          <div class="resultado-info is-default has-text-justified">
            Caso ambos jogadores concordem, por quaisquer motivos, a partida será cancelada. A reputação e as pontuações serão mantidas. Use o
            <strong>chat</strong> para entrar em um acordo.
          </div>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import User from '~/components/User'

export default {
  middleware: 'auth',
  components: { User },

  data () {
    return {
      carregado: false,
      timer: null,
      partida: {}
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    let { data } = await this.$axios.get(`/partida`)

    if (data === '' || (data.status !== 'JOGANDO' && data.status !== 'RESULTADO')) {
      this.$router.replace({ path: '/home' })
    } else {
      this.partida = data
      this.carregado = true

      this.$echo.channel('partida-' + this.partida.id).listen('.PartidaModificadaEvent', (payload) => {
        this.partida = payload.partida
        this.tratar()
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    },
    resultado () {
      let euId = this.user.id
      let adversarioId = (this.user.id === this.partida.user1_id) ? this.partida.user2_id : this.partida.user1_id
      let resultado = {
        eu: null,
        adversario: null
      }

      if (this.partida.detalhes) {
        resultado.eu = this.parseResultado(this.partida.detalhes[euId], euId)
        resultado.adversario = this.parseResultado(this.partida.detalhes[adversarioId], adversarioId)
      }

      return resultado
    }
  },
  methods: {
    parseResultado (detalhes, userId) {
      let resultado = null

      if (detalhes.solicitou_cancelamento === true) {
        resultado = 'cancelamento'
      } else {
        if (detalhes.vencedor !== null) {
          if (detalhes.vencedor === userId) {
            resultado = 'ganhou'
          } else if (detalhes.vencedor === -1) {
            resultado = 'empatou'
          } else {
            resultado = 'perdeu'
          }
        }
      }

      return resultado
    },
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
      if (!confirm('Solicitar o cancelamento da partida?\nA partida somente será cancelada se o seu adversário concordar. Use o chat.')) {
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
  font-size: 11pt;
}

.instrucoes li {
  margin-bottom: 5px;
}

.versus {
  font-weight: bold;
  padding-top: 20px;
  color: #c0c0c0;
  font-size: 14pt;
}

.resultado-info {
  font-size: 9pt;
  padding: 10px !important;
}

.resultado-adversario {
  padding: 5px;
  background-color: #ffdd57;
  color: rgba(0, 0, 0, 0.7);
  margin-left: -10px;
  margin-right: -10px;
  margin-top: -20px;
  margin-bottom: 20px;
  font-size: 9pt;
  border-top: 1px solid #888;
}
</style>