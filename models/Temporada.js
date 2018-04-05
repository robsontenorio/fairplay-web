import Model from './Model'
import Classificacao from './Classificacao'

export default class Temporada extends Model {
  classificacoes () {
    return this.hasMany(Classificacao)
  }
}
