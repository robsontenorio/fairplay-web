<template>
  <div class="pa-2">
    <h3>SOBRE</h3>
    <div class="conteudo">
      O modo FAIRPLAY é um formato promovido oficialmente pelo ARENA17. É um grande campeonato aberto disputado por todos os jogadores, dividido em temporadas mensais. O cadastro de usuário, partidas e rankings são independentes entre os sites FAIRPLAY e ARENA17.
    </div>

    <h3> COMO FUNCIONA </h3>
    <div class="conteudo">
      Semelhante às Divisões Online do FIFA e PES, cada jogador disputa partidas com adversários aleatórios da mesma plataforma. Em cada temporada rankings são formados com o desempenho de cada jogador.<br><br>
      <ul>
        <li>Clique em JOGAR</li>
        <li>Aceite o desafio</li>
        <li>Combine a partida pelo Chat</li>
        <li>Ao final informe o resultado</li>
      </ul>
    </div>

    <h3>CHAT</h3>

    <div class="conteudo">
      Ao encontrar uma partida utilize o Chat para conversar com o adversário. Ao final da partida é possível enviar fotos para comprovar o resultado. Mantenha sempre contato para chegar a um acordo antes de informar o resultado da partida.
    </div>

    <h3>PONTUAÇÃO</h3>

    <div class="conteudo">
      Ao jogar as partidas o sistema calcula o ranking de pontuações baseado nos seguintes critérios:
      <br><br>

      <p>
        <strong>Vitória:</strong> +5 pontos
      </p>
      <p>
        <strong>Empate:</strong> +1 ponto</p>
      <p>
        <strong>Derrota:</strong> -2 pontos </p>
      <br> Jogue limpo! Perdendo ou vencendo você mantém a sua reputação. Jogadores de péssima reputação são banidos do site.
    </div>
    <h3>JULGAMENTO</h3>
    <div class="conteudo">
      Não existem ligas ou administradores. A própria comunidade é responsável por decidir os casos onde há divergência entre os resultados das partidas. Ao votar corretamente você ganha pontos no ranking.
      <br><br>
      <p>
        <strong>Votar corretamente</strong><br>
        <span class="">+2 pontos</span>
      </p>
      <p>
        <strong>Ser derrotado no julgamento</strong><br>
        <span class="">-10 pontos</span>
      </p>

    </div>
  </div>
</template>

<script>
export default {

  data () {
    return {
    }
  },
  async mounted () {

  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}
.conteudo {
  padding: 15px;
  background-color: #efefef;
  margin-bottom: 20px;
}

ul {
  margin-left: 20px;
}
</style>
