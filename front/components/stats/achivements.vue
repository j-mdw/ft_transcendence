<template>
  <v-container class="our_navy_blue--text">
    <v-row justify="center" align="center" no-gutters class="mt-14 mb-10" dense>
      <v-col sm="3" class="ml-3 mr-3">
        <v-row justify="center" align="center" no-gutters dense class="mb-3">
          1 match won
        </v-row>
        <v-icon v-if="getVictories() > 0" color="#395c6b" right>
          fa-paper-plane
        </v-icon>
        <v-icon v-else color="#808080" right>
          fa-paper-plane
        </v-icon>
      </v-col>
      <v-col sm="3" class="ml-3 mr-3">
        <v-row justify="center" align="center" no-gutters dense class="mb-3">
          10 match won
        </v-row>

        <v-icon v-if="getVictories() > 9" color="#395c6b" right>
          fa-plane
        </v-icon>
        <v-icon v-else color="#808080" right>
          fa-plane
        </v-icon>
      </v-col>
      <v-col sm="3" class="ml-3 mr-3">
        <v-row justify="center" align="center" no-gutters dense class="mb-3">
          20 match won
        </v-row>
        <v-icon v-if="getVictories() > 19" color="#395c6b" right>
          fa-fighter-jet
        </v-icon>
        <v-icon v-else color="#808080" right>
          fa-fighter-jet
        </v-icon>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" no-gutters class="mt-10 mb-10" dense>
      <v-col sm="3" class="ml-3 mr-3">
        <v-row justify="center" align="center" no-gutters dense class="mb-3">
          1 friend
        </v-row>
        <v-icon v-if="howManyfriends() > 0" color="#395c6b" right>
          fa-user-friends
        </v-icon>
        <v-icon v-else color="#808080" right>
          fa-user-friends
        </v-icon>
      </v-col>
      <v-col sm="3" class="ml-3 mr-3">
        <v-row justify="center" align="center" no-gutters dense class="mb-3">
          10 friends
        </v-row>
        <v-icon v-if="howManyfriends() > 9" color="#395c6b" right>
          fa-user-friends
        </v-icon>
        <v-icon v-else color="#808080" right>
          fa-users
        </v-icon>
      </v-col>
      <v-col sm="3" class="ml-3 mr-3">
        <v-row justify="center" align="center" no-gutters dense class="mb-3">
          20 friends
        </v-row>
        <v-icon v-if="howManyfriends() > 19" color="#395c6b" right>
          fa-user-friends
        </v-icon>
        <v-icon v-else color="#808080" right>
          fa-crown
        </v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { meStore, relationshipStore } from '~/store'
import { User } from '~/models/user'
import { Relationship } from '~/models/relationship'

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

    relationships (): Relationship[] {
      return relationshipStore.all;
    },
  },

  async mounted () {
    this.matches = await this.$axios.$get(`user/matches/${this.userId}`, { withCredentials: true });
  },

  methods: {
    getVictories () {
      let e = 0;
      for (let i = 0; i < this.matches.length; i++) {
        if (this.matches[i].user1Score > this.matches[i].user2Score) { e++; }
      }
      return e;
    },

    howManyfriends (): number {
      let j = 0;
      for (let i = 0; this.relationships[i]; i++) {
        if (this.relationships[i].type === 3) { j++ }
      }
      return j;
    }
  },
})

</script>
