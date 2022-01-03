<template>
 <div>
        <v-col>
          <!-- <v-btn color="#f5cac3" class="mt-6">
          settings
          <v-icon color="#395c6b" right>
            fa fa-cog
          </v-icon>
          </v-btn> -->
          <v-dialog
      v-model="dialog"
      width="50%"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#f5cac3" class="mr-6"
          v-bind="attrs"
          v-on="on"
        >
          settings
        </v-btn>
      </template>

      <v-card class="our_beige">
        <v-card-title class="our_dark_beige our_navy_blue--text">
          Channel Settings
        </v-card-title>

        

        <v-divider></v-divider>
        <v-row justify="center" align="center">
          <v-btn
            v-if="thisChannelOwner != me.id"
            color="#f5cac3" class="mt-6 mb-6 mr-6"  @click="leaveChannel()"
          >
            Leave channel
          </v-btn>

          <div v-if="thisChannelOwner == me.id">
          <v-btn
            color="#f5cac3" class="mt-6 mb-6 ml-6" @click="deleteChannel()"
          >
            delete channel
          </v-btn>
          <v-btn
            v-if="thisChannel.type == 1"
            color="#f5cac3" class="mt-6 mb-6 ml-6" @click="deleteChannel()"
          >
            add participant
          </v-btn>
          </div>
        </v-row>
        <v-divider></v-divider>
        <div v-if="thisChannelOwner == me.id">
        <v-card-title class="our_dark_beige our_navy_blue--text">
          Change channel Type
        </v-card-title>
        <type-chat :channel-id="channelId"/>
        </div>
        <v-divider></v-divider>
        <v-card-title class="our_dark_beige our_navy_blue--text">
          Channel Participants
        </v-card-title>
        <participant-chat :channel-id="channelId" />
        
      </v-card>
    </v-dialog>

        </v-col>
  

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ParticipantChat from './ParticipantChat.vue'
import TypeChat from './typeChat.vue'
import { meStore, channelsStore } from '~/store';
export default Vue.extend({
  components: { ParticipantChat, TypeChat },
  layout: 'default',
  props: ['channelId'],
  data () {
    return {
      messages: Array<string>(),
      current_message: ''
    }
  },
  computed : {
     me () {
       return meStore.me;
     },
     thisChannel () {
        return  channelsStore.one(this.channelId);
      },

      thisChannelOwner: function (): any {
        return this.thisChannel?.owner
      }
     
  },
  mounted () {


  },
  methods: {
    async deleteChannel(id: string) {
      await this.$axios.$delete(`/channel/${this.channelId}`, { withCredentials: true});
      channelsStore.fetch();
      this.$router.push('/channels')
    },
    async leaveChannel(){
      await this.$axios.$delete(`/channel/${this.channelId}/${this.me.id}`, { withCredentials: true});
      channelsStore.fetch();
      this.$router.push('/channels')
    }
  }
})
</script>

<style scoped lang="scss">


</style>

