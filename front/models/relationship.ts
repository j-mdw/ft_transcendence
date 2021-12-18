export enum RelationshipType {
  sent,
  received,
  friend,
  blocked,
}

export interface Relationship {
  peerId: string;
  type: RelationshipType;
}

export interface RelationshipUpdate {
  type: RelationshipType;
}
