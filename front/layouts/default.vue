<template>
  <v-app>
    <v-app-bar
      elevation="0" 
      background-color=#395C6B
      color=#f7ede2
      dense
      app
      class="pt-2"
    >
      
      <v-btn 
            text
            color=#395c6b
            class="py-2"
            href="http://localhost:3000/profile"
      >
            <v-avatar
              size="30px"
              class="mr-4 ml-n2"
            >
              <img
                src="../assets/img/sample.jpg"
              >
            </v-avatar>
            my profile
      </v-btn>
        <v-tabs
          color=#395c6b
          centered
          icons-and-text
        >
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


@Component({
  middleware: 'auth',
})
export default
     class Index extends Vue {
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

.pp_image{
  height: 5px;
}

</style>