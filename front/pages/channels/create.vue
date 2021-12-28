<template>
  <v-form
    ref="form"
    lazy-validation
    title="Create a channel"
  >
    <v-text-field
      v-model="name"
      :counter="20"
      label="Name"
      required
    />

    <v-select
      v-model="select"
      :items="items"
      label="Type"
      required
    />

    <v-text-field
      v-if="select == 'protected'"
      v-model="password"
      label="password"
      required
    />

    <v-btn
      color="success"
      class="mr-4"
      @click="createChannel"
    >
      Send
    </v-btn>
  </v-form>
</template>

<script lang="ts">

import Vue from 'vue'
import { CreateChannelDTO } from '~/models/channel'
export default Vue.extend({
  data: () => ({
    items: ['Public', 'Private', 'Protected'],
    name: '',
    select: '',
    password: '',
  }),

  methods: {
    async createChannel () {
      const input: CreateChannelDTO = {
        name: this.name,
        type: this.items.indexOf(this.select),
        password: this.password,
      }
      await this.$axios.$put('channel', input, { withCredentials: true });
      this.$router.push({
        path: '/channels'
      });
    }
  }
})
</script>
