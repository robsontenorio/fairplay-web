import Model from './Model'
import Partida from './Partida'

export default class User extends Model {
  resource () {
    return 'users'
  }
  /**
   * Relacionamentos
   */

  partidas () {
    return this.hasMany(Partida)
  }

  /**
   * Métodos
   */

  ultimaPartida () {
    return this.partidas().where('ultima', 1).first()
  }
}
