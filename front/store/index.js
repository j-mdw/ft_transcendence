import Vue from 'vue';

export const state = () => ({
    isLogin: false,
})

export const mutations = {
    setLogin(state) {
       console.log(state.isLogin);
        state.isLogin = true
        console.log(state.isLogin);
        this.$router.push('/login')
    },
    removeLogin(state){
        state.isLogin = false
    }
}
