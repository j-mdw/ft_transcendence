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
              href="http://localhost:4000/42"
              @click="school42redirect"
            >
              <img style="height:36px" src="../../assets/logo/42_white.svg" />
            </v-btn>
            <v-btn
              class="mx-8"
              fab
              color="#F6BD60"
              href="http://localhost:4000/google"
              @click="googleredirect"
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
import { Vue, Component} from 'nuxt-property-decorator';
import { authenticationStore }  from '~/store'

@Component({layout: "empty",})
export default class test extends Vue {
  user= null
  tokens= null
  redirect42: boolean = false
  redirectgoogle: boolean = false

  async mounted() {
    console.log(this.$route)
    if ('code' in this.$route.query) {
       authenticationStore.signIn();
       // this.$store.commit('setLogin');
        console.log(this.redirect42);
        
        if(this.redirect42)
        {
          this.user = await (this as any).$axios.$get("/42/redirect", {params: this.$route.query, withCredentials: true})
        }
        else if(this.redirectgoogle)
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

    
  }
  school42redirect() {
    this.redirect42 = true
    console.log(this.redirect42);
  }

  googleredirect() {
    this.redirectgoogle = true
  }
}
// @Component({
//   layout: "empty",
// })
// export default Vue.extend({
  
//     data() {
//       return {
//         user: null
//       }
//     },
//     async mounted() {
      
//       if ('code' in this.$route.query) {
//         moduleStore.dec();
//         // this.$store.commit('setLogin');
//           this.user = await (this as any).$axios.$get("/google/redirect", {
//           params: this.$route.query
//         })
//       }
//     }
// })
</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}
</style>