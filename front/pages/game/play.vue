<template>
<v-container fill-height>
 <game/>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Game from '~/components/game/game.vue'
export default Vue.extend({
  components: { Game },
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
