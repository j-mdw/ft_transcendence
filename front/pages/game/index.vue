<template>
  <v-container fill-height >
    <!-- <v-row no-gutters> -->
    <v-row justify="center" align="center">
      <v-col
        sm="3"
        align="center"
        justify="center"
      >
		<h1 v-if="user">
           <br>welcome {{ user.pseudo }} <br>wants to play or watch a game ?</h1>

        <v-row justify="center" align="center" class="mt-8">
        <v-btn color="#f5cac3" v-bind="attrs" v-on="on" to="/game/rules" class="mt-6" >
          game rules
          <v-icon color="#395c6b" right>fa fa-align-justify</v-icon>
        </v-btn>
        </v-row>

      </v-col>
      <v-col
        sm="9"
        align="center"
        justify="center"
      >
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
           <div> play or not ?</div>
			<div class="tab-row">
				<v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeWaitingList == 'none' }" @click="buttonClickPlay('none')"  >Spectator</v-btn>
				<v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeWaitingList == 'classic' }" @click="buttonClickPlay('classic')" >Classic</v-btn>
        		<v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeWaitingList == 'rookie' }"  @click="buttonClickPlay('rookie')" >Rookie</v-btn>
        		<v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeWaitingList == 'multiballs' }" @click="buttonClickPlay('multiballs')"  >Multiballs</v-btn>
		  </div>
		  <div>
			  <br> {{messagePlayer}} <br>
		  </div>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
          <div> watch a game?
          </div>
			<div class="tab-row">
				<v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('classic')" >Classic</v-btn>
        		<v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('rookie')" >Rookie</v-btn>
        		<v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('multiballs')"  >Multiballs</v-btn>
		  </div>
			<div>
			  <br> {{messageWatch}} <br>
		  </div>
        </v-card>

      </v-col>
    </v-row>

</v-container>
</template>


<script lang="ts">
import Vue from 'vue'
import { authenticationStore }  from '~/store'
import FileUpload from "~/components/FileUpload.vue";
import { User } from '~/models/user'

export default Vue.extend({
	layout: 'default',
	data() {
		return {
		user: Object(),
		messagePlayer: "",
		messageWatch: "",
		activeRoom: [
			"none",
			"classic",
			"rookie",
			"multiballs"
		],
		activeWaitingList: [
			"none",
			"classic",
			"rookie",
			"multiballs"
		],
		goingToPlayOrWatch: false,
		}
	},

	methods: {

		buttonClickPlay(gametype: string): void {
			this.$socket.client.emit('gameAddToGameSocketList', { new: gametype, old: this.activeWaitingList } );
			this.activeWaitingList = gametype;
			if (gametype === 'none')
				this.messagePlayer = "choose the game you want to watch below";
			else {
				this.$socket.client.emit('gameCheckListLength', gametype);//permet de verifier la taille de la socket list
				this.$socket.$subscribe('gameSocketListLength', (data: number) => {
					if (data < 2)
						this.messagePlayer = `waiting a second player to play` ;
					else if (data > 2)
						this.messagePlayer = "no table available, you are on waiting list"
					else {
						this.messagePlayer = "YOUPI on va jouer"
						this.goingToPlayOrWatch = true; // attention, a envoyer aussi au player 1
						//on part pour la partie apres avoir envoye data pour la page suivante
						//et il faut rejoindre la room apres avoir quitte la room precedente
					}

				})
			}
		},


		buttonClickWatch(gametype: string): void {
		console.log (`${this.activeRoom}`);
		this.$socket.client.emit('gameLeaveRoom', this.activeRoom);//permet sortir de l'ancienne room
		this.$socket.client.emit('gameJoinRoom', gametype);//permet de rejoindre la room cliquee
		this.activeRoom = gametype;
		this.$socket.client.emit('gameCheckListLength', gametype);//permet de verifier si jeu en cours
		this.$socket.$subscribe('gameSocketListLength', (data: number) => {
			if (data < 2)
				this.messageWatch = `no ${gametype} game actually, please try another gametype or wait` ;
			else {
				//
				//A FAIRE
				//
				//
				this.messageWatch = `cool`;
				this.goingToPlayOrWatch = true;
				//on part pour la partie apres avoir envoye data pour la page suivante
			}
    	})
		},
	},

	async mounted() {
      this.user = await this.$axios.$get("user/me", {withCredentials: true});
  	},

	beforeDestroy(){
		console.log("before destroy");
		// console.log(``)
		if (!this.goingToPlayOrWatch) {
			this.$socket.client.emit('gameLeaveRoom', this.activeRoom);//permet sortir de l'ancienne room
			this.$socket.client.emit('gameRemoveFromGameSocketList', this.activeWaitingList );
		}
	},

  //before destroy, retirer socket de la socketlist si pas parti pour un jeu
  //booleen a mettre en place (goingToPlayOrWatch)
  //si true, ne pas retirer le socket de la socketlist

})


</script>

<style scoped lang="scss">
#component-logo {
  margin-top: 25px;
  i{
    font-size: 32px;
  }
}


.tab-btn.active {
    color: goldenrod;
}
</style>