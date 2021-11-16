import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
    isLogin: false,
  })

export type RootState = ReturnType<typeof state>
  
export const mutations: MutationTree<RootState> = {
    setLogin(state: RootState) {
        state.isLogin = true
    },
    removeLogin(state: RootState){
        state.isLogin = false
	}
}