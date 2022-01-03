import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const plugin: Plugin = ({ $axios, redirect, store, route }) => {
  initializeAxios($axios);
  $axios.onError(async (error) => {
    if (error?.response?.status === 401) {
      await store.dispatch('auth/signOut');
      if (route.path !== '/auth') {
        redirect('/auth')
      }
    }
  });
}

export default plugin
