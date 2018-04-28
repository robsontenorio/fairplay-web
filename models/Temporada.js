import Model from './Model'
import Classificacao from './Classificacao'

export default class Temporada extends Model {
  resource () {
    return 'temporadas'
  }
  classificacoes () {
    return this.hasMany(Classificacao)
  }
}
