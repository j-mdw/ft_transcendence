<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col sm="4">
        <v-card color="our_dark_beige" height="400" class="scrolla">
          <v-card-title class="our_beige our_navy_blue--text">
            <v-row align="center" justify="center" class="mt-1 mb-1">
              Play Game <pingpongLogo class="ml-4" />
            </v-row>
          </v-card-title>
          <v-row align="center" justify="center" class="mt-2 mb-n8 ml-4">
            <v-btn class="mt-16 tab-btn our_beige ml-1 mr-1 mb-6 " width="200" color="#F5CAC3" @click="buttonClickPlay(0)">
              Classic
            </v-btn>
          </v-row>
          <v-row align="center" justify="center" class="mt-2 mb-n8 ml-4">
            <v-btn class="mt-6 tab-btn our_beige ml-1 mr-1 mb-6" width="200" color="#F5CAC3" @click="buttonClickPlay(1)">
              Multiballs
            </v-btn>
          </v-row>
          <v-row align="center" justify="center" class="mt-2 mb-n8 ml-4">
            <v-btn class="mt-6 tab-btn our_beige ml-1 mr-1 mb-6" width="200" color="#F5CAC3" @click="buttonClickPlay(2)">
              Rookie
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
      <v-col>
        <v-card color="our_dark_beige" height="400" class="scrolla">
          <v-card-title class="our_beige our_navy_blue--text">
            <v-row align="center" justify="center" class="mt-1 mb-1">
              Watch Game  <v-icon color="#395C6B" right>
                fa-eye
              </v-icon>
            </v-row>
          </v-card-title>
          <div v-if="games">
            <v-list class="our_dark_beige">
              <div v-for="game in games" :key="game.it" class=" our_navy_blue--text">
                <v-row justify="center" align="center">
                  <v-col v-if="game.player1" class="ml-16" sm="3">
                    <h3>{{ getPseudo(game.player1.id) }}  - {{ getPseudo(game.player2.id) }}</h3>
                  </v-col>
                  <v-col v-if="game.player2" align="right" class="mr-8" sm="3">
                    <v-btn class="our_light_pink  mt-2 mb-3 " @click="buttonClickWatch2(game.id)">
                      watch this game
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider />
              </div>
            </v-list>
          </div>

          <v-row justify="center" align="center" class="mt-2">
            <v-btn class="mt-8 our_beige " width="200" @click="getLiveGames()">
              refresh
            </v-btn>
          </v-row>
        </v-card>
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
  components: { pingpongLogo },
  layout: 'default',
  data () {
    return {
      gameUnavailable: '',
      games: [] as GameDTO[],
    }
  },
  mounted () { // DELETE
    usersStore.fetchUsers()
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
    getPseudo (peerId: string) {
      if (usersStore.oneUser(peerId)) { return usersStore.oneUser(peerId).pseudo; } else { return ''; }
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
.scrolla {
   overflow-y: scroll;
   overflow-x: hidden !important;
}
</style>
