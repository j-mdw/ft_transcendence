import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { StatusUpdate, User, UserStatus } from '~/models'
import { $axios } from '~/utils/api'

@Module({
  name: 'users',
  stateFactory: true,
  namespaced: true
})
export default class UsersModule extends VuexModule {
  users = new Map<string, User>()

  get allUsers (): Array<User> {
    return Array.from(this.users.values());
  }

  @Mutation
  set (users: User[]) {
    for (let i = 0; i < users.length; i++) {
      users[i].status = UserStatus.offline; //Default value
      this.users.set(users[i].id, users[i]);
      console.log('User added to store:', users[i]);
    }
  }

  @Mutation
  setUsersStatus (userStatus: StatusUpdate[]) {
    userStatus.forEach((element) => {
      if (this.users.has(element.id)) {
        const user = this.users.get(element.id) as User;
        user.status = element.status;
        this.users.set(element.id, user);
      }
    })
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
    const users: User[] = await $axios.$get('/user', { withCredentials: true });
    console.log('Users: ', users);
    return users;
  }
}
