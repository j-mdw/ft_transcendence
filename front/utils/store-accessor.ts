import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AuthenticationModule from '~/store/auth'
import MeModule from '~/store/me'
import RelationshipModule from '~/store/relationship'
import UsersModule from '~/store/users'

let authenticationStore: AuthenticationModule
let usersStore: UsersModule
let meStore: MeModule
let relationshipStore: RelationshipModule

function initializeStores (store: Store<any>): void {
  authenticationStore = getModule(AuthenticationModule, store)
  usersStore = getModule(UsersModule, store)
  meStore = getModule(MeModule, store)
  relationshipStore = getModule(RelationshipModule, store)
}
export { initializeStores, authenticationStore, usersStore, meStore, relationshipStore }
