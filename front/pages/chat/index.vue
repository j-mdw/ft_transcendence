<template>
 <div>
  <div id="message">
              <!-- <v-list-item-content class="ml-4">  -->
                 test
               <!-- </v-list-item-content> -->
  </div>
  <div id="chat">
    
    <h2 class="ml-5">My message</h2>
    <v-card outlined color="transparent" class="mt-1">
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
  
      <v-row>
        <v-col>
        <v-text-field v-model="current_message" label="message" @keydown.enter="sendMessage" class="ml-8" />
        </v-col>
        <v-col>
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
        </v-col>
      </v-row>
      </v-card>
  </div>
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

ul {
    list-style-type: none;
}

.v-text-field{
      width: 60rem !important; 
}

.message-wrapper{
  height: 500px;
  overflow: scroll;
}

.message-background{
    background-color: #fff;
    width: 30rem;
    border-radius: 10px;
    margin-bottom: 15px;
		margin: "auto";
		/*margin-left: 10;
		max-height: "80%";
		width: "95%";
		max-width: "95%";
		background-color: '#FFF';
		padding: 15;
		/* borderRadius: 20, 
		flex-direction: 'row';
		align-items: "center";
		justify-content: "space-between";
		margin-bottom: 20;
		overflow: "scroll" */
    background-color: #fff;
    /* font-size:200px; */
}

.message{
    margin-left: 10px;
    margin-right: 10px;
}
</style>

