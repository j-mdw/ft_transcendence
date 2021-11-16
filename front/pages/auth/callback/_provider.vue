<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      {{ $route.query }}


      <div id="component-auth" class="d-flex flex-column justify-center align-center">

      </div>
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
        user: null
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
		(this as any).$router.push('/login');
		this.user = await (this as any).$axios.$get(`${this.provider}/redirect`, {params: this.$route.query, withCredentials: true})
		
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