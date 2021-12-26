<template>
    <div>
          <!-- none -->
          <div  v-if="myrelation.type == 0">
              <v-btn color="#f5cac3" class="mt-6" @click="askFriends()">
                add to my friends
              <v-icon color="#395c6b" right>fa-user-plus</v-icon>    
            </v-btn>
          </div>
          <!-- invitation sent -->
          <div  v-if="myrelation.type == 1">
            <v-btn color="#f5cac3" disabled class="mt-6" @click="deleteFriends()">
                invitation sent
              <v-icon color="#395c6b" right>fas fa-paper-plane</v-icon>      
            </v-btn>
            <v-btn color="#f5cac3" class="mt-6" @click="deleteFriends()">
                delete invitation 
              <v-icon color="#395c6b" right>fas fa-times</v-icon>      
            </v-btn>
          </div>
           <!-- invitation received -->
          <div  v-if="myrelation.type == 2">
            <v-row justify="center" align="center" >
            <v-card class="our_dark_beige pa-md-4">
              you received an invitation from this user !
              <v-btn color="#f5cac3"  @click="becomeFriends()" class="mb-2 mt-2 ml-2 mr-2">
                  become friend
                  <v-icon color="#395c6b" right>fas fa-user-check</v-icon>  
              </v-btn>
              <v-btn color="#f5cac3"  @click="deleteFriends()" class="mb-2 mt-2 ml-2 mr-2">
                  delete invitation
                  <v-icon color="#395c6b" right>fas fa-trash-alt</v-icon>  
              </v-btn>
            </v-card>
            </v-row>
          </div>
           <!-- we are friends -->
          <div  v-if="myrelation.type == 3">
            <v-btn color="#f5cac3" class="mt-6" >
                send a message
              <v-icon color="#395c6b" right>fa-comment-alt</v-icon>    
            </v-btn>
            <v-row justify="center" align="center" class="mt-5">
            <v-btn color="#f5cac3"  class="mt-6" @click="deleteFriends()">
                Unfriend
              <v-icon color="#395c6b" right>fa-user-minus</v-icon>    
            </v-btn>
            </v-row>
            <v-btn color="#f5cac3" class="mt-6" @click="blockFriends()">
                block this user
              <v-icon color="#395c6b" right>fa-user-times</v-icon>    
            </v-btn>
          </div>
           <!-- blocked -->
          <div v-if="myrelation.type == 4">
            <v-btn color="#EDEDED" disabled class="mt-6" @click="deleteFriends()">
                you have blocked this user
              <v-icon color="#395c6b" right>fa-ban</v-icon>    
            </v-btn>
            <v-btn color="#EDEDED" class="mt-6" @click="deleteFriends()">
                unblock
            </v-btn>

          </div>
          <div v-if="alertBlocked == true">
            <v-alert
              type="error"
              class="mt-6"
            >
              Sorry you most likely have been blocked by this user
            </v-alert>
          </div>

       </div>
       
</template>


<script lang="ts">
import Vue from 'vue'
import { meStore,relationshipStore } from "~/store";
import FileUpload from "~/components/FileUpload.vue";
import { User } from '~/models/user'
import { Relationship, RelationshipType } from '~/models';


export default Vue.extend({
    props: ['userId'],

	layout: 'default',
    data: () => ({
      alertBlocked: false,
    }),
    

    
    computed: {
        myrelation (): Relationship {
          console.log("test");
          console.log(relationshipStore.one(this.userId));
            return relationshipStore.one(this.userId);
        },
	},
    

    async mounted() {
    },

    methods: {
        async askFriends()
        {
            await this.$axios.$post(`relationships/${this.userId}`, {type: RelationshipType.sent}, {withCredentials: true})
            .then((res) => {
                console.log("ask to become friend");
            })
            .catch((err) => {
              console.log("there is an error");
              console.log(err);
              this.alertBlocked = true;
            });

        },
        async becomeFriends()
        {
            await this.$axios.$post(`relationships/${this.userId}`, {type: RelationshipType.friend}, {withCredentials: true}).then((res) => {
                console.log("we are friends");
            })
            .catch((err) => {
              console.log("there is an error");
              console.log(err);
              this.alertBlocked = true;
            });
        },
        async deleteFriends()
        {
            await this.$axios.$delete(`relationships/${this.userId}`, {withCredentials: true}).then((res) => {
                console.log("we nothing");
            })
            .catch((err) => {
              console.log("there is an error");
              console.log(err);
              this.alertBlocked = true;
            });
        },
        async blockFriends()
        {
            await this.$axios.$post(`relationships/${this.userId}`, {type: RelationshipType.blocked}, {withCredentials: true}).then((res) => {
                console.log("i blocked him");
            })
            .catch((err) => {
              console.log("there is an error");
              console.log(err);
              this.alertBlocked = true;
            });
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