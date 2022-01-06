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
          color="our_beige" 
          small
          v-bind="attrs"
          v-on="on"
        >
          join
        </v-btn>
      </template>
      <v-card class="our_beige" height="240" >       
        <v-card-title class="our_dark_beige our_navy_blue--text">
          channel password
        </v-card-title>
        <v-form
    ref="form"
    lazy-validation
    title="Create a channel"
  >
        <!-- <v-row align="center" justify="center"> -->
            <v-text-field
            v-model="password"
            label="password"
            required
            class="ml-4 mr-4"
            />
       <!-- </v-row> -->
        <v-row align="center" justify="center">
            <v-btn
            color="success"
            class="mr-4"
            @click="joinProtected()"
            >
            Send
            </v-btn>
        </v-row>
        </v-form>
        <div v-if="alertPassword == true" class="mt-6">
      <v-alert
        type="error"
        class=""
      >
         Sorry this user doesn't exist <br/>
        or he is already in the channel
      </v-alert>
      </div>
      </v-card>
    </v-dialog>

        </v-col>
  

  </div>
</template>


<script lang="ts">

import Vue from 'vue'
import { ChannelDTO } from '~/models/channel'
import { channelsStore, meStore } from '~/store';

export default Vue.extend({
    props: ['channelId'],
    data: () => ({
    password: '',
    dialog: false,
    alertPassword: false
  }),
   computed: {
     me () {
       return meStore.me;
     },
    visibleChannels () {
      return channelsStore.visible
    },
  },

  methods: {
    async joinProtected() {
      console.log("channel ID")
      console.log(this.channelId)
      console.log(this.me.id)
      try {
          this.alertPassword = false
          await this.$axios.$put(
              `/channel/${this.channelId}/${this.me.id}`,
              {
                  password: this.password
              },
              {
                 withCredentials: true
              }
          );
          console.log("still good")
      } catch (error: Error | any) {
         // debugger;
         this.alertPassword = true
          console.log(error.response.data)
      }
    
      if(this.alertPassword !== true) 
        this.$router.push(`/channels/${this.channelId}`)
    }
  }
})
</script>

<style scoped lang="scss">

.v-text-field{
      width: 5 !important;
}

</style>