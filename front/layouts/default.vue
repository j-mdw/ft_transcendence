<template>
  <v-app>

    <v-app-bar
      elevation="0" 
      background-color=#395C6B
      color=#f7ede2
      dense
      app
    >
        <v-tabs
          color=#395c6b
          centered
          icons-and-text
        >
          <v-tab>profile </v-tab>
          <v-tab>home </v-tab>
          <v-tab>message </v-tab>
          <v-tab>Game </v-tab>
        </v-tabs>
      <v-btn 
        text
        color=#395c6b
      >
        logout
      </v-btn>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
 import { Component } from 'nuxt-property-decorator'

// @Component({
  middleware: 'auth'
// })
@Component({
  middleware: 'auth',
})
export default class Index extends Vue {
}
</script>



<style scoped>
.v-application {
  background-color: #F7EDE2;
  color: #395C6B;
}

.v-tabs-bar{
  float: right !important;
}

</style>