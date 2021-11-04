import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
 
@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
class AuthenticationModule extends VuexModule {
  count = 0
  isLogin = false
  
  get isLogged(): boolean {
    //console.log(this.isLogin)
    return this.isLogin
  }

  @Mutation
  setLogin() {
    //console.log(this.isLogin);
    this.isLogin = true;
    //console.log(this.isLogin);
    (this as any).$router.push('/login')
  }
  
  @Mutation
  removeLogin(){
    this.isLogin = false
  }

  @Mutation
  increment(delta: number) {
    this.count += delta
  }
  @Mutation
  decrement(delta: number) {
    this.count -= delta
  }
 
  // action 'incr' commits mutation 'increment' when done with return value as payload
  @Action({ commit: 'increment' })
  incr() {
    return 5
  }
  // action 'decr' commits mutation 'decrement' when done with return value as payload
  @Action({ commit: 'decrement' })
  decr() {
    return 5
  }

  @Action
  signIn() {
    console.log("Called！");
    this.setLogin
  }


}

export default AuthenticationModule