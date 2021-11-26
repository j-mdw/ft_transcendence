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
            src="http://localhost:4000/users/me/avatar"
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
  </v-container>
</template>


<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'
import FileUpload from "../../components/FileUpload.vue";

export default Vue.extend({
	layout: 'default',
  components: {
    FileUpload
  },

	data() {
		return {
        user: null,
        avatar: null
		}
	},
	async mounted() {
      this.user = await (this as any).$axios.$get("/me", {withCredentials: true})
      this.avatar = await (this as any).$axios.$get("users/me/avatar", {withCredentials: true})
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