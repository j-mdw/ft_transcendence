import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({
  name: 'fetchStatus',
  stateFactory: true,
  namespaced: true
})
export default class FetchStatusModule extends VuexModule {
  fetchStatus: boolean = false;

  get status () {
    return this.fetchStatus;
  }

  @Mutation
  complete () {
    this.fetchStatus = true;
  }
}
