<template>
  <v-container class="flex-container" fill-height>
    <v-row justify="center">
      <h1 v-if="user">
        To continue you need to enter the code given to you by google authentificator<br>
      </h1>
    </v-row>

    <v-row>
      <v-text-field
        v-model="twofaCode"
        label="twofaCode"
        @keydown.enter="submitTwofaCode"
      />
      <v-btn
        text
        color="#395c6b"
        type="submit"
        @click="submitTwofaCode"
      >
        <img style="height:36px" src="../../assets/svg/arrow_right_blue.svg">
      </v-btn>
    </v-row>
    <div v-if="alertTwofa">
            <v-alert
              type="error"
              class="mt-6"
            >
              Sorry you've entered the wrong code
            </v-alert>
          </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticationStore } from '~/store';

export default Vue.extend({
  layout: 'empty',
  data () {
    return {
      user: Object(),
      twofaCode: '',
      title: null,
      alertTwofa: false
    }
  },

  methods: {
    async submitTwofaCode () {
      try {
        await this.$axios.$post('2fa/authenticate', { twoFactorAuthenticationCode: this.twofaCode }, { withCredentials: true })
        this.alertTwofa = false
          authenticationStore.setLogin()
          this.$router.push('/')
      } catch (err) {
        this.alertTwofa = true
        console.log("error two fa")
         this.$router.push('/auth');
      }
        
          // this.whereTogo()
    },

    // async whereTogo () {
    //   this.user = await this.$axios.$get('user/me', { withCredentials: true });
    //   if (this.user.isTwoFactorAuthenticationEnabled) { //Seems this if statement is not doing anything
    //     if (this.user.pseudo) {
    //       authenticationStore.setLogin()
    //       this.$router.push('/home')
    //     } else {
    //       this.$router.push('/pseudo')
    //     }
    //   }
    // }

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
