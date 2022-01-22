<template>
  <div>
    <div id="message" />
    <div id="chat">
      <h2 class="ml-5">
        {{ thisChannelName }}
      </h2>
      <v-card outlined color="transparent" class="mt-1">
        <div id="message-wrapper_left" class="message-wrapper_left">
          <ul id="chat">
            <li v-for="msg in messages" :key="messages[msg]">
              <v-row class="mt-7 mb-7">
                <profil-chat :user-id="msg.userId" />
                <!-- A REGLER -->

                <div class="message-background_left">
                  <div class="pseudo_message_left">
                    <h4>
                    <!-- {{ msg.pseudo }} -->
                    </h4>
                  </div>
                  <div class="message_left">
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
      <settings-chat :channel-id="$route.params.id" />
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import settingsChat from '~/components/chat/settingsChat.vue'
import profilChat from '~/components/chat/profileChat.vue'
import { channelsStore, messagesStore, usersStore } from '~/store'
import { ChannelDTO, MessageReceived } from '~/models';
export default Vue.extend({
  components: { settingsChat, profilChat },
  layout: 'default',
  data () {
    return {
      current_message: '',
    }
  },
  computed: {
    channelid (): string {
      return this.$route.params.id;
    },
    channelIdStore (): string {
      return messagesStore.currentChannelId;
    },
    thisChannel (): ChannelDTO | undefined {
      return channelsStore.one(this.$route.params.id);
    },
    thisChannelName (): string | undefined {
      return this.thisChannel?.name
    },
    messages (): MessageReceived[] {
      return messagesStore.channelMessages;
    }
  },
  updated () {
    this.scrollToEnd()
  },
  mounted () {
    this.$socket.client.emit('chat-join-channel', this.$route.params.id);
    usersStore.fetchUsers()
    channelsStore.fetch()
  },
  beforeDestroy () {
    this.$socket.client.emit('chat-leave', this.channelIdStore);
  },
  methods: {
    sendMessage (): void {
      this.$socket.client.emit('chat-channel-message', { channelId: this.$route.params.id, message: this.current_message });
      this.current_message = '';
    },
    getAvatar (peerId: string) {
      return usersStore.oneUser(peerId).avatarPath;
    },
    scrollToEnd () {
      const element = document.getElementById('message-wrapper_left')
        element!.scrollTop = element!.scrollHeight
    }
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
}
.message_righ{
    margin-left: 10px;
    margin-right: 10px;
}
.message-wrapper_left{
  height: 70vh;
  overflow: hidden;
  margin-right: 4rem;
}
.message-background_left{
    background-color: #fff;
    max-width: 30rem;
    border-radius: 10px;
    margin-bottom: 15px;
    margin: "auto";
    background-color: #fff;
}
.pseudo_message_left {
  color: #395c6b;
  margin-left: 10px;
  margin-right: 10px;
}
.message_left{
    margin-left: 10px;
    margin-right: 10px;
}
</style>