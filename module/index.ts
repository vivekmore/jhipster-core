import { JDLBinaryOption } from '../lib/core/jdl_binary_option';
import { JDLEntity } from '../lib/core/jdl_entity';
import { JDLEnum } from '../lib/core/jdl_enum';
import { JDLField } from '../lib/core/jdl_field';
import { JDLObject } from '../lib/core/jdl_object';
import { JDLOptions } from '../lib/core/jdl_options';
import { JDLRelationship } from '../lib/core/jdl_relationship';
import { JDLRelationships } from '../lib/core/jdl_relationships';
import { JDLUnaryOption } from '../lib/core/jdl_unary_option';
import { JDLValidation } from '../lib/core/jdl_validation';
import { BinaryOptions } from '../lib/core/jhipster/binary_options';
import { DatabaseTypes } from '../lib/core/jhipster/database_types';
import { FieldTypes } from '../lib/core/jhipster/field_types';
import { RelationshipTypes } from '../lib/core/jhipster/relationship_types';
import { ReservedKeywords } from '../lib/core/jhipster/reserved_keywords';
import { UnaryOptions } from '../lib/core/jhipster/unary_options';
import { Validations } from '../lib/core/jhipster/validations';
import { JdlExporter } from '../lib/export/jdl_exporter';
import { JsonExporter } from '../lib/export/json_exporter';
import { EntityParser } from '../lib/parser/entity_parser';
import { JdlParser } from '../lib/parser/jdl_parser';
import { JsonParser } from '../lib/parser/json_parser';
import { JdlReader } from '../lib/reader/jdl_reader';
import { JsonFileReader } from '../lib/reader/json_file_reader';
import { JsonReader } from '../lib/reader/json_reader';
import { JhipsterFormatUtils } from '../lib/utils/format_utils';
import { JhipsterObjectUtils } from '../lib/utils/object_utils';
import { Set } from '../lib/utils/objects/set';
import { JhipsterStringUtils } from '../lib/utils/string_utils';

const convertToJDL = JdlParser.parse;
const convertToJHipsterJSON = EntityParser.parse;
const exportToJDL = JdlExporter.exportToJDL;

export = {
  /* JHipster notions */
  JHipsterBinaryOptions: BinaryOptions,
  JHipsterUnaryOptions: UnaryOptions,
  JHipsterRelationshipTypes: RelationshipTypes,
  JHipsterValidations: Validations,
  JHipsterFieldTypes: FieldTypes,
  JHipsterDatabaseTypes: DatabaseTypes,
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
  exportToJSON: JsonExporter.exportToJSON,
  /* JDL exporting */
  exportToJDL,
  /* JDL utils */
  isJDLFile: JdlReader.checkFileIsJDLFile,
  /* JSON utils */
  ObjectUtils: JhipsterObjectUtils,
  createJHipsterJSONFolder: JsonExporter.createJHipsterJSONFolder,
  filterOutUnchangedEntities: JsonExporter.filterOutUnchangedEntities,
  readEntityJSON: JsonFileReader.readEntityJSON,
  toFilePath: JsonFileReader.toFilePath,
  /* Objects */
  Set,
  /* Utils */
  camelCase: JhipsterStringUtils.camelCase,
  dateFormatForLiquibase: JhipsterFormatUtils.dateFormatForLiquibase
};
