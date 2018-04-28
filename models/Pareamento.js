import Model from './Model'
import User from './User'

export default class Pareamento extends Model {
  resource () {
    return 'pareamentos'
  }
  /**
   * Metodos
   */
  isMatch () {
    return this.status === 'MATCH'
  }

  isSucesso () {
    return this.status === 'SUCESSO'
  }

  isCancelado () {
    return this.status === 'CANCELADO'
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
}
