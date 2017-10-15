import { JsonReader } from '../lib/reader/json_reader';
import { JhipsterStringUtils } from '../lib/utils/string_utils';
import { JhipsterObjectUtils } from '../lib/utils/object_utils';
import { JhipsterFormatUtils } from '../lib/utils/format_utils';
import { JdlReader } from '../lib/reader/jdl_reader';

const BINARY_OPTIONS = require('../lib/core/jhipster/binary_options');
const UNARY_OPTIONS = require('../lib/core/jhipster/unary_options');
const RELATIONSHIP_TYPES = require('../lib/core/jhipster/relationship_types');
const FIELD_TYPES = require('../lib/core/jhipster/field_types');
const VALIDATIONS = require('../lib/core/jhipster/validations');
const DATABASE_TYPES = require('../lib/core/jhipster/database_types');
const convertToJDL = require('../lib/parser/jdl_parser').parse;
const convertToJHipsterJSON = require('../lib/parser/entity_parser').parse;
const JsonParser = require('../lib/parser/json_parser');
const JDLObject = require('../lib/core/jdl_object');
const JDLEntity = require('../lib/core/jdl_entity');
const JDLField = require('../lib/core/jdl_field');
const JDLValidation = require('../lib/core/jdl_validation');
const JDLEnum = require('../lib/core/jdl_enum');
const JDLRelationship = require('../lib/core/jdl_relationship');
const JDLRelationships = require('../lib/core/jdl_relationships');
const JDLUnaryOption = require('../lib/core/jdl_unary_option');
const JDLBinaryOption = require('../lib/core/jdl_binary_option');
const JDLOptions = require('../lib/core/jdl_options');
const JSONExporter = require('../lib/export/json_exporter');
const exportToJDL = require('../lib/export/jdl_exporter').exportToJDL;
const JSONFileReader = require('../lib/reader/json_file_reader');
const ReservedKeywords = require('../lib/core/jhipster/reserved_keywords');
const Set = require('../lib/utils/objects/set');

export = {
  /* JHipster notions */
  JHipsterBinaryOptions: BINARY_OPTIONS,
  JHipsterUnaryOptions: UNARY_OPTIONS,
  JHipsterRelationshipTypes: RELATIONSHIP_TYPES,
  JHipsterValidations: VALIDATIONS,
  JHipsterFieldTypes: FIELD_TYPES,
  JHipsterDatabaseTypes: DATABASE_TYPES,
  isReservedKeyword: ReservedKeywords.isReserved,
  isReservedClassName: ReservedKeywords.isReservedClassName,
  isReservedTableName: ReservedKeywords.isReservedTableName,
  isReservedFieldName: ReservedKeywords.isReservedFieldName,
  /* JDL objects */
  JDLObject,
  JDLEntity,
  JDLField,
  JDLValidation,
  JDLEnum,
  JDLRelationship,
  JDLRelationships,
  JDLUnaryOption,
  JDLBinaryOption,
  JDLOptions,
  /* JDL reading */
  parse: JdlReader.parse,
  parseFromFiles: JdlReader.parseFromFiles,
  /* Json reading */
  parseJsonFromDir: JsonReader.parseFromDir,
  /* JDL conversion */
  convertToJDL,
  convertToJHipsterJSON,
  /* Json conversion */
  convertJsonEntitiesToJDL: JsonParser.parseEntities,
  convertJsonServerOptionsToJDL: JsonParser.parseServerOptions,
  /* JSON exporting */
  exportToJSON: JSONExporter.exportToJSON,
  /* JDL exporting */
  exportToJDL,
  /* JDL utils */
  isJDLFile: JdlReader.checkFileIsJDLFile,
  /* JSON utils */
  ObjectUtils: JhipsterObjectUtils,
  createJHipsterJSONFolder: JSONExporter.createJHipsterJSONFolder,
  filterOutUnchangedEntities: JSONExporter.filterOutUnchangedEntities,
  readEntityJSON: JSONFileReader.readEntityJSON,
  toFilePath: JSONFileReader.toFilePath,
  /* Objects */
  Set,
  /* Utils */
  camelCase: JhipsterStringUtils.camelCase,
  dateFormatForLiquibase: JhipsterFormatUtils.dateFormatForLiquibase
};
