<template>
  <div class="mt-5">
    <v-list class="our_beige">
      <div v-for="relationship in relationships" :key="relationship.type">
        <div v-if="relationship.type == 3">
          <v-list-item class="ml-n3">
            <v-badge
              bottom
              :color="colors[getStatus(relationship.peerId)]"
              offset-x="30"
              offset-y="30"
            >
              <router-link :to="`/profile/${relationship.peerId}`">
                <v-list-item-avatar class="mt-4 mb-4">
                  <v-img
                    :src="`http://localhost:4000/${getAvatar(relationship.peerId)}`"
                  />
                </v-list-item-avatar>
              </router-link>
            </v-badge>
            <v-list-item-content>
              <v-list-item-title class="our_navy_blue--text" v-text="getPseudo(relationship.peerId)" />
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-ripple="false" plain to="/channels">
                <messageLogo />
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn v-ripple="false" plain icon>
                <pingpongLogo />
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </div>
      </div>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import messageLogo from '../../components/Logo/messageLogo.vue';
import pingpongLogo from '../../components/Logo/pingpongLogo.vue';
import { Relationship, User } from '~/models';
import { usersStore, meStore, relationshipStore } from '~/store';

export default Vue.extend({
  components: { messageLogo, pingpongLogo },
  data () {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ['#AFE796', '#F7F4E8', '#C596E7'],
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

  methods: {
    getAvatar (peerId: string) {
      return usersStore.oneUser(peerId).avatarPath;
    },

    getPseudo (peerId: string) {
      return usersStore.oneUser(peerId).pseudo;
    },

    getStatus (peerId: string) {
      return usersStore.oneUser(peerId).status;
    }
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>
