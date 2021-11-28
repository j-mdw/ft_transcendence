<template>
  <v-container fill-height>
    <v-row justify="center" align="center">     
      <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <!-- <h1>LOGGED</h1> -->
        
          
      </div>
        <!-- <h1 v-if="user"> -->
           <br>welcome to your profile
        <!-- </h1> -->
    </v-row>

<v-form
    ref="form"
    lazy-validation
    title="Update profile"
  >
    <v-text-field
      v-model="pseudo"
      :counter="20"
      label="pseudo"
      required
    ></v-text-field>

    <v-text-field
      v-model="avatar"
      :counter="20"
      label="avatar"
      required
    ></v-text-field>

    <v-btn
      color="success"
      class="mr-4"
      @click="updateUser"
    >
      Update
    </v-btn>
  </v-form>
      <v-btn
      color="success"
      class="mr-4"
      @click="deleteAccount"
    >
      Delete account
    </v-btn>
</v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import { User } from '~/models/user'
import { authenticationStore }  from '~/store'

export default Vue.extend({
    layout: 'default',
    data: () => ({
      pseudo: '',
      avatar: '',
    }),

    methods: {
      async updateUser() {
        const resp = await this.$axios.$patch('user', {
          'pseudo': this.pseudo,
          'avatarPath': this.avatar,
        }, {withCredentials: true});
        console.log(resp);
      },
      async deleteAccount() {
        const resp = await this.$axios.$delete('user', {withCredentials: true});
        console.log(resp);
        authenticationStore.signOut();
        this.$router.push('/auth');

      }
    },
    async mounted() {
      const user: User = await this.$axios.$get("user/me", {withCredentials: true});
      this.pseudo = user.pseudo;
      this.avatar = user.avatarPath;
    },
})
</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}
</style>