<template>
<v-card
          class="scrolla"
          color="our_dark_beige"
          height="300px"
          align="center"
          max-width="600px"
          justify="center"
        >
        <v-card-title class="our_beige our_navy_blue--text justify-center mb-n6">
           history matches
        </v-card-title>
    <div v-if="matches.length == 0">
         <v-row justify="center" class="mt-11">
            <h1>
              Sorry there is no history<br>
            </h1>
          </v-row>
      </div>
      <div v-else>
  <div class="mt-5">
    <v-list class="our_dark_beige">
      <div v-for="match in matches" :key="match.user1Id">
        <v-row align="center" justify="center" class="mt-4 mb-4">
          <v-list-item-avatar class="mr-12">
              <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
          </v-list-item-avatar>
          <h4>
            {{match.user1Score}} - {{match.user2Score}} 
          </h4>
          <v-list-item-avatar class="ml-12">
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>
        </v-row>
        <v-divider/>
      </div>
    </v-list>
  </div>
  </div>
  </v-card>

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'default',
  data () {
    return {
     matches: [
        {
            user1Id: 'user1',
            user2Id: 'user2',
            user1Score: 2,
            user2Score: 1,
            date: '10-12-1999',
        },
        {
            user1Id: 'user1',
            user2Id: 'user2',
            user1Score: 7,
            user2Score: 2,
            date: '11-12-1999',
        },
        {
            user1Id: 'user1',
            user2Id: 'user2',
            user1Score: 4,
            user2Score: 5,
            date: '12-12-1999',
        },
      ],
    };

    
  },

  computed: {
  },


})

</script>

<style scoped lang="scss">
.scrolla {
   overflow-y: scroll;
   overflow-x: hidden !important;
}
</style>

