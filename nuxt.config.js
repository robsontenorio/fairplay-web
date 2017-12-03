module.exports = {
  ssr: false,
  mode: 'spa',
  /*
  ** Headers of the page
  */
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
  /*
  ** Customize the progress bar color
  */
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


  axios: {
    proxyHeaders: false,
    credentials: false,
    baseURL: (process.env.NODE_ENV !== 'production') ? 'http://fairplay-api.dev/api/' : 'http://IP:88/api/',
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
