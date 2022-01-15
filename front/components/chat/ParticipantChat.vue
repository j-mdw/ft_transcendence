<template>
  <div v-if="thisChannel.owner == me.id">
    <owner-view :channel-id="channelId" />
  </div>
  <div v-else-if="amIAdmin == true">
    <admin-view :channel-id="channelId" />
  </div>
  <div v-else>
    <user-view :channel-id="channelId" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import OwnerView from './participantsView/ownerView.vue';
import AdminView from './participantsView/adminView.vue';
import UserView from './participantsView/userView.vue';
import { ChannelDTO, User } from '~/models';
import { channelsStore, meStore } from '~/store';

export default Vue.extend({
  components: { OwnerView, AdminView, UserView },
  props: ['channelId'],
  data () {
    return {
      participants: Object(),
      counter: this.channelId
    };
  },
  computed: {
    me (): User {
      return meStore.me;
    },
    thisChannel (): ChannelDTO | undefined {
      return channelsStore.one(this.counter);
    },

    amIAdmin () : boolean {
      channelsStore.fetch()
      for (let i = 0; i < this.participants.length; i++) {
        if (this.participants[i].userId == this.me.id) {
          if (this.participants[i].admin) { return (true); } else { return false }
        }
      }
      console.log('NOT found')
      return false
    }
  },
  async mounted () {
    channelsStore.fetch();
    this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
  },
  methods: {
  },

});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>
