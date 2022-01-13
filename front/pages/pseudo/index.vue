<template>
  <v-container class="flex-container" fill-height>
    <v-row justify="center">
      <h1 v-if="user">
        Welcome to Transcendence, to continue you will need to set a pseudo :<br>
      </h1>
    </v-row>
    <v-row>
      <v-text-field
        v-model="pseudo"
        label="Pseudo"
        @keydown.enter="submitPseudo"
      />

      <v-btn
        v-if="pseudo"
        text
        type="submit"
        @click="submitPseudo"
      >
        <img style="height:36px" src="../../assets/svg/arrow_right_blue.svg">
      </v-btn>
       <v-btn v-else disabled class="mt-3 mb-5" text type="submit" @click="submitPseudo">
          <img style="height:36px" src="../../assets/svg/arrow_right_grey.svg">
        </v-btn>
    </v-row>
    <div v-if="alertPseudo == true">
      <v-alert
        type="error"
        class="mt-6"
      >
        Sorry this pseudo is used by another user
      </v-alert>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticationStore } from '~/store';

export default Vue.extend({
  layout: 'empty',
  data () {
    return {
      user: Object(),
      pseudo: '',
      alertPseudo: false,
    }
  },

  methods: {
    async submitPseudo () {
      try {
        await this.$axios.$patch('/user', { pseudo: this.pseudo }, { withCredentials: true })
        authenticationStore.setLogin();
        this.$router.push('/');
      } catch (error) {
        this.alertPseudo = true;
        console.log('Error:', error); // Should only intercept 409
        this.pseudo = ''; // Here could have a pop-up/message to let user know pseudo is not available
      }
    }
  }
})

</script>

<style scoped lang="scss">
.flex-container{
  display: flex;
  flex-flow: row wrap;
  justify-content: cente;
  align-content: center;
  row-gap: 30px;
}

.v-text-field{
      width: 50rem;
}

</style>
