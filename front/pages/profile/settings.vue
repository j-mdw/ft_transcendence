<template>
    <v-container fill-height >
        <v-row justify="left">
        <h1>
           Your Settings <br>
        </h1>
      </v-row>
      
      <v-row >
          <v-avatar
          size="250px"
        >
          <img
            src="http://localhost:4000/user/me/avatar"
          >
        </v-avatar>
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
        > 
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="#f5cac3"
              v-bind="attrs"
              v-on="on"
            >
              change my picture
            </v-btn>
          </template>
          <v-card color="#f7ede2">
            <v-card-text>
            <FileUpload/>
            </v-card-text>
          </v-card>
        </v-dialog>

      </v-row>
    <v-row >
    <v-form
        ref="form"
        lazy-validation
        title="Update profile"
    >
        <v-text-field
        v-model="user.pseudo"
        :counter="15"
        label="pseudo"
        required
        ></v-text-field>

        <v-btn
        color="#F6BD60"
        class="mr-4"
        @click="updateUser"
        >
        Update Pseudo
        </v-btn>
    </v-form>
     </v-row>
    <v-btn
      color="#F6BD60"
      class="mr-4"
      @click="deleteAccount"
    >
      Delete account
    </v-btn>

    </v-container>
</template>


<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'
import FileUpload from "~/components/FileUpload.vue";
import { User } from '~/models/user'

export default Vue.extend({
	layout: 'default',
  components: {
    FileUpload
  },

	data() {
		return {
        user: Object(),
        avatar: null
		}
	},

  methods: {
    async updateUser() {
      const resp = await this.$axios.$patch('user', {
        'pseudo': this.user.pseudo,
        'avatarPath': this.avatar,
      }, {withCredentials: true});
      console.log(resp);
    },
    async deleteAccount() {
      const resp = await this.$axios.$delete('user', {withCredentials: true});
      console.log(resp);
      authenticationStore.signOut();
      this.$router.push('/auth');

    },
  },

	async mounted() {
      this.user = await this.$axios.$get("user/me", {withCredentials: true});
      this.avatar = await this.$axios.$get("user/me/avatar", {withCredentials: true})
      console.log(this.avatar)
  }
})

</script>

<style scoped lang="scss">

</style>