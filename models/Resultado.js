export default class Resultado {
  static vencedor (partida, resultadoInformado) {
    let vencedor

    if (resultadoInformado === 'vitoria') {
      vencedor = partida.eu.id
    } else if (resultadoInformado === 'derrota') {
      if (partida.eu.id === partida.user1.id) {
        vencedor = partida.user2.id
      } else {
        vencedor = partida.user1.id
      }
    } else if (resultadoInformado === 'empate') {
      vencedor = 0
    } else if (resultadoInformado === 'cancelamento') {
      vencedor = -1
    }

    return vencedor
  }
}
