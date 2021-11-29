<template>
<div>
  <v-card
    class="mx-auto"
    max-width="400"
    tile
  >
    <v-list-item :key="index" v-for="(channel, index) in channels">
      <v-list-item-content>
        <v-list-item-title> {{ channel.name }} </v-list-item-title>
        <v-list-item-subtitle> {{ channel.type }} </v-list-item-subtitle>
        <v-btn
        @click="deleteChannel(channel.id)"
        >
          Delete Channel
        </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-card>
  <NuxtLink to="/channels/create">Create Channel</NuxtLink>
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