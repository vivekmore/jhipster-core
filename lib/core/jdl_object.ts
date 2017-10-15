import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { AbstractJDLOption } from './abstract_jdl_option';
import { JDLRelationships } from './jdl_relationships';
import { JDLRelationship } from './jdl_relationship';
import { JDLOptions } from './jdl_options';

const JDLEntity = require('./jdl_entity');
const JDLEnum = require('./jdl_enum');

export class JDLObject {

  entities: any;
  enums: any;
  relationships: JDLRelationships;
  options: JDLOptions;

  constructor() {
    this.entities = {};
    this.enums = {};
    this.relationships = new JDLRelationships();
    this.options = new JDLOptions();
  }

  getOptions() {
    return this.options.getOptions();
  }

  /**
   * Adds or replaces an entity.
   * @param entity the entity to add.
   */
  addEntity(entity) {
    const errors = JDLEntity.checkValidity(entity);
    if (errors.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The entity must be valid in order to be added.\nErrors: ${errors.join(', ')}`);
    }
    this.entities[entity.name] = entity;
  }

  /**
   * Adds or replaces an enum.
   * @param enumToAdd the enum to add.
   */
  addEnum(enumToAdd) {
    const errors = JDLEnum.checkValidity(enumToAdd);
    if (errors.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The enum must be valid in order to be added.\nErrors: ${errors.join(', ')}`);
    }
    this.enums[enumToAdd.name] = enumToAdd;
  }

  addRelationship(relationship) {
    const errors = JDLRelationship.checkValidity(relationship);
    if (errors.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The relationship must be valid in order to be added.\nErrors: ${errors.join(', ')}`);
    }
    this.relationships.add(relationship);
  }

  addOption(option) {
    const errors = AbstractJDLOption.checkValidity(option);
    if (errors.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The option must be valid in order to be added.\nErrors: ${errors.join(', ')}`);
    }
    this.options.addOption(option);
  }

  toString() {
    let string = '';
    string += `${JDLObject.entitiesToString(this.entities)}\n`;
    string += `${JDLObject.enumsToString(this.enums)}\n`;
    string += `${JDLObject.relationshipsToString(this.relationships)}\n`;
    string += `${JDLObject.optionsToString(this.options)}`;
    return string;
  }

  private static entitiesToString(entities) {
    let string = '';
    Object.keys(entities).forEach((entityName) => {
      string += `${entities[entityName].toString()}\n`;
    });
    return string.slice(0, string.length - 1);
  }

  private static enumsToString(enums) {
    let string = '';
    Object.keys(enums).forEach((enumName) => {
      string += `${enums[enumName].toString()}\n`;
    });
    return string;
  }

  private static relationshipsToString(relationships) {
    const string = relationships.toString();
    if (string === '') {
      return '';
    }
    return `${relationships.toString()}\n`;
  }

  private static optionsToString(options) {
    const string = options.toString();
    if (string === '') {
      return '';
    }
    return `${string}\n`;
  }
}

