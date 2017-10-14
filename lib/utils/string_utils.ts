import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';

export = {
  isNilOrEmpty,
  camelCase
};

function isNilOrEmpty(string) {
  return string == null || string === '';
}

function camelCase(string) {
  if (string == null) {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed string cannot be nil.');
  }
  if (string === '') {
    return string;
  }
  string = string.replace(/[\W_]/g, '');
  return `${string[0].toLowerCase()}${string.slice(1, string.length)}`;
}
