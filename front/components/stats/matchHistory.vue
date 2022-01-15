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
    <div v-if="gamesPlayed.length == 0">
      <v-row justify="center" class="mt-11">
        <h3>
          Sorry there is no history<br>
        </h3>
      </v-row>
    </div>
    <div v-else>
      <div class="mt-5">
        <v-list class="our_dark_beige">
          <div v-for="game in gamesPlayed" :key="game.user2Id">
            <v-row align="center" justify="center" class="mt-4 mb-4">
              <v-col class="ml-8">
                <v-row align="center" justify="center">
                  <div v-if="game.user1Id == me.id">
                    <v-list-item-avatar>
                      <v-avatar>
                        <v-img
                          :src="`/api/${getAvatar(game.user1Id)}`"
                        />
                      </v-avatar>
                    </v-list-item-avatar>
                  </div>
                  <div v-else>
                    <v-list-item-avatar>
                      <NuxtLink :to="`/profile/${game.user1Id}`">
                        <v-avatar>
                          <v-img
                            :src="`/api/${getAvatar(game.user1Id)}`"
                          />
                        </v-avatar>
                      </NuxtLink>
                    </v-list-item-avatar>
                  </div>
                </v-row>
                <v-row align="center" justify="center" class="mr-1">
                  {{ getPseudo(game.user1Id) }}
                </v-row>
              </v-col>
              <h4>
                {{ game.user1Score }} - {{ game.user2Score }}
              </h4>
              <v-col class="ml-8">
                <v-row align="center" justify="center">
                  <div v-if="game.user2Id == me.id">
                    <v-list-item-avatar>
                      <v-avatar>
                        <v-img
                          :src="`/api/${getAvatar(game.user2Id)}`"
                        />
                      </v-avatar>
                    </v-list-item-avatar>
                  </div>
                  <div v-else>
                    <v-list-item-avatar>
                      <NuxtLink :to="`/profile/${game.user2Id}`">
                        <v-avatar>
                          <v-img
                            :src="`/api/${getAvatar(game.user2Id)}`"
                          />
                        </v-avatar>
                      </NuxtLink>
                    </v-list-item-avatar>
                  </div>
                </v-row>
                <v-row align="center" justify="center" class="mr-1">
                  {{ getPseudo(game.user2Id) }}
                </v-row>
              </v-col>
            </v-row>
            <v-divider />
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
      gamesPlayed: Object(),
    };
  },
  computed: {
    me (): User {
      return meStore.me;
    },
  },
  async mounted () {
    this.gamesPlayed = await this.$axios.$get(`/user/matches/${this.userId}`, { withCredentials: true });
  },
  methods: {
    getAvatar (peerId: string) {
      return usersStore.oneUser(peerId).avatarPath;
    },
    getPseudo (peerId: string) {
      return usersStore.oneUser(peerId).pseudo;
    },
  },
})
</script>

<style scoped lang="scss">
.scrolla {
   overflow-y: scroll;
   overflow-x: hidden !important;
}
</style>
