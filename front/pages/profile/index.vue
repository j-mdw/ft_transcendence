<template>
  <v-container fill-height >
    <!-- <v-row no-gutters> -->
      <v-col
        sm="4"
        align="center"
        justify="center"
      >
        <v-avatar
          size="250px"
        >
          <img
            src="http://localhost:4000/user/me/avatar"
          >
        </v-avatar>
        <h1 v-if="user">
           <br>welcome {{ user.pseudo }}</h1>
      </v-col>
      <v-col
        sm="8"
        align="center"
        justify="center"
      >
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#f6bd60"
          outlined
          align="center"
          max-width="500px"
        >
           <div> victories
           <br> 0 </div>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#f6bd60"
          outlined
          align="center"
          max-width="500px"
        >
          <div> losses
          <br> 0 </div> 
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#f6bd60"
          outlined
          height="200px"
          align="center"
          max-width="500px"
        >
        MATCHES
        </v-card>

       
      </v-col>
    <!-- </v-row> -->
    <v-row justify="center" align="center">     
      <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <!-- <h1>LOGGED</h1> -->
      </div>
    </v-row>
  <v-btn                                                                                                                                                            
     dark                                                                                                                                                            
     color="orange"                                                                                                                                                  
     href="className/studentName"                                                                                                                                        
     nuxt          

     to="/profile/settings"                                                                                                                                                  
  >    
    <v-icon color="#395c6b">fa fa-cog</v-icon>                                                                                                                                                                                                                                                                                                               
  </v-btn> 
    

</v-container>
</template>


<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'
import FileUpload from "~/components/FileUpload.vue";
import { User } from '~/models/user'

export default Vue.extend({
	layout: 'default',
  components: {
    FileUpload
  },

	data() {
		return {
        user: Object(),
        avatar: null
		}
	},

  methods: {
    async updateUser() {
      const resp = await this.$axios.$patch('user', {
        'pseudo': this.user.pseudo,
        'avatarPath': this.avatar,
      }, {withCredentials: true});
      console.log(resp);
    },
    async deleteAccount() {
      const resp = await this.$axios.$delete('user', {withCredentials: true});
      console.log(resp);
      authenticationStore.signOut();
      this.$router.push('/auth');

    },
  },

	async mounted() {
      this.user = await this.$axios.$get("user/me", {withCredentials: true});
      this.avatar = await this.$axios.$get("user/me/avatar", {withCredentials: true})
      console.log(this.avatar)
  }
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