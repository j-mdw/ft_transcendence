<template>
  <v-app>
    <v-app-bar
      elevation="0" 
      color=#f7ede2
      dense
      app
    >
      <template v-slot:extension>
        <v-tabs
          color=#395c6b
        >
          <v-tab>Home </v-tab>
          <v-tab>message </v-tab>
          <v-tab>Game </v-tab>
        </v-tabs>
      </template>
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