import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import * as fs from 'fs';

export class JdlExporter {

  public static exportToJDL(jdl?, path?: string) {
    if (!jdl) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.NullPointer,
        'A JDLObject has to be passed to be exported.');
    }
    if (!path) {
      path = './jhipster-jdl.jh';
    }
    fs.writeFileSync(path, jdl.toString());
  }
}
