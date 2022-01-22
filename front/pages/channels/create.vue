<template>
  <v-container class="flex-container" fill-height>
    <v-row justify="center" color="#f7ede2" align="center">
    <v-col sm="8">
    <v-row justify="center" color="#f7ede2" align="center">
        <v-text-field
          v-model="name"
          
          counter
          maxlength="20"
          label="Name"
          required
        />
    </v-row>
    <v-row justify="center" color="#f7ede2" align="center">
        <v-select
          v-model="select"
          :items="items"
          label="Type"
          required
        />
    </v-row>
    <v-row justify="center" color="#f7ede2" align="center">
        <v-text-field
          v-if="select == 'Protected'"
          v-model="password"
          type="password"
          label="password"
          required
        />
    </v-row>
    <v-row justify="center" color="#f7ede2" align="center">
        <v-btn
          color="success"
          class="mr-4"
          @click="createChannel"
        >
          Send
        </v-btn>
    </v-row>
    </v-col>
    </v-row>
      <div v-if="alertCreation == true">
          <v-alert
            type="error"
            class=""
          >
            Sorry an error occured <br>
            maybe you forgot the password for a protected channel
          </v-alert>
        </div>
    
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import { CreateChannelDTO } from '~/models/channel'

import { channelsStore } from '~/store';

export default Vue.extend({
  data: () => ({
    items: ['Public', 'Private', 'Protected'],
    name: '',
    select: '',
    password: '',
    alertCreation: false,
    rules: {
          counter: (value:string) => value.length <= 20 || 'Max 20 characters',
      }
  }),

  methods: {
    async createChannel () {
      this.alertCreation = false;
      const input: CreateChannelDTO = {
        name: this.name,
        type: this.items.indexOf(this.select),
        password: this.password,
      }
      try {
        await this.$axios.$put('channel', input, { withCredentials: true });
      }
      catch (error: Error | any) {
        this.alertCreation = true;
        console.log(error.response.data)
      }
      if(!this.alertCreation )
        this.$router.push({ path: '/channels' });
      channelsStore.fetch();
    }
  }
})
</script>

<style scoped lang="scss">
.flex-container{
  display: flex;
  flex-flow: row wrap;
  justify-content: cente;
  align-content: center;
  row-gap: 30px;
}

.v-text-field{
      width: 50rem;
      /* max-width: 30%; */
}

</style>
