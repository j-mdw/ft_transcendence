import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AuthenticationModule from '~/store/auth'
import MeModule from '~/store/me'
import UsersModule from '~/store/users'

let authenticationStore: AuthenticationModule
let usersStore: UsersModule
let meStore: MeModule

function initializeStores (store: Store<any>): void {
  authenticationStore = getModule(AuthenticationModule, store)
  usersStore = getModule(UsersModule, store)
  meStore = getModule(MeModule, store)
}
export { initializeStores, authenticationStore, usersStore, meStore }
