import { JhipsterStringUtils } from '../utils/string_utils';
import { JhipsterObjectUtils } from '../utils/object_utils';
import { ErrorCasesEnum } from '../exceptions/error_cases';
import { Validations } from './jhipster/validations';

export class JDLValidation {

  value: any;
  name: any;

  constructor(args?) {
    const merged = JhipsterObjectUtils.merge(JDLValidation.defaults(), args);
    this.name = merged.name;
    this.value = merged.value;
  }

  public static checkValidity(validation) {
    const errors = [];
    if (!validation) {
      errors.push(ErrorCasesEnum.ErrorCases.validations.NoValidation);
      return errors;
    }
    if (JhipsterStringUtils.isNilOrEmpty(validation.name)) {
      errors.push(ErrorCasesEnum.ErrorCases.validations.NoName);
    }
    if (!Validations.exists(validation.name)) {
      errors.push(ErrorCasesEnum.ErrorCases.validations.WrongValidation);
    }
    if (Validations.needsValue(validation.name) && JhipsterStringUtils.isNilOrEmpty(validation.value)) {
      errors.push(ErrorCasesEnum.ErrorCases.validations.NoValue);
    }
    return errors;
  }

  public static isValid(validation) {
    const errors = this.checkValidity(validation);
    return errors.length === 0;
  }

  public toString() {
    let string = `${this.name}`;
    if (this.value || this.value === 0) {
      string += `(${this.value})`;
    }
    return string;
  }

  private static defaults() {
    return {
      name: 'required',
      value: ''
    };
  }
}
