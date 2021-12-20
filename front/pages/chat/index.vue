<template>
  <div id="chat">
    <h1>Welcome to The CHAT</h1>
    <!-- <ul id="chat" v-chat-scroll>
      <li v-for="msg in messages" :key="messages[msg]">
        {{ msg }}
      </li>
    </ul> -->
    <v-virtual-scroll
      height="500"
      item-height="50"
      :items="messages"
    >
      <template v-slot:default="{ item }">
          <v-list-item :key="item">
             <!-- <v-row class="mt-5"> -->
            <v-card
              min-width="400"
              height="40"
              class="mt-5"
            > 
              <!-- <v-list-item-content class="ml-4">  -->
                 {{ item }}
               <!-- </v-list-item-content> -->
            </v-card>
            <!-- </v-row> -->
          </v-list-item>
         </template>
    </v-virtual-scroll> 
      <v-text-field v-model="current_message" label="message" @keydown.enter="sendMessage"/>
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

<style scoped lang="scss">
.chat{
  height: 100%;
  position: relative;
  overflow: hidden;
}



</style>

