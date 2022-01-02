<template>
  <div v-if="thisChannel.owner == me.id">
    <owner-view :channel-id="channelId"/>
  </div>
  <div v-else-if="isAdmin(me.id)">
    <owner-view :channel-id="channelId"/>
  </div>
  <div v-else>
    <user-view :channel-id="channelId"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Relationship, User } from "~/models";
import { usersStore, meStore, relationshipStore, channelsStore  } from "~/store";
import messageLogo from "../../components/Logo/messageLogo.vue";
import pingpongLogo from "../../components/Logo/pingpongLogo.vue";
import UserView from "./participantsView/userView.vue";
import OwnerView from './participantsView/ownerView.vue'

export default Vue.extend({
  components: { messageLogo, pingpongLogo, OwnerView, UserView },
  props: ['channelId'],
  data() {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ["#AFE796", "#F7F4E8", "#C596E7"],
      participants: Object(),
      participant: Object(),
    };
  },
  computed : {
     me () {
       return meStore.me;
     },
     thisChannel () {
        return  channelsStore.one(this.channelId);
      }
     
  },

  async mounted () {
    this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    console.log("My participants");
    console.log(this.participants);
    
  },


  methods: {
    getAvatar(peerId: string) {
        return usersStore.oneUser(peerId).avatarPath;
    },

    getPseudo(peerId: string)
    {
        return usersStore.oneUser(peerId).pseudo;
    },

    getStatus(peerId: string)
    {
        return usersStore.oneUser(peerId).status;
    },

    async isAdmin(peerId: string)
    {
      this.participant = await this.$axios.$get(`channel/${this.channelId}/${peerId}`, { withCredentials: true });
      if(this.participant.admin)
        return(true);
      else false
    }
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>