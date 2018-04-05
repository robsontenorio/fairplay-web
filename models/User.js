import Model from './Model'
import Partida from './Partida'

export default class User extends Model {
  partidas () {
    return this.hasMany(Partida)
  }
}
