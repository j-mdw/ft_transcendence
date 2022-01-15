<template>
  <v-list class="py-0">
    <v-list-item class="px-2 ml-n1" to="/profile" exact-path>
      <v-badge
        :value="friends_request"
        offset-x="30"
        offset-y="20"
        :content="friends_request"
      >
        <v-list-item-avatar class="ml-0">
          <v-img
            :src="`/api/${me.avatarPath}`"
            max-height="64"
            max-width="64"
          />
        </v-list-item-avatar>
      </v-badge>
      <v-list-item-content>
        <v-list-item-title> My Profile </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';
import { User } from '~/models';
import { meStore, relationshipStore } from '~/store';
export default Vue.extend({
  data () {
    return {
      drawer: true,
      version: 0,
      mini: true,
      colors: ['#AFE796', '#F7F4E8', '#C596E7'],
    };
  },
  computed: {
    me (): User {
      return meStore.me;
    },
    friends_request (): number {
      let e = 0;
      for (let i = 0; relationshipStore.relationships[i]; i++) {
        if (relationshipStore.relationships[i].type === 2) {
          e++;
        }
      }
      return e;
    },
  },
  methods: {
    getColor (): string {
      return '';
    },
  },
});
</script>

<style scoped lang="scss">
.v-text {
  color: #fff;
}
</style>
