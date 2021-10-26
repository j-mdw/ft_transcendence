import Vue from 'vue';

export const state = () => ({
    isLogin: false,
})

export const mutations = {
    setLogin(state) {
        state.isLogin = true
    },
    removeLogin(state){
        state.isLogin = false
    }
}
