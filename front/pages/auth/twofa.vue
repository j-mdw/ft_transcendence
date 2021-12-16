<template>
  <v-container class="flex-container" fill-height> 
   
     <v-row justify="center">
        <h1 v-if="user">
           To continue you need to enter the code given to you by google authentificator<br>
        </h1>
      </v-row>
      
      <v-row >
          <v-text-field
            label="twofaCode"
            v-model="twofaCode"
            @keydown.enter="submitTwofaCode"
          ></v-text-field>  
          <v-btn 
            text
            color=#395c6b
            type="submit"
            @click="submitTwofaCode"
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
        user: Object(),
        twofaCode: "",
        title: null,
      }
    },
    
    methods: {
        async submitTwofaCode() {
          try {
            await this.$axios.$post(`2fa/authenticate`, {twoFactorAuthenticationCode: this.twofaCode}, {withCredentials: true}).then((res) => {
                console.log("youpi !");
                this.WhereTogo()
            });
          }
          catch (err)  {
              // console.log(err.response.status)
              // console.log(err.response.data.message)
              this.$dialog.warning({
                text: 'Do you really want to exit?',
                title: 'Warning'
              })
          }
            
        },

        async WhereTogo()
	    {
			this.user = await this.$axios.$get("user/me", {withCredentials: true});
			if(this.user.isTwoFactorAuthenticationEnabled)
			{
        
        authenticationStore.signIn();
          		if (this.user.pseudo) {
                    this.$router.push('/home');
                } else {
                    this.$router.push('/pseudo');
                }
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