<template>
  <div class="has-text-centered">
    oi {{ temporadas }}
  </div>
</template>

<script>

export default {
  middleware: 'auth',
  data () {
    return {
      temporadas: []
    }
  },

  async asyncData ({ app, params }) {
    // TODO nao funciona em SPA?
  },
  async mounted () {
    let { data } = await this.$axios.get(`/temporadas`)
    this.temporadas = data
  }
}
</script>