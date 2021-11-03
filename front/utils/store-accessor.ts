import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Counter2 from '~/store/mymodule'

 let moduleStore: Counter2

function initialiseStores(store: Store<any>): void {
    moduleStore = getModule(Counter2, store)
}
// , authStore
export { initialiseStores }