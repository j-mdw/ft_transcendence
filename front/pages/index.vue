<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col>
        <v-row align="center" justify="center" class="mb-11">
          <h1>
            Welcome to Transcendence
          </h1>
        </v-row>
        <v-row align="center" justify="center" class="mt-7">
          <pingpong-logo height class="mb-8" />
        </v-row>
      </v-col>
      <v-col>
        <ranking />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import pingpongLogo from '../components/Logo/pingpongLogo_big.vue';
import ranking from '../components/ranking.vue'

export default Vue.extend({
  components: { pingpongLogo, ranking },
  layout: 'default',
  data () {
    return {
    };
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
