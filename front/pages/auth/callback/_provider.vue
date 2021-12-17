<template>
  <v-container fill-height>
    <v-row justify="center" align="center" />
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticationStore } from '~/store'

export default Vue.extend({
  layout: 'empty',
	data: () => ({
        user: Object(),
    }),
	computed: {
		provider() {
			return this.$route.params.provider;
		} 
	},
  async mounted() {
		console.log(`logging with ${this.provider}`)
		
		
		await this.$axios.$get(`${this.provider}/redirect`, {params: this.$route.query, withCredentials: true}).then((res) => {
			if (res.user.isTwoFactorAuthenticationEnabled) {
				this.goTwoFa()
			} 
			else if (res.user.pseudo) {
				authenticationStore.signIn();
				this.$router.push('/home');
			} else {
				authenticationStore.signIn();
				this.$router.push('/pseudo');
			}
		});
	},
	methods: {
		async goTwoFa()
		{
			this.user = await this.$axios.$get("user/me", {withCredentials: true});
			if(this.user.isTwoFactorAuthenticationEnabled)
			{
          		console.log("two factor")
				this.$router.push('/auth/twofa');
			}
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
