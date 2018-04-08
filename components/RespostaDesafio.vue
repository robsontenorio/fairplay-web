<template>
  <div>
    <div v-show="resposta">
      <v-icon large color="success">{{ decisao }}</v-icon>
    </div>
    <div v-show="!resposta">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>
<script>
export default {
  props: ['resposta'],
  computed:
    {
      decisao () {
        if (this.resposta === 1) {
          return 'check'
        } else if (this.resposta === 0) {
          return 'close'
        }
      }
    }
}
</script>