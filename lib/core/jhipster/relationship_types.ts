import * as _ from 'lodash';

export class RelationshipTypes {

  public static readonly RELATIONSHIP_TYPES = {
    ONE_TO_ONE: 'OneToOne',
    ONE_TO_MANY: 'OneToMany',
    MANY_TO_ONE: 'ManyToOne',
    MANY_TO_MANY: 'ManyToMany'
  };

  public static exists(relationship) {
    return Object.keys(RelationshipTypes.RELATIONSHIP_TYPES).map(key => RelationshipTypes.RELATIONSHIP_TYPES[key]).indexOf(_.upperFirst(_.camelCase(relationship))) > -1;
  }

}
