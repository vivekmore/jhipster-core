import * as fs from 'fs';
import * as chalk from 'chalk';
import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';

const pegjsParser = require('../dsl/pegjs_parser');

export class JdlReader {

  constructor() {
  }

  /* Parse the given content and return an intermediate object */
  public static parse(content) {
    if (!content || content.length === 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.IllegalArgument, 'The content must be passed.');
    }
    try {
      return pegjsParser.parse(JdlReader.filterJDLDirectives(JdlReader.removeInternalJDLComments(content)));
    } catch (error) {
      console.error(`${chalk.red('An error has occurred:\n\t')}${error.name}`);
      console.error(`${chalk.red('Error message:\n\t')}${error.message}`);
      // console.error(`${chalk.red('Position:')}\n\tAt l.${error.location.start.line}.`);
      throw error;
    }
  }

  /* Parse the given files and return an intermediate object */
  public static parseFromFiles(files) {
    if (!files || files.length === 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.IllegalArgument, 'The file/s must be passed.');
    }
    JdlReader.checkAllTheFilesAreJDLFiles(files);
    return JdlReader.parse(files.length === 1
      ? JdlReader.readFileContent(files[0])
      : JdlReader.aggregateFiles(files));
  }

  /* private methods */

  private static removeInternalJDLComments(content) {
    return content.replace(/\/\/[^\n\r]*/mg, '');
  }

  private static filterJDLDirectives(content) {
    return content.replace(/^\u0023.*\n?/mg, '');
  }

  private static checkAllTheFilesAreJDLFiles(files) {
    for (let i = 0; i < files.length; i++) {
      JdlReader.checkFileIsJDLFile(files[i]);
    }
  }

  public static checkFileIsJDLFile(file) {
    if (file.slice(file.length - 3, file.length) !== '.jh'
      && file.slice(file.length - 4, file.length) !== '.jdl') {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.WrongFile,
        `The passed file '${file}' must end with '.jh' or '.jdl' to be valid.`);
    }
  }

  private static aggregateFiles(files) {
    let content = '';
    for (let i = 0; i < files.length; i++) {
      content = `${content}\n${JdlReader.readFileContent(files[i])}`;
    }
    return content;
  }

  private static readFileContent(file) {
    let isDirOrInvalid = false;
    try {
      isDirOrInvalid = fs.statSync(file).isDirectory();
    } catch (error) { // doesn't exist
      isDirOrInvalid = true;
    }
    if (isDirOrInvalid) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.WrongFile,
        `The passed file '${file}' must exist and must not be a directory.`);
    }
    return fs.readFileSync(file, 'utf-8').toString();
  }
}
