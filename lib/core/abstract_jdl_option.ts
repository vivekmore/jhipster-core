import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterStringUtils } from '../utils/string_utils';
import { JhipsterObjectUtils } from '../utils/object_utils';

const JDLEntity = require('./jdl_entity');
const Set = require('../utils/objects/set');
const ErrorCases = require('../exceptions/error_cases').ErrorCases;

class AbstractJDLOption {
  constructor(args) {
    const merged = JhipsterObjectUtils.merge(defaults(), args);
    if (!merged.name) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The option\'s name must be passed.');
    }
    this.name = merged.name;
    this.entityNames = new Set(merged.entityNames);
    if (this.entityNames.size() === 0) {
      this.entityNames.add('*');
    }
    this.excludedNames = new Set(merged.excludedNames);
  }

  addEntity(entity) {
    const errors = JDLEntity.checkValidity(entity);
    if (errors.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The passed entity must be valid.\nErrors: ${errors.join(', ')}`);
    }
    if (this.excludedNames.has(entity.name)) {
      return false;
    }
    if (this.entityNames.has('*')) {
      this.entityNames.remove('*');
    }
    return this.entityNames.add(entity.name);
  }

  addEntitiesFromAnotherOption(option) {
    if (!option || !AbstractJDLOption.isValid(option)) {
      return false;
    }
    this.entityNames.addSetElements(option.entityNames);
    this.excludedNames.addSetElements(option.excludedNames);
    return true;
  }

  excludeEntity(entity) {
    const errors = JDLEntity.checkValidity(entity);
    if (errors.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The passed entity must be valid.\nErrors: ${errors.join(', ')}`);
    }
    if (this.entityNames.has(entity.name)) {
      return false;
    }
    return this.excludedNames.add(entity.name);
  }

  getType() {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.UnsupportedOperation);
  }

  static checkValidity(object) {
    const errors = [];
    if (!object) {
      errors.push(ErrorCases.options.NoOption);
      return errors;
    }
    if (JhipsterStringUtils.isNilOrEmpty(object.name)) {
      errors.push(ErrorCases.options.NoName);
    }
    if (!object.entityNames) {
      errors.push(ErrorCases.options.NoEntityNames);
    }
    if (object.entityNames && object.entityNames.has(null)) {
      errors.push(ErrorCases.options.NilInEntityNames);
    }
    if (!object.excludedNames) {
      errors.push(ErrorCases.options.NoExcludedNames);
    }
    if (object.excludedNames && object.excludedNames.has(null)) {
      errors.push(ErrorCases.options.NilInExcludedNames);
    }
    try {
      object.getType();
    } catch (error) {
      errors.push(ErrorCases.options.NoType);
    }
    return errors;
  }

  static isValid(object) {
    const errors = this.checkValidity(object);
    return errors.length === 0;
  }
}

export = AbstractJDLOption;

function defaults() {
  return {
    entityNames: new Set(['*']),
    excludedNames: new Set()
  };
}
