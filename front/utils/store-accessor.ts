/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AuthenticationModule from '~/store/auth'
import ChannelsModule from '~/store/channels'
import MeModule from '~/store/me'
import MessagesModule from '~/store/messages'
import RelationshipModule from '~/store/relationship'
import UsersModule from '~/store/users'

let authenticationStore: AuthenticationModule
let usersStore: UsersModule
let meStore: MeModule
let relationshipStore: RelationshipModule
let channelsStore: ChannelsModule
let messagesStore: MessagesModule

function initializeStores(store: Store<any>): void {
  authenticationStore = getModule(AuthenticationModule, store)
  usersStore = getModule(UsersModule, store)
  meStore = getModule(MeModule, store)
  relationshipStore = getModule(RelationshipModule, store)
  channelsStore = getModule(ChannelsModule, store)
  messagesStore = getModule(MessagesModule, store)
}
export {
  initializeStores,
  authenticationStore,
  usersStore,
  meStore,
  relationshipStore,
  channelsStore,
  messagesStore,
}
