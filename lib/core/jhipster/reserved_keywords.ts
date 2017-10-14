

const MYSQL_RESERVED_WORDS = [
  'ACCESSIBLE', 'ADD', 'ALL', 'ALTER', 'ANALYZE', 'AND', 'AS', 'ASC', 'ASENSITIVE', 'BEFORE', 'BETWEEN',
  'BIGINT', 'BINARY', 'BLOB', 'BOTH', 'BY', 'CALL', 'CASCADE', 'CASE', 'CHANGE', 'CHAR', 'CHARACTER',
  'CHECK', 'COLLATE', 'COLUMN', 'CONDITION', 'CONSTRAINT', 'CONTINUE', 'CONVERT', 'CREATE', 'CROSS',
  'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER', 'CURSOR', 'DATABASE', 'DATABASES',
  'DAY_HOUR', 'DAY_MICROSECOND', 'DAY_MINUTE', 'DAY_SECOND', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT',
  'DELAYED', 'DELETE', 'DESC', 'DESCRIBE', 'DETERMINISTIC', 'DISTINCT', 'DISTINCTROW', 'DIV', 'DOUBLE',
  'DROP', 'DUAL', 'EACH', 'ELSE', 'ELSEIF', 'ENCLOSED', 'ESCAPED', 'EXISTS', 'EXIT', 'EXPLAIN', 'FALSE',
  'FETCH', 'FLOAT', 'FLOAT4', 'FLOAT8', 'FOR', 'FORCE', 'FOREIGN', 'FROM', 'FULLTEXT', 'GRANT', 'GROUP',
  'HAVING', 'HIGH_PRIORITY', 'HOUR_MICROSECOND', 'HOUR_MINUTE', 'HOUR_SECOND', 'IF', 'IGNORE', 'IN',
  'INDEX', 'INFILE', 'INNER', 'INOUT', 'INSENSITIVE', 'INSERT', 'INT', 'INT1', 'INT2', 'INT3', 'INT4',
  'INT8', 'INTEGER', 'INTERVAL', 'INTO', 'IS', 'ITERATE', 'JOIN', 'KEY', 'KEYS', 'KILL', 'LEADING',
  'LEAVE', 'LEFT', 'LIKE', 'LIMIT', 'LINEAR', 'LINES', 'LOAD', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCK',
  'LONG', 'LONGBLOB', 'LONGTEXT', 'LOOP', 'LOW_PRIORITY', 'MASTER_SSL_VERIFY_SERVER_CERT', 'MATCH',
  'MAXVALUE', 'MEDIUMBLOB', 'MEDIUMINT', 'MEDIUMTEXT', 'MIDDLEINT', 'MINUTE_MICROSECOND', 'MINUTE_SECOND',
  'MOD', 'MODIFIES', 'NATURAL', 'NOT', 'NO_WRITE_TO_BINLOG', 'NULL', 'NUMERIC', 'ON', 'OPTIMIZE', 'OPTION',
  'OPTIONALLY', 'OR', 'ORDER', 'OUT', 'OUTER', 'OUTFILE', 'PRECISION', 'PRIMARY', 'PROCEDURE', 'PURGE',
  'RANGE', 'READ', 'READS', 'READ_WRITE', 'REAL', 'REFERENCES', 'REGEXP', 'RELEASE', 'RENAME', 'REPEAT',
  'REPLACE', 'REQUIRE', 'RESIGNAL', 'RESTRICT', 'RETURN', 'REVOKE', 'RIGHT', 'RLIKE', 'SCHEMA', 'SCHEMAS',
  'SECOND_MICROSECOND', 'SELECT', 'SENSITIVE', 'SEPARATOR', 'SET', 'SHOW', 'SIGNAL', 'SMALLINT', 'SPATIAL',
  'SPECIFIC', 'SQL', 'SQLEXCEPTION', 'SQLSTATE', 'SQLWARNING', 'SQL_BIG_RESULT', 'SQL_CALC_FOUND_ROWS',
  'SQL_SMALL_RESULT', 'SSL', 'STARTING', 'STRAIGHT_JOIN', 'TABLE', 'TERMINATED', 'THEN', 'TINYBLOB',
  'TINYINT', 'TINYTEXT', 'TO', 'TRAILING', 'TRIGGER', 'TRUE', 'UNDO', 'UNION', 'UNIQUE', 'UNLOCK',
  'UNSIGNED', 'UPDATE', 'USAGE', 'USE', 'USING', 'UTC_DATE', 'UTC_TIME', 'UTC_TIMESTAMP', 'VALUES',
  'VARBINARY', 'VARCHAR', 'VARCHARACTER', 'VARYING', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WRITE', 'XOR',
  'YEAR_MONTH', 'ZEROFILL', 'GENERAL', 'IGNORE_SERVER_IDS', 'MASTER_HEARTBEAT_PERIOD', 'MAXVALUE',
  'RESIGNAL', 'SIGNAL', 'SLOW'];

const RESERVED_WORDS = {
  JHIPSTER: [
    'ACCOUNT', 'ACTIVATE', 'AUDITS', 'CONFIGURATION', 'DOCS', 'HEALTH', 'LOGS', 'METRICS', 'PASSWORD',
    'REGISTER', 'RESET', 'SESSIONS', 'SETTINGS', 'TEST', 'EVENTMANAGER', 'PRINCIPAL', 'ENTITY'
  ],
  ANGULAR: [
    'CLASS', 'NODENAME', 'NODETYPE', 'COMPONENT', 'SUBSCRIPTION', 'RESPONSE',
    'OBSERVABLE', 'INJECTABLE', 'HTTP', 'ROUTER'
  ],
  JAVA: [
    'ABSTRACT', 'CONTINUE', 'FOR', 'NEW', 'SWITCH', 'ASSERT', 'DEFAULT', 'GOTO', 'PACKAGE', 'SYNCHRONIZED',
    'BOOLEAN', 'DO', 'IF', 'PRIVATE', 'THIS', 'BREAK', 'DOUBLE', 'IMPLEMENTS', 'PROTECTED', 'THROW', 'BYTE',
    'ELSE', 'IMPORT', 'PUBLIC', 'THROWS', 'CASE', 'ENUM', 'INSTANCEOF', 'RETURN', 'TRANSIENT', 'CATCH',
    'EXTENDS', 'INT', 'SHORT', 'TRY', 'CHAR', 'FINAL', 'INTERFACE', 'STATIC', 'VOID', 'CLASS', 'FINALLY',
    'LONG', 'STRICTFP', 'VOLATILE', 'CONST', 'FLOAT', 'NATIVE', 'SUPER', 'WHILE'
  ],
  TYPESCRIPT: [
    'BREAK', 'CASE', 'CATCH', 'CLASS', 'CONST', 'CONSTRUCTOR', 'CONTINUE', 'DEBUGGER', 'DEFAULT', 'DELETE',
    'DO', 'ELSE', 'ENUM', 'EXPORT', 'EXTENDS', 'FALSE', 'FINALLY', 'FOR', 'FUNCTION', 'IF', 'IMPORT', 'IN',
    'INSTANCEOF', 'NEW', 'NULL', 'RETURN', 'SUPER', 'SWITCH', 'THIS', 'THROW', 'TRUE', 'TRY', 'TYPEOF',
    'VAR', 'VOID', 'WHILE', 'WITH', 'IMPLEMENTS', 'INTERFACE', 'LET', 'PACKAGE', 'PRIVATE', 'PROTECTED',
    'PUBLIC', 'STATIC', 'YIELD'
  ],
  MYSQL: MYSQL_RESERVED_WORDS,
  MARIADB: MYSQL_RESERVED_WORDS,
  POSTGRESQL: [
    'ALL', 'ANALYSE', 'ANALYZE', 'AND', 'ANY', 'ARRAY', 'AS', 'ASC', 'ASYMMETRIC', 'AUTHORIZATION', 'BINARY',
    'BOTH', 'CASE', 'CAST', 'CHECK', 'COLLATE', 'COLLATION', 'COLUMN', 'CONCURRENTLY', 'CONSTRAINT', 'CREATE',
    'CROSS', 'CURRENT_CATALOG', 'CURRENT_DATE', 'CURRENT_ROLE', 'CURRENT_SCHEMA', 'CURRENT_TIME',
    'CURRENT_TIMESTAMP', 'CURRENT_USER', 'DEFAULT', 'DEFERRABLE', 'DESC', 'DISTINCT', 'DO', 'ELSE',
    'END', 'EXCEPT', 'FALSE', 'FETCH', 'FOR', 'FOREIGN', 'FROM', 'FULL', 'GRANT', 'GROUP', 'HAVING',
    'ILIKE', 'IN', 'INITIALLY', 'INNER', 'INTERSECT', 'INTO', 'IS', 'ISNULL', 'JOIN', 'LATERAL', 'LEADING',
    'LEFT', 'LIKE', 'LIMIT', 'LOCALTIME', 'LOCALTIMESTAMP', 'NATURAL', 'NOT', 'NOTNULL', 'NULL', 'OFFSET',
    'ON', 'ONLY', 'OR', 'ORDER', 'OUTER', 'OVERLAPS', 'PLACING', 'PRIMARY', 'REFERENCES', 'RETURNING',
    'RIGHT', 'SELECT', 'SESSION_USER', 'SIMILAR', 'SOME', 'SYMMETRIC', 'TABLE', 'THEN', 'TO', 'TRAILING',
    'TRUE', 'UNION', 'UNIQUE', 'USER', 'USING', 'VARIADIC', 'VERBOSE', 'WHEN', 'WHERE', 'WINDOW', 'WITH'
  ],
  CASSANDRA: [
    'ADD', 'ALL', 'ALTER', 'AND', 'ANY', 'APPLY', 'AS', 'ASC', 'ASCII', 'AUTHORIZE', 'BATCH', 'BEGIN',
    'BIGINT', 'BLOB', 'BOOLEAN', 'BY', 'CLUSTERING', 'COLUMNFAMILY', 'COMPACT', 'CONSISTENCY', 'COUNT',
    'COUNTER', 'CREATE', 'DECIMAL', 'DELETE', 'DESC', 'DOUBLE', 'DROP', 'EACH_QUORUM', 'FLOAT', 'FROM',
    'GRANT', 'IN', 'INDEX', 'CUSTOM', 'INSERT', 'INT', 'INTO', 'KEY', 'KEYSPACE', 'LEVEL', 'LIMIT',
    'LOCAL_ONE', 'LOCAL_QUORUM', 'MODIFY', 'NORECURSIVE', 'NOSUPERUSER', 'OF', 'ON', 'ONE', 'ORDER',
    'PASSWORD', 'PERMISSION', 'PERMISSIONS', 'PRIMARY', 'QUORUM', 'REVOKE', 'SCHEMA', 'SELECT', 'SET',
    'STORAGE', 'SUPERUSER', 'TABLE', 'TEXT', 'TIMESTAMP', 'TIMEUUID', 'THREE', 'TOKEN', 'TRUNCATE',
    'TTL', 'TWO', 'TYPE', 'UPDATE', 'USE', 'USER', 'USERS', 'USING', 'UUID', 'VALUES', 'VARCHAR',
    'VARINT', 'WHERE', 'WITH', 'WRITETIME', 'DISTINCT', 'BYTE', 'SMALLINT', 'COMPLEX', 'ENUM', 'DATE',
    'INTERVAL', 'MACADDR', 'BITSTRING'
  ],
  ORACLE: [
    'ACCESS', 'ACCOUNT', 'ACTIVATE', 'ADD', 'ADMIN', 'ADVISE', 'AFTER', 'ALL', 'ALL_ROWS', 'ALLOCATE',
    'ALTER', 'ANALYZE', 'AND', 'ANY', 'ARCHIVE', 'ARCHIVELOG', 'ARRAY', 'AS', 'ASC', 'AT', 'AUDIT',
    'AUTHENTICATED', 'AUTHORIZATION', 'AUTOEXTEND', 'AUTOMATIC', 'BACKUP', 'BECOME', 'BEFORE', 'BEGIN',
    'BETWEEN', 'BFILE', 'BITMAP', 'BLOB', 'BLOCK', 'BODY', 'BY', 'CACHE', 'CACHE_INSTANCES', 'CANCEL',
    'CASCADE', 'CAST', 'CFILE', 'CHAINED', 'CHANGE', 'CHAR', 'CHAR_CS', 'CHARACTER', 'CHECK', 'CHECKPOINT',
    'CHOOSE', 'CHUNK', 'CLEAR', 'CLOB', 'CLONE', 'CLOSE', 'CLOSE_CACHED_OPEN_CURSORS', 'CLUSTER', 'COALESCE',
    'COLUMN', 'COLUMNS', 'COMMENT', 'COMMIT', 'COMMITTED', 'COMPATIBILITY', 'COMPILE', 'COMPLETE',
    'COMPOSITE_LIMIT', 'COMPRESS', 'COMPUTE', 'CONNECT', 'CONNECT_TIME', 'CONSTRAINT', 'CONSTRAINTS',
    'CONTENTS', 'CONTINUE', 'CONTROLFILE', 'CONVERT', 'COST', 'CPU_PER_CALL', 'CPU_PER_SESSION', 'CREATE',
    'CURRENT', 'CURRENT_SCHEMA', 'CURREN_USER', 'CURSOR', 'CYCLE', ' ', 'DANGLING', 'DATABASE', 'DATAFILE',
    'DATAFILES', 'DATAOBJNO', 'DATE', 'DBA', 'DBHIGH', 'DBLOW', 'DBMAC', 'DEALLOCATE', 'DEBUG', 'DEC',
    'DECIMAL', 'DECLARE', 'DEFAULT', 'DEFERRABLE', 'DEFERRED', 'DEGREE', 'DELETE', 'DEREF', 'DESC',
    'DIRECTORY', 'DISABLE', 'DISCONNECT', 'DISMOUNT', 'DISTINCT', 'DISTRIBUTED', 'DML', 'DOUBLE', 'DROP',
    'DUMP', 'EACH', 'ELSE', 'ENABLE', 'END', 'ENFORCE', 'ENTRY', 'ESCAPE', 'EXCEPT', 'EXCEPTIONS',
    'EXCHANGE', 'EXCLUDING', 'EXCLUSIVE', 'EXECUTE', 'EXISTS', 'EXPIRE', 'EXPLAIN', 'EXTENT', 'EXTENTS',
    'EXTERNALLY', 'FAILED_LOGIN_ATTEMPTS', 'FALSE', 'FAST', 'FILE', 'FIRST_ROWS', 'FLAGGER', 'FLOAT',
    'FLOB', 'FLUSH', 'FOR', 'FORCE', 'FOREIGN', 'FREELIST', 'FREELISTS', 'FROM', 'FULL', 'FUNCTION',
    'GLOBAL', 'GLOBALLY', 'GLOBAL_NAME', 'GRANT', 'GROUP', 'GROUPS', 'HASH', 'HASHKEYS', 'HAVING',
    'HEADER', 'HEAP', 'IDENTIFIED', 'IDGENERATORS', 'IDLE_TIME', 'IF', 'IMMEDIATE', 'IN', 'INCLUDING',
    'INCREMENT', 'INDEX', 'INDEXED', 'INDEXES', 'INDICATOR', 'IND_PARTITION', 'INITIAL', 'INITIALLY',
    'INITRANS', 'INSERT', 'INSTANCE', 'INSTANCES', 'INSTEAD', 'INT', 'INTEGER', 'INTERMEDIATE', 'INTERSECT',
    'INTO', 'IS', 'ISOLATION', 'ISOLATION_LEVEL', 'KEEP', 'KEY', 'KILL', 'LABEL', 'LAYER', 'LESS',
    'LEVEL', 'LIBRARY', 'LIKE', 'LIMIT', 'LINK', 'LIST', 'LOB', 'LOCAL', 'LOCK', 'LOCKED', 'LOG',
    'LOGFILE', 'LOGGING', 'LOGICAL_READS_PER_CALL', 'LOGICAL_READS_PER_SESSION', 'LONG', 'MANAGE',
    'MASTER', 'MAX', 'MAXARCHLOGS', 'MAXDATAFILES', 'MAXEXTENTS', 'MAXINSTANCES', 'MAXLOGFILES',
    'MAXLOGHISTORY', 'MAXLOGMEMBERS', 'MAXSIZE', 'MAXTRANS', 'MAXVALUE', 'MIN', 'MEMBER', 'MINIMUM',
    'MINEXTENTS', 'MINUS', 'MINVALUE', 'MLSLABEL', 'MLS_LABEL_FORMAT', 'MODE', 'MODIFY', 'MOUNT', 'MOVE',
    'MTS_DISPATCHERS', 'MULTISET', 'NATIONAL', 'NCHAR', 'NCHAR_CS', 'NCLOB', 'NEEDED', 'NESTED',
    'NETWORK', 'NEW', 'NEXT', 'NOARCHIVELOG', 'NOAUDIT', 'NOCACHE', 'NOCOMPRESS', 'NOCYCLE', 'NOFORCE',
    'NOLOGGING', 'NOMAXVALUE', 'NOMINVALUE', 'NONE', 'NOORDER', 'NOOVERRIDE', 'NOPARALLEL',
    'NOPARALLEL', 'NOREVERSE', 'NORMAL', 'NOSORT', 'NOT', 'NOTHING', 'NOWAIT', 'NULL', 'NUMBER',
    'NUMERIC', 'NVARCHAR2', 'OBJECT', 'OBJNO', 'OBJNO_REUSE', 'OF', 'OFF', 'OFFLINE', 'OID', 'OIDINDEX',
    'OLD', 'ON', 'ONLINE', 'ONLY', 'OPCODE', 'OPEN', 'OPTIMAL', 'OPTIMIZER_GOAL', 'OPTION', 'OR',
    'ORDER', 'ORGANIZATION', 'OSLABEL', 'OVERFLOW', 'OWN', 'PACKAGE', 'PARALLEL', 'PARTITION',
    'PASSWORD', 'PASSWORD_GRACE_TIME', 'PASSWORD_LIFE_TIME', 'PASSWORD_LOCK_TIME', 'PASSWORD_REUSE_MAX',
    'PASSWORD_REUSE_TIME', 'PASSWORD_VERIFY_FUNCTION', 'PCTFREE', 'PCTINCREASE', 'PCTTHRESHOLD', 'PCTUSED',
    'PCTVERSION', 'PERCENT', 'PERMANENT', 'PLAN', 'PLSQL_DEBUG', 'POST_TRANSACTION', 'PRECISION', 'PRESERVE',
    'PRIMARY', 'PRIOR', 'PRIVATE', 'PRIVATE_SGA', 'PRIVILEGE', 'PRIVILEGES', 'PROCEDURE', 'PROFILE', 'PUBLIC',
    'PURGE', 'QUEUE', 'QUOTA', 'RANGE', 'RAW', 'RBA', 'READ', 'READUP', 'REAL', 'REBUILD', 'RECOVER',
    'RECOVERABLE', 'RECOVERY', 'REF', 'REFERENCES', 'REFERENCING', 'REFRESH', 'RENAME', 'REPLACE',
    'RESET', 'RESETLOGS', 'RESIZE', 'RESOURCE', 'RESTRICTED', 'RETURN', 'RETURNING', 'REUSE', 'REVERSE',
    'REVOKE', 'ROLE', 'ROLES', 'ROLLBACK', 'ROW', 'ROWID', 'ROWNUM', 'ROWS', 'RULE', 'SAMPLE', 'SAVEPOINT',
    'SB4', 'SCAN_INSTANCES', 'SCHEMA', 'SCN', 'SCOPE', 'SD_ALL', 'SD_INHIBIT', 'SD_SHOW', 'SEGMENT',
    'SEG_BLOCK', 'SEG_FILE', 'SELECT', 'SEQUENCE', 'SERIALIZABLE', 'SESSION', 'SESSION_CACHED_CURSORS',
    'SESSIONS_PER_USER', 'SET', 'SHARE', 'SHARED', 'SHARED_POOL', 'SHRINK', 'SIZE', 'SKIP',
    'SKIP_UNUSABLE_INDEXES', 'SMALLINT', 'SNAPSHOT', 'SOME', 'SORT', 'SPECIFICATION', 'SPLIT',
    'SQL_TRACE', 'STANDBY', 'START', 'STATEMENT_ID', 'STATISTICS', 'STOP', 'STORAGE', 'STORE',
    'STRUCTURE', 'SUCCESSFUL', 'SWITCH', 'SYS_OP_ENFORCE_NOT_NULL$', 'SYS_OP_NTCIMG$', 'SYNONYM',
    'SYSDATE', 'SYSDBA', 'SYSOPER', 'SYSTEM', 'TABLE', 'TABLES', 'TABLESPACE', 'TABLESPACE_NO',
    'TABNO', 'TEMPORARY', 'THAN', 'THE', 'THEN', 'THREAD', 'TIMESTAMP', 'TIME', 'TO', 'TOPLEVEL',
    'TRACE', 'TRACING', 'TRANSACTION', 'TRANSITIONAL', 'TRIGGER', 'TRIGGERS', 'TRUE', 'TRUNCATE',
    'TX', 'TYPE', 'UB2', 'UBA', 'UID', 'UNARCHIVED', 'UNDO', 'UNION', 'UNIQUE', 'UNLIMITED',
    'UNLOCK', 'UNRECOVERABLE', 'UNTIL', 'UNUSABLE', 'UNUSED', 'UPDATABLE', 'UPDATE', 'USAGE',
    'USE', 'USER', 'USING', 'VALIDATE', 'VALIDATION', 'VALUE', 'VALUES', 'VARCHAR', 'VARCHAR2',
    'VARYING', 'VIEW', 'WHEN', 'WHENEVER', 'WHERE', 'WITH', 'WITHOUT', 'WORK', 'WRITE', 'WRITEDOWN',
    'WRITEUP', 'XID', 'YEAR', 'ZONE'
  ],
  MONGODB: ['DOCUMENT'],
  MSSQL: [
    'ADD', 'ALL', 'ALTER', 'AND', 'ANY', 'AS', 'ASC', 'AUTHORIZATION', 'BACKUP', 'BEGIN', 'BETWEEN', 'BREAK',
    'BROWSE', 'BULK', 'BY', 'CASCADE', 'CASE', 'CHECK', 'CHECKPOINT', 'CLOSE', 'CLUSTERED', 'COALESCE',
    'COLLATE', 'COLUMN', 'COMMIT', 'COMPUTE', 'CONSTRAINT', 'CONTAINS', 'CONTAINSTABLE', 'CONTINUE',
    'CONVERT', 'CREATE', 'CROSS', 'CURRENT', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP',
    'CURRENT_USER', 'CURSOR', 'DATABASE', 'DBCC', 'DEALLOCATE', 'DECLARE', 'DEFAULT', 'DELETE',
    'DENY', 'DESC', 'DISK', 'DISTINCT', 'DISTRIBUTED', 'DOUBLE', 'DROP', 'DUMP', 'ELSE', 'END',
    'ERRLVL', 'ESCAPE', 'EXCEPT', 'EXEC', 'EXECUTE', 'EXISTS', 'EXIT', 'EXTERNAL', 'FETCH', 'FILE',
    'FILLFACTOR', 'FOR', 'FOREIGN', 'FREETEXT', 'FREETEXTTABLE', 'FROM', 'FULL', 'FUNCTION', 'GOTO',
    'GRANT', 'GROUP', 'HAVING', 'HOLDLOCK', 'IDENTITY', 'IDENTITY_INSERT', 'IDENTITYCOL', 'IF', 'IN',
    'INDEX', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'IS', 'JOIN', 'KEY', 'KILL', 'LEFT', 'LIKE',
    'LINENO', 'LOAD', 'MERGE', 'NATIONAL', 'NOCHECK', 'NONCLUSTERED', 'NOT', 'NULL', 'NULLIF', 'OF',
    'OFF', 'OFFSETS', 'ON', 'OPEN', 'OPENDATASOURCE', 'OPENQUERY', 'OPENROWSET', 'OPENXML', 'OPTION',
    'OR', 'ORDER', 'OUTER', 'OVER', 'PERCENT', 'PIVOT', 'PLAN', 'PRECISION', 'PRIMARY', 'PRINT',
    'PROC', 'PROCEDURE', 'PUBLIC', 'RAISERROR', 'READ', 'READTEXT', 'RECONFIGURE', 'REFERENCES',
    'REPLICATION', 'RESTORE', 'RESTRICT', 'RETURN', 'REVERT', 'REVOKE', 'RIGHT', 'ROLLBACK',
    'ROWCOUNT', 'ROWGUIDCOL', 'RULE', 'SAVE', 'SCHEMA', 'SECURITYAUDIT', 'SELECT', 'SEMANTICKEYPHRASETABLE',
    'SEMANTICSIMILARITYDETAILSTABLE', 'SEMANTICSIMILARITYTABLE', 'SESSION_USER', 'SET', 'SETUSER',
    'SHUTDOWN', 'SOME', 'STATISTICS', 'SYSTEM_USER', 'TABLE', 'TABLESAMPLE', 'TEXTSIZE', 'THEN',
    'TO', 'TOP', 'TRAN', 'TRANSACTION', 'TRIGGER', 'TRUNCATE', 'TRY_CONVERT', 'TSEQUAL', 'UNION',
    'UNIQUE', 'UNPIVOT', 'UPDATE', 'UPDATETEXT', 'USE', 'USER', 'VALUES', 'VARYING', 'VIEW',
    'WAITFOR', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WITHIN GROUP', 'WRITETEXT'
  ]
};

function isReserved(keyword, type) {
  return keyword != null && type != null && RESERVED_WORDS[type.toUpperCase()] != null
    && RESERVED_WORDS[type.toUpperCase()].indexOf(keyword.toUpperCase()) !== -1;
}

function isReservedClassName(keyword) {
  return isReserved(keyword, 'JHIPSTER') || isReserved(keyword, 'ANGULAR') || isReserved(keyword, 'TYPESCRIPT') || isReserved(keyword, 'JAVA');
}

function isReservedTableName(keyword, databaseType) {
  return (databaseType.toUpperCase() === 'SQL')
    ? isReserved(keyword, 'MYSQL') || isReserved(keyword, 'POSTGRESQL') || isReserved(keyword, 'ORACLE') || isReserved(keyword, 'MSSQL')
    : isReserved(keyword, databaseType);
}

function isReservedFieldName(keyword) {
  return isReserved(keyword, 'ANGULAR') || isReserved(keyword, 'TYPESCRIPT') || isReserved(keyword, 'JAVA');
}

export = {
  isReserved,
  isReservedClassName,
  isReservedTableName,
  isReservedFieldName,
  JHIPSTER: RESERVED_WORDS.JHIPSTER,
  ANGULAR: RESERVED_WORDS.ANGULAR,
  JAVA: RESERVED_WORDS.JAVA,
  TYPESCRIPT: RESERVED_WORDS.TYPESCRIPT,
  MYSQL: RESERVED_WORDS.MYSQL,
  POSTGRESQL: RESERVED_WORDS.POSTGRESQL,
  CASSANDRA: RESERVED_WORDS.CASSANDRA,
  ORACLE: RESERVED_WORDS.ORACLE,
  MONGODB: RESERVED_WORDS.MONGODB,
  MSSQL: RESERVED_WORDS.MSSQL
};
