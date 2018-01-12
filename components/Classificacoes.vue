<template>
  <div>
    <v-data-table dense :items="classificacoes" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <tr>
          <th class="pl-3 pr-0 text-xs-left">#</th>
          <th class="px-2 text-xs-left">ID</th>
          <th class="px-2 ">P</th>
          <th class="px-2 ">V</th>
          <th class="px-2 ">E</th>
          <th class="px-2 ">D</th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <td class="pl-3 pr-0">
          <strong>{{ props.index + 1}}</strong>
        </td>
        <td class="px-2">{{ props.item.identificador || props.item.user.identificador }}</td>
        <td class="px-2">{{ props.item.pontos }}</td>
        <td class="px-2">{{ props.item.vitorias }}</td>
        <td class="px-2">{{ props.item.empates }}</td>
        <td class="px-2">{{ props.item.derrotas }}</td>
      </template>
      <template slot="no-data">
        -
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  props: ['classificacoes', 'user']
}
</script>
<style  scoped>

</style>
