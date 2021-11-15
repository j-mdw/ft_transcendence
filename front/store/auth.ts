import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
 
@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class AuthenticationModule extends VuexModule {
  count = 0
  isLogin = false
  is42 = false

  get isLogged(): boolean {
    //console.log(this.isLogin)
    return this.isLogin
  }

  get isit42(): boolean {
    //console.log(this.isLogin)
    return this.is42
  }


  @Mutation
  setLogin() {
    this.isLogin = true;
  }

  @Mutation
  set42() {
    console.log("H0 !");
    this.is42 = true;
    console.log(this.is42);
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
    this.context.commit("setLogin");
  //  console.log("Cal");
  }

  @Action({rawError: true})
  sign42() {
    this.context.commit("set42");
    console.log("Commit");
  }


}