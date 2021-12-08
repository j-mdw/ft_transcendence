import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { User, UserStatus } from '~/models'
import { $axios } from '~/utils/api'

@Module({
  name: 'users',
  stateFactory: true,
  namespaced: true
})
export default class UsersModule extends VuexModule {
  users = new Map<string, User>()

  get allUsers (): Array<User> {
    return Array.from(this.users, ([name, value]) => (value));
  }

  @Mutation
  set (users: User[]) {
    for (let i = 0; i < users.length; i++) {
      this.users.set(users[i].id, users[i]);
    }
  }

  @Mutation
  updateUserStatus (uid: string, status: UserStatus) {
    if (this.users.has(uid)) {
      const user = this.users.get(uid) as User;
      user.status = status;
      this.users.set(uid, user);
    }
  }

  @Mutation
  addUser (user: User) {
    if (!this.users.has(user.id)) {
      this.users.set(user.id, user)
    }
  }

  @Action({ commit: 'set', rawError: true })
  async fetchUsers () {
    const users: User[] = await $axios.$get('http://localhost:4000/user', { withCredentials: true });
    console.log('Users: ', users);
    return users;
  }
}
