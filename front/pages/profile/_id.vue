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

export default Vue.extend({
	layout: 'default',
    data: () => ({
        user: Object(),
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