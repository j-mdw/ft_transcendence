import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const plugin: Plugin = ({ $axios, redirect, store, route }) => {
  initializeAxios($axios);
  $axios.onError(async (error) => {
    if (error?.response?.status === 401 && !error?.request?.responseURL?.includes('/2fa/authenticate')) {
      await store.dispatch('auth/signOut');
      if (route.path !== '/auth') {
        redirect('/auth')
      }
      return;
    }
    throw error;
  });
}

export default plugin
