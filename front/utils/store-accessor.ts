import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '~/store/mymodule'

 let moduleStore: AuthModule

function initialiseStores(store: Store<any>): void {
    moduleStore = getModule(AuthModule, store)
}
// , authStore
export { initialiseStores, moduleStore }