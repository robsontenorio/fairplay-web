let API_URL = (process.env.NODE_ENV !== 'production') ? 'http://fairplay-api.dev/api/' : 'http://IP/api/'
let API_URL_SOCKET = (process.env.NODE_ENV !== 'production') ? 'http://fairplay-api.dev:6001' : 'http://IP:6001'
let API_URL_STORAGE = (process.env.NODE_ENV !== 'production') ? 'http://fairplay-api.dev/storage/' : 'http://IP:6001'

module.exports = {
  ssr: false,
  mode: 'spa',
  head: {
    title: 'Arena Fair Play',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Você joga limpo?' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: {
    color: 'green',
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
    '~plugins/buefy',
    '~plugins/socket.io'
  ],
  modules: [
    '@nuxtjs/font-awesome',
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
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    }
  }
}
