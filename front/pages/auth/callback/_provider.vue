<template>
  <v-container fill-height>
    <v-row justify="center" align="center" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticationStore } from '~/store'

export default Vue.extend({
  layout: 'empty',
  data: () => ({
    user: Object(),
  }),
  computed: {
    provider (): string {
      return this.$route.params.provider;
    }
  },
  async mounted () {
    const res = await this.$axios.$get(`${this.provider}/redirect`, { params: this.$route.query, withCredentials: true })
    if (res.user.isTwoFactorAuthenticationEnabled) {
      this.$router.push('/auth/twofa');
    } else if (res.user.pseudo) {
      authenticationStore.setLogin()
      this.$router.push('/')
    } else {
      this.$router.push('/pseudo')
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
