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
              <v-btn color="#f5cac3" class="mt-6" @click="deleteFriends()">
                detete invitation
              <v-icon color="#395c6b" right>fa-user-times</v-icon>    
            </v-btn>
          </div>
           <!-- invitation received -->
          <div  v-if="myrelation.type == 2">
              <v-btn color="#f5cac3" class="mt-6" @click="becomeFriends()">
                invitation received
              <v-icon color="#395c6b" right>fa-user-times</v-icon>    
            </v-btn>
          </div>
           <!-- we are friends -->
          <div  v-if="myrelation.type == 3">
            <v-btn color="#f5cac3" v-bind="attrs" v-on="on" class="mt-6" >
                send a message
              <v-icon color="#395c6b" right>fa-comment-alt</v-icon>    
            </v-btn>
            <v-row justify="center" align="center" class="mt-5">
            <v-btn color="#f5cac3" v-bind="attrs" v-on="on" class="mt-6" @click="deleteFriends()">
                Unfriend
              <v-icon color="#395c6b" right>fa-user-minus</v-icon>    
            </v-btn>
            </v-row>
            <v-btn color="#f5cac3" v-bind="attrs" v-on="on" class="mt-6" @click="blockFriends()">
                block this user
              <v-icon color="#395c6b" right>fa-user-times</v-icon>    
            </v-btn>
          </div>
           <!-- blocked -->
          <div v-if="myrelation.type == 4">
              <v-btn color="#EDEDED" v-bind="attrs" v-on="on" class="mt-6" @click="deleteFriends()">
                you have blocked this user
              <v-icon color="#395c6b" right>fa-ban</v-icon>    
            </v-btn>
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
            await this.$axios.$post(`relationships/${this.userId}`, {type: RelationshipType.sent}, {withCredentials: true}).then((res) => {
                console.log("ask to become friend");
            });
        },
        async becomeFriends()
        {
            await this.$axios.$post(`relationships/${this.userId}`, {type: RelationshipType.friend}, {withCredentials: true}).then((res) => {
                console.log("we are friends");
            });
        },
        async deleteFriends()
        {
            await this.$axios.$delete(`relationships/${this.userId}`, {withCredentials: true}).then((res) => {
                console.log("we nothing");
            });
        },
        async blockFriends()
        {
            await this.$axios.$post(`relationships/${this.userId}`, {type: RelationshipType.blocked}, {withCredentials: true}).then((res) => {
                console.log("i blocked him");
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