
import Vue from 'vue';
import { io, Socket } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
// import store from '@/store';
// const socket: Socket = io("http://localhost:4001");
// socket.on('connect', () => {
// 	console.log(`Connected with id: , ${socket.id}`);
// })

const socket: Socket = io("http://localhost:4001");


export default () => {
  Vue.use(VueSocketIOExt, socket)
};

// socket.on('connect', () => console.log("connected to the server!!"));

// declare module 'vue/types/vue' {
//   interface Vue {
//     $socket: Socket
//   }
// }
// Vue.prototype.$socket = socket;





