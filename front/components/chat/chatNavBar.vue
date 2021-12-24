<template>
  <div>
      <v-navigation-drawer
      class="our_dark_beige"
      absolute
      permanent
      right
    > 
        <v-divider></v-divider>
        
        <v-row justify="center" align="center" class="mb-4">
            <v-btn color="#f5cac3" v-bind="attrs" to="/profile/settings" class="mt-6" v-on="on">
                    settings
                <v-icon color="#395c6b" right>
                    fa fa-cog
                </v-icon>
            </v-btn>
        </v-row>

        <v-divider></v-divider>
        <v-row justify="center" align="center" class="mt-4">
            list of participants
        </v-row>

      

      
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { User } from '~/models';
import { usersStore, meStore, relationshipStore } from '~/store';

export default Vue.extend({
  data () {
    return {
    };
  },
 
});
</script>

<style scoped lang="scss">

</style>
