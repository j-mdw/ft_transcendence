<!--
<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col
        sm="3"
        align="center"
        justify="center"
      >
        <h1 v-if="user">
          <br>welcome {{ user.pseudo }} <br>wants to play or watch a game ?
        </h1>

        <v-row justify="center" align="center" class="mt-8">
          <v-btn color="#f5cac3" v-bind="attrs" to="/game/rules" class="mt-6" v-on="on">
            game rules
            <v-icon color="#395c6b" right>
              fa fa-align-justify
            </v-icon>
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
          <div> Play Game </div>
          <div class="tab-row">
            <v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeWaitingList == 'classic' }" @click="buttonClickPlay('classic')">
              Classic
            </v-btn>
            <v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeWaitingList == 'rookie' }" @click="buttonClickPlay('rookie')">
              Rookie
            </v-btn>
            <v-btn class="mt-6 tab-btn" color="#f5cac3" :class="{ active: activeWaitingList == 'multiballs' }" @click="buttonClickPlay('multiballs')">
              Multiballs
            </v-btn>
          </div>
          <div>
            <br> {{ messagePlayer }} <br>
          </div>
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
          <div>
            Watch Game
          </div>
          <div class="tab-row">
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('classic')">
              Classic
            </v-btn>
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('rookie')">
              Rookie
            </v-btn>
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch('multiballs')">
              Multiballs
            </v-btn>
          </div>
          <div>
            <br> {{ messageWatch }} <br>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
-->
<script lang="ts">
// import Vue from 'vue'
// export default Vue.extend({
//   layout: 'default',

//   async mounted () {
	  
// 	  this.$socket.$subscribe('gameLetsPlay', (data: void) => {
// 		  this.goingToPlayOrWatch = true;
// 		  this.$router.push('/game/pongGame');
// 	  })
//   	},

//   methods: {
//     buttonClickPlay (gametype: string): void {
     
//     },
//     /// /A REVOIR
//     buttonClickWatch (gametype: string): void {
//       console.log(`${this.activeRoom}`);
//       this.$socket.client.emit('gameLeaveRoom', this.activeRoom);// permet sortir de l'ancienne room
//       this.$socket.client.emit('gameJoinRoom', gametype);// permet de rejoindre la room cliquee
//       this.activeRoom = gametype;
//       this.$socket.client.emit('gameCheckListLength', gametype);// permet de verifier si jeu en cours
//       this.$socket.$subscribe('gameSocketListLength', (data: number) => {
//         if (data < 2) { this.messageWatch = `no ${gametype} game actually, please try another gametype or wait`; } else {
//           //
//           // A FAIRE
//           //
//           //
//           this.messageWatch = 'cool';
//           this.goingToPlayOrWatch = true;
//           // on part pour la partie apres avoir envoye data pour la page suivante
//         }
//     	})
//     },
//   },
  // before destroy, retirer socket de la socketlist si pas parti pour un jeu
  // booleen a mettre en place (goingToPlayOrWatch)
  // si true, ne pas retirer le socket de la socketlist
// })
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
