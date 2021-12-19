/* eslint-disable no-unused-expressions */
import Vue from 'vue'
import { io, Socket } from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import { Store } from 'vuex';
import { Relationship, StatusUpdate } from '~/models';
// import { getters } from '~/store';

const socket: Socket = io('http://localhost:4000', {
  autoConnect: false,
  withCredentials: true
});

export default ({ store }: any) => {
  Vue.use(VueSocketIOExt, socket, ({ store }));

  socket.on('all-users-status', (userStatus: StatusUpdate[]) => {
    store.commit('users/setUsersStatus', userStatus);
  });
  socket.on('status-update', (data: StatusUpdate) => {
    store.commit('users/updateUserStatus', data)
  });
  socket.on('relationship-update', (data: Relationship) => {
    store.commit('relationship/update', data);
    try {
      const user = store.getters['relationship/one'](data.peerId);
      console.log('Relation found:', user);
    } catch {
      console.log('Relationship does not exist with:', data.peerId);
    }
    console.log('Updated Relaitonships', store.getters['relationship/all']);
  });
  socket.on('relationship-delete', (peerId: string) => {
    store.commit('relationship/delete', peerId);
    console.log('All Relaitonships', store.getters['relationship/all']);
  });

  store.watch(
    (_state: any, getters: any) =>
      getters['auth/isLogged'],
    async (val: boolean) => {
      if (val) {
        await store.dispatch('me/fetch');
        await store.dispatch('users/fetchUsers');
        await store.dispatch('relationship/fetch');
        socket.connect();
      } else {
        socket.disconnect();
      }
    },
    {
      immediate: true,
    });
}
