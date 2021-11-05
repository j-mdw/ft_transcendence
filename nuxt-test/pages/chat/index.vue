<template>
	<h1>{{ message }}</h1>
	<!-- <button @click="pingServer()">Ping server</button> -->
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data() {
		return {
			message: 'Hello'
		}
	},
	// methods: {
	// 	pingServer: function pingServer() {
	// 		$socket.emit('hey');
	// 	}
	// }
})
</script>