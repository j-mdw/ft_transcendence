import { Middleware } from '@nuxt/types'
import { moduleStore } from '~/store'

const middleware: Middleware = ({ redirect, store }) => {
 // console.log("coucou")
  //console.log(moduleStore.isLogged)
  //if (!moduleStore.isLogged) {
    //console.log(store.getters['auth/isLogged'])
    return redirect('/auth')
    //(this as any).$router.push('/auth')
    // .catch(error => {
    //   console.info(error.message)
    // })
  //}
}

export default middleware