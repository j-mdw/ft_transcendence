<template>
  <v-container fill-height >
    <!-- <v-row no-gutters> -->
    <v-row justify="center" align="center">
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
        <v-row justify="center" align="center" class="mt-8">
        <v-btn color="#f5cac3" v-bind="attrs" v-on="on" to="/profile/settings" class="mt-6" >
          my settings 
          <v-icon color="#395c6b" right>fa fa-cog</v-icon>    
        </v-btn>
        </v-row>
        <v-row justify="center" align="center">
        <v-btn color="#f5cac3" to="/profile/friendsList" class="mt-6" >
          my friends
          <v-icon color="#395c6b" right>fa-users </v-icon>    
        </v-btn>
        </v-row>
        
        <div v-if="friends_request">
          <v-row justify="center" align="center" class="mt-8">
            <v-btn color="#f5cac3" to="/profile/requestList" class="mt-6" >
              see friends request
              <v-icon color="#395c6b" right>fa-users </v-icon>    
            </v-btn>
          </v-row>
        </div>

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
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
           <div> victories
           <br> 0 </div>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
          <div> losses
          <br> 0 </div> 
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          height="200px"
          align="center"
          max-width="500px"
        >
        MATCHES
        </v-card>

       
      </v-col>                                                                                                                                                                                                                                                                                            
    </v-row>   

</v-container>
</template>


<script lang="ts">
import Vue from 'vue'
import { relationshipStore }  from '~/store'
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

	async mounted() {
      this.user = await this.$axios.$get("user/me", {withCredentials: true});
      this.avatar = await this.$axios.$get("user/me/avatar", {withCredentials: true})
  },
  
  computed : {
    friends_request() { 
        let e = 0;
        for (let i = 0; relationshipStore.relationships[i]; i++) {
        if (relationshipStore.relationships[i].type === 2) {
                e++;
            }
        }
        return e;
    }
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