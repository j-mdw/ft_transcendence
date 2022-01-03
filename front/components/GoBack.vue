<template>
	<span class="go-back">
		<v-btn color="#f5cac3" v-bind="attrs" @click="goBack" class="mt-6" >
          <v-icon color="#395c6b" left>fa fa-angle-left</v-icon>
		  Go Back
        </v-btn>
	</span>

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	methods: {
		goBack(): any {
			return this.$router.go(-1)
		}
	}
})
</script>

<style scoped>
.go-back {
	display: flex;
	cursor: pointer;
}

button {
	border: 0;
}

</style>