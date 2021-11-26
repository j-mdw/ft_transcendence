<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
    </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { User } from '~/models/user';
import { authenticationStore }  from '~/store'

export default Vue.extend({
	layout: 'empty',

	computed: {
		provider() {
			return this.$route.params.provider;
		} 
	},
	async mounted() {
		console.log(`logging with ${this.provider}`)
		authenticationStore.signIn();

		const user: User = await this.$axios.$get(`${this.provider}/redirect`, {params: this.$route.query, withCredentials: true})
		// this.pseudo = await this.$axios.$get("/me/pseudo", {withCredentials: true})
        // if (this.pseudo.length != 0) {
        //     console.log(this.pseudo),
        //   this.$router.push({
				// 		path: '/home'
				// 	});
				// 	console.log("tada")
        // }
				// else
				// {
				// 	console.log("tooo")
				// 	this.$router.push({
				// 		path: '/pseudo'
				// 	});
				// 	console.log("iiii")
				// }
    if (user.pseudo) {
        console.log(user.pseudo),
      this.$router.push({ path: '/' })
      this.$router.push({ name: 'home' });
      console.log("tada")
    } else {
      console.log("about to push /pseudo")
      this.$router.push({ path: '/' })
      this.$router.push({ name: 'pseudo' });
      console.log("/pseudo pushed")
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