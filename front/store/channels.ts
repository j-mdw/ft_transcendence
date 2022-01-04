import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ChannelDTO } from '~/models';
import { $axios } from '~/utils/api'

interface AllChans {
  myChan: ChannelDTO[];
  visibleChan: ChannelDTO[];
}

@Module({
  name: 'channels',
  stateFactory: true,
  namespaced: true
})
export default class ChannelsModule extends VuexModule {
  myChannels: ChannelDTO[] = [];
  visibleChannels: ChannelDTO[] = [];

  get mine () {
    return this.myChannels;
  }

  get visible () {
    return this.visibleChannels;
  }

  get one (): (channelId: string) => ChannelDTO | undefined {
    return (channelId: string) => {
      let channel = this.myChannels.find(channel => channel.id === channelId);
      console.log(this.myChannels)
      if (channel === undefined) {
        channel = this.visibleChannels.find(channel => channel.id === channelId);
      }

      return channel;
    };
  }

  @Mutation
  set (channels: AllChans) {
    this.myChannels = channels.myChan;
    this.visibleChannels = channels.visibleChan;
    for (let i = 0; i < this.myChannels.length; i++) {
      for (let j = 0; j < this.visibleChannels.length; j++) {
        if (this.visibleChannels[j].id === this.myChannels[i].id) {
          this.visibleChannels.splice(j, 1);
          break;
        }
      }
    }
  }

  @Action({ commit: 'set', rawError: true })
  async fetch () {
    console.log("FEEEETCH !!")
    const channels = {} as AllChans;
    channels.myChan = (await $axios.get('/user/channels', { withCredentials: true })).data;
    channels.visibleChan = (await $axios.get('/channel', { withCredentials: true })).data;
    return channels;
  }
}
