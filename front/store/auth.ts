import axios from 'axios';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class AuthenticationModule extends VuexModule {
  isLogin = localStorage.getItem('IS_LOGIN') === 'true'

  get isLogged (): boolean {
    return this.isLogin
  }

  @Mutation
  setLogin () {
    this.isLogin = true;
    localStorage.setItem('IS_LOGIN', 'true')
  }

  @Mutation
  removeLogin () {
    this.isLogin = false
    localStorage.setItem('IS_LOGIN', 'false')
  }
  //Only use actions for Async code
  // @Action({ rawError: true })
  // signIn () {
  //   console.log('Signing in!');
  //   this.context.commit('setLogin');
  // }

  @Action({commit: 'removeLogin', rawError: true })
  async signOut () {
    await axios.get('/logout', { withCredentials: true });
    return ;
  }
}
