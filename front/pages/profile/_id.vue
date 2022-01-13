<template>
  <v-container fill-height>
    <!-- <v-row no-gutters> -->
    <v-row justify="center" align="center">
      <v-col sm="4" align="center" justify="center">
        <v-avatar size="250px">
          <img :src="`/api/${user.avatarPath}`">
        </v-avatar>

        <h1 v-if="user">
          <br>
          {{ user.pseudo }}
        </h1>
      </v-col>
      <v-col sm="8" align="center" justify="center">
        <v-row justify="center" align="center" class="mt-8">
          <relationship-buttons :user-id="$route.params.id" />
        </v-row>
        <v-row justify="center" align="center">
          <v-btn color="#f5cac3" :to="`/stats/${$route.params.id}`" class="mt-6">
            stats
            <v-icon color="#395c6b" right>
              fa-chart-line
            </v-icon>
          </v-btn>
        </v-row>
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
    id (): string {
      return this.$route.params.id;
    },
    me (): User {
      return meStore.me;
    },

    user () : User {
      return usersStore.oneUser(this.$route.params.id);
    }
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
