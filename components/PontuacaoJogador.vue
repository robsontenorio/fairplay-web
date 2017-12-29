<template>
  <div>
    <div v-if="objeto" class="wrapper">
      <div class="linha posicao">
        <b-tag type="is-dark">
          <small>
            <i class="fa fa-line-chart"></i>&nbsp; posição</small>
        </b-tag>
        <b-tag type="is-warning">{{ objeto.posicao }} °</b-tag>
      </div>

      <div class="linha pontuacoes">
        <b-tag type="is-dark">P</b-tag>
        <b-tag type="is-info">{{ objeto.pontos }}</b-tag>&nbsp;
        <b-tag type="is-dark">V</b-tag>
        <b-tag type="is-success">{{ objeto.vitorias }}</b-tag>&nbsp;
        <b-tag type="is-dark">E</b-tag>
        <b-tag type="is-light">{{ objeto.empates }}</b-tag>&nbsp;
        <b-tag type="is-dark">D</b-tag>
        <b-tag type="is-danger">{{ objeto.derrotas }}</b-tag>&nbsp;
      </div>
    </div>
    <b-message class="aviso" v-if="!objeto">
      Não pontuou :(
    </b-message>
  </div>
</template>
<script>
export default {
  props: ['objeto']
}
</script>
<style lang="scss" scoped>
.posicao {
  color: #888;
}

.posicao span {
  font-weight: bold;
  font-size: 14pt;
}

.tag:not(body).is-warning {
  border: 1px solid #ffdd57;
}

.tag:not(body).is-light {
  border: 1px solid #c0c0c0;
  background: #363635;
  color: white;
}
.tag:not(body).is-dark {
  color: #363635;
  background: white;
  border: 1px solid #c0c0c0;
}

.linha {
  padding-bottom: 20px;
}

.aviso {
  margin-top: 20px;
}

.wrapper {
  background-color: #efefef;
  padding-top: 20px;
}
</style>
