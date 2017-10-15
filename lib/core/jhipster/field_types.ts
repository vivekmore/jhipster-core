import { JhipsterCoreException } from '../../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../../exceptions/jhipster_core_exception_type';
import { Set } from '../../utils/objects/set';
import { JDLEnum } from '../jdl_enum';
import { Validations } from './validations';
import { DatabaseTypes } from './database_types';
import * as _ from 'lodash';

const DbTypes = DatabaseTypes.Types;
const VALIDATIONS = Validations.VALIDATIONS;

const SQL_TYPES = {
  STRING: 'String',
  INTEGER: 'Integer',
  LONG: 'Long',
  BIG_DECIMAL: 'BigDecimal',
  FLOAT: 'Float',
  DOUBLE: 'Double',
  ENUM: 'Enum',
  BOOLEAN: 'Boolean',
  LOCAL_DATE: 'LocalDate',
  ZONED_DATE_TIME: 'ZonedDateTime',
  BLOB: 'Blob',
  ANY_BLOB: 'AnyBlob',
  IMAGE_BLOB: 'ImageBlob',
  TEXT_BLOB: 'TextBlob',
  INSTANT: 'Instant'
};
const SQL_VALIDATIONS = {
  String: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINLENGTH, VALIDATIONS.MAXLENGTH, VALIDATIONS.PATTERN]),
  Integer: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Long: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  BigDecimal: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Float: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Double: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Enum: new Set([VALIDATIONS.REQUIRED]),
  Boolean: new Set([VALIDATIONS.REQUIRED]),
  LocalDate: new Set([VALIDATIONS.REQUIRED]),
  ZonedDateTime: new Set([VALIDATIONS.REQUIRED]),
  Blob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  AnyBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  ImageBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  TextBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  Instant: new Set([VALIDATIONS.REQUIRED])
};
const MONGODB_TYPES = {
  STRING: 'String',
  INTEGER: 'Integer',
  LONG: 'Long',
  BIG_DECIMAL: 'BigDecimal',
  FLOAT: 'Float',
  DOUBLE: 'Double',
  ENUM: 'Enum',
  BOOLEAN: 'Boolean',
  LOCAL_DATE: 'LocalDate',
  ZONED_DATE_TIME: 'ZonedDateTime',
  BLOB: 'Blob',
  ANY_BLOB: 'AnyBlob',
  IMAGE_BLOB: 'ImageBlob',
  TEXT_BLOB: 'TextBlob',
  INSTANT: 'Instant'
};
const MONGODB_VALIDATIONS = {
  String: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINLENGTH, VALIDATIONS.MAXLENGTH, VALIDATIONS.PATTERN]),
  Integer: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Long: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  BigDecimal: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Float: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Double: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Enum: new Set([VALIDATIONS.REQUIRED]),
  Boolean: new Set([VALIDATIONS.REQUIRED]),
  LocalDate: new Set([VALIDATIONS.REQUIRED]),
  ZonedDateTime: new Set([VALIDATIONS.REQUIRED]),
  Blob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  AnyBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  ImageBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  TextBlob: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINBYTES, VALIDATIONS.MAXBYTES]),
  Instant: new Set([VALIDATIONS.REQUIRED])
};
const CASSANDRA_TYPES = {
  STRING: 'String',
  INTEGER: 'Integer',
  LONG: 'Long',
  BIG_DECIMAL: 'BigDecimal',
  FLOAT: 'Float',
  DOUBLE: 'Double',
  BOOLEAN: 'Boolean',
  DATE: 'Date',
  UUID: 'UUID',
  INSTANT: 'Instant'
};
const CASSANDRA_VALIDATIONS = {
  String: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MINLENGTH, VALIDATIONS.MAXLENGTH, VALIDATIONS.PATTERN]),
  Integer: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Long: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  BigDecimal: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Float: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Double: new Set([VALIDATIONS.REQUIRED, VALIDATIONS.MIN, VALIDATIONS.MAX]),
  Boolean: new Set([VALIDATIONS.REQUIRED]),
  Date: new Set([VALIDATIONS.REQUIRED]),
  UUID: new Set([VALIDATIONS.REQUIRED]),
  Instant: new Set([VALIDATIONS.REQUIRED])
};

export class FieldTypes {

  public static readonly SQL_TYPES = SQL_TYPES;
  public static readonly MONGODB_TYPES = MONGODB_TYPES;
  public static readonly CASSANDRA_TYPES = CASSANDRA_TYPES;

  public static isSQLType(type) {
    if (!type) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type must not be nil.');
    }
    return (_.snakeCase(type).toUpperCase() in SQL_TYPES) || type instanceof JDLEnum;
  }

  public static isMongoDBType(type) {
    if (!type) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type must not be nil.');
    }
    return (_.snakeCase(type).toUpperCase() in MONGODB_TYPES) || type instanceof JDLEnum;
  }

  public static isCassandraType(type) {
    if (!type) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type must not be nil.');
    }
    return (_.snakeCase(type).toUpperCase() in CASSANDRA_TYPES) && !(type instanceof JDLEnum);
  }

  public static hasValidation(type?, validation?, isAnEnum?) {
    if (!type || !validation) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type and value must not be nil.');
    }
    if (isAnEnum) {
      type = 'Enum';
    }
    return (FieldTypes.isSQLType(type) && SQL_VALIDATIONS[type].has(validation))
      || (FieldTypes.isMongoDBType(type) && MONGODB_VALIDATIONS[type].has(validation))
      || (FieldTypes.isCassandraType(type) && CASSANDRA_VALIDATIONS[type].has(validation));
  }

  public static getIsType(databaseType?, callback?) {
    if (!databaseType) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type must not be nil.');
    }
    let isType;
    switch (databaseType) {
      case DbTypes.sql:
      case DbTypes.mysql:
      case DbTypes.mariadb:
      case DbTypes.postgresql:
      case DbTypes.oracle:
      case DbTypes.mssql:
        isType = FieldTypes.isSQLType;
        break;
      case DbTypes.mongodb:
        isType = FieldTypes.isMongoDBType;
        break;
      case DbTypes.cassandra:
        isType = FieldTypes.isCassandraType;
        break;
      default:
        callback && callback();
        throw new JhipsterCoreException(
          JhipsterCoreExceptionType.IllegalArgument,
          'The passed database type must either be \'sql\', \'mysql\', \'mariadb\', \'postgresql\', \'oracle\', \'mssql\', \'mongodb\', or \'cassandra\'');
    }
    return isType;
  }
}
