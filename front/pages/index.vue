<template>
  <v-container fill-height>
    <v-row justify="center" align="center">     
      <!-- <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <h1>INDEX !!!</h1>
        
          
      </div> -->
      <v-col>
        <h1>
          Welcome to Transcendence
        </h1>
        <pingpong-logo height/>
      </v-col>
       <v-col>
        <v-card color="#FFF" height="500">
          tutu
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