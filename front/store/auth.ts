import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

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

  @Action({ rawError: true })
  signIn () {
    this.context.commit('setLogin');
  }

  @Action({ rawError: true })
  signOut () {
    this.context.commit('removeLogin');
  }
}
