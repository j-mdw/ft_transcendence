<template>
<v-container fill-height>
    <v-row justify="center" align="center" >
        <v-col>
           <h3> User 1</h3>
        </v-col>
        <v-col align="right" class="mr-3" >
            <h3> User 2</h3>
        </v-col>
    </v-row>
 <game/>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import matchHistory from '~/components/stats/matchHistory.vue';
import achivements from '~/components/stats/achivements.vue';
import Game from '~/components/game/game.vue';


export default Vue.extend({
  components: { matchHistory,achivements, Game },
  layout: 'default',
  data () {
    return {

    };
  },

  computed: {
  },
  methods: {

  }

})

</script>

<style scoped lang="scss">
.scroll {
   overflow-y: scroll
}
</style>

