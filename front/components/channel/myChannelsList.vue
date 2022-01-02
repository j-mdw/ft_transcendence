<template>
  <v-container>
    <v-row no-gutters class="mt-2">
      <template v-for="(channel, index) in myChannel" >
        <v-col :key="index" class="ml-2 mr-2">
          <v-btn
            class="pa-2 mt-2 mb-2" 
            width="400"
            color="#ebd9c5"
          >
            <v-col> 
                {{ channel.name }}
            </v-col> 
            <v-col>
            <div v-if="channel.type == 0" >
                <h5> public </h5>
              </div>
              <div v-if="channel.type == 1">
                <h5>private</h5>
              </div>
              <div v-if="channel.type == 2">
                <h5>protected</h5>
              </div>
            </v-col> 
          </v-btn>
        </v-col>
        
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import { ChannelDTO } from '~/models/channel'
import { channelsStore } from '~/store';

export default Vue.extend({
  computed: {
    myChannel () {
      return channelsStore.mine
    },
  }
})
</script>