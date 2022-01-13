<template>
<v-container fill-height>
 <game/>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import matchHistory from '~/components/stats/matchHistory.vue';
import achivements from '~/components/stats/achivements.vue';
import Game from '~/components/game/game.vue'
export default Vue.extend({
  components: { matchHistory,achivements, Game },
  layout: 'default',
  data () {
    return {
    };
  },
})
</script>

<style scoped lang="scss">
.scroll {
   overflow-y: scroll
}
</style>