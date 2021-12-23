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
        text
        color="#395c6b"
        type="submit"
        @click="submitPseudo"
      >
        <img style="height:36px" src="../../assets/svg/arrow_right_blue.svg">
      </v-btn>
    </v-row>
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
    }
  },

  methods: {
    async submitPseudo () {
      try {
        await this.$axios.$patch('/user', { pseudo: this.pseudo }, { withCredentials: true })
        authenticationStore.setLogin();
        this.$router.push('/home');
      } catch (error) {
        console.log('Error:', error); // Should only intercept 409
        this.pseudo = '';
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
