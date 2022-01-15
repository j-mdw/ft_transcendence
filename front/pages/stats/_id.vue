<template>
  <v-container fill-height>
    <v-row class="mt-4 mb-n7 ml-1">
      <h1> {{ getPseudo() }} Stats : </h1>
    </v-row>
    <v-row class="mt-n8 ">
      <v-col
        sm="5"
        class="ml-10"
        align="center"
        justify="center"
      >
        <match-history :user-id="$route.params.id" />
      </v-col>
      <v-col
        sm="5"
        class="mr-10"
        align="center"
        justify="center"
      >
        <v-card
          class="pa-2 mb-7 mt-7 our_navy_blue--text"
          color="our_dark_beige"
          outlined
          align="center"
          max-width="500px"
        >
          <h3>
            Level : {{ getLevel() }}
          </h3>
        </v-card>

        <v-card
          class="pa-2 mb-7 mt-7 our_navy_blue--text"
          color="our_dark_beige"
          outlined
          align="center"
          max-width="500px"
        >
          <h3>
            Victories : {{ user.victories }}  / {{ getMatches() }}
          </h3>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7 our_navy_blue--text"
          color="our_dark_beige"
          outlined
          align="center"
          max-width="500px"
        >
          <h3>
            Defeats : {{ user.defeats }}  / {{ getMatches() }}
          </h3>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import matchHistory from '~/components/stats/matchHistory.vue';
import { usersStore } from '~/store'
import { User } from '~/models/user'

export default Vue.extend({
  components: { matchHistory },
  layout: 'default',
  data () {
    return {
      matches: Object(),

    };
  },

  computed: {
    user (): User {
      return usersStore.oneUser(this.$route.params.id);
    },
  },

  async mounted () {
    this.matches = await this.$axios.$get(`user/matches/${this.$route.params.id}`, { withCredentials: true });
  },

  methods: {
    getPseudo () {
      return usersStore.oneUser(this.$route.params.id).pseudo;
    },
    getVictories () {
      let e = 0;
      for (let i = 0; i < this.matches.length; i++) {
        if (this.matches[i].user1Score > this.matches[i].user2Score) { e++; }
      }
      return e;
    },
    getLosses () {
      let e = 0;
      for (let i = 0; i < this.matches.length; i++) {
        if (this.matches[i].user2Score > this.matches[i].user1Score) { e++; }
      }
      return e;
    },
    getMatches () {
      return (this.matches.length)
    },
    getLevel () {
      const win = this.getVictories();
      if (win === 0) {
        return 0
      } else {
        return (Math.round((win * 0.4) * 100) / 100);
      }
    },
  },

})

</script>

<style scoped lang="scss">
.scroll {
   overflow-y: scroll
}
</style>
