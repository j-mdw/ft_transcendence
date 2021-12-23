<template>
  <div>
      <v-list>
        <v-list-item class="px-2 ml-n1">
            
          <v-badge
            v-if="friends_request"
            offset-x="30"
            offset-y="20"
            :content=friends_request
          >
            <router-link to=/profile>
              <v-list-item-avatar>
                <v-img :src="`http://localhost:4000/${me.avatarPath}`"></v-img>
              </v-list-item-avatar>
            </router-link>
          </v-badge>
          <div
            v-if="!friends_request"
          >
            <router-link to=/profile>
              <v-list-item-avatar>
                <v-img :src="`http://localhost:4000/${me.avatarPath}`"></v-img>
              </v-list-item-avatar>
            </router-link>
          </div>
          <v-list-item to="/profile">
            My Profile
          </v-list-item>
        </v-list-item>
      </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import messageLogo from './Logo/messageLogo.vue';
import pingpongLogo from './Logo/pingpongLogo.vue';
import { User } from '~/models';
import { usersStore, meStore, relationshipStore } from '~/store';

export default Vue.extend({
  components: { messageLogo, pingpongLogo },
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

    friends_request() { 
        let e = 0;
        for (let i = 0; relationshipStore.relationships[i]; i++) {
        if (relationshipStore.relationships[i].type === 2) {
                e++;
            }
        }
        return e;
    }
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
