import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AuthenticationModule from '~/store/auth'

 let authenticationStore: AuthenticationModule

function initializeStores(store: Store<any>): void {
    authenticationStore = getModule(AuthenticationModule, store)
}
// , authStore
export { initializeStores, authenticationStore, }