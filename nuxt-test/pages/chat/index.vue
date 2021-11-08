<template>
	<div id="chat">
		<h1>Welcome to The CHAT</h1>
		<p>
			{{ message }}
		</p>
		<form action="">
			<!-- <input type="text"> -->
			<v-text-field label="message" v-model="message"></v-text-field>
			<v-btn id="chat send" elevation="2" @click="sendMessage()">
				Send
			</v-btn>
		</form>
		<v-btn elevation="2" @click="pingServer()">
			Ping server
		</v-btn>
		<!-- <button @click="pingServer()">Ping server</button> -->
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: "chat",
	data() {
		return {
			message: ''
		}
	},
	methods: {
		pingServer(): void {
			console.log("trying to ping server");
			this.$socket.emit('ping message', 'ping ping');
		},
		sendMessage(): void {
			this.$socket.emit('chat-message', this.message);
		},
		// reveiveMessage() {
		// 	this.$socket.on('chat-message', (msg) => this.message = msg);
		// }
	},
})
</script>

