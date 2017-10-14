import { JhipsterCoreException } from '../../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../../exceptions/jhipster_core_exception_type';

const Set = require('../../utils/objects/set');
const _ = require('lodash');
const _v = require('./validations');
const JDLEnum = require('../jdl_enum');
const DatabaseTypes = require('./database_types').Types;

const VALIDATIONS = _v.VALIDATIONS;

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
function isSQLType(type) {
  if (!type) {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type must not be nil.');
  }
  return (_.snakeCase(type).toUpperCase() in SQL_TYPES) || type instanceof JDLEnum;
}
function isMongoDBType(type) {
  if (!type) {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type must not be nil.');
  }
  return (_.snakeCase(type).toUpperCase() in MONGODB_TYPES) || type instanceof JDLEnum;
}
function isCassandraType(type) {
  if (!type) {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type must not be nil.');
  }
  return (_.snakeCase(type).toUpperCase() in CASSANDRA_TYPES) && !(type instanceof JDLEnum);
}
function hasValidation(type, validation, isAnEnum) {
  if (!type || !validation) {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type and value must not be nil.');
  }
  if (isAnEnum) {
    type = 'Enum';
  }
  return (isSQLType(type) && SQL_VALIDATIONS[type].has(validation))
    || (isMongoDBType(type) && MONGODB_VALIDATIONS[type].has(validation))
    || (isCassandraType(type) && CASSANDRA_VALIDATIONS[type].has(validation));
}
function getIsType(databaseType, callback) {
  if (!databaseType) {
    throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The passed type must not be nil.');
  }
  let isType;
  switch (databaseType) {
  case DatabaseTypes.sql:
  case DatabaseTypes.mysql:
  case DatabaseTypes.mariadb:
  case DatabaseTypes.postgresql:
  case DatabaseTypes.oracle:
  case DatabaseTypes.mssql:
    isType = isSQLType;
    break;
  case DatabaseTypes.mongodb:
    isType = isMongoDBType;
    break;
  case DatabaseTypes.cassandra:
    isType = isCassandraType;
    break;
  default:
    callback && callback();
    throw new JhipsterCoreException(
      JhipsterCoreExceptionType.IllegalArgument,
      'The passed database type must either be \'sql\', \'mysql\', \'mariadb\', \'postgresql\', \'oracle\', \'mssql\', \'mongodb\', or \'cassandra\'');
  }
  return isType;
}
export = {
  SQL_TYPES,
  MONGODB_TYPES,
  CASSANDRA_TYPES,
  isSQLType,
  isMongoDBType,
  isCassandraType,
  hasValidation,
  getIsType
};
