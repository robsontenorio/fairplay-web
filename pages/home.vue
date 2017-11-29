<template>
  <div class="has-text-centered">
    HOME
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

  }
}
</script>