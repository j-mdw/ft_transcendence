<template>
  <div>
    <div id="message" />
    <div id="chat">
      <h2 class="mt-5 ml-5">
        this is your conversation with {{ `${getChannelName()}` }}
      </h2>
      <v-card outlined color="transparent" class="mt-1">
        <div id="message-wrapper_left" class="message-wrapper_left">
          <ul id="chat">
            <li v-for="msg in messages" :key="messages[msg]">
              <v-row class="mt-7 mb-7">    
                    <profil-chat :user-id="msg.userId"/>
                <div class="message-background_left">
                  <div v-if="msg.gameInvite">
                    <v-btn class="our_yellow" @click="joinPrivateGame()">
                      join the game
                    </v-btn>
                  </div>
                  <div v-else class="message_left">
                    {{ msg.message }}
                  </div>
                </div>
              </v-row>
            </li>
          </ul>
        </div>
      </v-card>
    </div>
    <v-row>
      <v-col cols="7">
        <v-text-field v-model="current_message" label="message" class="ml-8" @keydown.enter="sendMessage" />
      </v-col>
      <v-col>
        <v-btn
          v-if="current_message.length > 0"
          id="chat send"
          elevation="2"
          class="mt-6"
          @click="sendMessage()"
        >
          Send
        </v-btn>
        <v-btn v-else disabled class="mt-6">
          Send
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          elevation="2"
          class="mt-6 our_light_pink"
          @click="sendGameInvite()"
        >
          Play pong
          <pingpong-logo  class="ml-5 mt-2 mb-2"/>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import settingsChat from '~/components/chat/settingsChat.vue'
import profilChat from '~/components/chat/profileChat.vue'

import { channelsStore, messagesStore, usersStore } from '~/store'
import PingpongLogo from '~/components/Logo/pingpongLogo.vue'
import { MessageReceived, MessageToServerDTO } from "~/models";
export default Vue.extend({
  components: { settingsChat, profilChat, PingpongLogo },
  layout: 'default',
    
  data () {
    return {
      current_message: '',
      peerId: '',
      thisChannelId: '',
    }
  },
  computed: {
      channelid () {
          return messagesStore.currentChannelId;
      },
      thisChannel () {
        return  channelsStore.one(this.$route.params.id);
      },
      messages () {
        return messagesStore.channelMessages;
      }
      
  },
    methods: {
      sendMessage (): void {
        this.$socket.client.emit('chat-DM-message', {channelId: this.channelid, message: this.current_message});
        this.thisChannelId = this.channelid
        this.current_message = '';
        //this.scrollToEnd();
      },

      sendGameInvite() {
        const input: MessageToServerDTO = {
          channelId: this.channelid,
          message: "join",
          gameInvite: true,
        }
        this.$socket.client.emit('chat-DM-message', input);
        console.log("sent")
        console.log(this.messages)
      },

      joinPrivateGame() {
        const str = this.$route.params.id;
        this.peerId = str.split(':').pop() || '';
        if(this.peerId)
        {
          this.$socket.client.emit('game-play-private', this.peerId);
          this.$router.push("/game/play")
        }
          
      },

      getAvatar(peerId: string) {
        return usersStore.oneUser(peerId).avatarPath;
    },
      scrollToEnd() {
        const element = document.getElementById('message-wrapper_left')
        element!.scrollTop = element!.scrollHeight
      },
      getChannelName() {
        const str = this.$route.params.id;
        this.peerId = str.split(':').pop() || '';
        if(this.peerId)
          return usersStore.oneUser(this.peerId).pseudo;
      },
    },
    updated() {
      this.scrollToEnd()
    },
  
    mounted() {
      const str = this.$route.params.id;
      this.peerId = str.split(':').pop() || '';
      if(this.peerId)
        this.$socket.client.emit('chat-join-DM', this.peerId);
    },
    beforeDestroy() {
      this.$socket.client.emit('chat-leave', this.thisChannelId);
    },
    
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
.message-wrapper_righ{
  height: 500px;
  overflow: scroll;
  margin-left: 45%;
  text-align: right;
}
.message-background_right{
    background-color: #fff;
    max-width: 30rem;
    border-radius: 10px;
    margin-bottom: 15px;
		margin: "auto";
    background-color: #fff;
    /* font-size:200px; */
}
.message_righ{
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