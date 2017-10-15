import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterStringUtils } from '../utils/string_utils';
import { JhipsterObjectUtils } from '../utils/object_utils';
import { Set } from '../utils/objects/set';
import { ErrorCasesEnum } from '../exceptions/error_cases';
import { ReservedKeywords } from './jhipster/reserved_keywords';

const ErrorCases = ErrorCasesEnum.ErrorCases;
const isReservedClassName = ReservedKeywords.isReservedClassName;

export class JDLEnum {

  comment: any;
  name: any;
  values: Set;

  constructor(args?) {
    const merged = JhipsterObjectUtils.merge(JDLEnum.defaults(), args);
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

  private static defaults() {
    return {
      values: new Set()
    };
  }
}
