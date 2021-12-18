import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Relationship, RelationshipType } from '~/models'
import { $axios } from '~/utils/api'

@Module({
  name: 'relationship',
  stateFactory: true,
  namespaced: true
})
export default class RelationshipModule extends VuexModule {
  relationships: Relationship[] = [];

  get all (): Relationship[] {
    return this.relationships;
  }

  @Mutation
  set (relationships: Relationship[]) {
    this.relationships = relationships;
  }

  @Mutation
  update (peerId: string, type: RelationshipType) {
    this.relationships.forEach((relation) => {
      if (relation.peerId === peerId) {
        relation.type = type;
      }
    });
  }

  @Action({ commit: 'set', rawError: true })
  async fetch () {
    const relationships: Relationship[] = await $axios.$get('/relationships/me', { withCredentials: true });
    return relationships;
  }
}
