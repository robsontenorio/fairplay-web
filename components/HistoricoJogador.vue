<template>
  <div>
    <b-table :data="historico" :mobile-cards="false" :narrowed="true" :striped="true" :loading="historico.length===0 ">
      <template slot-scope="props ">
        <b-table-column label="Temporada">
          {{ props.row.temporada.nome }}
        </b-table-column>
        <b-table-column label="#">
          {{ props.row.posicao }}
        </b-table-column>
        <b-table-column label="P">
          {{ props.row.pontos }}
        </b-table-column>
        <b-table-column label="V">
          {{ props.row.vitorias }}
        </b-table-column>
        <b-table-column label="E">
          {{ props.row.empates }}
        </b-table-column>
        <b-table-column label="D">
          {{ props.row.derrotas }}
        </b-table-column>
      </template>
      <template slot="empty ">
        ...
      </template>
    </b-table>
  </div>
</template>
<script>
export default {
  props: ['historico']
}
</script>
<style lang="scss" scoped>

</style>
