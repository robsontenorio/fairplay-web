<template>
  <div>
    <div v-show="resposta">
      <span class="tag" :class="`decisao-${resposta}`"> {{ decisao }} </span>
    </div>
    <div v-show="!resposta">
      Aguardando ...
    </div>
  </div>
</template>
<script>
export default {
  name: 'resposta-desafio',
  props: ['resposta'],
  computed:
  {
    decisao () {
      if (this.resposta === 1) {
        return 'pronto'
      } else if (this.resposta === 0) {
        return 'recusou'
      }
    }
  }
}
</script>
<style scoped>
.decisao-1 {
  color: green;
}

.decisao-2 {
  color: red;
}
</style>
