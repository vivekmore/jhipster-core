import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterStringUtils } from '../utils/string_utils';
import { JhipsterObjectUtils } from '../utils/object_utils';
import { JDLField } from './jdl_field';
import { ReservedKeywords } from './jhipster/reserved_keywords';
import { ErrorCasesEnum } from '../exceptions/error_cases';

const ErrorCases = ErrorCasesEnum.ErrorCases;
const isReservedClassName = ReservedKeywords.isReservedClassName;

export class JDLEntity {

  name: any;
  tableName: any;
  fields: any;
  comment: any;

  constructor(args?) {
    const merged = JhipsterObjectUtils.merge(JDLEntity.defaults(), args);
    if (JhipsterStringUtils.isNilOrEmpty(merged.name)) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.NullPointer,
        'The name is mandatory to create an entity.');
    }
    if (isReservedClassName(merged.name)) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.IllegalName,
        `The name cannot be a reserved keyword, got: ${merged.name}.`
      );
    }
    this.name = merged.name;
    this.tableName = merged.tableName || merged.name;
    this.fields = merged.fields;
    this.comment = merged.comment;
  }

  addField(field) {
    const errors = JDLField.checkValidity(field);
    if (errors.length !== 0) {
      let fieldName = '';
      if (field) {
        fieldName = field.name;
      }
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The passed field '${'' || fieldName}' must be valid for entity '${this.name}'.\nErrors: ${errors.join(', ')}`);
    }
    this.fields[field.name] = field;
  }

  static checkValidity(entity) {
    const errors = [];
    if (!entity) {
      errors.push(ErrorCases.entities.NoEntity);
      return errors;
    }
    if (JhipsterStringUtils.isNilOrEmpty(entity.name)) {
      errors.push(ErrorCases.entities.NoName);
    } else if (isReservedClassName(entity.name)) {
      errors.push(ErrorCases.entities.ReservedWordAsName);
    }
    if (JhipsterStringUtils.isNilOrEmpty(entity.tableName)) {
      errors.push(ErrorCases.entities.NoTableName);
    }
    if (!('fields' in entity)) {
      errors.push(ErrorCases.entities.NoFields);
    }
    if (entity.fields) {
      for (let i = 0; i < entity.fields.length; i++) {
        const fieldsErrors = JDLField.checkValidity(entity.fields[i]);
        if (fieldsErrors.length !== 0) {
          errors.push(`For field #${i + 1}: ${fieldsErrors}`);
        }
      }
    }
    return errors;
  }

  static isValid(entity) {
    const errors = this.checkValidity(entity);
    return errors.length === 0;
  }

  toString() {
    let string = '';
    if (this.comment) {
      string += `/**\n${this.comment.split('\n').map(line => ` * ${line}\n`).join('')} */\n`;
    }
    string += `entity ${this.name} (${this.tableName})`;
    if (Object.keys(this.fields).length !== 0) {
      string += ` {\n${JDLEntity.formatFieldObjects(this.fields)}\n}`;
    }
    return string;
  }

  private static defaults() {
    return {
      fields: {}
    };
  }

  private static formatFieldObjects(jdlFieldObjects) {
    let string = '';
    Object.keys(jdlFieldObjects).forEach((jdlField) => {
      string += `${JDLEntity.formatFieldObject(jdlFieldObjects[jdlField])}`;
    });
    string = `${string.slice(0, string.length - 2)}`;
    return string;
  }

  private static formatFieldObject(jdlFieldObject) {
    let string = '';
    const lines = jdlFieldObject.toString().split('\n');
    for (let j = 0; j < lines.length; j++) {
      string += `  ${lines[j]}\n`;
    }
    string = `${string.slice(0, string.length - 1)},\n`;
    return string;
  }
}

