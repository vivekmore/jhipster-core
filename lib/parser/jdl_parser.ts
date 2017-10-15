import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { ApplicationTypes } from '../core/jhipster/application_types';
import * as _ from 'lodash';
import { JhipsterFormatUtils } from '../utils/format_utils';
import { JDLValidation } from '../core/jdl_validation';

const JDLObject = require('../core/jdl_object');
const JDLEnum = require('../core/jdl_enum');
const JDLField = require('../core/jdl_field');
const JDLRelationship = require('../core/jdl_relationship');
const JDLUnaryOption = require('../core/jdl_unary_option');
const JDLBinaryOption = require('../core/jdl_binary_option');
const UnaryOptions = require('../core/jhipster/unary_options');
const BinaryOptions = require('../core/jhipster/binary_options');
const FieldTypes = require('../core/jhipster/field_types');
const DatabaseTypes = require('../core/jhipster/database_types');
const ReservedKeyWords = require('../core/jhipster/reserved_keywords');

const isReservedClassName = ReservedKeyWords.isReservedClassName;
const isReservedTableName = ReservedKeyWords.isReservedTableName;
const isReservedFieldName = ReservedKeyWords.isReservedFieldName;


export class JdlParser {

  private static readonly USER = 'User';

  private static document;
  private static jdlObject;
  private static isType;

  /**
   * Convert the given intermediate object to JDLObject
   */
  public static parse(passedDocument, passedDatabaseType: string, applicationType?, applicationName?) {
    if (!passedDocument || !passedDatabaseType) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The parsed JDL content and the database type must be passed.');
    }
    JdlParser.init(passedDocument, passedDatabaseType, applicationType);
    JdlParser.fillEnums();
    JdlParser.fillClassesAndFields(passedDatabaseType);
    JdlParser.fillAssociations();
    JdlParser.fillOptions(passedDatabaseType, applicationType, applicationName);
    return JdlParser.jdlObject;
  }

  private static init(passedDocument, passedDatabaseType, applicationType) {
    JdlParser.document = passedDocument;
    JdlParser.jdlObject = new JDLObject();
    if (applicationType !== 'gateway') {
      JdlParser.isType = FieldTypes.getIsType(passedDatabaseType, () => {
        JdlParser.isType = null;
      });
    } else {
      JdlParser.isType = () => true;
    }
  }

  private static fillEnums() {
    for (let i = 0; i < JdlParser.document.enums.length; i++) {
      const enumObj = JdlParser.document.enums[i];
      if (isReservedClassName(enumObj.name)) {
        throw new JhipsterCoreException(
          JhipsterCoreExceptionType.IllegalName,
          `The name '${enumObj.name}' is reserved keyword and can not be used as enum class name.`);
      }
      JdlParser.jdlObject.addEnum(new JDLEnum({
        name: enumObj.name,
        values: enumObj.values,
        comment: JhipsterFormatUtils.formatComment(enumObj.javadoc)
      }));
    }
  }

  private static fillClassesAndFields(passedDatabaseType) {
    for (let i = 0; i < JdlParser.document.entities.length; i++) {
      const entity = JdlParser.document.entities[i];
      if (isReservedClassName(entity.name)) {
        throw new JhipsterCoreException(
          JhipsterCoreExceptionType.IllegalName,
          `The name '${entity.name}' is a reserved keyword and can not be used as entity class name.`);
      }
      if (isReservedTableName(entity.tableName, passedDatabaseType)) {
        throw new JhipsterCoreException(
          JhipsterCoreExceptionType.IllegalName,
          `The name '${entity.tableName}' is a reserved keyword and can not be used as an entity table name.`);
      }
      const tableName = entity.tableName || entity.name;
      JdlParser.jdlObject.addEntity({
        name: entity.name,
        tableName,
        fields: JdlParser.getFields(entity, passedDatabaseType),
        comment: JhipsterFormatUtils.formatComment(entity.javadoc)
      });
    }

    const relationToUser = JdlParser.document.relationships.filter(val => val.to.name.toLowerCase() === JdlParser.USER.toLowerCase());
    if (relationToUser && relationToUser.length && !JdlParser.jdlObject.entities[JdlParser.USER]) {
      JdlParser.jdlObject.addEntity({
        name: JdlParser.USER,
        tableName: 'jhi_user',
        fields: {}
      });
    }
  }

  private static getFields(entity, passedDatabaseType) {
    const fields = {};
    for (let i = 0; i < entity.body.length; i++) {
      const field = entity.body[i];
      const fieldName = _.lowerFirst(field.name);
      if (fieldName.toLowerCase() === 'id') {
        continue; // eslint-disable-line no-continue
      }
      if (isReservedFieldName(fieldName)) {
        throw new JhipsterCoreException(
          JhipsterCoreExceptionType.IllegalName,
          `The name '${fieldName}' is a reserved keyword and can not be used as entity field name.`);
      }
      if (JdlParser.jdlObject.enums[field.type] || JdlParser.isType(field.type)) {
        const fieldObject = new JDLField({
          name: fieldName,
          type: field.type,
          validations: JdlParser.getValidations(field, JdlParser.jdlObject.enums[field.type])
        });
        if (field.javadoc) {
          fieldObject.comment = JhipsterFormatUtils.formatComment(field.javadoc);
        }
        fields[fieldName] = fieldObject;
      } else {
        throw new JhipsterCoreException(JhipsterCoreExceptionType.WrongType, `The type '${field.type}' doesn't exist for ${passedDatabaseType}.`);
      }
    }
    return fields;
  }

  private static getValidations(field, isAnEnum) {
    const validations = {};
    for (let i = 0; i < field.validations.length; i++) {
      const validation = field.validations[i];
      if (!FieldTypes.hasValidation(field.type, validation.key, isAnEnum)) {
        throw new JhipsterCoreException(
          JhipsterCoreExceptionType.WrongValidation,
          `The validation '${validation.key}' isn't supported for the type '${field.type}'.`);
      }
      if (validation.constant) {
        validation.value = JdlParser.document.constants[validation.value];
      }
      validations[validation.key] = new JDLValidation({
        name: validation.key,
        value: validation.value
      });
    }
    return validations;
  }

  private static fillAssociations() {
    for (let i = 0; i < JdlParser.document.relationships.length; i++) {
      const relationship = JdlParser.document.relationships[i];
      JdlParser.checkEntityDeclaration(relationship);
      JdlParser.jdlObject.addRelationship(new JDLRelationship({
        from: JdlParser.jdlObject.entities[relationship.from.name],
        to: JdlParser.jdlObject.entities[relationship.to.name],
        type: _.upperFirst(_.camelCase(relationship.cardinality)),
        injectedFieldInFrom: relationship.from.injectedfield,
        injectedFieldInTo: relationship.to.injectedfield,
        isInjectedFieldInFromRequired: relationship.from.required,
        isInjectedFieldInToRequired: relationship.to.required,
        commentInFrom: JhipsterFormatUtils.formatComment(relationship.from.javadoc),
        commentInTo: JhipsterFormatUtils.formatComment(relationship.to.javadoc)
      }));
    }
  }

  private static checkEntityDeclaration(relationship) {
    const absentEntities = [];

    if (relationship.from.name.toLowerCase() === JdlParser.USER.toLowerCase()) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.IllegalAssociation,
        `Relationships from User entity is not supported in the declaration between ${relationship.from.name} and `
        + `${relationship.to.name}.`
      );
    }
    if (!JdlParser.jdlObject.entities[relationship.from.name]) {
      absentEntities.push(relationship.from.name);
    }
    if (relationship.to.name.toLowerCase() !== JdlParser.USER.toLowerCase() && !JdlParser.jdlObject.entities[relationship.to.name]) {
      absentEntities.push(relationship.to.name);
    }
    if (absentEntities.length !== 0) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.UndeclaredEntity,
        `In the relationship between ${relationship.from.name} and `
        + `${relationship.to.name}, ${absentEntities.join(' and ')} `
        + `${(absentEntities.length === 1 ? 'is' : 'are')} not declared.`
      );
    }
  }

  private static fillOptions(passedDatabaseType, applicationType, applicationName) {
    JdlParser.fillUnaryOptions();
    JdlParser.fillBinaryOptions(passedDatabaseType);
    if (applicationType === ApplicationTypes.MICROSERVICE) {
      JdlParser.globallyAddMicroserviceOption(applicationName);
    }
  }

  private static globallyAddMicroserviceOption(applicationName) {
    JdlParser.jdlObject.addOption(new JDLBinaryOption({
      name: BinaryOptions.BINARY_OPTIONS.MICROSERVICE,
      value: applicationName,
      entities: JdlParser.document.entities.map(entity => entity.name)
    }));
  }

  private static fillUnaryOptions() {
    if (JdlParser.document.noClient.list.length !== 0) {
      JdlParser.jdlObject.addOption(new JDLUnaryOption({
        name: UnaryOptions.UNARY_OPTIONS.SKIP_CLIENT,
        entityNames: JdlParser.document.noClient.list,
        excludedNames: JdlParser.document.noClient.excluded
      }));
    }
    if (JdlParser.document.noServer.list.length !== 0) {
      JdlParser.jdlObject.addOption(new JDLUnaryOption({
        name: UnaryOptions.UNARY_OPTIONS.SKIP_SERVER,
        entityNames: JdlParser.document.noServer.list,
        excludedNames: JdlParser.document.noServer.excluded
      }));
    }
    if (JdlParser.document.noFluentMethod.list.length !== 0) {
      JdlParser.jdlObject.addOption(new JDLUnaryOption({
        name: UnaryOptions.UNARY_OPTIONS.NO_FLUENT_METHOD,
        entityNames: JdlParser.document.noFluentMethod.list,
        excludedNames: JdlParser.document.noFluentMethod.excluded
      }));
    }
    if (JdlParser.document.filter.list.length !== 0) {
      JdlParser.jdlObject.addOption(new JDLUnaryOption({
        name: UnaryOptions.UNARY_OPTIONS.FILTER,
        entityNames: JdlParser.document.filter.list,
        excludedNames: JdlParser.document.filter.excluded
      }));
    }
  }

  private static addOption(key, value) {
    const option = new JDLBinaryOption({
      name: key,
      value,
      entityNames: JdlParser.document[key][value].list,
      excludedNames: JdlParser.document[key][value].excluded
    });
    if (JdlParser.document[key].value !== undefined || !JDLBinaryOption.isValid(option)) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.InvalidObject,
        `The parsed ${key} option is not valid for value ${value}.`);
    }
    JdlParser.jdlObject.addOption(option);
  }

  private static fillBinaryOptions(passedDatabaseType) {
    _.forEach(BinaryOptions.BINARY_OPTIONS, (optionValue) => {
      _.forEach(JdlParser.document[optionValue], (documentOptionValue, documentOptionKey) => {
        if (optionValue === BinaryOptions.BINARY_OPTIONS.PAGINATION
          && passedDatabaseType === DatabaseTypes.Types.cassandra) {
          throw new JhipsterCoreException(JhipsterCoreExceptionType.IllegalOption, 'Pagination isn\'t allowed when the app uses Cassandra.');
        }
        JdlParser.addOption(optionValue, documentOptionKey);
      });
    });
  }
}
