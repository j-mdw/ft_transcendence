<template>
  <div v-if="thisChannel.owner == me.id">
    <owner-view :channel-id="channelId"/>
  </div>
  <div v-else-if="isAdmin(me.id) == true">
    <admin-view :channel-id="channelId"/>
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
import AdminView from './participantsView/adminView.vue'


export default Vue.extend({
  components: { messageLogo, pingpongLogo, OwnerView, UserView, AdminView },
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
      console.log("SHHHHHHHHHIIIIIIIIT")
      for (let i = 0; i < this.participants.length; i++) {
        if(this.participants[i].userId = peerId)
        {
          if(this.participant.admin)
          {
            console.log("ADMINNN")
            return(true);
          }
          else 
          {
            console.log("NOT ADMINNN")
            return false
          }
        } 
      }
    }
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>