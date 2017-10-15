import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { AbstractJDLOption } from './abstract_jdl_option';

class JDLOptions {
  constructor() {
    this.options = {};
  }

  addOption(option) {
    const errors = AbstractJDLOption.checkValidity(option);
    if (errors.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The passed options is invalid'.\nErrors: ${errors.join(', ')}`);
    }
    const key = getOptionKey(option);
    if (!this.options[key]) {
      this.options[key] = option;
      return;
    }
    this.options[key].addEntitiesFromAnotherOption(option);
  }

  getOptions() {
    return Object.keys(this.options).map(optionKey => this.options[optionKey]);
  }

  has(optionName) {
    if (!optionName || optionName.length === 0) {
      return false;
    }
    return !!this.options[optionName]
      || Object.keys(this.options).filter(option => option.indexOf(optionName) !== -1).length !== 0;
  }

  toString() {
    if (Object.keys(this.options).length === 0) {
      return '';
    }
    return Object.keys(this.options)
      .map(optionKey => `${this.options[optionKey].toString()}`)
      .join('\n');
  }
}

function getOptionKey(option) {
  return (AbstractJDLOption.getType() === 'UNARY') ? option.name : `${option.name}_${option.value}`;
}

export = JDLOptions;
