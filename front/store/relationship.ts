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

  get one (): (peerId: string) => Relationship {
    return (peerId: string) => {
      for (let i = 0; i < this.relationships.length; i++) {
        if (this.relationships[i].peerId === peerId) {
          return this.relationships[i];
        }
      }
      return {
        // eslint-disable-next-line object-shorthand
        peerId: peerId,
        type: RelationshipType.none,
      }
    };
  }

  @Mutation
  set (relationships: Relationship[]) {
    this.relationships = relationships;
  }

  @Mutation
  update (relationship: Relationship) {
    for (let i = 0; i < this.relationships.length; i++) {
      if (this.relationships[i].peerId === relationship.peerId) {
        this.relationships[i].type = relationship.type;
        return;
      }
    }
    this.relationships.push(relationship);
  }

  @Mutation
  delete (peerId: string) {
    for (let i = 0; i < this.relationships.length; i++) {
      if (this.relationships[i].peerId === peerId) {
        this.relationships.splice(i, 1);
        return;
      }
    }
  }

  @Action({ commit: 'set', rawError: true })
  async fetch () {
    const relationships: Relationship[] = await $axios.$get('/relationships/me', { withCredentials: true });
    return relationships;
  }
}
