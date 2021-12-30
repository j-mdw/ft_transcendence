<template>
  <div class="mt-5">
    <v-list class="our_beige">
      <div v-for="relationship in relationships" :key="relationship.type">
        <div v-if="relationship.type == 2">
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
            <v-list-item-title class="our_navy_blue--text" v-text="getPseudo(relationship.peerId)" />
            <v-col>
              <v-btn color="#f5cac3" class="mb-2 mt-2 ml-2 mr-2" @click="becomeFriends(relationship.peerId)">
                become friend
                <v-icon color="#395c6b" right>
                  fas fa-user-check
                </v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="#f5cac3" class="mb-2 mt-2 ml-2 mr-2" @click="deleteFriends(relationship.peerId)">
                delete invitation
                <v-icon color="#395c6b" right>
                  fas fa-trash-alt
                </v-icon>
              </v-btn>
            </v-col>
          </v-list-item>
        </div>
      </div>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Relationship, User, RelationshipType } from '~/models';
import { usersStore, meStore, relationshipStore } from '~/store';

export default Vue.extend({
  data () {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ['#AFE796', '#F7F4E8', '#C596E7'],
      alertBlocked: false,
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
    },

    async becomeFriends (peerId: string) {
      await this.$axios.$post(`relationships/${peerId}`, { type: RelationshipType.friend }, { withCredentials: true }).then((res) => {
        console.log('we are friends');
      })
        .catch((err) => {
          console.log('there is an error');
          console.log(err);
          this.alertBlocked = true;
        });
    },

    async deleteFriends (peerId:string) {
      await this.$axios.$delete(`relationships/${peerId}`, { withCredentials: true }).then((res) => {
        console.log('we nothing');
      })
        .catch((err) => {
          console.log('there is an error');
          console.log(err);
          this.alertBlocked = true;
        });
    },
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>
