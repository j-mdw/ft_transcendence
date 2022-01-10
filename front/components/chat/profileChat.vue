<template>
  <v-dialog
    v-model="dialog"
  >
    <template #activator="{ on, attrs }">
      <v-avatar class="mr-4 mt-n3" v-bind="attrs" v-on="on">
        <v-img :src="`http://localhost:4000/${getAvatar(userId)}`" />
        <!-- <v-img src=https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg /> -->
      </v-avatar>
    </template>

    <v-card height="200" width="200">
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
              <v-img :src="`http://localhost:4000/${getAvatar(userId)}`" />
            </v-avatar>
          </router-link>
        </v-badge>
        <v-btn v-ripple="false" plain to="/channels">
          <messageLogo />
        </v-btn>
        <v-btn v-ripple="false" plain icon>
          <pingpongLogo />
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import messageLogo from '../Logo/messageLogo.vue';
import pingpongLogo from '../Logo/pingpongLogo.vue';
import { usersStore } from '~/store';
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
    }
  },

  methods: {
    getAvatar (peerId: string) {
      // console.log(this.user.pseudo)
      return usersStore.oneUser(peerId).avatarPath;
    },
  },
});
</script>
