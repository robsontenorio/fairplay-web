<template>
  <div>
    <v-alert outline color="warning" icon="priority_high" :value="!objeto && !loading">
      Não pontuou na temporada :(
    </v-alert>
    <div class="text-xs-center">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
    <v-container v-if="objeto" grid-list-md text-xs-center class="px-0">
      <v-layout row wrap>
        <v-flex xs12 class="mb-2">
          <v-card flat class="display-2">
            <v-icon class="display-2" color="black">timeline</v-icon> {{ objeto.posicao }}°
          </v-card>
        </v-flex>
        <v-flex xs3>
          <v-card dark color="primary">
            <v-card-text class="px-0 py-2">
              <strong>{{ objeto.pontos }}</strong>
              <div class="caption">pontos</div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs3>
          <v-card dark color="green">
            <v-card-text class="px-0 py-2">
              <strong>{{ objeto.vitorias }}</strong>
              <div class="caption">vitórias</div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs3>
          <v-card dark color="grey darken-4">
            <v-card-text class="px-0 py-2">
              <strong>{{ objeto.empates }}</strong>
              <div class="caption">empates</div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs3>
          <v-card dark color="red">
            <v-card-text class="px-0 py-2">
              <strong>{{ objeto.derrotas }}</strong>
              <div class="caption">derrotas</div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  props: ['objeto', 'loading']
}
</script>
<style  scoped>
/* .posicao {
  font-size: 20pt;
  font-weight: bold;
}

.posicao span {
  font-size: 9pt;
  font-weight: normal;
}

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
} */
</style>
