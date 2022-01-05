<template>
  <v-container fill-height>
    <v-row justify="center" align="center">     
      <!-- <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <h1>INDEX !!!</h1>
        
          
      </div> -->
      <v-col>
        <v-row align="center" justify="center" class="mb-7">
        <h1>
          Welcome to Transcendence
        </h1>
        </v-row>
        <v-row align="center" justify="center">
        <pingpong-logo height/>
        </v-row>
      </v-col>
       <v-col>
        <v-card color="our_dark_beige" height="500">
          <v-card-title class="our_beige our_navy_blue--text">
            <v-row align="center" justify="center">
               top players
            </v-row>
        </v-card-title>
        </v-card>
      </v-col>
    </v-row>
</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import pingpongLogo from '../components/Logo/pingpongLogo_big.vue';

@Component({
  components: { pingpongLogo },
  layout: 'default',
})
export default class Index extends Vue {
}
</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}
</style>