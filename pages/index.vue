<template>
  <div>
    <div class="text-xs-center">
      <div class="mt-3">
        <span class="fa-stack fa-4x">
          <i class="fa fa-circle fa-stack-2x info--text"></i>
          <i class="fa fa-random fa-stack-1x fa-inverse "></i>
        </span>
        <h4 class="service-heading">Encontre um jogador</h4>
      </div>
      <div class="my-4">
        <span class="fa-stack fa-4x">
          <i class="fa fa-circle fa-stack-2x info--text"></i>
          <i class="fa fa-gamepad fa-stack-1x fa-inverse"></i>
        </span>
        <h4 class="service-heading">Jogue a partida</h4>
      </div>
      <div>
        <span class="fa-stack fa-4x">
          <i class="fa fa-circle fa-stack-2x info--text"></i>
          <i class="fa fa-pencil fa-stack-1x fa-inverse"></i>
        </span>
        <h4 class="service-heading">Informe o resultado</h4>
      </div>
    </div>

    <div class="text-xs-center mt-5 pt-4" style="border-top: 1px solid #c0c0c0">
      <span class="fa-stack fa-4x">
        <i class="fa fa-circle fa-stack-2x orange--text"></i>
        <i class="fa fa-trophy fa-stack-1x fa-inverse"></i>
      </span>
      <h4 class="service-heading mb-4">Seja o grande campeão!</h4>
      <p>Divisões online FIFA e PES</p>
      <p>Todas as plataformas.</p>
      <p>Escale entre as divisões.</p>
      <p>Somente um será o vencedor!</p>
    </div>

    <div class="text-xs-center mt-5 pt-4" style="border-top: 1px solid #c0c0c0">
      <span class="fa-stack fa-4x">
        <i class="fa fa-circle fa-stack-2x orange--text"></i>
        <i class="fa fa-star fa-stack-1x fa-inverse"></i>
      </span>
      <h4 class="service-heading mb-4">Jogue limpo!</h4>
      <p> Mantenha sua reputação.</p>
      <p> Havendo divergência, os jogadores vão a julgamento.</p>
      <p> A comunidade analisa as provas e vota.</p>
      <p>Jogadores de péssima reputação são banidos</p>
    </div>

    <v-btn block color="info" class="mb-3 mt-5" @click="$router.push('/ajuda')">
      <v-icon left>help</v-icon> saiba mais
    </v-btn>
    <v-btn block color="success" @click="$router.push('/login')">
      <v-icon left>account_box</v-icon> entrar
    </v-btn>
    <br><br>
  </div>
</template>

<script>

export default {

}
</script>