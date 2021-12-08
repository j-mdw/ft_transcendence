import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const plugin: Plugin = ({ $axios }) => {
  initializeAxios($axios)
}

export default plugin
