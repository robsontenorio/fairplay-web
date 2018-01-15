<template>
  <div>

  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data () {
    return {
    }
  },
  async mounted () {
    let user = await this.$store.state.auth.user
    this.$router.replace({ path: '@' + user.identificador })
  }
}
</script>

<style scoped>

</style>
