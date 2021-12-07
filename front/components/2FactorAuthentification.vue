

<template>
  <div>
    <v-switch
        color="#f28482"
        v-model="switch1"
        inset
        @change="activate2fa"
    >fa </v-switch>
  <h1 v-if="test">Vue is awesome!</h1>
    <!-- <v-card-text class="text-center" style="padding: 24px !important">
            <qrcode :value="qrCode" :options="{ width: 400 }" />
          </v-card-text> -->
    <v-img :src=qrCode> </v-img>
  </div>
</template>
 
<script lang="ts">
import axios from 'axios'
import Vue from 'vue'
import { config } from 'vuex-module-decorators';
import { authenticationStore }  from '~/store'
export default Vue.extend({
    data: () => ({
        switch: false,
        switch1: "activate",
        user: Object(),
        qrCode: "",
    }),
    async mounted() {
      this.user = await this.$axios.$get("user/me", {withCredentials: true});
      this.qrCode = "data:text/plain;base64," + await this.$axios.$post(`2fa/generate`, this.user,{ responseType: 'arraybuffer', withCredentials: true})
      .then(response => Buffer.from(response, 'binary').toString('base64'))

      console.log("qrCode");
      console.log(this.qrCode);

    },
    methods: {

      async activate2fa()
      {
        console.log("coucou")
        // this.switch ? false : true;
      },

    }

    
})
</script>