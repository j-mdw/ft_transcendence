<template>
  <div>
    <div id="message" />
    <div id="chat">
      <h2 class="ml-5">
        {{ thisChannel.name }}
      </h2>
      <v-card outlined color="transparent" class="mt-1">
        <div class="message-wrapper_left">
          <ul id="chat">
            <li v-for="msg in messages" :key="messages[msg]">
              <v-row class="mt-7 mb-7">
                <v-dialog
                  v-model="dialog"
                >
                  <template #activator="{ on, attrs }">
                    <v-avatar class="mr-4 mt-n3" v-bind="attrs" v-on="on">
                      <v-img src="https://randomuser.me/api/portraits/women/85.jpg" />
                    </v-avatar>
                  </template>
                  <v-card>
                    <profil-chat />
                  </v-card>
                </v-dialog>

                <div class="message-background_left">
                  <div class="message_left">
                    {{ msg }}
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
      <settings-chat :channel-id="$route.params.id"/>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import settingsChat from '~/components/chat/settingsChat.vue'
import profilChat from '~/components/chat/profileChat.vue'

import { channelsStore } from '~/store'
export default Vue.extend({
  components: { settingsChat, profilChat },
  layout: 'default',
  data () {
    return {
      messages: Array<string>(),
      current_message: ''
    }
  },
  computed: {
      channelid () {
          return this.$route.params.id;
      },

      thisChannel () {
        return  channelsStore.one(this.$route.params.id);
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
