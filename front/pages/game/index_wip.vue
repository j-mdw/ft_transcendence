<template>
  <v-container fill-height >
    <!-- <v-row no-gutters> -->
    <v-row justify="center" align="center">
      <v-col
        sm="4"
        align="center"
        justify="center"
      >
		<h1 v-if="user">
           <br>welcome {{ user.pseudo }}</h1>

        <v-row justify="center" align="center" class="mt-8">
        <v-btn color="#f5cac3" v-bind="attrs" v-on="on" to="/game/rules" class="mt-6" >
          game rules
          <v-icon color="#395c6b" right>fa fa-align-justify</v-icon>
        </v-btn>
        </v-row>

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
import { authenticationStore }  from '~/store'
import FileUpload from "~/components/FileUpload.vue";
import { User } from '~/models/user'

export default Vue.extend({
	layout: 'default',
	data() {
		return {
        user: Object(),
		}
	},

	async mounted() {
      this.user = await this.$axios.$get("user/me", {withCredentials: true});
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