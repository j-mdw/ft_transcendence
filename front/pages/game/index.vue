<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col
        sm="3"
        align="center"
        justify="center"
      >
        <!-- <h1 v-if="user">
          <br>welcome {{ user.pseudo }} <br>wants to play or watch a game ?
        </h1> -->

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
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickPlay(0)">
              Classic
            </v-btn>
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickPlay(1)">
              Rookie
            </v-btn>
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickPlay(2)">
              Multiballs
            </v-btn>
          </div>
          <!-- <div>
            <br> {{ messagePlayer }} <br>
          </div> -->
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
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch(0)">
              Classic
            </v-btn>
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch(1)">
              Rookie
            </v-btn>
            <v-btn class="mt-6 tab-btn" color="#f5cac3" @click="buttonClickWatch(2)">
              Multiballs
            </v-btn>
          </div>
          <div>
            <br> {{ gameUnavailable }} <br>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { GameStyle, GameStyleDTO } from '~/models';
import { gameStatusStore } from '~/store';
export default Vue.extend({
  layout: 'default',
  data () {
    return {
      gameUnavailable: '',
    }
  },

  methods: {
    buttonClickPlay (gameStyle: GameStyle): void {
      const gameStyleDTO: GameStyleDTO = {
        pongType: gameStyle,
      }
      this.$socket.client.emit('game-play', gameStyleDTO);
      gameStatusStore.startPlaying(gameStyle);
      this.$router.push('/game/play');
    },
    buttonClickWatch (gameStyle: GameStyle): void {
      const gameStyleDTO: GameStyleDTO = {
        pongType: gameStyle,
      }
      this.$socket.client.emit('game-watch', gameStyleDTO, (response: boolean) => {
        if (response === true) {
          this.$router.push('/game/play');
        } else {
          this.gameUnavailable = 'No games are being played at the moment, try again later';
        }
      });
    },
  },
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
