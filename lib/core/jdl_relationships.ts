import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';

const JDLRelationship = require('./jdl_relationship');

export class JDLRelationships {
  size: number;
  relationships: { OneToOne?: {}; OneToMany?: {}; ManyToOne?: {}; ManyToMany?: {}; };

  constructor() {
    this.relationships = {
      OneToOne: {},
      OneToMany: {},
      ManyToOne: {},
      ManyToMany: {}
    };
    this.size = 0;
  }

  public add(relationship) {
    if (!relationship) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'A relationship must be passed.');
    }
    if (!JDLRelationship.isValid(relationship)) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.InvalidObject, 'A valid relationship must be passed.');
    }
    this.relationships[relationship.type][relationship.getId()] = relationship;
    this.size++;
  }

  public toArray() {
    const relationships = [];
    Object.keys(this.relationships).forEach((type) => {
      Object.keys(this.relationships[type]).forEach((relationshipId) => {
        relationships.push(this.relationships[type][relationshipId]);
      });
    });
    return relationships;
  }

  public toString() {
    if (Object.keys(this.relationships).length === 0) {
      return '';
    }
    let string = '';
    Object.keys(this.relationships).forEach((type) => {
      if (Object.keys(this.relationships[type]).length !== 0) {
        const result = JDLRelationships.relationshipTypeToString(this.relationships[type], type);
        string += `${result}\n`;
      }
    });
    return string.slice(0, string.length - 1);
  }

  private static relationshipTypeToString(relationships, type) {
    let relationship = `relationship ${type} {\n`;
    Object.keys(relationships).forEach((internalRelationship) => {
      let lines = relationships[internalRelationship].toString().split('\n');
      lines = lines.slice(1, lines.length - 1);
      relationship += `${lines.join('\n')},\n`;
    });
    relationship = `${relationship.slice(0, relationship.length - 2)}\n}`;
    return relationship;
  }
}
