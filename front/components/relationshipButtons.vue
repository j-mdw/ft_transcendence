<template>
    <div>
          <div>
              <v-btn color="#f5cac3" class="mt-6" @click="becomeFriends()">
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
        // myrelation (): Relationship {
        //     // try {
        //         console.log("computed")
        //         return relationshipStore.one(this.userId)
        //     // }
        //     // catch (error)
        //     // { 
        //     //     console.log("no relationship");
        //     //     console.log(this.relation);
        //     // }
        //     // return (this.relation)
        // },
	},
    

    async mounted() {
    },

    methods: {
        async becomeFriends()
        {
            await this.$axios.$post(`relationships/${this.userId}`, {relation: RelationshipType.friend}, {withCredentials: true}).then((res) => {
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