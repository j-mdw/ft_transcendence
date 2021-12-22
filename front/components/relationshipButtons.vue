<template>
    <div>
          <div  v-if="myrelation.type == 1">
              <v-btn color="#f5cac3" class="mt-6" @click="askFriends()">
                add to my friends
              <v-icon color="#395c6b" right>fa-user-plus</v-icon>    
            </v-btn>
            <!-- send message  -->
          </div>
          <div  v-if="status == 1">
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
                console.log("we are friends");
            });
        },
        async becomeFriends()
        {
            await this.$axios.$post(`relationships/${this.userId}`, {type: RelationshipType.sent}, {withCredentials: true}).then((res) => {
                console.log("we are friends");
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