<template>
  <div v-if="partida.id">
    <div v-if="carregado && this.partida.finalizaEm > 0" class="pa-2 text-xs-center yellow accent-4">
      <countdown :time="this.partida.finalizaEm">
        <template slot-scope="props">Finaliza em
          <strong>{{ props.minutes }}</strong> minutos e {{ props.seconds }}s</template>
      </countdown>
    </div>
    <v-card flat>
      <v-layout text-xs-center class="pt-3 mb-2 pb-2">
        <v-flex xs6 v-if="partida.user1">
          <v-avatar size="96" class="mb-2">
            <img :src="`${API_URL_STORAGE}/${partida.user1.avatar}`" />
          </v-avatar>
          <div>
            {{ partida.user1.identificador }}
          </div>
          <resposta-partida :partida="partida" :user="partida.user1"></resposta-partida>
        </v-flex>
        <v-flex xs6 v-if="partida.user1">
          <v-avatar size="96" class="mb-2">
            <img :src="`${API_URL_STORAGE}/${partida.user2.avatar}`" />
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
            <chat :partida="partida" :mensagens="mensagens" @enviarMensagem="enviarMensagem"></chat>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- RESULTADO -->
      <v-tab-item id="tab-3">
        <v-card flat>
          <v-card-text>
            <v-layout>
              <v-flex xs4 class="pr-2">
                <v-btn block color="success" @click="informarResultado('vitoria')">ganhei</v-btn>
              </v-flex>
              <v-flex xs4 class="pr-2">
                <v-btn block color="black" class="white--text" @click="informarResultado('empate')">empate</v-btn>
              </v-flex>
              <v-flex xs4>
                <v-btn block color="error" class="white--text" @click="informarResultado('derrota')">perdi</v-btn>
              </v-flex>
            </v-layout>
            <v-layout class="mt-2">
              <v-flex xs12>
                <v-btn block @click="informarResultado('cancelamento')">solicitar cancelamento</v-btn>
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
              <strong>chat</strong> para chegar a um acordo.
            </p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-dialog persistent v-model="dialog.show">
      <v-card>
        <v-card-title class="headline">Importante!</v-card-title>
        <v-card-text v-html="dialog.texto"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" flat @click.native="postResultado">confirmar</v-btn>
          <v-btn color="error" flat @click.native="dialog.show = false">cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="sheet.show">
      <v-card tile>
        <v-card-text>
          {{ sheet.text }}
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="primary" flat @click.native="sheet.show = false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

    <v-dialog persistent v-model="final.show">
      <v-card tile>
        <v-card-text>
          {{ final.text }}
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="primary" flat @click.native="$router.replace({ path: '/home' })">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Chat from '~/components/Chat'
import RespostaPartida from '~/components/RespostaPartida'
import Countdown from '@xkeshi/vue-countdown'
import Partida from '@/models/Partida'
import Mensagem from '@/models/Mensagem'
import Resultado from '@/models/Resultado'

export default {
  middleware: 'auth',
  components: { Chat, Countdown, RespostaPartida },

  data () {
    return {
      dialog: {
        show: false,
        texto: '',
        tipo: ''
      },
      sheet: {
        show: false,
        text: ''
      },
      final: {
        show: false,
        text: ''
      },
      conexao: {
        show: false
      },
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
    let id = this.$route.params.id

    this.partida = await Partida.find(id)
    this.partida.eu = this.$store.state.auth.user
    this.mensagens = await this.partida.mensagens().$get()
    this.carregado = true

    if (this.partida.isJulgamento()) {
      alert('Partida em julgamento.')
      this.$router.replace({ path: `/julgamentos/${this.partida.id}` })
    }

    if (this.partida.isFinalizada() || this.partida.isAnulada()) {
      alert('Partida concluída.')
      this.$router.replace({ path: '/home' })
    }

    if (this.partida.user1.id !== this.partida.eu.id && this.partida.user2.id !== this.partida.eu.id) {
      alert('Você não participa desta partida')
      this.$router.replace({ path: '/home' })
    }

    this.$echo.channel('partida-' + this.partida.id)
      .listen('.PartidaAtualizadaEvent', (payload) => {
        Object.assign(this.partida, payload.partida)
        this.tratar()
      })

    this.$echo.channel('chat-' + this.partida.id)
      .listen('.MensagemRecebidaEvent', (payload) => {
        this.mensagens.push(new Mensagem(payload.mensagem))
      })

    let self = this
    this.$echo.connector.socket.on('disconnect', function () {
      self.conexao.show = true
    })
  },
  beforeDestroy () {
    this.$echo.leave('partida-' + this.partida.id)
    this.$echo.leave('chat-' + this.partida.id)
  },
  computed: {
    API_URL_STORAGE () {
      return process.env.API_URL_STORAGE
    }
  },
  methods: {
    recarregar () {
      location.reload()
    },
    async tratar () {
      if (this.partida.isFinalizada()) {
        this.final.show = true
        this.final.text = 'Partida finalizada'
      }

      if (this.partida.isJulgamento()) {
        this.final.show = true
        this.final.text = 'Os resultados informados foram divergentes. Partida vai a JULGAMENTO'
      }

      if (this.partida.isAnulada()) {
        this.final.show = true
        this.final.text = 'A partida foi anulada, pois ambos jogadores concordaram'
      }
    },
    informarResultado (tipo) {
      this.dialog.tipo = tipo

      if (tipo === 'cancelamento') {
        this.dialog.texto = 'A partida somente será cancelada se o seu adversário também solicitar o cancelamento. Caso o adversário informe qualquer outro resultado a partida irá a <strong>julgamento</strong>. Use o chat para chegar a um acordo.'
      } else {
        this.dialog.texto = 'Caso informe um resultado falso você será <strong>banido.</strong> Caso o adversário informe um resultado divergente a partida irá a <strong>julgamento</strong>. Use o chat para chegar a um acordo.'
      }

      this.dialog.show = true
    },
    async postResultado () {
      this.dialog.show = false

      try {
        this.partida.vencedor = Resultado.vencedor(this.partida, this.dialog.tipo)
        await this.partida.save()

        if (this.partida.isResultado()) {
          this.sheet.text = `O adversário tem 30 minutos para confirmar ou recusar o resultado. Você ainda pode alterar o resultado informado, continuar conversando com o aversário ou procurar por uma nova partida.`
          this.sheet.show = true
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    async enviarMensagem (params) {
      await this.partida.mensagens().attach(params)
      // await this.mensagens[0].save() // PUT /partidas/{id}/mensagens/{id2}
      // await this.mensagens[0].delete() // DELETE /partidas/{id}/mensagens/{id2}

      // await this.partida.mensagens().attach(payload) // POST /partidas/{id}/mensagens
      // await this.partida.mensagens().sync(payload) // PUT /partidas/{id}/mensagens      

    }
  }
}
</script>

<style  scoped>
li {
  margin-bottom: 10px;
}
</style>