<template>
  <div class="has-text-centered" v-show="carregado">
    <div v-show="procurando">
      <img src="/spinner.gif" />
      <h1>Procurando jogador ... </h1>
      {{ pareamento }}
      <button class="button is-primary" @click="parar()">cancelar </button>
    </div>
    <div v-show="!procurando">
      <button class="button is-primary" @click="procurar()">procurar partida</button>
    </div>
  </div>
</template>

<script>

export default {
  middleware: 'auth',
  data () {
    return {
      carregado: false,
      procurando: false,
      timer: null,
      pareamento: {}
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    let { data } = await this.$axios.get(`/partida`)

    if (data !== '' && data.status !== 'FINALIZADA') {
      this.$router.replace({ path: '/partida' })
    } else {
      this.carregado = true
    }
  },
  methods: {
    procurar () {
      this.procurando = true
      this.timer = setInterval(function () {
        this.parear()
      }.bind(this), 2000)
    },
    parar () {
      this.procurando = false
      clearInterval(this.timer)
      // TODO enviar requisição ajax para cancelar pareamento
    },
    async parear () {
      try {
        let { data } = await this.$axios.post(`/pareamento`)
        this.pareamento = data
        if (this.pareamento.match !== undefined) {
          this.$toast.open({
            message: 'Adversário encontrado',
            type: 'is-success',
            position: 'is-bottom'
          })
          this.parar()
          this.$router.replace({ path: '/partida' })
        }
      } catch (error) {
        this.parar()
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