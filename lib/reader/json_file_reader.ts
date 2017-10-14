import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';

const fs = require('fs');
const _ = require('lodash');
const isNilOrEmpty = require('../utils/string_utils').isNilOrEmpty;

module.exports = {
  readEntityJSON,
  toFilePath,
  doesfileExist
};

function readEntityJSON(filePath) {
  if (isNilOrEmpty(filePath)) {
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
  return JSON.parse(fs.readFileSync(filePath));
}

function toFilePath(entityName) {
  if (isNilOrEmpty(entityName)) {
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
