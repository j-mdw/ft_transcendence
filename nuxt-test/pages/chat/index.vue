<template>
	<div>
		<h1>{{ message }}</h1>
		<button @click="pingServer()">Ping server</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: "clientActions",
	data() {
		return {
			message: 'Hello'
		}
	},
	methods: {
		pingServer: function pingServer() {
			console.log("trying to ping server");
			this.$socket.emit('hey');
		}
	}
})
</script>