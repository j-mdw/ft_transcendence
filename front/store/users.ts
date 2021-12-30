import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Vue from 'vue'
import { StatusUpdate, User, UserStatus } from '~/models'
import { $axios } from '~/utils/api'

@Module({
  name: 'users',
  stateFactory: true,
  namespaced: true
})
export default class UsersModule extends VuexModule {
  users = {} as { [key: string]: User };

  get allUsers (): User[] {
    console.log('Users GETTER called');
    return Object.values(this.users)
  }

  get oneUser (): (userId: string) => User {
    return (userId: string) => {
      return this.users[userId];
    }
  }

  @Mutation
  set (users: User[]) {
    this.users = users.map((x: User) => ({
      ...x,
      status: UserStatus.offline,
    })).reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {} as { [key: string]: User })
  }

  @Mutation
  setUsersStatus (userStatuses: StatusUpdate[]) {
    userStatuses.forEach((updateStatus) => {
      if (updateStatus.id in this.users) {
        this.users[updateStatus.id].status = updateStatus.status
      }
    })
    console.log('users status set:', this.users);
  }

  @Mutation
  updateUserStatus (data: StatusUpdate) {
    if (data.id in this.users) {
      this.users[data.id].status = data.status
    }
  }

  @Mutation
  addUser (user: User) {
    Vue.set(this.users, user.id, user)
  }

  @Action({ commit: 'set', rawError: true })
  async fetchUsers () {
    const users: User[] = await $axios.$get('/user', { withCredentials: true });
    return users;
  }
}
