<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col
        sm="4"
        align="center"
        justify="center"
      >
        <avatar-editor />
      </v-col>
      <v-col sm="4">
        <v-form
        ref="form"
        lazy-validation
        title="Update profile"
    >
        <v-text-field
        v-model="newPseudo"
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
      </v-col>
    </v-row>
    <v-row justify="center">
      <Fa />
    </v-row>
    <v-row justify="center" align="center">
      <v-col
        align="center"
        justify="center"
      >
        <v-btn
          color="#F6BD60"
          to="/profile"
        >
          go back to my profile
        </v-btn>
      </v-col>
      <v-col
        align="center"
        justify="center"
      >
        <v-btn
          color="#F6BD60"
          @click="deleteAccount"
        >
          Delete my account
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticationStore } from '~/store'
import FileUpload from '~/components/FileUpload.vue';
import { User } from '~/models/user'
import Fa from '~/components/2FactorAuthentification.vue';

export default Vue.extend({
  components: {
    FileUpload,
    Fa
  },
  layout: 'default',

  data () {
    return {
      user: Object(),
      newPseudo:'',
    }
  },

  async mounted () {
    this.user = await this.$axios.$get('user/me', { withCredentials: true });
  },

  methods: {
    async updateUser () {
      console.log("PSEUDO")
      console.log(this.newPseudo)
      const resp = await this.$axios.$patch('user', {
        pseudo: this.newPseudo,
      }, { withCredentials: true });
      console.log(resp);
    },
    async deleteAccount () {
      const resp = await this.$axios.$delete('user', { withCredentials: true });
      console.log(resp);
      authenticationStore.signOut();
      this.$router.push('/auth');
    },
  }
})

</script>

<style scoped lang="scss">
.v-text-field{
      max-width: 350px;
}

</style>
