<template>
  <div>
    <v-btn color="#F6BD60" v-bind="attrs" to="/channels/create" class="mt-9 ml-8" v-on="on">
      create channel
    </v-btn>

    <v-row no-gutters class="mb-6" justify="center" align="center">
      <v-col v-for="(channel, index) in channels" :key="index">
        <v-list-item>
          <v-card width="500" height="50" class="mt-5" color="#ebd9c5">
          <v-row justify="center" align="center">
            <v-col>
            <v-list-item-title class="">
              {{ channel.name }}
            </v-list-item-title>
            </v-col>
            <v-col>
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
            </v-col>
            <v-btn
              class=""
              @click="deleteChannel(channel.id)"
            >
              Delete Channel
            </v-btn>
            </v-row>
          </v-card>
        </v-list-item>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { ChannelDTO } from '~/models/channel'

export default Vue.extend({
  data () {
    return {
      channels: Array<ChannelDTO>(),
    }
  },
  async mounted () {
    this.channels = await this.$axios.$get('/channel', { withCredentials: true })
  },
  methods: {
    async createChannel () {

    },
    async deleteChannel (id: string) {
      await this.$axios.$delete('/channel', { params: { id }, withCredentials: true });
      this.channels = await this.$axios.$get('/channel', { withCredentials: true })
    },
    async updateChannel () {},
  },
})
</script>
