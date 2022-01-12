<template>
  <div>
    <v-navigation-drawer
      class="our_dark_beige"
      app
      permanent
      expand-on-hover
    >
      <user-bar-me/>
      <v-divider />
      <v-list>
        <div v-for="user in users" :key="user.title">
          <div v-if="user.id != me.id">
            <v-list-item class="ml-n3">
              <v-badge
                bottom
                :color="colors[user.status]"
                offset-x="30"
                offset-y="30"
              >
                <router-link :to="`/profile/${user.id}`">
                  <v-list-item-avatar class="mt-4 mb-4">
                    <v-img
                      :src="`/api/${user.avatarPath}`"
                    />
                  </v-list-item-avatar>
                </router-link>
              </v-badge>
              <v-list-item :to="`/profile/${user.id}`" >
                <v-list-item-title class="our_navy_blue--text" v-text="user.pseudo" />
              </v-list-item>
              <v-list-item-action>
                <v-btn v-ripple="false" plain :to="`/dm/${getNameDM(user.id)}`">
                  <messageLogo/>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action >
                <v-btn v-ripple="false" plain icon>
                  <pingpongLogo />
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
import Vue from 'vue';
import messageLogo from './Logo/messageLogo.vue';
import pingpongLogo from './Logo/pingpongLogo.vue';
import { User } from '~/models';
import { usersStore, meStore } from '~/store';
import UserBarMe from './userBarMe.vue';

export default Vue.extend({
  components: { messageLogo, pingpongLogo, UserBarMe },
  data () {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ['#AFE796', '#F7F4E8', '#C596E7'],
    };
  },
  computed: {
    users (): User[] {
      return usersStore.allUsers;
    },
    me (): User {
      return meStore.me;
    },
  },
  methods: {
    getNameDM(idpeer : string) {
      var name = this.me.id + ':' + idpeer;
      return name;
    }
  }
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}

.v-list-item{
  /* width: 120px; */
  max-width: 120px;
  min-width: 119px;
}
</style>
