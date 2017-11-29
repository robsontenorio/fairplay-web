<template>
  <div class="has-text-centered" v-show="carregado">

    <h1>DESAFIO</h1>
    <div class="columns is-mobile has-text-centered" v-if="partida.user1">
      <div class="column">
        <user :user="partida.user1"></user>

        <div v-show="partida.user1.id == user.id">
          <div v-show="!respostaDesafio1">
            <button class="button is-success" @click="responder(1)" :disabled="respondeu">aceitar</button>
            <button class="button is-danger" @click="responder(0)" :disabled="respondeu">recusar</button>
          </div>
          <resposta-desafio :resposta="respostaDesafio1" v-show="respostaDesafio1"></resposta-desafio>
        </div>
        <div v-show="partida.user2.id == user.id">
          <resposta-desafio :resposta="respostaDesafio1"></resposta-desafio>
        </div>
      </div>
      <div class="column">
        <user :user="partida.user2"></user>

        <div v-show="partida.user2.id == user.id">
          <div v-show="!respostaDesafio2">
            <button class="button is-success" @click="responder(1)" :disabled="respondeu">aceitar</button>
            <button class="button is-danger" @click="responder(0)" :disabled="respondeu">recusar</button>
          </div>
          <resposta-desafio :resposta="respostaDesafio2" v-show="respostaDesafio2">></resposta-desafio>
        </div>
        <div v-show="partida.user1.id == user.id">
          <resposta-desafio :resposta="respostaDesafio2"></resposta-desafio>
        </div>
      </div>
    </div>

    <div v-show="pronto">
      <div class="columns is-mobile">
        <div class="column has-text-right">
          <button class="button is-success" @click="informar('vitoria')">ganhei</button>
        </div>
        <div class="column has-text-centered">
          <button class="button is-default" @click="informar('empate')">empate</button>
        </div>
        <div class="column has-text-left">
          <button class="button is-danger" @click="informar('derrota')">perdi</button>
        </div>
      </div>
    </div>
    {{ partida }}
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
      carregado: false,
      respondeu: false,
      timer: null,
      partida: {}
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    let { data } = await this.$axios.get(`/partida`)

    if (data === '' || data.status === 'FINALIZADA') {
      this.$router.replace({ path: '/home' })
    } else {
      this.partida = data
      this.carregado = true

      this.timer = setInterval(function () {
        this.refresh()
      }.bind(this), 2000)
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    },
    respostaDesafio1 () {
      if (this.partida.user1) {
        return this.partida.detalhes[this.partida.user1.id].aceitou_desafio
      }
    },
    respostaDesafio2 () {
      if (this.partida.user2) {
        return this.partida.detalhes[this.partida.user2.id].aceitou_desafio
      }
    },
    pronto () {
      return this.respostaDesafio1 && this.respostaDesafio2
    }
  },
  methods: {
    async refresh () {
      let { data } = await this.$axios.get(`/partida`)
      this.partida = data
    },
    async responder (decisao) {
      this.respondeu = true

      let params = {
        aceitou_desafio: decisao
      }

      await this.$axios.patch(`/partidas/${this.partida.id}`, params)
    },
    async informar (tipo) {
      let userId

      if (tipo === 'vitoria') {
        userId = this.user.id
      } else if (tipo === 'derrota') {
        if (this.user.id === this.partida.user1.id) {
          userId = this.partida.user2.id
        } else {
          userId = this.partida.user1.id
        }
      } else {
        userId = 0
      }

      let params = {
        vencedor: userId
      }
      await this.$axios.patch(`/partidas/${this.partida.id}`, params)
    }
  }
}
</script>

<style scoped>
button {
  margin-top: 20px;
}
</style>