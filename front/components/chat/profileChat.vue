<template>
  <div v-if="UserExist(userId)">
    <v-dialog
      v-model="dialog"
    >
      <template #activator="{ on, attrs }">
        <v-avatar class="mr-4" v-bind="attrs" v-on="on">
          <v-img :src="`/api/${getAvatar(userId)}`" />
          <!-- <v-img src=https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg /> -->
        </v-avatar>
      </template>

      <v-card height="200" width="200">
        <!-- <div v-if="userId != me.id"> -->
        <div v-if="userId != me.id">
          <v-card-title class="our_dark_beige our_navy_blue--text">
            {{ user.pseudo }}
          </v-card-title>
          <v-row justify="center" align="center" class="mt-9 mb-9">
            <v-badge
              bottom
              :color="colors[user.status]"
              offset-x="15"
              offset-y="15"
            >
              <router-link :to="`/profile/${userId}`">
                <v-avatar>
                  <v-img :src="`/api/${getAvatar(userId)}`" />
                </v-avatar>
              </router-link>
            </v-badge>
            <v-btn v-ripple="false" plain :to="`/dm/${getNameChannel(userId)}`">
              <messageLogo />
            </v-btn>
            <v-btn v-ripple="false" plain icon>
              <pingpongLogo />
            </v-btn>
          </v-row>
        </div>
        <div v-else>
          <v-row align="center" justify="center">
            <h1 class="mt-11">
              it's you
            </h1>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
  <div v-else>
    <v-dialog
      v-model="dialog"
    >
      <template #activator="{ on, attrs }">
        <v-avatar class="mr-4" v-bind="attrs" color="our_light_yellow" v-on="on" />
      </template>

      <v-card height="200" width="200">
        <v-row align="center" justify="center">
          <h3 class="mt-11">
            reload the page <br> to access this user
          </h3>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import messageLogo from '../Logo/messageLogo.vue';
import pingpongLogo from '../Logo/pingpongLogo.vue';
import { usersStore, meStore } from '~/store';
import { User } from '~/models';

export default Vue.extend({
  components: { messageLogo, pingpongLogo },
  props: ['userId'],
  data () {
    return {
      dialog: false,
      colors: ['#AFE796', '#F7F4E8', '#C596E7'],
    }
  },

  computed: {
    user (): User {
      return usersStore.oneUser(this.userId);
    },
    me (): User {
      return meStore.me;
    },
  },

  methods: {
    UserExist (peerId: string) {
      if (!usersStore.oneUser(peerId)) {
        console.log('loosing my mind');
        return false
      }
      return (true);
    },
    getAvatar (peerId: string) {
      return usersStore.oneUser(peerId).avatarPath;
    },
    getNameChannel (idpeer : string) {
      const name = this.me.id + ':' + idpeer;
      return name;
    }
  },
});
</script>
