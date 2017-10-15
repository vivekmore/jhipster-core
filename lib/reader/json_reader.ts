import * as fs from 'fs';
import * as _ from 'lodash';
import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JsonFileReader } from './json_file_reader';

const Parser = require('../parser/json_parser');

export class JsonReader {

  /* Parse the given jhipster app dir and return a JDLObject */
  public static parseFromDir(dir) {
    let isDir = false;
    if (!dir) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.IllegalArgument, 'The app directory must be passed.');
    }
    try {
      isDir = fs.statSync(dir).isDirectory();
    } catch (error) { // doesn't exist
      isDir = false;
    }
    if (!isDir) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.WrongDir,
        'The passed dir must exist and must be a directory.');
    }
    const jdl = Parser.parseServerOptions(JsonFileReader.readEntityJSON(`${dir}/.yo-rc.json`)['generator-jhipster']);
    const entityDir = `${dir}/.jhipster`;
    let isJhipsterDirectory = false;
    try {
      isJhipsterDirectory = fs.statSync(entityDir).isDirectory();
    } catch (error) {
      // .jhipster dir doesn't exist
      return jdl;
    }
    if (!isJhipsterDirectory) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.WrongDir,
        `'${entityDir}' must be a directory.`);
    }
    const entities = {};
    _.forEach(fs.readdirSync(entityDir), (file) => {
      if (file.slice(file.length - 5, file.length) === '.json') {
        const entityName = file.slice(0, file.length - 5);
        try {
          entities[entityName] = JsonFileReader.readEntityJSON(`${entityDir}/${file}`);
        } catch (error) {
          // Not an entity file, not adding
        }
      }
    });
    Parser.parseEntities(entities, jdl);
    return jdl;
  }
}
