<template>
  <div>
    <div v-show="resposta">
      <span class="tag" :class="`decisao-${resposta}`">
        <i :class="`fa fa-${decisao}`"></i>
      </span>
    </div>
    <div v-show="!resposta">
      <img width="58px" src="/spinner2.gif" /> <br>
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
        return 'check'
      } else if (this.resposta === 0) {
        return 'times'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.decisao-1 {
  color: green;
}

.decisao-2 {
  color: red;
}

.tag {
  font-size: 21pt;
}
</style>
