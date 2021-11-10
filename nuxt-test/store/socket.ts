// import { GetterTree, ActionTree, MutationTree } from 'vuex'

// export const state = () => ({
// 	messages: Array<string>(),
//   })

//   export type RootState = ReturnType<typeof state>
  
// export const mutations: MutationTree<RootState> = {
// 	NEW_MESSAGE(state: RootState, message: string) {
// 		state.messages.push(message);
// 	}	  
//   }

// export const actions: ActionTree<RootState, RootState> = {
// 	socket_userMessage (message: string) { // <-- this action is triggered when `user_message` is emmited on the server
// 		return MessagesAPI.downloadMessageById(messageId).then((message) => {
// 		commit('NEW_MESSAGE', message);
// 		})
// 	}
// } 

// export const messages = {
// 	state: {
// 	  messages: []
// 	},
// 	mutations: {
// 	  SOCKET_CHAT_MESSAGE(state, message: string) {
// 		state.messages.push(message);
// 	  }
// 	},
// 	actions: {
// 	  socket_chatMessage() {
// 		console.log('this action will be called');
// 	  }
// 	},
//   };