<template>
  <div>
    <v-col>
      <v-dialog
        v-model="dialog"
        width="50%"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="our_beige"
            small
            v-bind="attrs"
            v-on="on"
          >
            join
          </v-btn>
        </template>
        <v-card class="our_beige" height="240">
          <v-card-title class="our_dark_beige our_navy_blue--text">
            channel password
          </v-card-title>
          <v-form
            ref="form"
            lazy-validation
            title="Create a channel"
          >
            <v-text-field
              v-model="password"
              type="password"
              label="password"
              required
              class="ml-4 mr-4"
            />
            <v-row align="center" justify="center">
              <v-btn
                v-if="password"
                color="success"
                class="mr-4"
                @click="joinProtected()"
              >
                Send
              </v-btn>
              <v-btn v-else disabled>
                Send
              </v-btn>
            </v-row>
          </v-form>
          <div v-if="goodPassword()">
            <v-alert
              type="error"
              class="mt-6"
            >
              Sorry this user doesn't exist <br>
              or he is already in the channel
            </v-alert>
          </div>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { channelsStore, meStore } from '~/store';
import { User, ChannelDTO } from '~/models';

export default Vue.extend({
  props: ['channelId'],
  data: () => ({
    password: '',
    dialog: false,
    alertPassword: false
  }),
  computed: {
    me (): User {
      return meStore.me;
    },
    visibleChannels () : ChannelDTO[] {
      return channelsStore.visible
    },
  },

  methods: {
    goodPassword () {
      if (!this.password) { this.alertPassword = false; }
      return (this.alertPassword);
    },
    async joinProtected () {
      try {
        this.alertPassword = false
        await this.$axios.$put(
              `/channel/${this.channelId}/${this.me.id}`,
              {
                password: this.password
              },
              {
                withCredentials: true
              }
        );
      } catch (error: Error | any) {
        this.alertPassword = true
      }

      if (this.alertPassword !== true) { this.$router.push(`/channels/${this.channelId}`) }
    }
  }
})
</script>

<style scoped lang="scss">

.v-text-field{
      width: 5 !important;
}

</style>
