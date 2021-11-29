import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect, store }) => {
  if (!store.getters['auth/isLogged']){ 
    return redirect('/auth')
  }
}

export default middleware