import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = async ({ redirect, store, route }) => {
  console.log('auth mdw!');
  const unprotected = ['/auth', '/auth/twofa', '/auth/42', '/auth/google', '/pseudo'];
  if (unprotected.find(path => path === route.path)) {
    console.log('auth: unprotected path');
    return;
  }
  const getterVal = store.getters['auth/isLogged'];
  console.log('Is logged?:', getterVal);
  if (!store.getters['auth/isLogged']) {
    await store.dispatch('auth/signOut');
    if (route.path !== '/auth') {
      redirect('/auth');
    }
  }
}

export default authMiddleware
