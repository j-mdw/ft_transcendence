<template>
  <div class="mt-5">
    <v-list class="our_beige">
      <div v-for="participant in participants" :key="participant.userId">
        <v-list-item class="ml-n3">
          <v-badge
            bottom
            :color="colors[getStatus(participant.userId)]"
            offset-x="30"
            offset-y="30"
          >
            <router-link :to="`/profile/${participant.userId}`">
              <v-list-item-avatar class="mt-4 mb-4">
                <v-img
                  :src="`/api/${getAvatar(participant.userId)}`"
                />
              </v-list-item-avatar>
            </router-link>
          </v-badge>
          <v-list-item-content>
            <v-list-item-title class="our_navy_blue--text" v-text="getPseudo(participant.userId)" />
          </v-list-item-content>
          <div v-if="participant.userId != me.id">
            <div v-if="participant.userId != thisChannelOwner">
              <v-list-item-action>
                <mute-button v-if="participant.muted == false" :user-id="participant.userId" :channel-id="channelId" @click="muteUser()" />
                <v-btn
                  v-else
                  v-ripple="false"
                  plain
                  icon
                  title="unmute"
                  @click="unmuteUser(participant.userId)"
                >
                  <v-icon color="#395c6b">
                    fa-volume-up
                  </v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn
                  v-if="participant.banned == false"
                  v-ripple="false"
                  plain
                  icon
                  title="ban"
                  @click="banUser(participant.userId)"
                >
                  <v-icon color="#395c6b">
                    fa-user-slash
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else
                  v-ripple="false"
                  plain
                  icon
                  title="ban"
                  @click="unbanUser(participant.userId)"
                >
                  <v-icon color="#395c6b">
                    fa-user
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </div>
          </div>
        </v-list-item>
      </div>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MuteButton from './muteButton.vue';
import { usersStore, meStore, relationshipStore, channelsStore } from '~/store';
import { Relationship, User, ChannelDTO } from '~/models';
export default Vue.extend({
  components: { MuteButton },
  props: ['channelId'],
  data () {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ['#AFE796', '#F7F4E8', '#C596E7'],
      participants: Object(),
      counter: this.channelId
    };
  },
  computed: {
    relationships (): Relationship[] {
      return relationshipStore.all;
    },
    users (): User[] {
      return usersStore.allUsers;
    },
    me (): User {
      return meStore.me;
    },

    thisChannel (): ChannelDTO | undefined {
      return channelsStore.one(this.counter);
    },

    thisChannelOwner (): string | undefined {
      return this.thisChannel?.owner
    }

  },
  async mounted () {
    this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
  },
  methods: {
    getAvatar (peerId: string) {
      return usersStore.oneUser(peerId).avatarPath;
    },
    getPseudo (peerId: string) {
      return usersStore.oneUser(peerId).pseudo;
    },
    getStatus (peerId: string) {
      return usersStore.oneUser(peerId).status;
    },
    async becomeAdmin (peerId: string) {
      await this.$axios.$patch(`channel/${this.channelId}/${peerId}`, { admin: true }, { withCredentials: true });
      this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    },
    async removeAdmin (peerId: string) {
      await this.$axios.$patch(`channel/${this.channelId}/${peerId}`, { admin: false }, { withCredentials: true });
      this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    },
    async muteUser () {
      this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    },
    async unmuteUser (peerId: string) {
      await this.$axios.$patch(`channel/${this.channelId}/${peerId}`, { muted: false }, { withCredentials: true });
      this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    },

    async banUser (peerId: string) {
      await this.$axios.$patch(`channel/${this.channelId}/${peerId}`, { banned: true }, { withCredentials: true });
      this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    },

    async unbanUser (peerId: string) {
      await this.$axios.$patch(`channel/${this.channelId}/${peerId}`, { banned: false }, { withCredentials: true });
      this.participants = await this.$axios.$get(`channel/${this.channelId}`, { withCredentials: true });
    }
  },

});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>
