<template>
    <div class="mt-5 mb-9">
    <v-row justify="center" color="#f7ede2" align="center">
      <v-form
    ref="form"
    lazy-validation
    title="Create a channel"
  >
    <!-- <v-text-field
      v-model="name"
      :counter="20"
      label="Name"
      required
    /> -->

    <v-select
      v-model="select"
      :items="items"
      label="Type"
      required
    />

    <v-text-field
      v-if="select == 'Protected'"
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
    </v-row>
</div>
</template>

<script lang="ts">

import Vue from 'vue'
import {CreateChannelDTO} from '~/models/channel'
export default Vue.extend({
  props: ['channelId'],
  data: () => ({
    items: ['Public', 'Private', 'Protected'],
    name: '',
    select: '',
    password: '',
  }),

  methods: {
    async createChannel () {
      console.log(this.items.indexOf(this.select))
     // await this.$axios.$patch(`channel/${this.channelId}`, {type: this.items.indexOf(this.select), withCredentials: true });
      // this.$router.push({
      //   path: '/channels'
      // });
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
      width: 100%;
}

</style>
