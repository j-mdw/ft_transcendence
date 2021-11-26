<template>
  <v-container fill-height>
    <v-row justify="center" align="center">     
      <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <!-- <h1>LOGGED</h1> -->
        
          
      </div>
        <h1 v-if="user">
           <br>welcome {{ user.pseudo }}
        </h1>
    </v-row>
</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { authenticationStore }  from '~/store'
import { User } from '~/models/user'

@Component({
  layout: 'default',
})
export default class Login extends Vue {
  
  user: User = Object();
  async mounted() {
      this.user = await this.$axios.get('/user')
      // this.user = await this.$axios.$get("/me", {withCredentials: true})
  }
}
</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}
</style>