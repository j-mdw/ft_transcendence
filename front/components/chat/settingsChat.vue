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
            color="#f5cac3" class="mt-6 mb-6 mr-6" 
          >
            Leave channel
          </v-btn>

          <v-btn
            v-if="thisChannel.owner == me.id"
            color="#f5cac3" class="mt-6 mb-6 ml-6" @click="deleteChannel()"
          >
            delete channel
          </v-btn>
        </v-row>
        <v-divider></v-divider>
        <v-card-title class="our_dark_beige our_navy_blue--text">
          Change channel Type
        </v-card-title>
        <type-chat/>
        <v-divider></v-divider>
        <v-card-title class="our_dark_beige our_navy_blue--text">
          Channel Participants
        </v-card-title>
        <participant-chat/>
        
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
      }
     
  },
  mounted () {


  },
  methods: {
    async deleteChannel(id: string) {
      console.log("channel ID")
      console.log(this.channelId)
      await this.$axios.$delete(`/channel/${this.channelId}`, { withCredentials: true});
      this.$router.push('/')
    },
  }
})
</script>

<style scoped lang="scss">


</style>

