<template>
  <v-navigation-drawer class="our_dark_beige" app permanent expand-on-hover>
    <template #prepend>
      <user-bar-me />
      <v-divider />
    </template>
    <v-list class="py-0">
      <v-list-item
        v-for="user in users"
        :key="user.title"
        class="ml-n3"
        :to="`/profile/${user.id}`"
      >
        <v-badge
          bottom
          :color="colors[user.status]"
          offset-x="30"
          offset-y="30"
        >
          <v-list-item-avatar class="mt-4 mb-4 ml-0">
            <v-img
              :src="`/api/${user.avatarPath}`"
              max-height="64"
              max-width="64"
              contain
            />
          </v-list-item-avatar>
        </v-badge>
        <v-list-item-content>
          <v-list-item-title class="our_navy_blue--text">
            {{ user.pseudo }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn v-ripple="false" plain :to="`/dm/${getNameDM(user.id)}`">
            <messageLogo />
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import messageLogo from './Logo/messageLogo.vue';
import UserBarMe from './userBarMe.vue';
import { User } from '~/models';
import { usersStore, meStore } from '~/store';

export default Vue.extend({
  components: { messageLogo, UserBarMe },
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
      return usersStore.allUsers.filter(x => x.id !== this.me.id);
    },
    me (): User {
      return meStore.me;
    },
  },
  methods: {
    getNameDM (idpeer: string) {
      const name = this.me.id + ':' + idpeer;
      return name;
    },
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>
