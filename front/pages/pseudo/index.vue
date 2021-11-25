<template>
  <v-container class="flex-container" fill-height> 
   
     <v-row justify="center">
        <h1 v-if="user">
           Welcome {{ user.firstName }}, to continue you will need to set a pseudo :<br>
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
    data() {
    return {
        user: null,
        pseudo :null,
        title: null,
      }
    },
    
    async mounted() {
        this.user = await (this as any).$axios.$get("/me", {withCredentials: true})
    },

  
    methods: {
      async submitPseudo() {
          authenticationStore.signIn(); //Don't think we have to do this -> already signed in if comming from auth (which we always should)
          console.log(this.pseudo);
          await this.$axios.$patch('/user', {pseudo: this.pseudo}, {withCredentials: true});
          console.log('User updated successfully')
          this.$router.push('/home');
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