import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterStringUtils } from '../utils/string_utils';
import * as fs from 'fs';
import * as _ from 'lodash';

export = {
  readEntityJSON,
  toFilePath,
  doesfileExist
};

function readEntityJSON(filePath) {
  if (JhipsterStringUtils.isNilOrEmpty(filePath)) {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed file path must not be nil.');
  }
  try {
    if (!doesfileExist(filePath)) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.FileNotFound, `The passed file '${filePath}' is a folder.`);
    }
  } catch (error) {
    if (error.name === 'FileNotFoundException') {
      throw error;
    }
    throw new JhipsterCoreException(JhipsterCoreExceptionType.FileNotFound, `The passed file '${filePath}' couldn't be found.`);
  }
  return JSON.parse(fs.readFileSync(filePath).toString());
}

function toFilePath(entityName) {
  if (JhipsterStringUtils.isNilOrEmpty(entityName)) {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed entity name must not be nil.');
  }
  return `.jhipster/${_.upperFirst(entityName)}.json`;
}

function doesfileExist(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}
