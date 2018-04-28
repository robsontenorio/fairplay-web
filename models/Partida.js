import moment from 'moment'
import Model from './Model'
import Mensagem from './Mensagem'
import User from './User'

export default class Partida extends Model {
  resource () {
    return 'partidas'
  }
  /**
   * Relacionamentos
   */
  mensagens () {
    return this.hasMany(Mensagem)
  }

  /**
   * Métodos
   */

  isFinalizada () {
    return this.status === 'FINALIZADA'
  }

  isJulgamento () {
    return this.status === 'JULGAMENTO'
  }

  isAnulada () {
    return this.status === 'ANULADA'
  }

  isResultado () {
    return this.status === 'RESULTADO'
  }

  isJogando () {
    return this.status === 'JOGANDO'
  }

  /**
   * Computado
   */

  set eu (user) {
    this._eu = new User(user)
  }

  get eu () {
    return this._eu
  }

  get adversario () {
    let adversario = null

    if (this.eu) {
      adversario = (this.eu.id === this.user1_id) ? this.user2 : this.user1
    }

    return adversario
  }

  get finalizaEm () {
    let trinta = 1000 * 60 * 30
    let agora = moment()
    let resultadoEm = moment(this.resultado_em)
    let diff = trinta - agora.diff(resultadoEm)

    return diff
  }

  get meuResultado () {
    return this.detalhes[this.eu.id].vencedor
  }
}
