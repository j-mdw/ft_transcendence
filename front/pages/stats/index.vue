<template>
<v-container fill-height>

    <!-- <v-row no-gutters> -->
        <v-row class="mt-4 mb-n7 ml-1">
           <h1> Your Stats : </h1>
        </v-row>
    <v-row >
      <v-col 
        sm="5"
        class="mr-10"
        align="center"
        justify="center"
      >
          <!-- <v-row justify="center" align="center"> -->
           <v-card
          class="pa-2 mb-7 mt-7 our_navy_blue--text"
          color="our_dark_beige"
          outlined
          align="center"
          max-width="500px"
        >
          <h3>
            Level : {{getLevel()}}
          </h3>
        </v-card>

        <v-card
          class="scroll mb-7 mt-7"
          color="our_dark_beige"
          height="374px"
          align="center"
          max-width="600px"
          justify="center"
        >
        <v-card-title class="our_beige our_navy_blue--text justify-center">
           Achievements
        </v-card-title>
        <achivements/>
        </v-card>
        
        <!-- </v-row> -->

      </v-col>
    <v-col
        sm="5"
        class="ml-10"
        align="center"
        justify="center"
      >
      <v-card
          class="pa-2 mb-7 mt-7 our_navy_blue--text"
          color="our_dark_beige"
          outlined
          align="center"
          max-width="500px"
        >
          <h3>
            Victories : 0
          </h3>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7 our_navy_blue--text"
          color="our_dark_beige"
          outlined
          align="center"
          max-width="500px"
        >
          <h3>
            Losses : 0
          </h3>
        </v-card>
        
        <match-history/>
        
      
        
      </v-col>
    </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import matchHistory from '~/components/stats/matchHistory.vue';
import achivements from '~/components/stats/achivements.vue';


export default Vue.extend({
  components: { matchHistory,achivements },
  layout: 'default',
  data () {
    return {

    };
  },

  computed: {
  },
    methods: {
    getLevel() {
      let win = 2;
      if(win == 0)
        return 0
      else
        return (win * 0.40);
    }
  }

})

</script>

<style scoped lang="scss">
.scroll {
   overflow-y: scroll
}
</style>

