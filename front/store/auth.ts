import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
 
@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class AuthenticationModule extends VuexModule {
  isLogin = localStorage.getItem("IS_LOGIN") === "true"
  twoFa = localStorage.getItem("TWO_FA") === "false"

  get isLogged(): boolean {
    return this.isLogin
  }

  get isTwoFa(): boolean {
    return this.twoFa
  }

  @Mutation
  setLogin() {
    this.isLogin = true;
    localStorage.setItem("IS_LOGIN", "true")
  }

  @Mutation
  removeLogin(){
    this.isLogin = false
    localStorage.setItem("IS_LOGIN", "false")
  }

  @Mutation
  setTwoFa() {
    this.twoFa = true;
    localStorage.setItem("TWO_FA", "true")
  }

  @Mutation
  removeTwoFa(){
    this.twoFa = false
    localStorage.setItem("TWO_FA", "false")
  }

  @Action({rawError: true})
  signIn() {
    this.context.commit("setLogin");
  }

  @Action({rawError: true})
  signOut() {
    this.context.commit("removeLogin");
  }

  @Action({rawError: true})
  activateTwofa() {
    this.context.commit("setTwoFa");
  }

  @Action({rawError: true})
  desactivateTwofa() {
    this.context.commit("removeTwoFa");
  }

  @Action({rawError: true})
  setTwofaFirstTime(twofa: boolean) {
    if(twofa == true)
      this.context.commit("removeTwoFa");
    else
      this.context.commit("setTwoFa");
  }

}