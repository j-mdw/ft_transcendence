<template>
    <v-container fill-height >
        <v-row justify="left">
        <h1>
           Your Settings <br>
        </h1>
      </v-row>
      
      <v-row >
          <avatar-editor />

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
		}
	},

  methods: {
    async updateUser() {
      const resp = await this.$axios.$patch('user', {
        'pseudo': this.user.pseudo,
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
  }
})

</script>

<style scoped lang="scss">

</style>