import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { relationshipStore } from '.';
import { MessageReceived, RelationshipType } from '~/models'
import { $axios } from '~/utils/api'

@Module({
  name: 'messages',
  stateFactory: true,
  namespaced: true,
})
export default class MessagesModule extends VuexModule {
  currentChannel: string = '';
  messages: MessageReceived[] = [];

  get channelMessages () {
    return this.messages;
  }

  get currentChannelId () {
    return this.currentChannel;
  }

  @Mutation
  set (messages: MessageReceived[]) {
    if (messages) {
      this.messages = messages;
      const relations = relationshipStore.all;
      for (let i = 0; i < relations.length; i++) {
        if (relations[i].type === RelationshipType.blocked) {
          this.messages = this.messages.filter(message => message.userId !== relations[i].peerId);
        }
      }
    }
  }

  @Mutation
  add (message: MessageReceived) {
    if (message.channelId === this.currentChannel) {
      console.log("we are in the first if")
      const relation = relationshipStore.one(message.userId);
      if (!relation || relation.type !== RelationshipType.blocked) {
        this.messages.push(message);
        console.log("we are in the second if")
        console.log(this.messages)
      }
    }
  }

  @Mutation
  setCurrentChannel (channelId: string) {
    this.currentChannel = channelId;
    this.messages = [];
  }

  @Action({ commit: 'set', rawError: true })
  async fetch () {
    if (this.currentChannel && this.currentChannel.length > 0) {
      return await $axios.$get(`channel/messages/${this.currentChannel}`, {withCredentials : true});
    }
  }
}
