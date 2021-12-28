import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const plugin: Plugin = ({ $axios, redirect, store }) => {
  initializeAxios($axios);
  $axios.onError((error) => {
    if (error?.response?.status === 401) {
      store.commit('auth/removeLogin');
      redirect('/auth')
    }
  });
}

export default plugin
