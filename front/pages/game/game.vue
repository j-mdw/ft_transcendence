<template>
<div id="v-app">
		<canvas
			id="game"
			class="game"
			style="border: none;"
			overscroll-behavior="none"
		></canvas>

	</div>


</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  	layout: 'empty',
	name: 'gamescript',
	data() {
		return {
			title:'Pong Game',
			// text:'',
			player1Status: false,
			player2Status: false,
			room:'',
			//socket: null, //ne sert a rien pour l'intant je crois
			context: null,
			canvas:  null,
			width: 0,
			height: 0,
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
			this.$socket.$unsubscribe('chat-message') //je ne sais pas si utile
		}
	},
	methods: {
		createScreen(){
			this.width = window.innerWidth,
			this.height = window.innerHeight;
			this.canvas.width = this.width //* ratio;
			this.canvas.height = this.height //* ratio;
			this.ratio.x = this.width / 1280;
			this.ratio.y = this.height / 960;
			this.ratio.less = (this.ratio.x > this.ratio.y ? this.ratio.y : this.ratio.x);
			},

		initialization() {
			this.$socket.client.emit('gameInitialization', this.username);
			//on recupere position de la balle sur le server
			//attention a priori ce qui uit est inutile
			this.$socket.$subscribe('ganeReturnInitialPosition', (data: any) => {
			for(let i = 0; i < data.balls.length; i++)
				this.drawBall(data.balls[i]);
			this.drawPlayer(data.p1);
			this.drawPlayer(data.p2);
			});
		},

				drawBall(ball: any) {
					this.context.beginPath();
					this.context.arc((ball.x * this.ratio.x), (ball.y * this.ratio.y), (ball.radius * this.ratio.less), 0, 2 * Math.PI);
					this.context.fill();
				},

				drawPlayer(player: any) {
					let top = (player.y - (player.h / 2)) * this.ratio.y,
						left = (player.x - (player.w / 2)) * this.ratio.x;
					this.context.fillRect(left, top, player.w * this.ratio.x, player.h * this.ratio.y);
					this.context.font = "30px Arial";
					// console.log(`${player.username}`)
					this.context.fillText( player.userName + " : " + player.score, player.xScore * this.ratio.x, 50 * this.ratio.y);
				},

				gametype(typeofgame: string) {
					this.$socket.client.emit('gameTypeOfGame', typeofgame)
				},

	},



	destroyed(){
		console.log("ohoh destroyed");

	},

	mounted() {
		this.canvas = <HTMLCanvasElement>document.getElementById("game");
		this.context = this.canvas.getContext('2d');
        //dessin du cadre
        this.createScreen();
        //position de depart
		this.initialization(); //mettre en statut player1, 2 ou spectateur
		//et pour player 1 et 2 leur indiquer le nom de la room ou ils sont
		//car pour l'instant ce qui relie cette page au game, c'estle socketid



	  // addeventlistener  d'appui sur touche
        window.addEventListener('keydown', (event) => {
			//mettre condition playerStatus = true, sinon pas la peine d'envoyer l'info
            if(event.key === 'w') //w
                this.$socket.client.emit('gameKeyPress', {inputId:'up', state:true});
            else if(event.key === 's') //s
                this.$socket.client.emit('gameKeyPress', {inputId:'down', state:true});
            else if(event.key === 'ArrowUp') //up
                this.$socket.client.emit('gameKeyPress', {inputId:'up', state:true});
            else if(event.key === 'ArrowDown') //down
                this.$socket.client.emit('gameKeyPress', {inputId:'down', state:true});
            })


	// addeventlistener de relachement d'une touche
        window.addEventListener('keyup', (event) => {
			//mettre condition playerStatus = true, sinon pas la peine d'envoyer l'info

            if(event.key === 'w') //up
                this.$socket.client.emit('gameKeyPress', {inputId:'up', state:false});
            else if(event.key === 's') //down
                this.$socket.client.emit('gameKeyPress', {inputId:'down', state:false});
            else if(event.key === 'ArrowUp') //s
                this.$socket.client.emit('gameKeyPress', {inputId:'up', state:false});
            else if(event.key === 'ArrowDown') //s
                this.$socket.client.emit('gameKeyPress', {inputId:'down', state:false});
            })

	// addeventlistener de changement de taille de l'ecran
        window.addEventListener('resize', (event) => {
            this.createScreen();
        })

		  //gameloop
		  //
        this.$socket.client.emit('gameLoop');

	// on recupere les donnees en provenance du serveur
        this.$socket.$subscribe('gameReturnFullData', (data: any) => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath();
            this.context.moveTo(this.canvas.width / 2, 0);
            this.context.lineTo (this.canvas.width / 2, this.canvas.height);
            this.context.stroke();
			for(let i = 0; i < data.balls.length; i++)
				this.drawBall(data.balls[i]);
            this.drawPlayer(data.p1);
			this.drawPlayer(data.p2);
			// if (data.p1.score >= 2|| data.p2.score >= 2){

			// 	console.log("coucou");
			// 	this.$router.push('/home');
			// }
			});

		this.$socket.$subscribe('gameWinner', (data: string) => {
			this.context.font = "30px Arial";
			this.context.fillText( "Player " + data + " has won !!!!", 500 * this.ratio.x, 240 * this.ratio.y);
			const tID = setTimeout(() => {
				this.$router.push('/profile');
            	window.clearTimeout(tID);		// clear time out.
				}, 3000);

			});
	},

	beforeDestroy(){
		console.log("ohoh beforedestroy");
		this.$socket.client.emit('gameCheckIfCleanlyExited');
	},


})
</script>
