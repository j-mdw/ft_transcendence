<template>
  <div>
    <v-row align="center" class="mt-8 mb-8 ml-8">
    <v-btn color="#F6BD60" to="/channels/create" class="mt-9 ml-8" >
      create channel
    </v-btn>
    </v-row>
    <v-row justify="center" align="center" class="mt-5 mb-5">
    <v-card class="our_beige" width="90%">
        <v-card-title class="our_dark_beige our_navy_blue--text">
          My channels
        </v-card-title>
        <v-divider></v-divider>
        <my-channels-list/>
      </v-card>
    </v-row>
    <v-row justify="center" align="center" class="mt-5 mb-5">
    <v-card class="our_beige" width="90%">
        <v-card-title class="our_dark_beige our_navy_blue--text">
          Visible Channels
        </v-card-title>
        <v-divider></v-divider>
        <visible-channels/>
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import myChannelsList from '~/components/channel/myChannelsList.vue'
import VisibleChannels from '~/components/channel/visibleChannels.vue'
import { channelsStore } from '~/store';
import { ChannelDTO } from '~/models/channel'

export default Vue.extend({
  components: { myChannelsList, VisibleChannels },
  data () {
    return {
      channels: Array<ChannelDTO>(),
    }
  },

  computed: {
    myChannel () {
      return channelsStore.mine
    },
    visibleChannel () {
      return channelsStore.visible
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
