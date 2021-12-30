<template>
    <v-card height="200" width="200">
        <v-card-title class="our_dark_beige our_navy_blue--text">
          name
        </v-card-title>
        <v-row justify="center" align="center" class="mt-9 mb-9">
        <v-badge
                bottom

                offset-x="15"
                offset-y="15"
              >
                  <v-avatar >
                    <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                  </v-avatar>
              </v-badge>
                <v-btn v-ripple="false" plain to="/channels">
                  <messageLogo />
                </v-btn>
                <v-btn v-ripple="false" plain icon>
                  <pingpongLogo />
                </v-btn>

        </v-row>
      </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import messageLogo from '../Logo/messageLogo.vue';
import pingpongLogo from '../Logo/pingpongLogo.vue';

export default Vue.extend({
  components: { messageLogo, pingpongLogo },
  data () {
  },
  computed: {

  },

  methods: {
  },
});
</script>