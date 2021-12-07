import Vue from 'vue';
import { io, Socket } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';


const socket: Socket = io("http://localhost:4000", {
  autoConnect: false,
  withCredentials: true,
});

export default (({ store }: any) => {
  Vue.use(VueSocketIOExt, socket, ({ store })),
  store.watch(
    (_state: any, getters: any) => 
    getters['auth/isLogged'],
    (val: boolean) => {
      if (val) {
        console.log('User login -> trying to connect to socket');
        socket.connect();
      } else {
        console.log('User login out -> disconnecting socket');
        socket.disconnect();
      }
    },
  );
})
