<template>
  <div>
    <div v-if="objeto" class="wrapper">
      <div class="linha posicao">
        <i class="fa fa-line-chart"></i>&nbsp; {{ objeto.posicao }}°
      </div>

      <div class="linha">
        <div class="columns pontuacoes is-mobile">
          <div class="column notification is-info">
            {{ objeto.pontos }}
            <br>
            <span>pontos</span>
          </div>
          <div class="column notification is-success">
            {{ objeto.vitorias }}
            <br>
            <span>vitorias</span>
          </div>
          <div class="column notification is-dark">
            {{ objeto.empates }}
            <br>
            <span>empates</span>
          </div>
          <div class="column notification is-danger">
            {{ objeto.derrotas }}
            <br>
            <span>derrotas</span>
          </div>
        </div>
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
  font-size: 20pt;
  font-weight: bold;
}

.posicao span {
  font-size: 9pt;
  font-weight: normal;
}

// .tag:not(body).is-warning {
//   border: 1px solid #ffdd57;
// }

// .tag:not(body).is-light {
//   border: 1px solid #c0c0c0;
//   background: #363635;
//   color: white;
// }
// .tag:not(body).is-dark {
//   color: #363635;
//   background: white;
//   border: 1px solid #c0c0c0;
// }

.notification:not(:last-child) {
  margin-bottom: 0;
  margin-right: 10px;
}

.pontuacoes {
  margin: 0px;
}
.notification {
  font-weight: bold;
}

.notification span {
  font-size: 9pt;
  font-weight: normal;
}
.notification {
  padding: 5px;
}

.linha {
  padding-bottom: 20px;
}

.aviso {
  margin-top: 20px;
  margin-bottom: 20px;
}

.wrapper {
  // background-color: #616567;
  // background-color: #f5f5f5;
  // border-radius: 3px;
  // padding-top: 20px;
}
</style>
