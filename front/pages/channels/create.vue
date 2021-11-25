<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    title="Create a channel"
  >
    <v-text-field
      v-model="name"
      :counter="20"
      label="Name"
      required
    ></v-text-field>

    <v-select
      v-model="select"
      :items="items"
      label="Type"
      required
    ></v-select>

	<v-text-field
      v-if="select == 'protected'"
      v-model="password"
      label="password"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="createChannel"
    >
      Send
    </v-btn>
  </v-form>
</template>

<script lang="ts">

export enum ChannelType {
  public,
  private,
  password,
}

export interface ICreateChannelDTO {
  name: string;
  type: ChannelType;
  password?: string;
}

import Vue from 'vue'
export default Vue.extend({
    data: () => ({
      items: ['Public', 'Private', 'Protected'],
      name: '',
      select: '',
      password: '',
    }),

    methods: {
      async createChannel() {
        const input: ICreateChannelDTO = {
          name: this.name,
          type: this.items.indexOf(this.select),
          password: this.password,
        }
        await this.$axios.$put('channel', input, {withCredentials: true});
        this.$router.push({
						path: '/channels'
					});
      }
    }
})
</script>