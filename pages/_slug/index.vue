<template>
  <div class="has-text-centered">
    USER {{ user }}
  </div>
</template>

<script>

export default {
  data () {
    return {
      user: {}
    }
  },

  async asyncData ({ app, params }) {

  },
  async mounted () {
    let identificador = await this.$route.params.slug
    this.user = identificador
  }
}
</script>