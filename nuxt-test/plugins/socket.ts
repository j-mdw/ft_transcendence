
import Vue from 'vue';
import { io, Socket } from 'socket.io-client'
// import VueSocketIOExt from 'vue-socket.io-extended';

// const socket: Socket = io("http://localhost:4001");
// socket.on('connect', () => {
// 	console.log(`Connected with id: , ${socket.id}`);
// })

// export default Vue.use({
// 	install(Vue) {
// 	Vue.socket = socket;
// 	Vue.prototype.$socket = $socket;
// 	}
// });  

declare module 'vue/types/vue' {
  interface Vue {
    $socket: Socket
  }
}

const socket: Socket = io("http://localhost:4001");
socket.on('connect', () => console.log("connected to the server!!"));

Vue.prototype.$socket = socket;



// socket.on('connection', (socket) => {
// 	console.log('user connected');
// 	socket.on('disconnect', () => {
// 	  console.log('user disconnected');
// 	});
//   });