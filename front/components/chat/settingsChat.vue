<template>
  <div>
    <v-col>
      <v-dialog
        v-model="dialog"
        width="50%"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="#f5cac3"
            class="mr-6"
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

          <v-divider />
          <v-row justify="center" align="center">
            <v-btn
              v-if="thisChannelOwner != me.id"
              color="#f5cac3"
              class="mt-6 mb-6 mr-6"
              @click="leaveChannel()"
            >
              Leave channel
            </v-btn>

            <div v-if="thisChannelOwner == me.id">
              <v-btn
                color="#f5cac3"
                class="mt-6 mb-6 ml-6"
                @click="deleteChannel()"
              >
                delete channel
              </v-btn>
            </div>
            <div
              v-if="thisChannel.type == 1"
            >
              <add-participant-private :channel-id="channelId" />
            </div>
          </v-row>
          <v-divider />
          <div v-if="thisChannelOwner == me.id">
            <v-card-title class="our_dark_beige our_navy_blue--text">
              Change channel Type
            </v-card-title>
            <type-chat :channel-id="channelId" />
          </div>
          <v-divider />
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
import AddParticipantPrivate from './addParticipantPrivate.vue';
import { meStore, channelsStore } from '~/store';
import { ChannelDTO, User } from '~/models'

export default Vue.extend({
  components: { ParticipantChat, TypeChat, AddParticipantPrivate },
  layout: 'default',
  props: ['channelId'],
  data () {
    return {
      messages: [] as string[],
      current_message: '',
      dialog: false,
    }
  },
  computed: {
    me (): User {
      return meStore.me;
    },
    thisChannel () : ChannelDTO | undefined {
      return channelsStore.one(this.channelId);
    },
    thisChannelOwner (): string | undefined {
      return this.thisChannel?.owner
    }
  },
  mounted () {
  },
  methods: {
    async deleteChannel () {
      await this.$axios.$delete(`/channel/${this.channelId}`, { withCredentials: true });
      channelsStore.fetch();
      this.$router.push('/channels')
    },
    async leaveChannel () {
      await this.$axios.$delete(`/channel/${this.channelId}/${this.me.id}`, { withCredentials: true });
      channelsStore.fetch();
      this.$router.push('/channels')
    }
  }
})
</script>

<style scoped lang="scss">
</style>
