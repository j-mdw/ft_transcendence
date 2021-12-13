import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const plugin: Plugin = ({ $axios, redirect }) => {
  initializeAxios($axios);
  $axios.onError((error) => {
    if (error?.response?.status == 401) {
      redirect('/auth')
    }
  });
}

export default plugin
