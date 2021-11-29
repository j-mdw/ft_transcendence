import Vue from 'vue';
import { io, Socket } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';

const socket: Socket = io("http://localhost:4000");

export default () => {
  Vue.use(VueSocketIOExt, socket)
};