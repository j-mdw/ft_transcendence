<template>
<div id="v-app">
		<canvas
			id="game"
			style="border: 4px solid black;"
		></canvas>
	</div>


</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'default',
	name: "game",
	data() {
		return {
			title:'Pong Game',
				text:'',
				username:'',
				socket: null,
				context: null,
				canvas: null,
				ratio:{ //on part sur un ecran de 1280 x 960
					x:0,
					y:0,
					less:0,
				},
		}
	},
	sockets: {
		connect() {
			console.log("we\'re in!!");
		},
		disconnect() {
			this.$socket.$unsubscribe('chat-message')
		}
	},
	methods: {
		createScreen(){
					let	width = window.innerWidth,
						height = window.innerHeight;
					this.canvas.width = width //* ratio;
					this.canvas.height = height //* ratio;
					this.ratio.x = width / 1280;
					this.ratio.y = height / 960;
					this.ratio.less = (this.ratio.x > this.ratio.y ? this.ratio.y : this.ratio.x);

				},
				initialization() {
					this.$socket.client.emit('initialization');
					//on recupere position de la balle sur le server
					this.$socket.on('returnInitialPosition', (data) => {
					this.drawBall(data.ball);
					this.drawPlayer(data.p1);
					this.drawPlayer(data.p2);
					});
				},

				drawBall(ball) {
					this.context.beginPath();
					// this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.context.arc((ball.x * this.ratio.x), (ball.y * this.ratio.y), (ball.radius * this.ratio.less), 0, 2 * Math.PI);
					this.context.fill();
				},

				drawPlayer(player) {
					let top = (player.y - (player.h / 2)) * this.ratio.y,
						left = (player.x - (player.w / 2)) * this.ratio.x;
					this.context.fillRect(left, top, player.w * this.ratio.x, player.h * this.ratio.y);
					this.context.font = "30px Arial";
					this.context.fillText( this.username + " : " + player.score, player.xScore * this.ratio.x, 50 * this.ratio.y);
				},

    },
	mounted() {
        this.canvas = document.getElementById("game");
        this.context = this.canvas.getContext("2d");
        //dessin du cadre
        this.createScreen();
        //position de depart
        this.initialization();
        //loop
        window.addEventListener('keydown', (event) => {
            if(event.key === 'w') //w
                this.$socket.client.emit('keyPress', {inputId:'up', state:true});
            else if(event.key === 's') //s
                this.$socket.client.emit('keyPress', {inputId:'down', state:true});
            else if(event.key === 'ArrowUp') //up
                this.$socket.client.emit('keyPress2', {inputId:'up', state:true});
            else if(event.key === 'ArrowDown') //down
                this.$socket.client.emit('keyPress2', {inputId:'down', state:true});


            })


        window.addEventListener('keyup', (event) => {
            if(event.key === 'w') //up
                this.$socket.client.emit('keyPress', {inputId:'up', state:false});
            else if(event.key === 's') //down
                this.$socket.client.emit('keyPress', {inputId:'down', state:false});
            else if(event.key === 'ArrowUp') //s
                this.$socket.client.emit('keyPress2', {inputId:'up', state:false});
            else if(event.key === 'ArrowDown') //s
                this.$socket.client.emit('keyPress2', {inputId:'down', state:false});


            })

        window.addEventListener('resize', (event) => {
            this.createScreen();
        })

        this.$socket.client.emit('loop');

        this.$socket.on('returnFullData', (data) => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath();
            this.context.moveTo(this.canvas.width / 2, 0);
            this.context.lineTo (this.canvas.width / 2, this.canvas.height);
            this.context.stroke();

            this.drawBall(data.ball);
            this.drawPlayer(data.p1);
            this.drawPlayer(data.p2);
            });
    },


})
</script>