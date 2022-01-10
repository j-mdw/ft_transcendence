<template>
  <v-container fill-height>
    <!-- <v-row no-gutters> -->
    <v-row justify="center" align="center">
      <v-col sm="4" align="center" justify="center">
        <v-avatar size="250px">
          <img :src="`http://localhost:4000/${user.avatarPath}`">
        </v-avatar>
        <v-row justify="center" align="center" class="mt-8">
          <relationship-buttons :user-id="$route.params.id" />
        </v-row>
        <h1 v-if="user">
          <br>
          {{ user.pseudo }}
        </h1>
      </v-col>
      <v-col sm="8" align="center" justify="center">
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
          <div>
            victories <br>
            0
          </div>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
          <div>
            losses <br>
            0
          </div>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          height="200px"
          align="center"
          max-width="500px"
        >
          MATCHES
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { meStore, usersStore } from '~/store';
import { User } from '~/models/user'
import relationshipButtons from '~/components/relationshipButtons.vue';

export default Vue.extend({
  components: { relationshipButtons },
  layout: 'default',
  data: () => ({
    relation: Object(),
  }),

  computed: {
    id () {
      return this.$route.params.id;
    },
    me (): User {
      return meStore.me;
    },

    user () : User {
      return usersStore.oneUser(this.$route.params.id);
    }
  },
  // For testing (left here for integration)
  async mounted () {
    const gameHist = await this.$axios.$get(`user/matches/${this.$route.params.id}`, { withCredentials: true });
    console.log(gameHist);
  },
});
</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i {
    font-size: 32px;
  }
}
</style>
