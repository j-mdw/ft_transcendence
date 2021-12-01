<template>
  <div>
    <v-avatar size="250px">
      <v-img :src="avatarUrl" />
    </v-avatar>
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="#f5cac3" v-bind="attrs" v-on="on" class="mt-8">
          change my picture
        </v-btn>
      </template>
      <v-card color="#f7ede2">
        <v-card-text>
          <FileUpload @change="onPictureChanged" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data: () => ({
        version: 0,
        dialog: false
    }),
    computed: {
        avatarUrl() {
            return `http://localhost:4000/user/me/avatar?version=${this.version}`
        }
    },
    methods: {
        onPictureChanged() {
            this.dialog = false
            this.version = Date.now()
        }
    }
})
</script>