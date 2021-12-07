import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { User, UserStatus } from '~/models'
import { $axios } from '~/utils/api'

@Module({
  name: 'users',
  stateFactory: true,
  namespaced: true
})
export default class UsersModule extends VuexModule {
  // isLogin = localStorage.getItem("IS_LOGIN") === "true"

  users = new Map<string, User>()

  get allUsers (): Array<User> {
    return Array.from(this.users, ([name, value]) => (value))
  }

  @Mutation
  updateUserStatus (uid: string, status: UserStatus) {
    if (this.users.has(uid)) {
      const user = this.users.get(uid) as User
      user.status = status
      this.users.set(uid, user)
    }
  }

  @Mutation
  addUser (user: User) {
    if (!this.users.has(user.id)) {
      this.users.set(user.id, user)
    }
  }

  @Action({ rawError: true })
  async fetchUsers () {
    console.log('About to fetch users')
    const users: User[] = await $axios.$get('/user', { withCredentials: true })
    console.log(users)
  }
}
