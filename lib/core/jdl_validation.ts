import { JhipsterStringUtils } from '../utils/string_utils';

const merge = require('../utils/object_utils').merge;
const ErrorCases = require('../exceptions/error_cases').ErrorCases;
const VALIDATIONS = require('./jhipster/validations');

class JDLValidation {
  constructor(args) {
    const merged = merge(defaults(), args);
    this.name = merged.name;
    this.value = merged.value;
  }

  static checkValidity(validation) {
    const errors = [];
    if (!validation) {
      errors.push(ErrorCases.validations.NoValidation);
      return errors;
    }
    if (JhipsterStringUtils.isNilOrEmpty(validation.name)) {
      errors.push(ErrorCases.validations.NoName);
    }
    if (!VALIDATIONS.exists(validation.name)) {
      errors.push(ErrorCases.validations.WrongValidation);
    }
    if (VALIDATIONS.needsValue(validation.name) && JhipsterStringUtils.isNilOrEmpty(validation.value)) {
      errors.push(ErrorCases.validations.NoValue);
    }
    return errors;
  }

  static isValid(validation) {
    const errors = this.checkValidity(validation);
    return errors.length === 0;
  }

  toString() {
    let string = `${this.name}`;
    if (this.value || this.value === 0) {
      string += `(${this.value})`;
    }
    return string;
  }
}

export = JDLValidation;

function defaults() {
  return {
    name: 'required',
    value: ''
  };
}
