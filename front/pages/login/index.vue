<template>
  <v-container class="flex-container" fill-height> 
   
     <v-row justify="center">
        <h1 v-if="user">
           Welcome {{ user.firstName }}, to continue you will need to set a pseudo :<br>
        </h1>
      </v-row>
      
      <v-row >
      <form>
        <v-text-field
          label="Pseudo"
          v-model="pseudo"
          @keydown.enter="submitPseudo"
        ></v-text-field>  
        <v-btn @click="submitPseudo"><img style="height:36px" src="../../assets/svg/arrow_right_blue.svg" /></v-btn> # HERE IT WORKS
      </form> 
      
      </v-row>
      



</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticationStore } from '~/store';
export default Vue.extend({
    layout: 'empty',
    data() {
    return {
        user: null,
        pseudo :null,
        title: null,
      }
    },
    
    async mounted() {
        this.user = await (this as any).$axios.$get("/me", {withCredentials: true})
        this.pseudo = await (this as any).$axios.$get("/me", {withCredentials: true})
        if (this.pseudo != null) {
            console.log(this.pseudo),
          (this as any).$router.push('/home'); 
        }
    },

  
    methods: {
      
      submitPseudo() {
          authenticationStore.signIn();
          console.log(this.pseudo);
          (this as any).$axios.$post('/pseudo', {pseudo: this.pseudo}, {withCredentials: true})
          authenticationStore.setLogin;
          (this as any).$router.push('/home');
          
          


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
      width: 800px;
}

</style>