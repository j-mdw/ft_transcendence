<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  //middleware: 'auth'
})
</script>
<style scoped>
.v-application {
  background-color: #F7EDE2;
  color: #395C6B;
}
</style>