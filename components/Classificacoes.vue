<template>
  <div>
    <b-table :data="classificacoes" :mobile-cards=" false " :narrowed="true " :striped="true " :loading="classificacoes.length===0 ">
      <template slot-scope="props ">
        <b-table-column label="#">
          <strong>{{ props.index + 1 }}</strong>
        </b-table-column>
        <b-table-column label="PSN / Gamertag ">
          {{ props.row.user.identificador }}
        </b-table-column>
        <b-table-column label="P ">
          {{ props.row.pontos }}
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
  props: ['classificacoes', 'user']
}
</script>
<style lang="scss" scoped>
tr.is-warning {
  background: #ffdd57 !important;
}

.b-table th {
  background-color: red !important;
}
</style>
