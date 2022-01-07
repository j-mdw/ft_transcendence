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
            return(true);
          else
            return false
        }
        
      }
      console.log("NOT found")
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