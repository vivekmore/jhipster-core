export class DatabaseTypes {

  public static readonly Types = {
    sql: 'sql',
    mysql: 'mysql',
    mariadb: 'mariadb',
    postgresql: 'postgresql',
    mssql: 'mssql',
    oracle: 'oracle',
    mongodb: 'mongodb',
    cassandra: 'cassandra'
  };

  public static isSql(type) {
    return DatabaseTypes.Types.sql === type || DatabaseTypes.Types.mysql === type || DatabaseTypes.Types.postgresql === type || DatabaseTypes.Types.oracle === type || DatabaseTypes.Types.mariadb === type || DatabaseTypes.Types.mssql === type;
  }
}
