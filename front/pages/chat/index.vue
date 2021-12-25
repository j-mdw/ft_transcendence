<template>
 <div>
  <div id="message">
  </div>
  <div id="chat">
    
    <h2 class="ml-5">My message</h2>
    <v-card outlined color="transparent" class="mt-1" >
      <div class="message-wrapper">
      <ul id="chat">
      <li v-for="msg in messages" :key="messages[msg]">
        <div class="message-background">
          <div class="message">
          {{ msg }}
          </div>
        </div>
      </li>
    </ul>
    </div>
    </v-card>
  </div>
      <v-row>
        <v-col cols="7">
        <v-text-field v-model="current_message" label="message" @keydown.enter="sendMessage" class="ml-8" />
        </v-col>
        <v-col>
        <v-btn
          v-if="current_message.length > 0"
          id="chat send"
          elevation="2"
          @click="sendMessage()"
          class="mt-6"
        >
          Send
        </v-btn>
        <v-btn v-else disabled class="mt-6">
          Send
        </v-btn>
        </v-col>
        <settings-chat/>
      </v-row>
  

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import settingsChat from '~/components/chat/settingsChat.vue'
export default Vue.extend({
  components: { settingsChat },
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
ul {
    list-style-type: none;
}
/* .v-text-field{
      max-width: rem !important; 
} */
.message-wrapper{
  height: 500px;
  overflow: scroll;
  margin-left: 45%;
  text-align: right;
}
.message-background{
    background-color: #fff;
    max-width: 30rem;
    border-radius: 10px;
    margin-bottom: 15px;
		margin: "auto";
    background-color: #fff;
    /* font-size:200px; */
}
.message{
    margin-left: 10px;
    margin-right: 10px;
}

.message-wrapper_left{
  height: 500px;
  overflow: scroll;
  margin-right: 4rem;
}
.message-background_left{
    background-color: #fff;
    max-width: 30rem;
    border-radius: 10px;
    margin-bottom: 15px;
		margin: "auto";
    background-color: #fff;
    /* font-size:200px; */
}
.message_left{
    margin-left: 10px;
    margin-right: 10px;
}
</style>

