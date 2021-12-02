import Vue from 'vue';
import { io, Socket } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
import { authenticationStore } from '~/store';


const socket: Socket = io("http://localhost:4000", {
  autoConnect: true,
});

export default (({store}: any) => {
  Vue.use(VueSocketIOExt, socket, ({store})),
  // store.watch((state: any) => {
  //   if (state.isLogged()) {
  //     socket.connect();
  //   }
  //   else {
  //     socket.disconnect();
  //   } 
  // });
  // store.watch(
  //   (state: any) => state.isLogged(),
  //   (val: boolean) => {
  //     if (val) {
  //       socket.connect()
  //     } else {
  //       socket.disconnect()
  //     }
  //   },
  //   {
  //     immediate: true,
  //   }
  // );
})

// import { Plugin } from '@nuxt/types'
// import { $socket, initializeSocket } from '~/utils/api'
// const accessor: Plugin = (socket) => {
//   initializeSocket($socket)
// }

// $store.socket.watch(() =>
// {

// }