<template>
<div>
    <v-btn color="#F6BD60" v-bind="attrs" v-on="on" to="/channels/create" class="mt-9 ml-8" >
      create channel
    </v-btn>

  
    <v-row no-gutters class="mb-6" justify="center" align="center">
    <v-col  :key="index" v-for="(channel, index) in channels" >
      <v-list-item>
        <v-card width="500" class="mt-5">
        <v-list-item-title class=""> {{ channel.name }} </v-list-item-title>
        <v-list-item-subtitle class=""> 
          <div v-if="channel.type == 0"> 
            public
          </div>
          <div v-if="channel.type == 1"> 
            private
          </div>
          <div v-if="channel.type == 2"> 
            protected
          </div>
        </v-list-item-subtitle>
        <v-btn
        class=""
        @click="deleteChannel(channel.id)"
        >
          Delete Channel
        </v-btn>
        </v-card>
      </v-list-item>
    </v-col>
    </v-row>   
</div>
</template>

<script lang="ts">

import { ChannelDTO } from '~/models/channel'

import Vue from 'vue'
export default Vue.extend({
	data() {
		return {
			channels: Array<ChannelDTO>(),
		}
	},
  methods: {
    async createChannel() {

    },
    async deleteChannel(id: string) {
      await this.$axios.$delete('/channel', {params: {'id': id}, withCredentials: true});
      this.channels = await this.$axios.$get('/channel', {withCredentials: true}) 
    },
    async updateChannel() {},
  },
  async mounted() {
    this.channels = await this.$axios.$get('/channel', {withCredentials: true})
  },
})
</script>