import { Model } from 'vue-api-query'

// inject global axios instance as http client to Model
export default function (ctx, injext) {
  Model.$http = ctx.$axios
}
