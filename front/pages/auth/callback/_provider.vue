<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
    </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'

export default Vue.extend({
	layout: 'empty',

	data() {
		return {
			user: null,
			pseudo: ''
		}
	},
	computed: {
		provider() {
			return this.$route.params.provider;
		} 
	},
	async mounted() {
		console.log(`logging with ${this.provider}`)
		authenticationStore.signIn();

		this.user = await this.$axios.$get(`${this.provider}/redirect`, {params: this.$route.query, withCredentials: true})
		this.pseudo = await this.$axios.$get("/me/pseudo", {withCredentials: true})
        if (this.pseudo.length != 0) {
            console.log(this.pseudo),
          this.$router.push({
						path: '/home'
					});
					console.log("tada")
        }
				else
				{
					console.log("tooo")
					this.$router.push({
						path: '/pseudo'
					});
					console.log("iiii")
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