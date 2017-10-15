import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterStringUtils } from '../utils/string_utils';
import { JhipsterObjectUtils } from '../utils/object_utils';
import { JhipsterFormatUtils } from '../utils/format_utils';
import { BinaryOptions } from '../core/jhipster/binary_options';
import * as _ from 'lodash';

const FieldTypes = require('../core/jhipster/field_types');
const RelationshipTypes = require('../core/jhipster/relationship_types').RELATIONSHIP_TYPES;
const DatabaseTypes = require('../core/jhipster/database_types');
const UnaryOptions = require('../core/jhipster/unary_options').UNARY_OPTIONS;
const BINARY_OPTIONS = BinaryOptions.BINARY_OPTIONS;

const USER = 'User';

export class EntityParser {

  private static entities;
  private static isType;
  private static jdlObject;

  /**
   * Keys of args:
   *   - jdlObject,
   *   - databaseType,
   *   - applicationType
   */
  public static parse(args?) {
    const merged = JhipsterObjectUtils.merge(this.defaults(), args);
    if (!args || !merged.jdlObject || !args.databaseType) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.NullPointer,
        'The JDL object and the database type are both mandatory.');
    }
    if (merged.applicationType !== 'gateway') {
      this.checkNoSQLModeling(merged.jdlObject, args.databaseType);
    }
    this.init(merged, args.databaseType);
    this.initializeEntities();
    this.setOptions();
    this.fillEntities();
    return this.entities;
  }

  private static init(args, databaseType, applicationType?) {
    if (this.jdlObject) {
      this.resetState();
    }
    this.jdlObject = args.jdlObject;
    this.entities = {};
    if (applicationType !== 'gateway') {
      this.isType = () => true;
    } else {
      this.isType = FieldTypes.getIsType(databaseType, () => this.resetState());
    }
  }

  private static resetState() {
    this.jdlObject = null;
    this.entities = null;
    this.isType = null;
  }

  private static checkNoSQLModeling(passedJdlObject, passedDatabaseType) {
    if (passedJdlObject.relationships.size !== 0 && !DatabaseTypes.isSql(passedDatabaseType)) {
      throw new JhipsterCoreException(
        JhipsterCoreExceptionType.NoSQLModeling, 'NoSQL entities don\'t have relationships.');
    }
  }

  private static initializeEntities() {
    for (let i = 0, entityNames = Object.keys(this.jdlObject.entities); i < entityNames.length; i++) {
      const entityName = entityNames[i];
      const jdlEntity = this.jdlObject.entities[entityName];
      /*
       * If the user adds a 'User' entity we consider it as the already
       * created JHipster User entity and none of its fields and ownerside
       * relationships will be considered.
       */
      if (entityName.toLowerCase() === USER.toLowerCase()) {
        console.warn('Warning:  An Entity name \'User\' was used: \'User\' is an' +
          ' entity created by default by JHipster. All relationships toward' +
          ' it will be kept but any attributes and relationships from it' +
          ' will be disregarded.');
      } else {
        this.entities[entityName] = { // todo: make a builder/factory instead!
          fluentMethods: true,
          relationships: [],
          fields: [],
          changelogDate: JhipsterFormatUtils.dateFormatForLiquibase({increment: i}),
          javadoc: JhipsterFormatUtils.formatComment(jdlEntity.comment),
          entityTableName: _.snakeCase(jdlEntity.tableName),
          dto: 'no',
          pagination: 'no',
          service: 'no',
          jpaMetamodelFiltering: false
        };
      }
    }
  }

  private static setOptions() {
    const options = this.jdlObject.getOptions();
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.entityNames.size() === 1 && option.entityNames.has('*')) {
        option.entityNames = _.filter(
          Object.keys(this.jdlObject.entities),
          entityName =>
            !option.excludedNames.has(entityName) && entityName.toLowerCase() !== USER.toLowerCase()
        );
      }
      this.setEntityNamesOptions(option);
    }
  }

  private static setEntityNamesOptions(option) {
    option.entityNames.forEach((entityName) => {
      switch (option.name) {
        case UnaryOptions.SKIP_CLIENT:
        case UnaryOptions.SKIP_SERVER:
          this.entities[entityName][option.name] = true;
          break;
        case BINARY_OPTIONS.MICROSERVICE:
          this.entities[entityName].microserviceName = option.value;
          break;
        case UnaryOptions.NO_FLUENT_METHOD:
          this.entities[entityName].fluentMethods = false;
          break;
        case BINARY_OPTIONS.ANGULAR_SUFFIX:
          this.entities[entityName].angularJSSuffix = option.value;
          break;
        case UnaryOptions.FILTER:
          this.entities[entityName].jpaMetamodelFiltering = true;
          break;
        default:
          this.entities[entityName][option.name] = option.value;
      }
    });
  }

  private static defaults() {
    return {};
  }

  private static fillEntities() {
    for (let i = 0, entityNames = Object.keys(this.jdlObject.entities); i < entityNames.length; i++) {
      const entityName = entityNames[i];

      if (entityName.toLowerCase() !== USER.toLowerCase()) {
        this.setFieldsOfEntity(entityName);
        this.setRelationshipOfEntity(entityName);
      }
    }
  }

  private static setFieldsOfEntity(entityName) {
    for (let i = 0, fieldNames = Object.keys(this.jdlObject.entities[entityName].fields); i < fieldNames.length; i++) {
      const fieldName = fieldNames[i];
      const jdlField = this.jdlObject.entities[entityName].fields[fieldName];
      const fieldData: any = {
        fieldName: JhipsterStringUtils.camelCase(fieldName)
      };
      const comment = JhipsterFormatUtils.formatComment(jdlField.comment);
      if (comment) {
        fieldData.javadoc = comment;
      }
      if (this.isType(jdlField.type)) {
        fieldData.fieldType = jdlField.type;
      }
      if (this.jdlObject.enums[jdlField.type]) {
        fieldData.fieldType = jdlField.type;
        fieldData.fieldValues = this.jdlObject.enums[jdlField.type].values.join(',');
      }
      if (fieldData.fieldType.indexOf('Blob') !== -1) {
        this.setBlobFieldData(fieldData);
      }
      this.setValidationsOfField(jdlField, fieldData);
      this.entities[entityName].fields.push(fieldData);
    }
  }

  private static setBlobFieldData(fieldData) {
    switch (fieldData.fieldType) {
      case 'ImageBlob':
        fieldData.fieldTypeBlobContent = 'image';
        break;
      case 'Blob':
      case 'AnyBlob':
        fieldData.fieldTypeBlobContent = 'any';
        break;
      case 'TextBlob':
        fieldData.fieldTypeBlobContent = 'text';
        break;
      default:
    }
    fieldData.fieldType = 'byte[]';
  }

  private static setValidationsOfField(jdlField, fieldData) {
    if (Object.keys(jdlField.validations).length === 0) {
      return;
    }
    fieldData.fieldValidateRules = [];
    for (let i = 0, validationNames = Object.keys(jdlField.validations); i < validationNames.length; i++) {
      const validation = jdlField.validations[validationNames[i]];
      fieldData.fieldValidateRules.push(validation.name);
      if (validation.name !== 'required') {
        fieldData[`fieldValidateRules${_.capitalize(validation.name)}`] = validation.value;
      }
    }
  }

  private static getRelatedRelationships(entityName, relationships) {
    const relatedRelationships = {
      from: [],
      to: []
    };
    const relationshipsArray = relationships.toArray();
    for (let i = 0; i < relationshipsArray.length; i++) {
      const relationship = relationshipsArray[i];
      if (relationship.from.name === entityName) {
        relatedRelationships.from.push(relationship);
      }
      if (relationship.to.name === entityName && relationship.injectedFieldInTo) {
        relatedRelationships.to.push(relationship);
      }
    }
    return relatedRelationships;
  }

  /**
   * Parses the string "<relationshipName>(<otherEntityField>)"
   * @param{String} field
   * @return{Object} where 'relationshipName' is the relationship name and
   *                'otherEntityField' is the other entity field name
   */
  private static extractField(field) {
    const splitField = {
      otherEntityField: 'id', // id by default
      relationshipName: ''
    };
    if (field) {
      const chunks = field.replace('(', '/').replace(')', '').split('/');
      splitField.relationshipName = chunks[0];
      if (chunks.length > 1) {
        splitField.otherEntityField = chunks[1];
      }
    }
    return splitField;
  }

  private static setRelationshipOfEntity(entityName) {
    const relatedRelationships = this.getRelatedRelationships(entityName, this.jdlObject.relationships);
    this.setSourceAssociationsForClass(relatedRelationships, entityName);
    this.setDestinationAssociationsForClass(relatedRelationships, entityName);
  }

  private static setSourceAssociationsForClass(relatedRelationships, entityName) {
    for (let i = 0; i < relatedRelationships.from.length; i++) {
      let otherSplitField;
      let splitField;
      const relatedRelationship = relatedRelationships.from[i];
      const relationship: any = {
        relationshipType: _.kebabCase(relatedRelationship.type)
      };
      if (relatedRelationship.isInjectedFieldInFromRequired) {
        relationship.relationshipValidateRules = 'required';
      }
      if (relatedRelationship.commentInFrom) {
        relationship.javadoc = relatedRelationship.commentInFrom;
      }
      if (relatedRelationship.type === RelationshipTypes.ONE_TO_ONE) {
        splitField = this.extractField(relatedRelationship.injectedFieldInFrom);
        relationship.relationshipName = JhipsterStringUtils.camelCase(splitField.relationshipName);
        relationship.otherEntityName = JhipsterStringUtils.camelCase(relatedRelationship.to.name);
        relationship.otherEntityField = _.lowerFirst(splitField.otherEntityField);
        relationship.ownerSide = true;
        relationship.otherEntityRelationshipName = _.lowerFirst(relatedRelationship.injectedFieldInTo || relatedRelationship.from.name);
      } else if (relatedRelationship.type === RelationshipTypes.ONE_TO_MANY) {
        splitField = this.extractField(relatedRelationship.injectedFieldInFrom);
        otherSplitField = this.extractField(relatedRelationship.injectedFieldInTo);
        relationship.relationshipName = JhipsterStringUtils.camelCase(splitField.relationshipName || relatedRelationship.to.name);
        relationship.otherEntityName = JhipsterStringUtils.camelCase(relatedRelationship.to.name);
        relationship.otherEntityRelationshipName = _.lowerFirst(otherSplitField.relationshipName);
        if (!relatedRelationship.injectedFieldInTo) {
          relationship.otherEntityRelationshipName = _.lowerFirst(relatedRelationship.from.name);
          otherSplitField = this.extractField(relatedRelationship.injectedFieldInTo);
          const otherSideRelationship = {
            relationshipName: JhipsterStringUtils.camelCase(relatedRelationship.from.name),
            otherEntityName: JhipsterStringUtils.camelCase(relatedRelationship.from.name),
            relationshipType: _.kebabCase(RelationshipTypes.MANY_TO_ONE),
            otherEntityField: _.lowerFirst(otherSplitField.otherEntityField)
          };
          relatedRelationship.type = RelationshipTypes.MANY_TO_ONE;
          this.entities[relatedRelationship.to.name].relationships.push(otherSideRelationship);
        }
      } else if (relatedRelationship.type === RelationshipTypes.MANY_TO_ONE && relatedRelationship.injectedFieldInFrom) {
        splitField = this.extractField(relatedRelationship.injectedFieldInFrom);
        relationship.relationshipName = JhipsterStringUtils.camelCase(splitField.relationshipName);
        relationship.otherEntityName = JhipsterStringUtils.camelCase(relatedRelationship.to.name);
        relationship.otherEntityField = _.lowerFirst(splitField.otherEntityField);
      } else if (relatedRelationship.type === RelationshipTypes.MANY_TO_MANY) {
        splitField = this.extractField(relatedRelationship.injectedFieldInFrom);
        relationship.otherEntityRelationshipName = _.lowerFirst(this.extractField(relatedRelationship.injectedFieldInTo).relationshipName);
        relationship.relationshipName = JhipsterStringUtils.camelCase(splitField.relationshipName);
        relationship.otherEntityName = JhipsterStringUtils.camelCase(relatedRelationship.to.name);
        relationship.otherEntityField = _.lowerFirst(splitField.otherEntityField);
        relationship.ownerSide = true;
      }
      this.entities[entityName].relationships.push(relationship);
    }
  }

  private static setDestinationAssociationsForClass(relatedRelationships, entityName) {
    for (let i = 0; i < relatedRelationships.to.length; i++) {
      let splitField;
      let otherSplitField;
      const relatedRelationship = relatedRelationships.to[i];
      const relationshipType = relatedRelationship.type === RelationshipTypes.ONE_TO_MANY ? RelationshipTypes.MANY_TO_ONE : relatedRelationship.type;
      const relationship: any = {
        relationshipType: _.kebabCase(relationshipType)
      };
      if (relatedRelationship.isInjectedFieldInToRequired) {
        relationship.relationshipValidateRules = 'required';
      }
      if (relatedRelationship.commentInTo) {
        relationship.javadoc = relatedRelationship.commentInTo;
      }
      if (relatedRelationship.type === RelationshipTypes.ONE_TO_ONE) {
        splitField = this.extractField(relatedRelationship.injectedFieldInTo);
        otherSplitField = this.extractField(relatedRelationship.injectedFieldInFrom);
        relationship.relationshipName = JhipsterStringUtils.camelCase(splitField.relationshipName);
        relationship.otherEntityName = JhipsterStringUtils.camelCase(relatedRelationship.from.name);
        relationship.ownerSide = false;
        relationship.otherEntityRelationshipName = _.lowerFirst(otherSplitField.relationshipName);
      } else if (relatedRelationship.type === RelationshipTypes.ONE_TO_MANY) {
        relatedRelationship.injectedFieldInTo = relatedRelationship.injectedFieldInTo || _.lowerFirst(relatedRelationship.from);
        splitField = this.extractField(relatedRelationship.injectedFieldInTo);
        relationship.relationshipName = JhipsterStringUtils.camelCase(splitField.relationshipName || relatedRelationship.from.name);
        relationship.otherEntityName = JhipsterStringUtils.camelCase(relatedRelationship.from.name);
        relationship.otherEntityField = _.lowerFirst(splitField.otherEntityField);
      } else if (relatedRelationship.type === RelationshipTypes.MANY_TO_ONE && relatedRelationship.injectedFieldInTo) {
        splitField = this.extractField(relatedRelationship.injectedFieldInTo);
        relationship.relationshipName = JhipsterStringUtils.camelCase(splitField.relationshipName);
        relationship.otherEntityName = JhipsterStringUtils.camelCase(relatedRelationship.from.name);
        relationship.relationshipType = 'one-to-many';
        otherSplitField = this.extractField(relatedRelationship.injectedFieldInFrom);
        relationship.otherEntityRelationshipName = _.lowerFirst(otherSplitField.relationshipName);
      } else if (relatedRelationship.type === RelationshipTypes.MANY_TO_MANY) {
        splitField = this.extractField(relatedRelationship.injectedFieldInTo);
        relationship.relationshipName = JhipsterStringUtils.camelCase(splitField.relationshipName);
        relationship.otherEntityName = JhipsterStringUtils.camelCase(relatedRelationship.from.name);
        relationship.ownerSide = false;
        relationship.otherEntityRelationshipName = _.lowerFirst(this.extractField(relatedRelationship.injectedFieldInFrom).relationshipName);
      }
      this.entities[entityName].relationships.push(relationship);
    }
  }
}
