import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterStringUtils } from '../utils/string_utils';
import { JhipsterObjectUtils } from '../utils/object_utils';
import { Set } from '../utils/objects/set';

const ErrorCases = require('../exceptions/error_cases').ErrorCases;
const ReservedKeyWord = require('../core/jhipster/reserved_keywords');

const isReservedClassName = ReservedKeyWord.isReservedClassName;

class JDLEnum {
  constructor(args) {
    const merged = JhipsterObjectUtils.merge(defaults(), args);
    if (!merged.name) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.NullPointer,
        'The enum\'s name must be passed.');
    }
    if (isReservedClassName(merged.name)) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.IllegalName,
        `The name cannot be a reserved keyword, got: ${merged.name}.`
      );
    }
    this.comment = merged.comment;
    this.name = merged.name;
    this.values = new Set(merged.values);
  }

  addValue(value) {
    if (!value) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.NullPointer,
        'A valid value must be passed, got nil.');
    }
    this.values.add(value.toString());
  }

  static checkValidity(object) {
    const errors = [];
    if (!object) {
      errors.push(ErrorCases.enums.NoEnum);
      return errors;
    }
    if (JhipsterStringUtils.isNilOrEmpty(object.name)) {
      errors.push(ErrorCases.enums.NoName);
    } else if (isReservedClassName(object.name)) {
      errors.push(ErrorCases.enums.ReservedWordAsName);
    }
    return errors;
  }

  /**
   * Deprecated
   */
  static isValid(object) {
    const errors = this.checkValidity(object);
    return errors.length === 0;
  }

  toString() {
    let comment = '';
    if (this.comment) {
      comment += `/**\n * ${this.comment}\n */`;
    }
    return `${comment}\nenum ${this.name} {\n  ${this.values.join(',\n  ')}\n}`;
  }
}

export = JDLEnum;

function defaults() {
  return {
    values: new Set()
  };
}
