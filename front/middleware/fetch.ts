import { Middleware } from '@nuxt/types'

const fetchMiddleware: Middleware = async ({ store }) => {
  if (store.getters['auth/isLogged']) {
    if (!store.getters['fetchStatus/status']) {
      await store.dispatch('me/fetch');
      await store.dispatch('users/fetchUsers');
      await store.dispatch('relationship/fetch');
      await store.dispatch('channels/fetch');
      await store.dispatch('messages/fetch');
      store.commit('fetchStatus/complete');
    }
  }
}

export default fetchMiddleware
