<template>
<div v-if="doIhaverequest == 0">
         <v-row justify="center" class="mt-11">
            <h1>
              you have no more request<br>
            </h1>
          </v-row>
      </div>
      <div v-else>
  <div class="mt-5">
    <v-list class="our_beige">
      <div v-for="relationship in relationships" :key="relationship.peerId">
        <div v-if="relationship.type == 2">
          <div v-if="UserExist(relationship.peerId)">
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
          <div v-else>
            <v-row justify="center" align="center" class="mt-2">
            <h3> you will need to reload the page to see this user </h3>
            </v-row>
          </div>
        </div>
      </div>
    </v-list>
  </div>
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
    doIhaverequest(): number {
      let j = 0;

      for (let i = 0; this.relationships[i]; i++) {
        if(this.relationships[i].type == 2)
          j++
      }
      return j;
    }
  },

  methods: {
    UserExist(peerId: string) {
      // usersStore.fetchUsers();
      if(!usersStore.oneUser(peerId))
      {
        return false
      }
      return(true);
    },

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
