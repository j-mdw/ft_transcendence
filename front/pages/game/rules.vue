<template>
	<div
justify="center" align="center"
	>

	  <!-- <v-container > -->

		      <!-- <v-row > -->
	<GoBack />
	<h1> PONG RULES - HOW TO PLAY IF YOU WERE NOT BORN IN 1972 </h1>

	<br>
	<h2>Classic game</h2>
	<br>
	<p>Each player has a paddle, well…, what should be a paddle, but is only a line.<br> Each player controls his paddle with ‘w’ or 'arrow up' to go up and ’s’ or 'arrow down' to go down.<br>
		The game is like a ping pong game, you have to send back the ball with your paddle. <br> <br>
		You’re the winner when you hit the  <strong>fabulous</strong>  score of <strong> 5</strong> !</p>
	<br>
	<h2>Rookie game</h2>
	<br>
	<p>Your opponent is too strong ? You’re completely drunk ? Play the rookie mode !
		Length of the paddle will be adapted to your drinking level.</p>
	<br>
	<h2>Multiballs game</h2>
	<br>
	<p>Long games are so boring ! Let put all the balls together to decide which player is the best.</p>
	<br>
	<h1>ENJOY !</h1>
	<GoBack />
		<!-- </v-row> -->
	  <!-- </v-container> -->
	</div>

</template>

<script lang="ts">
	import Vue from 'vue'
	import GoBack from "~/components/GoBack.vue"
	export default Vue.extend({
		components: {
			GoBack,
		},
	})
</script>
