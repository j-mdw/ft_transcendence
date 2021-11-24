<template>
  <v-container fill-height>
    <v-row justify="center" align="center">     
      <div id="component-auth" class="d-flex flex-column justify-center align-center">
          <!-- <h1>LOGGED</h1> -->
        <!-- <FileUpload /> -->
        <v-avatar
          size="250px"
          class="mr-4 ml-n2"
        >
          <img
            src="../../assets/img/sample.jpg"
          >
        </v-avatar>
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
        > 
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="#f5cac3"
              v-bind="attrs"
              v-on="on"
            >
              change my picture
              <!-- <v-icon color="#395c6b">fa fa-cog</v-icon> -->
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
            <FileUpload/>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-row >
    <v-row justify="center">
        <h1 v-if="user">
           <br>welcome to your profile {{ user.pseudo }}
        </h1>
    </v-row>
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
        user: null
		}
	},
	async mounted() {
      this.user = await (this as any).$axios.$get("/me", {withCredentials: true})
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