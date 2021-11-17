import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
 
@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class AuthenticationModule extends VuexModule {
  isLogin = false

  get isLogged(): boolean {
    return this.isLogin
  }

  @Mutation
  setLogin() {
    this.isLogin = true;
  }

  @Mutation
  removeLogin(){
    this.isLogin = false
  }

  @Action({rawError: true})
  signIn() {
    this.context.commit("setLogin");
  }

}