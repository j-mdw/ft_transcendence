import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
 
@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class AuthenticationModule extends VuexModule {
  count = 0
  isLogin = false
  
  get isLogged(): boolean {
    //console.log(this.isLogin)
    return this.isLogin
  }

  @Mutation
  setLogin() {
    console.log("HEY !");
    this.isLogin = true;
    console.log(this.isLogin);
  }

  @Mutation
  setToken(accesstoken: string, refreshtoken: string) {
    localStorage.setItem("ACCESS_TOKEN", accesstoken)
    localStorage.setItem("REFRESH_TOKEN", refreshtoken)
  }
  
  @Mutation
  removeLogin(){
    this.isLogin = false
  }

  @Mutation
  decrement(delta: number) {
    this.count -= delta
  }
 
  // action 'decr' commits mutation 'decrement' when done with return value as payload
  @Action({ commit: 'decrement' })
  decr() {
    return 5
  }

  @Action({rawError: true})
  signIn() {
    console.log("Called！");
    this.context.commit("setLogin");
  //  console.log("Cal");
  }


}