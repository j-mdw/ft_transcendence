<template>   
<v-container class="flex-container" fill-height> 
    <v-row justify="center" color="#f7ede2" align="center">
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
          class="mt-8"
        ></v-text-field>

        <v-select
          v-model="select"
          :items="items"
          label="Type"
          required
        ></v-select>

      
        <v-text-field
          v-if="select == 'Protected'"
          v-model="password"
          label="password"
          required
        ></v-text-field>

        <v-btn
          color="success"
          class="mr-4"
          @click="createChannel"
        >
          Send
        </v-btn>
      </v-form>
    </v-row>
</v-container>
</template>

<script lang="ts">


import { ChannelDTO } from '~/models/channel'
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
        const input: ChannelDTO = {
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
}

</style>
