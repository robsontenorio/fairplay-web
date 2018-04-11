var path = require('path')

let API_URL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:8000/api' : 'https://fairplay-api.arena17.com/api/'
let API_URL_SOCKET = (process.env.NODE_ENV !== 'production') ? 'http://localhost:6001' : 'https://fairplay-api.arena17.com:6001'
let API_URL_STORAGE = (process.env.NODE_ENV !== 'production') ? 'http://localhost:8000/storage/' : 'https://fairplay-api.arena17.com/storage'

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
    '@nuxtjs/axios'
  ],
  env: {
    API_URL: API_URL,
    API_URL_SOCKET: API_URL_SOCKET,
    API_URL_STORAGE: API_URL_STORAGE
  },
  axios: {
    proxyHeaders: false,
    credentials: false,
    baseURL: API_URL,
    requestInterceptor: (config, { store }) => {
      if (store.state['auth']['token']) {
        config.headers.common['Authorization'] = 'Bearer ' + store.state['auth']['token']
      }
      return config
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

        config.resolve.alias['root'] = path.resolve(__dirname, 'node_modules')
        config.resolve.alias['vue-api-query'] = '/Volumes/BackupHD/Dropbox/dev/vue-api-query/src'

        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/
        // })
      }
    }
  }
}
