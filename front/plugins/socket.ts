/* eslint-disable no-unused-expressions */
import Vue from 'vue'
import { io, Socket } from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import { Store } from 'vuex';
import { StatusUpdate } from '~/models';
// import { getters } from '~/store';

const socket: Socket = io('http://localhost:4000', {
  autoConnect: false,
  withCredentials: true
});

export default ({ store }: any) => {
  Vue.use(VueSocketIOExt, socket, ({ store }));

  socket.on('all-users-status', (userStatus: StatusUpdate[]) => {
    console.log('Reveived all user status: ', userStatus);
    store.commit('users/setUsersStatus', userStatus);
    console.log('State - Users(2):', store.state['users/users']);
    const usrs = store.getters['users/allUsers'];
    console.log('Stored users after update: ', usrs);
  });

  store.watch(
    (_state: any, getters: any) =>
      getters['auth/isLogged'],
    async (val: boolean) => {
      if (val) {
        await store.dispatch('users/fetchUsers');
        console.log('State - Users(1):', store.state['users/users']);
        console.log('Stored users: ', store.getters['users/allUsers']);
        socket.connect();
      } else {
        console.log('User login out -> disconnecting socket');
        socket.disconnect();
      }
    }
  );
}
