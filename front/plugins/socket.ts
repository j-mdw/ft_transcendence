/* eslint-disable no-unused-expressions */
import Vue from 'vue'
import { io, Socket } from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import { MessageReceived, Relationship, StatusUpdate } from '~/models';

const socket: Socket = io({
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
  });
  socket.on('relationship-delete', (peerId: string) => {
    store.commit('relationship/delete', peerId);
  });
  socket.on('chat-channel-joined', async (channelId: string) => {
    store.commit('messages/setCurrentChannel', channelId);
    await store.dispatch('messages/fetch');
  });
  socket.on('chat-DM-joined', async (channelId: string) => {
    store.commit('messages/setCurrentChannel', channelId);
    await store.dispatch('messages/fetch');
  });
  socket.on('chat-message-to-client', (message: MessageReceived) => {
    store.commit('messages/add', message);
  });

  store.watch(
    (_state: any, getters: any) =>
      getters['auth/isLogged'],
    (val: boolean) => {
      if (!val) {
        store.commit('messages/clearCurrentChannel');
        store.commit('fetchStatus/reset');
        socket.disconnect();
      }
    },
    {
      immediate: true,
    });

  store.watch(
    (_state: any, getters: any) =>
      getters['fetchStatus/status'],
    (val: boolean) => {
      if (val) {
        socket.connect();
      }
    });

  store.watch(
    (_state: any, getters: any) =>
      getters['users/allUsers'],
    () => {
      socket.emit('user-get-all-status');
    });
}
