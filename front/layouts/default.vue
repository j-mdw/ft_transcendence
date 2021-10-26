<template>
  <v-app>
      <v-navigation-drawer :value="true">
        <v-btn @click="$store.commit('removeLogin');">
          logout
          {{ $store.state.isLogin }}
        </v-btn>
      </v-navigation-drawer>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script>
export default {
  middleware: 'auth'
}
</script>
<style scoped>
.v-application {
  background-color: #F7EDE2;
  color: #395C6B;
}
</style>