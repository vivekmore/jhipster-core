import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';

export class JhipsterStringUtils {

  public static isNilOrEmpty(s: string): boolean {
    return s == null || s === '';
  }

  public static camelCase(s: string): string {
    if (s == null) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed string cannot be nil.');
    }
    if (s === '') {
      return s;
    }
    s = s.replace(/[\W_]/g, '');
    return `${s[0].toLowerCase()}${s.slice(1, s.length)}`;
  }
}
