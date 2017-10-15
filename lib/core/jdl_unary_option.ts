import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { AbstractJDLOption } from './abstract_jdl_option';

const UNARY_OPTIONS = require('./jhipster/unary_options');

/**
 * For flags such as skipServer, skipClient, etc.
 */
export class JDLUnaryOption extends AbstractJDLOption {

  constructor(args?) {
    super(args);
    if (!UNARY_OPTIONS.exists(this.name)) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.IllegalArgument, `The option's name must be valid, got '${this.name}'.`);
    }
  }

  getType() {
    return 'UNARY';
  }

  toString() {
    const entityNames = this.entityNames.join(', ');
    entityNames.slice(1, entityNames.length - 1);
    const firstPart = `${this.name} for ${entityNames}`;
    if (this.excludedNames.size() === 0) {
      return firstPart;
    }
    const excludedNames = this.excludedNames.join(', ');
    excludedNames.slice(1, this.excludedNames.size() - 1);
    return `${firstPart} except ${excludedNames}`;
  }

  static isValid(option?) {
    return AbstractJDLOption.isValid(option);
  }
}
