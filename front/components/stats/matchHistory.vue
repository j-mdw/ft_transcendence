<template>
<v-card
          class="scrolla"
          color="our_dark_beige"
          height="300px"
          align="center"
          max-width="600px"
          justify="center"
        >
        <v-card-title class="our_beige our_navy_blue--text justify-center mb-n6">
          Match History
        </v-card-title>
    <div v-if="matches.length == 0">
         <v-row justify="center" class="mt-11">
            <h3>
              Sorry there is no history<br>
            </h3>
          </v-row>
      </div>
      <div v-else>
  <div class="mt-5">
    <v-list class="our_dark_beige">
      <div v-for="match in matches" :key="match.dates">
        <v-row align="center" justify="center" class="mt-4 mb-4">
          <v-col class="ml-8">
          <v-row align="center" justify="center">
          <v-list-item-avatar   >
          <router-link :to="`/profile/${match.user1Id}`">
            <v-avatar >
              <v-img
                :src="`http://localhost:4000/${getAvatar(match.user1Id)}`"
              />
            </v-avatar>
          </router-link>
           </v-list-item-avatar>
           </v-row>
           <v-row align="center" justify="center" class="mr-1">
             {{getPseudo(match.user1Id)}}
           </v-row>
           </v-col>
          <h4>
            {{match.user1Score}} - {{match.user2Score}} 
          </h4>
          <v-col class="ml-8">
          <v-row align="center" justify="center">
          <v-list-item-avatar   >
          <router-link :to="`/profile/${match.user2Id}`">
            <v-avatar >
              <v-img
                :src="`http://localhost:4000/${getAvatar(match.user2Id)}`"
              />
            </v-avatar>
          </router-link>
        </v-list-item-avatar>
        </v-row>
           <v-row align="center" justify="center" class="mr-1">
             {{getPseudo(match.user2Id)}}
           </v-row>
           </v-col>
        </v-row>
        <v-divider/>
      </div>
    </v-list>
  </div>
  </div>
  </v-card>

</template>

<script lang="ts">
import Vue from 'vue'
import { meStore, usersStore } from '~/store'
import { User } from '~/models/user'


export default Vue.extend({
  layout: 'default',
  props: ['userId'],
  data () {
    return {
     matches: Object(),
    };

    
  },

  computed: {
      me (): User {
        return meStore.me;
      },
  },

  methods: {
    getAvatar(peerId: string) {
        return usersStore.oneUser(peerId).avatarPath;
    },

    getPseudo(peerId: string)
    {
        return usersStore.oneUser(peerId).pseudo;
    },
  },

  async mounted () {
    this.matches = await this.$axios.$get(`user/matches/${this.userId}`, { withCredentials: true });
  },


})

</script>

<style scoped lang="scss">
.scrolla {
   overflow-y: scroll;
   overflow-x: hidden !important;
}
</style>

