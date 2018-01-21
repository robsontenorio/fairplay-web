<template>
  <div>
    <v-alert color="info" icon="info" :value="true" class="mb-3">
      Antes de jogar, por favor, ajude-nos a decidir quem foi o vencedor. Você ganha pontos no ranking se o seu voto for correto.
      <strong>Vote com sabedoria.</strong>
    </v-alert>
    <div v-if="julgamentos.length === 0">
      jogar
    </div>
    <div v-if="julgamentos.length > 0">
      <v-card :key="julgamento.id" v-for="julgamento in julgamentos" class="mb-3">
        <v-card-text @click="verJulgamento(julgamento)">
          <v-layout text-xs-center>
            <v-flex xs5>
              <v-avatar size="48" class="mb-2">
                <img :src="julgamento.partida.user1.avatar" />
              </v-avatar>
              <div>
                <strong>{{ julgamento.partida.user1.identificador }}</strong>
              </div>
            </v-flex>
            <v-flex xs2 class="mt-1 display-1">
              vs
            </v-flex>
            <v-flex xs5>
              <v-avatar size="48" class="mb-2">
                <img :src="julgamento.partida.user2.avatar" />
              </v-avatar>
              <div>
                <strong>{{ julgamento.partida.user2.identificador }}</strong>
              </div>
            </v-flex>
          </v-layout>

        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import Profile from '~/components/Profile'

export default {
  middleware: 'auth',
  components: { Profile },
  data () {
    return {
      id: null,
      julgamentos: []
    }
  },
  async mounted () {
    let response
    response = await this.$axios.get('/julgamentos')
    this.julgamentos = response.data
  },
  methods: {
    verJulgamento (julgamento) {
      this.$router.push(`/julgamentos/${julgamento.id}`)
    }
  }
}
</script>