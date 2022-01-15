<template>
  <div v-if="!users">
    <v-row justify="center" class="mt-11">
      <h1>
        Sorry there is nobody yet<br>
      </h1>
    </v-row>
  </div>
  <div v-else>
    <div class="mt-5">
      <v-list class="our_beige">
        <div v-for="user in users" :key="user.title">
          <div v-if="user.id != me.id">
            <v-list-item class="ml-n3">
              <NuxtLink :to="`/profile/${user.id}`">
                <v-list-item-avatar class="mt-4 mb-4">
                  <v-img
                    :src="`/api/${user.avatarPath}`"
                  />
                </v-list-item-avatar>
              </NuxtLink>
              <v-list-item :to="`/profile/${user.id}`">
                <v-list-item-title class="our_navy_blue--text" v-text="user.pseudo" />
              </v-list-item>
              <div v-if="user.banned">
                you have banned this user, you can still see his profil but he cannot connect
              </div>
              <v-btn v-else color="#f5cac3" class="mb-2 mt-2 ml-2 mr-2" @click="banUser(user.id)">
                ban
              </v-btn>
            </v-list-item>
            <v-divider />
          </div>
        </div>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { User } from '~/models';
import { usersStore, meStore } from '~/store';
export default Vue.extend({
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
    getNameDM (idpeer : string) {
      const name = this.me.id + ':' + idpeer;
      return name;
    },

    async banUser (idpeer : string) {
      await this.$axios.$patch(`user/admin/${idpeer}`, { ban: true }, { withCredentials: true });
      usersStore.fetchUsers();
    }
  }
});
</script>

<style scoped lang="scss">

</style>
