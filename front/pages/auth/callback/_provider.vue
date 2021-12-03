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
		// const user: User = (await this.$axios.$get(`${this.provider}/redirect`, {params: this.$route.query, withCredentials: true})).user;
		// console.log('user: ', user);
    // if (user.pseudo) {
    //     console.log(user.pseudo),
		// 		this.$router.push('/home');
    //   console.log("tada")
    // } else {
    //   console.log("about to push /pseudo")
    //   this.$router.push('/pseudo');
    //   console.log("/pseudo pushed")
    // }
		await this.$axios.$get(`${this.provider}/redirect`, {params: this.$route.query, withCredentials: true}).then((res) => {
			if (res.user.pseudo) {
				this.$router.push('/home');
			} else {
				this.$router.push('/pseudo');
			}
		});
		authenticationStore.signIn();
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