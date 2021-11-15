<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      {{ $route.query }}


      <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <h1>Welcome to ft_transcendence ! </h1>
          <div id="component-logo" class="d-flex justify-space-around mb-6 ">
            <v-btn
              class="mx-8"
              fab
              color="#F6BD60"
        
              @click="school42redirect"
            >
              <img style="height:36px" src="../../assets/logo/42_white.svg" />
            </v-btn>
            <v-btn
              class="mx-8"
              fab
              color="#F6BD60"
              href="http://localhost:4000/google"
            >
              <img style="height:36px" src="../../assets/logo/google_white.svg" />
            </v-btn>

          
          </div> 

           <p v-if="user">
            welcome {{ user }}
          </p>
          
          
      </div>
    </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'

export default Vue.extend({
	layout: 'empty',
	data() {
		return {
        redirect42: false,
        redirectgoogle: false,
        user: null
        
		}
	},

	async mounted() { 
    console.log(this.$route)
    if ('code' in this.$route.query) {
       authenticationStore.signIn();
       // this.$store.commit('setLogin');console.log("is it 42")
      console.log(authenticationStore.isit42)
        
        if(authenticationStore.isit42)
        {
          this.user = await (this as any).$axios.$get("/42/redirect", {params: this.$route.query, withCredentials: true})
        }
        else
        {
          this.user = await (this as any).$axios.$get("/google/redirect", {params: this.$route.query, withCredentials: true})
        }
        //this.user = await (this as any).$axios.$get("/google/redirect", {params: this.$route.query})
      // this.user = await (this as any).$axios.$get("/42/redirect", {params: this.$route.query}, {withCredentials: true})
      
       //await (this as any).$axios.$get("test", {withCredentials: true})
        (this as any).$router.push('/login');
        
        console.log(this.user);
        console.log("T00");
    }
	},

  methods: {
    school42redirect() {
      console.log("is it 42")
      authenticationStore.sign42()
      
      console.log(authenticationStore.isit42)
    },
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