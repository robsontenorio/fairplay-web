require('dotenv').config()

module.exports = {
  ssr: false,
  mode: 'spa',
  head: {
    title: 'FAIRPLAY',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Você joga limpo?' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/cf07100fec.css' }
    ]
  },
  css: [
    '~/assets/style/app.styl'
  ],
  loading: {
    color: '#23d160',
    height: '4px'
  },

  loadingIndicator: {
    name: 'pulse',
    color: 'blue',
    background: 'white'
  },
  router: {
    linkActiveClass: 'is-active'
  },
  plugins: [
    '~plugins/vuetify',
    '~plugins/vee-validate',
    '~plugins/socket.io',
    '~plugins/vue-api-query'
  ],
  modules: [
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv'
  ],
  env: {
    API_URL: process.env.API_URL,
    API_URL_SOCKET: process.env.API_URL_SOCKET,
    API_URL_STORAGE: process.env.API_URL_STORAGE
  },
  axios: {
    baseURL: process.env.API_URL,
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login' },
          logout: { url: '/auth/logout', method: 'GET' },
          user: { url: '/auth/user' }
        }
      }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/plugins/vuetify.js'
    ],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {

      if (isDev && isClient) {
        // config.resolve.alias['vue-api-query'] = '/Volumes/BackupHD/Dropbox/dev/vue-api-query/src'

        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
