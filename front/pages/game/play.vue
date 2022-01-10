<template>
<div v-if="game">
  <div v-if="game.state == 0">
  <h1>
    {{ game.countdown }}
  </h1>
  </div>
  <div id="v-app" class="v-app">
    <canvas
      id="game"
      class="game"
      style="border: none"
      overscroll-behavior="none"
    ></canvas>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Ball,
  GameDTO,
  GameIdDTO,
  GameKey,
  GameState,
  GameStyle,
  GameStyleDTO,
  Paddle,
  PaddleMoveDTO,
  Role,
} from "~/models";
import { gameStatusStore, meStore } from "~/store";

export default Vue.extend({
  middleware: ['auth', 'fetch'],
  layout: "empty",
  data() {
    return {
      game: Object() as GameDTO,
      canvas: Object(),
      context: Object(),
      width: 0,
      height: 0,
      ratio: {
        x: 0,
        y: 0,
        less: 0,
      },
    };
  },
  methods: {
    createScreen() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width; //* ratio;
      this.canvas.height = this.height; //* ratio;
      this.ratio.x = this.width / 1280;
      this.ratio.y = this.height / 960;
      this.ratio.less =
        this.ratio.x > this.ratio.y ? this.ratio.y : this.ratio.x; 
      },

    drawBall(ball: Ball) {
      if (this.context) {
        this.context.beginPath();
        this.context.arc(
          ball.x * this.ratio.x,
          ball.y * this.ratio.y,
          ball.radius * this.ratio.less,
          0,
          2 * Math.PI
        );
        this.context.fill();
      }
    },

    drawPaddle(paddle: Paddle) {
      let top = (paddle.y - paddle.h / 2) * this.ratio.y,
        left = (paddle.x - paddle.w / 2) * this.ratio.x;
      if (this.context) {
        this.context.fillRect(
          left,
          top,
          paddle.w * this.ratio.x,
          paddle.h * this.ratio.y
        );
        this.context.font = "30px Arial"; // Used for fillText only, remove??
        // this.context.fillText( paddle.userName + " : " + player.score, player.xScore * this.ratio.x, 50 * this.ratio.y);
      }
    },

    addWindowListeners() {
      window.addEventListener("keydown", this.keydownListener);
      window.addEventListener("keyup", this.keyupListener);
      window.addEventListener("resize", this.createScreen);
    },

    keydownListener(event: KeyboardEvent) {
      if (this.role !== undefined && this.role !== Role.spectator) {
        const paddleMove: PaddleMoveDTO = {
          gameId: this.game.id,
          keyChange: -1,
        };
        if (event.key === "ArrowUp") {
          paddleMove.keyChange = GameKey.UpPress;
          this.$socket.client.emit("game-update-from-player", paddleMove);
        } else if (event.key === "ArrowDown") {
          paddleMove.keyChange = GameKey.DownPress;
          this.$socket.client.emit("game-update-from-player", paddleMove);
        }
      }
    },

    keyupListener(event: KeyboardEvent) {
      if (this.role !== undefined && this.role !== Role.spectator) {
        const paddleMove: PaddleMoveDTO = {
          gameId: this.game.id,
          keyChange: -1,
        };
        if (event.key === "ArrowUp") {
          paddleMove.keyChange = GameKey.UpRelease;
          this.$socket.client.emit("game-update-from-player", paddleMove);
        } else if (event.key === "ArrowDown") {
          paddleMove.keyChange = GameKey.DownRelease;
          this.$socket.client.emit("game-update-from-player", paddleMove);
        }
      }
    },

    removeWindowListeners() {
      window.removeEventListener("keydown", this.keydownListener);
      window.removeEventListener("keyup", this.keyupListener);
      window.removeEventListener("resize", this.createScreen);
    },
  },

  computed: {
    role: function() {
      if (this.game) {
        if (meStore.me.id === this.game.player1.id) {
          return Role.player1;
        } else if (meStore.me.id === this.game.player2.id) {
          return Role.player2;
        } else {
          return Role.spectator;
        }
      } else {
        return undefined;
      }
    }
  },

  mounted() {
    this.canvas = <HTMLCanvasElement>document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    this.createScreen();
    this.addWindowListeners();

    this.$socket.$subscribe("game-data-update", (gameData: GameDTO) => {
      this.game = gameData;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.beginPath();
      this.context.moveTo(this.canvas.width / 2, 0);
      this.context.lineTo(this.canvas.width / 2, this.canvas.height);
      this.context.stroke();
      if (gameData.state == GameState.playing) {
        gameData.balls.forEach((ball) => {
          this.drawBall(ball);
        });
        this.drawPaddle(gameData.player1.paddle);
        this.drawPaddle(gameData.player2.paddle);
      }
    });
  },

  beforeDestroy() {
    gameStatusStore.stopPlaying();
    this.removeWindowListeners();
    const gameIdDTO: GameIdDTO = {
      id: this.game.id
    }
    this.$socket.client.emit("game-leave", gameIdDTO);
  },
});
</script>

<style scoped lang="scss">
.v-app {
  overflow: hidden !important;
}

.game {
  overflow: hidden !important;
  display: block;
}
</style>