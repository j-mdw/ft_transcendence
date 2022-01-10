<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <div id="component-auth" class="d-flex flex-column justify-center align-center">
        <h1>Welcome to ft_transcendence ! </h1>
        <div id="component-logo" class="d-flex justify-space-around mb-6 ">
          <v-btn
            class="mx-8"
            fab
            color="#F6BD60"
            href="http://localhost:4000/42"
          >
            <img style="height:36px" src="../../assets/logo/42_white.svg">
          </v-btn>
          <v-btn
            class="mx-8"
            fab
            color="#F6BD60"
            href="http://localhost:4000/google"
          >
            <img style="height:36px" src="../../assets/logo/google_white.svg">
          </v-btn>
          <v-btn
            class="mx-8"
            fab
            color="#F6BD60"
            @click="createRandomUser"
          >
            <img style="height:36px" src="../../assets/logo/anon.png">
          </v-btn>
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
// import { authenticationStore }  from '@store/index'
export default Vue.extend({
  layout: 'empty',
  data () {
    return {
      user: null,
    }
  },
  computed: {
    provider () {
      console.log(this.$route.query.params)
      return this.$route.params.provider;
    }
  },
  methods: {
    async createRandomUser () {
      console.log('randomeeee')
      try {
        this.user = await this.$axios.$get('random', { withCredentials: true })
        this.$router.push('/pseudo')
      } catch (error) {

        console.log('ooops', error);
      }
    },

    mounted () {
      console.log(this.$route)
      if ('code' in this.$route.query) {
        console.log(`logging with ${this.provider}`)
      }
    },
  }
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
