<template>
  <div class="mt-5">
    <v-list class="our_beige">
      <div v-for="participant in participants" :key="participant.userId">
        <div v-if="UserExist(participant.userId)">
          <v-list-item class="ml-n3">
            <v-badge
              bottom
              :color="colors[getStatus(participant.userId)]"
              offset-x="30"
              offset-y="30"
            >
              <div v-if="participant.userId != me.id">
                <NuxtLink :to="`/profile/${participant.userId}`">
                  <v-list-item-avatar class="mt-4 mb-4">
                    <v-img
                      :src="`/api/${getAvatar(participant.userId)}`"
                    />
                  </v-list-item-avatar>
                </NuxtLink>
              </div>
              <div v-else>
                <v-list-item-avatar class="mt-4 mb-4">
                  <v-img
                    :src="`/api/${getAvatar(participant.userId)}`"
                  />
                </v-list-item-avatar>
              </div>
            </v-badge>
            <v-list-item-content>
              <v-list-item-title class="our_navy_blue--text" v-text="getPseudo(participant.userId)" />
            </v-list-item-content>
          </v-list-item>
        </div>
      </div>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Relationship, User } from '~/models';
import { usersStore, meStore, relationshipStore } from '~/store';
export default Vue.extend({
  props: ['channelId'],
  data () {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ['#AFE796', '#F7F4E8', '#C596E7'],
      participants: Object(),
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
    UserExist (peerId: string) {
      if (!usersStore.oneUser(peerId)) {
        return false
      }
      return (true);
    },
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>
