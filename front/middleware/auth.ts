import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect, store }) => {
  //console.log("coucou")
  console.log(store.getters['auth/isLogged'])
  if (!store.getters['auth/isLogged']) {
    //console.log(store.getters['auth/isLogged'])
    return redirect('/auth')
  }
}

export default middleware