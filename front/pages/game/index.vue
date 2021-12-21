<template>
<div id="v-app">
		<canvas
			id="game"
			style="border: 4px solid black;"
			overscroll-behavior="none"
		></canvas>
<!-- A UTILISER SUR AUTRE PAGE POUR SCRIPTER LE TYPE DDE JEU
		<p>
			<button @click="gametype('classic')">classic</button>
			<button @click="gametype('multiballs')">multiballs</button>
			<button @click="gametype('rookie')">rookie</button>
		</p> -->
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
			text:'',
			username:'',
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
					this.$socket.client.emit('initialization', this.username);
					//on recupere position de la balle sur le server
					//attention a priori ce qui uit est inutile
					this.$socket.$subscribe('returnInitialPosition', (data: any) => {
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
					this.context.fillText( player.username + " : " + player.score, player.xScore * this.ratio.x, 50 * this.ratio.y);
				},

				gametype(typeofgame: string) {
					this.$socket.client.emit('typeofgame', typeofgame)
				},

    },
	mounted() {
		this.canvas = <HTMLCanvasElement>document.getElementById("game");
		this.context = this.canvas.getContext('2d');
        //dessin du cadre
        this.createScreen();
        //position de depart
        this.initialization();

	  // addeventlistener  d'appui sur touche
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


	// addeventlistener de relachement d'une touche
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

	// addeventlistener de changement de taille de l'ecran
        window.addEventListener('resize', (event) => {
            this.createScreen();
        })

		  //loop
        this.$socket.client.emit('loop');

	// on recupere les donnees en provenance du serveur
        this.$socket.$subscribe('returnFullData', (data: any) => {
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
			// 	this.$router.push('/profile');
			// }
            });
    },


})
</script>
<!--
// this.socket.on('firstPlayerInitialization', (data) => {
				// 	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				// 	this.context.font = "30px Arial";
				// 	this.context.fillText( "WAITIN' FOR PLAYER TWO", 50 * this.ratio.x, 50 * this.ratio.y);
				// 	});
	-->