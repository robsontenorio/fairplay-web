<template>
  <div class="text-xs-center">
    <v-alert type="warning" :value="true">
      Temporada inicia QUINTA-FEIRA 25 DE JANEIRO, 22h00.
    </v-alert>
    <br>
    <v-btn block @click="$router.replace({path: '/buscar'})">
      <v-icon>play_arrow</v-icon> Jogar
    </v-btn>
  </div>
</template>

<script>
// import Avatar from '~/components/Avatar'

export default {

}
</script>

<style  scoped>

</style>