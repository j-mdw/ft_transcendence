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
      </v-list-item-content>
    </v-list-item>
  </v-card>
  <NuxtLink to="/channels/create">Create Channel</NuxtLink>
</div>
</template>

<script lang="ts">

export enum ChannelType {
  public,
  private,
  password,
}

export interface IChannelDTO {
  name: string;
  type: ChannelType;
}

export interface ICreateChannelDTO {
  name: string;
  type: ChannelType;
  password?: string;
}

export interface IDeleteChannelDTO {
  name: string;
}

import Vue from 'vue'
export default Vue.extend({
	data() {
		return {
			channels: Array<IChannelDTO>(),
		}
	},
  methods: {
    async createChannel() {

    },
    async deleteChannel() {},
    async updateChannel() {},
  },
  async mounted() {
    this.channels = await this.$axios.$get('/channel', {withCredentials: true})
  },
})
</script>