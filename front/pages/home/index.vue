<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <div id="component-auth" class="d-flex flex-column justify-center align-center">
        <!-- <h1>LOGGED</h1> -->
      </div>
      <h1 v-if="user">
        <br>welcome {{ user.pseudo }}
      </h1>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { meStore } from '~/store'
import { User } from '~/models/user'

export default Vue.extend({
  layout: 'default',
  computed: {
    user (): User {
      return meStore.me;
    },
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
