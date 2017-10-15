import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterStringUtils } from '../utils/string_utils';
import { JhipsterObjectUtils } from '../utils/object_utils';

const ErrorCases = require('../exceptions/error_cases').ErrorCases;
const JDLValidation = require('./jdl_validation');
const ReservedKeyWord = require('../core/jhipster/reserved_keywords');

const isReservedFieldName = ReservedKeyWord.isReservedFieldName;

class JDLField {
  constructor(args) {
    const merged = JhipsterObjectUtils.merge(defaults(), args);
    if (JhipsterStringUtils.isNilOrEmpty(merged.name) || JhipsterStringUtils.isNilOrEmpty(merged.type)) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.NullPointer,
        'The field name and type are mandatory.');
    }
    if (isReservedFieldName(merged.name)) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.IllegalName,
        `The field name cannot be a reserved keyword, got: ${merged.name}.`
      );
    }
    this.name = merged.name;
    this.type = merged.type;
    this.comment = merged.comment;

    /**
     * key: the validation's name, value: the validation object
     */
    this.validations = merged.validations;
  }

  addValidation(validation) {
    const errors = JDLValidation.checkValidity(validation);
    if (errors.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The passed validation must be valid.\nErrors: ${errors.join(', ')}`);
    }
    this.validations[validation.name] = validation;
  }

  static checkValidity(field) {
    const errors = [];
    if (!field) {
      errors.push(ErrorCases.fields.NoField);
      return errors;
    }
    if (JhipsterStringUtils.isNilOrEmpty(field.name)) {
      errors.push(ErrorCases.fields.NoName);
    } else if (isReservedFieldName(field.name)) {
      errors.push(ErrorCases.fields.ReservedWordAsName);
    }
    if (JhipsterStringUtils.isNilOrEmpty(field.type)) {
      errors.push(ErrorCases.fields.NoType);
    }
    if (field.validations) {
      for (let i = 0; i < field.validations.length; i++) {
        const validationErrors = JDLValidation.checkValidity(field.validations[i]);
        if (validationErrors.length !== 0) {
          errors.push(`For validation #${i + 1}: ${validationErrors}`);
        }
      }
      JDLValidation.checkValidity(field.validations);
    }

    return errors;
  }

  /**
   * Deprecated
   */
  static isValid(field) {
    const errors = this.checkValidity(field);
    return errors.length === 0;
  }

  toString() {
    let string = '';
    if (this.comment) {
      string += `/**\n${this.comment.split('\n').map(line => ` * ${line}\n`).join('')} */\n`;
    }
    string += `${this.name} ${this.type}`;
    Object.keys(this.validations).forEach((validationName) => {
      string += ` ${this.validations[validationName].toString()}`;
    });
    return string;
  }
}

export = JDLField;

function defaults() {
  return {
    validations: {}
  };
}
