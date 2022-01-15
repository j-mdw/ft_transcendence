import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = async ({ redirect, store, route }) => {
  const unprotected = ['/auth', '/auth/twofa', '/auth/callback/42', '/auth/callback/google', '/pseudo'];
  if (unprotected.find(path => path === route.path)) {
    return;
  }
  if (!store.getters['auth/isLogged']) {
    await store.dispatch('auth/signOut');
    if (route.path !== '/auth') {
      redirect('/auth');
    }
  }
}

export default authMiddleware
