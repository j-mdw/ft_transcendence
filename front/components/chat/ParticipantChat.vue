<template>
  <div v-if="thisChannel.owner == me.id">
    <owner-view :channel-id="channelId"/>
  </div>
  <div v-else-if="amIAdmin == true">
     <admin-view :channel-id="channelId"/> 
    <!-- COUCOU -->
  </div>
  <div v-else >
    
    <user-view :channel-id="channelId"/>
    <!-- POUET -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Relationship, User } from "~/models";
import { usersStore, meStore, channelsStore } from "~/store";
import messageLogo from "../../components/Logo/messageLogo.vue";
import pingpongLogo from "../../components/Logo/pingpongLogo.vue";
import { ChannelDTO } from '~/models';
import OwnerView from "./participantsView/ownerView.vue";
import AdminView from "./participantsView/adminView.vue";
import UserView from "./participantsView/userView.vue";
export default Vue.extend({
  components: { messageLogo, pingpongLogo, OwnerView, AdminView, UserView },
  props: ['channelId'],
  data() {
    return {
      participants: Object(),
      counter: this.channelId
    };
  },
  computed : {
    me () {
       return meStore.me;
     },
    thisChannel: function (): any {
        return  channelsStore.one(this.counter);
    },

    amIAdmin: function (): any {   
       channelsStore.fetch()
      for (let i = 0; i < this.participants.length; i++) {
        if(this.participants[i].userId == this.me.id)
        {
          if(this.participants[i].admin)
          {
            console.log(" he is ADMIIIN")
            return(true);
          }
          else 
          {
            console.log("NOT ADMIIIN")
            return false
          }
        }
        
      }
      console.log("NOT found")
      return false
    }
  },
  async mounted () {
    channelsStore.fetch();
    this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    console.log("My participants chat ");
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

  },
  
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>