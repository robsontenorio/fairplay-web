<template>
  <div class="has-text-centered" v-show="carregado">
    PARTIDA {{ partida }}
  </div>
</template>

<script>

export default {
  middleware: 'auth',
  data () {
    return {
      carregado: false,
      partida: {}
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    let { data } = await this.$axios.get(`/partida`)
    console.log(data)

    if (data === '' || data.status === 'FINALIZADA') {
      this.$router.replace({ path: '/home' })
    } else {
      this.partida = data
      this.carregado = true
    }
  }
}
</script>