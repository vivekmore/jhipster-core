import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';

export class JhipsterObjectUtils {

  /**
   * Merge two objects.
   * The order is important here: o1.merge(o2) means that the keys values of o2
   * will replace those identical to o1.
   * The keys that don't belong to the other object will be added.
   * @param object1 the object to be merged into.
   * @param object2 the object to be merged with.
   * @returns {Object} the object result of the merge
   */
  public static merge(object1, object2) {
    if (!object1 || Object.keys(object1).length === 0) {
      return object2;
    }
    if (!object2 || Object.keys(object2).length === 0) {
      return object1;
    }
    const merged = {};
    Object.keys(object1).forEach((key) => {
      merged[key] = object1[key];
    });
    Object.keys(object2).forEach((key) => {
      merged[key] = object2[key];
    });
    return merged;
  }

  public static values(object) {
    if (object == null) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed object must not be nil.');
    }
    const values = [];
    for (let i = 0, keys = Object.keys(object); i < keys.length; i++) {
      values.push(object[keys[i]]);
    }
    return values;
  }

  public static areEntitiesEqual(firstEntity, secondEntity) {
    if (firstEntity.fields.length !== secondEntity.fields.length
      || firstEntity.relationships.length !== secondEntity.relationships.length
      || firstEntity.javadoc !== secondEntity.javadoc
      || firstEntity.entityTableName !== secondEntity.entityTableName) {
      return false;
    }
    return JhipsterObjectUtils.areFieldsEqual(firstEntity.fields, secondEntity.fields)
      && JhipsterObjectUtils.areRelationshipsEqual(firstEntity.relationships, secondEntity.relationships)
      && JhipsterObjectUtils.areOptionsTheSame(firstEntity, secondEntity);
  }

  private static areFieldsEqual(firstFields, secondFields) {
    return firstFields.every((field, index) => {
      if (Object.keys(field).length !== Object.keys(secondFields[index]).length) {
        return false;
      }
      const secondEntityField = secondFields[index];
      return Object.keys(field).every((key) => {
        if (field[key].constructor === Array) {
          return field[key].toString() === secondEntityField[key].toString();
        }
        return field[key] === secondEntityField[key];
      });
    });
  }

  private static areRelationshipsEqual(firstRelationships, secondRelationships) {
    return firstRelationships.every((relationship, index) => {
      if (Object.keys(relationship).length !== Object.keys(secondRelationships[index]).length) {
        return false;
      }
      const secondEntityRelationship = secondRelationships[index];
      return Object.keys(relationship).every(key => relationship[key] === secondEntityRelationship[key]);
    });
  }

  private static areOptionsTheSame(firstEntity, secondEntity) {
    return firstEntity.dto === secondEntity.dto && firstEntity.pagination === secondEntity.pagination
      && firstEntity.service === secondEntity.service && firstEntity.searchEngine === secondEntity.searchEngine;
  }
}
