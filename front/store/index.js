import Vue from 'vue';

export const state = () => ({
    isLogin: true,
})

export const mutations = {
    setLogin(state) {
        state.isLogin = true
        this.$router.push('/login')
    },
    removeLogin(state){
        state.isLogin = false
    }
}
