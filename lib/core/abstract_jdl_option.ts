import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterStringUtils } from '../utils/string_utils';
import { JhipsterObjectUtils } from '../utils/object_utils';
import { Set } from '../utils/objects/set';
import { JDLEntity } from './jdl_entity';
import { ErrorCasesEnum } from '../exceptions/error_cases';

export abstract class AbstractJDLOption {

  name: any;
  entityNames: Set;
  excludedNames: Set;

  constructor(args) {
    const merged = JhipsterObjectUtils.merge(AbstractJDLOption.defaults(), args);
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

  public addEntity(entity) {
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

  public addEntitiesFromAnotherOption(option) {
    if (!option || !AbstractJDLOption.isValid(option)) {
      return false;
    }
    this.entityNames.addSetElements(option.entityNames);
    this.excludedNames.addSetElements(option.excludedNames);
    return true;
  }

  public excludeEntity(entity) {
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

  public static getType(): any {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.UnsupportedOperation);
  }

  public static checkValidity(object) {
    const errors = [];
    if (!object) {
      errors.push(ErrorCasesEnum.ErrorCases.options.NoOption);
      return errors;
    }
    if (JhipsterStringUtils.isNilOrEmpty(object.name)) {
      errors.push(ErrorCasesEnum.ErrorCases.options.NoName);
    }
    if (!object.entityNames) {
      errors.push(ErrorCasesEnum.ErrorCases.options.NoEntityNames);
    }
    if (object.entityNames && object.entityNames.has(null)) {
      errors.push(ErrorCasesEnum.ErrorCases.options.NilInEntityNames);
    }
    if (!object.excludedNames) {
      errors.push(ErrorCasesEnum.ErrorCases.options.NoExcludedNames);
    }
    if (object.excludedNames && object.excludedNames.has(null)) {
      errors.push(ErrorCasesEnum.ErrorCases.options.NilInExcludedNames);
    }
    try {
      object.getType();
    } catch (error) {
      errors.push(ErrorCasesEnum.ErrorCases.options.NoType);
    }
    return errors;
  }

  public static isValid(object) {
    const errors = AbstractJDLOption.checkValidity(object);
    return errors.length === 0;
  }

  private static defaults() {
    return {
      entityNames: new Set(['*']),
      excludedNames: new Set()
    };
  }
}

