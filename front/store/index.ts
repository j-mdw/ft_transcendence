 //import Vue from 'vue';

 import { Store } from 'vuex'
 import { initialiseStores } from '~/utils/store-accessor'
 const initializer = (store: Store<any>) => initialiseStores(store)
 export const plugins = [initializer]
 export * from '~/utils/store-accessor'
 

// import Vuex, { Module } from 'vuex'
 
// import Auth from './modules/auth'
 
// Vue.use(Vuex)
 
// const store = new Vuex.Store({
//   state: {},
//   modules: {
//     Auth
//   }
// })