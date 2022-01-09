import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { User, UserStatus } from '~/models'
import { $axios } from '~/utils/api'

@Module({
  name: 'me',
  stateFactory: true,
  namespaced: true
})
export default class MeModule extends VuexModule {
  user = new User();

  get me (): User {
    return this.user;
  }

  @Mutation
  set (user: User) {
    if (user) {
      this.user = user;
      this.user.status = UserStatus.online;
    }
  }

  @Mutation
  updateMyStatus (status: UserStatus) {
    this.user.status = status;
  }

  @Action({ commit: 'set', rawError: true })
  async fetch () {
    const user: User = await $axios.$get('/user/me', { withCredentials: true });
    return user;
  }
}
