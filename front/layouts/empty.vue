<template>
  <v-app>
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
</style>