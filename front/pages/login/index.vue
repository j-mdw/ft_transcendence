<template>
  <v-container fill-height>
    <v-row justify="center" align="center">     
      <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <h1>LOGGED</h1>
        
          
      </div>
        <p v-if="user">
            welcome {{ user }}
        </p>
    </v-row>
</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'default',
})
export default class Login extends Vue {
  user= null
  async mounted() {
      this.user = await (this as any).$axios.$get("/me", {withCredentials: true})
       //await (this as any).$axios.$get("test", {withCredentials: true})
        console.log(this.user);
        console.log("T00");
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