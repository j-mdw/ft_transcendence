<template>
  <div>
    <v-avatar size="250px">
      <v-img :src="`/api/${avatarUrl}`" />
    </v-avatar>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <template #activator="{ on, attrs }">
        <v-btn color="#f5cac3" v-bind="attrs" class="mt-8" v-on="on">
          change my picture
        </v-btn>
      </template>
      <v-card color="#f7ede2">      
        <v-card-title class="our_dark_beige our_navy_blue--text">
          change my picture
        </v-card-title>
        <v-card-text class="mt-6">
          <FileUpload @change="onPictureChanged" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { meStore } from '~/store';
export default Vue.extend({
  data: () => ({
    version: 0,
    dialog: false,
  }),
  computed: {
    avatarUrl () : string {
      return meStore.me.avatarPath;
    },
  },
  methods: {
    onPictureChanged () {
      this.dialog = false;
      this.version = Date.now();
      meStore.fetch();
    },
  },
});
</script>
