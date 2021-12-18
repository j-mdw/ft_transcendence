<template>
  <div>
      <v-navigation-drawer
        class="our_dark_beige"
        app
        permanent
        expand-on-hover
      >
      <v-list>
        <v-list-item class="px-2 ml-n1">
          <v-badge
            bottom
            :color=colors[me.status]
            offset-x="30"
            offset-y="30"
          >
            <router-link to=/profile>
              <v-list-item-avatar>
                <v-img :src="`http://localhost:4000/${me.avatarPath}`"></v-img>
              </v-list-item-avatar>
            </router-link>
          </v-badge>
          <v-list-item to=/profile>
            My Profile
          </v-list-item>
        </v-list-item>
      </v-list>
    <v-divider></v-divider>
    <v-list>
      <div v-for="user in users" :key="user.title">
        <div v-if="user.id != me.id">
          <v-list-item class="ml-n3">
            <v-badge
              bottom
              :color=colors[user.status]
              offset-x="30"
              offset-y="30"
            >
            <router-link :to="`/profile/${user.id}`">
              <v-list-item-avatar class="mt-4 mb-4">
                
                <v-img
                  :src="`http://localhost:4000/${user.avatarPath}`"
                ></v-img>
               
                <!-- </NuxtLink> -->
              </v-list-item-avatar>
               </router-link >
            </v-badge>
            <v-list-item-content>
              <v-list-item-title v-text="user.pseudo" class="our_navy_blue--text" ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-ripple="false" plain  to="/channels">
                  <messageLogo/>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn v-ripple="false" plain  icon>
                <pingpongLogo/>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </div>
      </div>
    </v-list>   
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "~/models";
import { usersStore, meStore } from "~/store";
import messageLogo from "./Logo/messageLogo.vue";
import pingpongLogo from "./Logo/pingpongLogo.vue";

export default Vue.extend({
  components: { messageLogo, pingpongLogo },
  data() {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ["#AFE796", "#F7F4E8", "#C596E7"],
    };
  },

  methods: {
    getColor(): string {
      return "";
    },
  },
  computed: {
    users(): User[] {
      return usersStore.allUsers;
    },
    me(): User {
      return meStore.me;
    },
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>