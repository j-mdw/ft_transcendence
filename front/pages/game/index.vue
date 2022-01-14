<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col
        sm="9"
        align="center"
        justify="center"
        class="mr-16 ml-n8"
      >
        <v-card
          class="pa-2 mb-7 mt-7 our_dark_beige"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
          <div class="our_navy_blue--text"> <h3> Play Game <pingpongLogo class="ml-4"/> </h3> </div>
          <div class="tab-row">
            <v-btn class="mt-6 tab-btn our_beige ml-1 mr-1 mb-6" color="#f5cac3" @click="buttonClickPlay(0)">
              Classic
            </v-btn>
            <v-btn class="mt-6 tab-btn our_beige ml-1 mr-1 mb-6" color="#f5cac3" @click="buttonClickPlay(1)">
              Multiballs
            </v-btn>
            <v-btn class="mt-6 tab-btn our_beige ml-1 mr-1 mb-6" color="#f5cac3" @click="buttonClickPlay(2)">
              Rookie
            </v-btn>
          </div>
          <!-- <div>
            <br> {{ messagePlayer }} <br>
          </div> -->
        </v-card>
        <v-card
          class="pa-2 mb-7 mt-7 our_dark_beige"
          color="#F7C678"
          outlined
          align="center"
          max-width="500px"
        >
          <div class="our_navy_blue--text"> <h3> Watch Game  <v-icon color="#395c6b" right>
          fa-eye
        </v-icon> </h3>  </div>
          <div class="tab-row">
            <v-btn class="mt-6 tab-btn our_beige ml-1 mr-1" color="#f5cac3" @click="buttonClickWatch(0)">
              Classic
            </v-btn>
            <v-btn class="mt-6 tab-btn our_beige ml-1 mr-1" color="#f5cac3" @click="buttonClickWatch(1)">
              Multiballs
            </v-btn>
            <v-btn class="mt-6 tab-btn our_beige ml-1 mr-1" color="#f5cac3" @click="buttonClickWatch(2)">
              Rookie
            </v-btn>
          </div>
          <div>
            <br> {{ gameUnavailable }} <br>
          </div>
        </v-card>
        <v-row justify="center" align="center" class="mt-8">
            <v-btn color="#f5cac3" to="/game/rules" class="mt-6">
              game rules
              <v-icon color="#395c6b" right>
                fa fa-align-justify
              </v-icon>
            </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import pingpongLogo from '../../components/Logo/pingpongLogo.vue';
import { GameDTO, GameStyle, GameStyleDTO } from '~/models';
import { gameStatusStore, usersStore } from '~/store';

export default Vue.extend({
  layout: 'default',
  components: { pingpongLogo },
  data () {
    return {
      gameUnavailable: '',
      games: [] as GameDTO[],
    }
  },
  mounted () { // DELETE
    console.log(usersStore.ranking);
    this.getLiveGames();
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
    buttonClickWatch2 (gameId: string) {
      this.$socket.client.emit('game-watch', gameId, (response: boolean) => {
        if (response === true) {
          this.$router.push('/game/play');
        } else {
          this.getLiveGames();
        }
      });
    },

    getLiveGames () {
      this.$socket.client.emit('game-get-all', (games: GameDTO[]) => {
        this.games = games;
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
