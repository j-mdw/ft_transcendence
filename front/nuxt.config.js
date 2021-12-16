import colors from 'vuetify/es5/util/colors'
// import IconComponent from './components/Logo/message.vue'

export default {
  components: true,
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - new_front_bis',
    title: 'new_front_bis',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { 
        rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'
      }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'font-awesome/css/font-awesome.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/socket.ts',
      ssr: false,
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxt/components'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    'vuetify-dialog/nuxt',
  ],

  axios: {
    // extra config e.g
      baseURL: 'http://localhost:4000'
  },

  vuetifyDialog: {
    property: '$dialog',
    confirm: {},
    error: {}
    // ...
  },


  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // values: {
    //   product: {
    //     component: IconComponent, // you can use string here if component is registered globally
    //   },
    // },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: '#f28482',
          accent: '#f28482',
          secondary: '#f28482',
          info: '#f28482',
          warning: '#f28482',
          error: '#f28482',
          success: '#f6bd60',
          our_yellow: "#f6bd60",
          our_beige: "#f7ede2",
          our_light_pink: "#f5cac3",
          our_navy_blue: "#395c6b",
          our_dark_pink: "#f28482",
          our_dark_beige: "#ebd9c5"
        }
      }
    },icons: {
      iconfont: 'fa4', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  production_mode: false, //Added for use of random users in development mode
}
