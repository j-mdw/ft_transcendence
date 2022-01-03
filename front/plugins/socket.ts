/* eslint-disable no-unused-expressions */
import Vue from 'vue'
import { io, Socket } from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import { MessageReceived, Relationship, StatusUpdate } from '~/models';
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
    async (val: boolean) => {
      if (val) {
        // try {
          await store.dispatch('me/fetch');
          await store.dispatch('users/fetchUsers');
          await store.dispatch('relationship/fetch');
          await store.dispatch('channels/fetch');
          await store.dispatch('messages/fetch');
          console.log('My channels:', store.getters['channels/mine']);
          console.log('Visible channels:', store.getters['channels/visible']);
          socket.connect();
        // } catch (error: any) {
          // if (error?.response?.status !== 401) {
            // throw (error);
          // }
        // }
      } else {
        socket.disconnect();
      }
    },
    {
      immediate: true,
    });
}
