<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col
        sm="5"
        align="center"
        justify="center"
      >
        <v-avatar
          size="250px"
        >
          <img
            :src="`http://localhost:4000/${user.avatarPath}`"
          >
        </v-avatar>
       

        <h1 v-if="user">
          <br>welcome {{ user.pseudo }}
        </h1>
      </v-col>
      <v-col
        sm="5"
        align="center"
        justify="center"
      >
       <v-row justify="center" align="center" class="mt-8">
          <v-btn color="#f5cac3" to="/profile/settings" class="mt-6">
            my settings
            <v-icon color="#395c6b" right>
              fa fa-cog
            </v-icon>
          </v-btn>
        </v-row>
        <v-row justify="center" align="center">
          <v-btn color="#f5cac3" to="/profile/friendsList" class="mt-6">
            my friends
            <v-icon color="#395c6b" right>
              fa-users
            </v-icon>
          </v-btn>
        </v-row>
        <v-row justify="center" align="center">
          <v-btn color="#f5cac3" to="/stats" class="mt-6">
            my stats
            <v-icon color="#395c6b" right>
              fa-chart-line
            </v-icon>
          </v-btn>
        </v-row>

        <div v-if="friends_request">
          <v-row justify="center" align="center" class="mt-8">
            <v-badge
              offset-y="36"
              offset-x="8"
              :content="friends_request"
            >
            <v-btn color="#f5cac3" to="/profile/requestList" class="mt-6">
              see friends request
              <v-icon color="#395c6b" right>
                fa-users
              </v-icon>
            </v-btn>
            </v-badge>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { relationshipStore, meStore } from '~/store'
import FileUpload from '~/components/FileUpload.vue';
// import FileUpload from '~/components/FileUpload.vue';
import { User } from '~/models/user'

export default Vue.extend({
  // components: {
  //   FileUpload
  // },
  layout: 'default',

  computed: {
    user (): User {
      return meStore.me;
    },
    friends_request () {
      let e = 0;
      for (let i = 0; relationshipStore.relationships[i]; i++) {
        if (relationshipStore.relationships[i].type === 2) {
          e++;
        }
      }
      return e;
    }
  },

})

</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}
</style>
