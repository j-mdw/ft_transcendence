<template>
  <v-container class="flex-container" fill-height> 
   
    <v-row justify="center">
      <h1 v-if="user">
        Welcome to Transcendence, to continue you will need to set a pseudo :<br>
      </h1>
    </v-row>
    <v-row >
      <v-text-field
        label="Pseudo"
        v-model="pseudo"
        @keydown.enter="submitPseudo"
      ></v-text-field>
      <v-btn 
        text
        color=#395c6b
        type="submit"
        @click="submitPseudo"
      >
        <img style="height:36px" src="../../assets/svg/arrow_right_blue.svg" />
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
      console.log(this.pseudo);
      // try {
      //   const resp = await this.$axios.$patch('/user', { pseudo: this.pseudo }, { withCredentials: true });
      //   console.log('User updated successfully:', resp);
      //   authenticationStore.setLogin(); //Don't think we have to do this -> already signed in if comming from auth (which we always should)
      //   this.$router.push('/home');
      // } catch (error) {
      //   this.pseudo = '';
      // }
      this.$axios.$patch('/user', { pseudo: this.pseudo }, { withCredentials: true })
      .then((resp) => {
        console.log('User updated successfully:', resp);
        authenticationStore.setLogin(); //Don't think we have to do this -> already signed in if comming from auth (which we always should)
        this.$router.push('/home');
        })
      .catch((error) => {
        console.log('Error from user update', error);
      this.pseudo = '';
    });
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