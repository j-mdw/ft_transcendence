<template>
  <div id="chat">
    <h1>Welcome to The CHAT</h1>
    <ul id="chat">
      <li v-for="msg in messages" :key="messages[msg]">
        {{ msg }}
      </li>
    </ul>
    <v-virtual-scroll
      height="100"
      item-height="20"
      :items="messages"
    />
    <form action="">
      <v-text-field v-model="current_message" label="message" />
      <v-btn
        v-if="current_message.length > 0"
        id="chat send"
        elevation="2"
        @click="sendMessage()"
      >
        Send
      </v-btn>
      <v-btn v-else disabled>
        Send
      </v-btn>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'default',
  data () {
    return {
      messages: Array<string>(),
      current_message: ''
    }
  },
  sockets: {
    connect () {
      console.log("we're in!!")
    },
    disconnect () {
      this.$socket.$unsubscribe('chat-message')
    }
  },
  mounted () {
    this.$socket.$subscribe('chat-message', (payload: string) => {
      console.log(payload)
      this.messages.push(payload)
    })
  },
  methods: {
    sendMessage (): void {
      this.$socket.client.emit('chat-message', this.current_message)
      this.current_message = ''
    }
  }
})
</script>
