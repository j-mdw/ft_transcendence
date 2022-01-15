<template>
<v-container fill-height>
 <body>

	<h2>	PONG RULES - HOW TO PLAY IF YOU WERE NOT BORN IN 1972</h2>
	<h3>Classic game</h3>
	<p>Each player has a paddle, well…, what should be a paddle, but is only a line. Each player controls his paddle with 'arrow up' to go up and 'arrow down' to go down.
		The game is like a ping pong game, you have to send back the ball with your paddle.
		You’re the winner when you hit the  <strong>fabulous</strong>  score of <strong> 5</strong> !</p>

	<h3>Rookie game</h3>
	<p>Your opponent is too strong ? You’re completely drunk ? Play the rookie mode !
		Length of the paddle will be adapted to your drinking level.</p>

	<h3>Multiballs game</h3>

	<p>Long games are so boring ! Let put all the balls together to decide which player is the best.</p>

	<h2>ENJOY !</h2>

</body>

 <v-row justify="center" align="center" class="mt-n8">
            <v-btn color="#f5cac3" to="/game" class="mt-6" v-on="on">
              go play
              <v-icon color="#395c6b" right>
                fa fa-gamepad
              </v-icon>
            </v-btn>
        </v-row>
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