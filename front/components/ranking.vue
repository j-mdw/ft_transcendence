<template>
  <v-card color="our_dark_beige" height="400" class="scrolla">
    <v-card-title class="our_beige our_navy_blue--text">
      <v-row align="center" justify="center">
        top players
      </v-row>
    </v-card-title>
    <v-list class="our_dark_beige">
      <div v-for="user in ranking" :key="user.title">
        <v-row align="center" justify="center" class="mt-2 mb-2 ml-4">
          <v-col>
            <router-link :to="`/profile/${user.id}`">
              <v-list-item-avatar class="mt-4 mb-4">
                <v-img
                  :src="`/api/${user.avatarPath}`"
                />
              </v-list-item-avatar>
            </router-link>
            {{ user.pseudo }}
          </v-col>
          <v-col>
            <v-btn color="#f5cac3" :to="`/stats/${user.id}`">
              see stats
              <v-icon color="#395c6b" right>
                fa-chart-line
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider />
      </div>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import pingpongLogo from '../components/Logo/pingpongLogo_big.vue';
import matchHistory from '~/components/stats/matchHistory.vue';
import achivements from '~/components/stats/achivements.vue';
import { usersStore } from '~/store'
import { User } from '~/models/user'

export default Vue.extend({
  components: { matchHistory, achivements, pingpongLogo },
  layout: 'default',
  data () {
    return {

    };
  },

  computed: {

    ranking () {
      return usersStore.ranking;
    }

  },

  methods: {
  },

})

</script>

<style scoped lang="scss">
.scrolla {
   overflow-y: scroll;
   overflow-x: hidden !important;
}
</style>
