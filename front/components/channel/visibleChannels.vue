<template>
  <v-container>
    <v-row no-gutters class="mt-2">
      <template v-for="(channel, index) in visibleChannels">
        <v-col :key="index" class="ml-2 mr-2">
          <v-btn
            class="pa-2 m-2 mb-2"
            width="400"
            color="#ebd9c5"
          >
            <div class="channel_name">
                {{ channel.name }}
                 </div>

            <v-col>
              <div v-if="channel.type == 0">
                <h5> public </h5>
              </div>
              <div v-if="channel.type == 1">
                <h5>private</h5>
              </div>
              <div v-if="channel.type == 2">
                <h5>protected</h5>
              </div>
            </v-col>
            <div v-if="channel.type == 2">
              <join-protected :channel-id="channel.id" />
            </div>
            <div v-if="channel.type == 0">
              <v-btn small class="our_beige" @click="joinPublic(channel.id)">
                join
              </v-btn>
            </div>
          </v-btn>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import joinProtected from './joinProtected.vue';
import { User, ChannelDTO } from '~/models';
import { channelsStore, meStore } from '~/store';

export default Vue.extend({
  components: { joinProtected },
  computed: {
    me (): User {
      return meStore.me;
    },
    visibleChannels (): ChannelDTO[] {
      return channelsStore.visible
    },
  },

  methods: {
    async joinPublic (id: string) {
      await this.$axios.$put(`/channel/${id}/${this.me.id}`, '', { withCredentials: true });
      channelsStore.fetch();
      this.$router.push(`/channels/${id}`)
    },
  }
})
</script>

<style scoped lang="scss">
.channel_name{
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  padding: 5px;
  margin: 0;
}
</style>