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
            >
              <img style="height:36px" src="../../assets/logo/42_white.svg" />
            </v-btn>
            <v-btn
              class="mx-8"
              fab
              color="#F6BD60"
              href="http://localhost:4000/google"
            >
              <i class="fab fa-google mx-2"></i>
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

  async mounted() {
    if ('code' in this.$route.query) {
        authenticationStore.signIn();
        // this.$store.commit('setLogin');
      //   this.user = await (this as any).$axios.$get("/google/redirect", {
      //   params: this.$route.query
      // })
    }
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