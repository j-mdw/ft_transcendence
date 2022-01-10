<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <!-- <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <h1>INDEX !!!</h1>

      </div> -->
      <v-col>
        <v-row align="center" justify="center" class="mb-11">
          <h1>
            Welcome to Transcendence
          </h1>
        </v-row>
        <v-row align="center" justify="center" class="mt-7">
          <pingpong-logo height />
        </v-row>
      </v-col>
      <v-col>
        <ranking/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import matchHistory from '~/components/stats/matchHistory.vue';
import achivements from '~/components/stats/achivements.vue';
import pingpongLogo from '../components/Logo/pingpongLogo_big.vue';
import ranking from '../components/ranking.vue'
import { usersStore } from '~/store'
import { User } from '~/models/user'

export default Vue.extend({
  components: { matchHistory,achivements, pingpongLogo, ranking },
  layout: 'default',
  data () {
    return {

    };
  },

  computed: {     

  },

    methods: {

  },

})

</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}
</style>
