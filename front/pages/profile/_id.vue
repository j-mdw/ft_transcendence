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
              :src="`http://localhost:4000/${user.avatarPath}`"
            >
          </v-avatar>
        <v-row justify="center" align="center" class="mt-8">
          <div v-if="status == 0">
              <v-btn color="#f5cac3" v-bind="attrs" v-on="on" class="mt-6" >
                add to my friends
              <v-icon color="#395c6b" right>fa-user-plus</v-icon>    
            </v-btn>
            <!-- send message  -->
          </div>
          <div v-if="status == 1">
            <v-btn color="#f5cac3" v-bind="attrs" v-on="on" class="mt-6" >
                send a message
              <v-icon color="#395c6b" right>fa-comment-alt</v-icon>    
            </v-btn>
            <v-row justify="center" align="center" class="mt-5">
            <v-btn color="#f5cac3" v-bind="attrs" v-on="on" class="mt-6" >
                Unfriend
              <v-icon color="#395c6b" right>fa-user-minus</v-icon>    
            </v-btn>
            </v-row>
            <v-btn color="#f5cac3" v-bind="attrs" v-on="on" class="mt-6" >
                block this user
              <v-icon color="#395c6b" right>fa-user-times</v-icon>    
            </v-btn>
            <!-- send message  -->
          </div>
          <div v-if="status == 2">
              <v-btn color="#EDEDED" v-bind="attrs" v-on="on" class="mt-6" >
                you have been blocked
              <v-icon color="#395c6b" right>fa-ban</v-icon>    
            </v-btn>
          </div>
        </v-row>
        <h1 v-if="user">
           <br> {{ user.pseudo }}</h1>
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
import { meStore } from "~/store";
import FileUpload from "~/components/FileUpload.vue";
import { User } from '~/models/user'

//0 = to add not friends yet
//1 = you are fiends
//2 = you are blocked


export default Vue.extend({
	layout: 'default',
    data: () => ({
        user: Object(),
        status: 2, 
    }),
    

    
    computed: {
		id() {
			return this.$route.params.id;
		},  
    me(): User {
      return meStore.me;
    },
        
        imgUrl() {
            return (`http://localhost:4000/user/${this.$route.params.id}/avatar`)
        }
	},
    

    async mounted() {
       this.user = await this.$axios.$get(`user/${this.id}`, {withCredentials: true});
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