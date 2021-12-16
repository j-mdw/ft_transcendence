<template>
  <div>
    
        <v-switch
          color="#f28482"
          v-model="switch2"
          inset
          :label="`${switch1.toString()} Two Factor Authentification`"
          @change="activate2fa"
        >fa </v-switch>
      <v-card v-if="switch2"  color="#f7ede2">
      <v-card-text>
        <v-img  :src=qrCode> </v-img>
      </v-card-text>
    </v-card>
    
  </div>
</template>
 
<script lang="ts">
// import axios from 'axios'
import Vue from 'vue'
// import { config } from 'vuex-module-decorators';
import { authenticationStore }  from '~/store'
export default Vue.extend({
    data: () => ({
        dialog: false,
        switch2: false,
        switch1: "activate",
        user: Object(),
        qrCode: "",
    }),
    async mounted() {
      
      this.user = await this.$axios.$get("user/me", {withCredentials: true});
      if(this.user.isTwoFactorAuthenticationEnabled === true)
        authenticationStore.setTwoFa();
      else
        authenticationStore.removeTwoFa();
      this.switch2 = authenticationStore.isTwoFa;
      this.qrCode = "data:text/plain;base64," + await this.$axios.$post(`2fa/generate`, this.user,{ responseType: 'arraybuffer', withCredentials: true})
      .then(response => Buffer.from(response, 'binary').toString('base64'))

    },
    methods: {

      async activate2fa()
      {
        if(authenticationStore.isTwoFa == true)
        {
          authenticationStore.removeTwoFa();
          this.switch1 = "desactivate"
        }
        else{
          authenticationStore.setTwoFa();
          this.switch1 = "activate"
        }

        console.log(authenticationStore.isTwoFa)
        await this.$axios.$patch('user', {
              'isTwoFactorAuthenticationEnabled': authenticationStore.isTwoFa,
        }, {withCredentials: true});

      },

    }

    
})
</script>