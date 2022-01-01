import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect, store, route }) => {
  if (!store.getters['auth/isLogged']) {
    store.dispatch('auth/signOut');
    if (route.path !== '/auth') {
      redirect('/auth')
    }
  }
}

export default middleware
