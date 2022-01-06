import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = async ({ redirect, store, route }) => {
  if (!store.getters['auth/isLogged']) {
    await store.dispatch('auth/signOut');
    if (route.path !== '/auth') {
      redirect('/auth')
    }
  }
}

export default authMiddleware
