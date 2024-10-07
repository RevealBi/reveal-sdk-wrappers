import { 
    AmazonAthenaDataSource, 
    AmazonS3DataSource, 
    GoogleBigQueryDataSource, 
    GoogleDriveDataSource, 
    GoogleSheetsDataSource, 
    LocalFileDataSource, 
    MicrosoftAzureSqlServerDataSource, 
    MicrosoftSqlServerDataSource, 
    MongoDBDataSource, 
    MySqlDataSource, 
    OracleDataSource, 
    PostgreSQLDataSource, 
    RemoteFileDataSource, 
    RestDataSource, 
    SnowflakeDataSource 
} from "./data-sources";

export type DataSourcesConfig = DataSourceConfig[];
export type DataSourceConfig = AmazonAthenaDataSource
    | AmazonS3DataSource
    | GoogleBigQueryDataSource
    | GoogleDriveDataSource
    | GoogleSheetsDataSource
    | LocalFileDataSource
    | MicrosoftAzureSqlServerDataSource
    | MicrosoftSqlServerDataSource
    | MongoDBDataSource
    | MySqlDataSource
    | OracleDataSource
    | PostgreSQLDataSource
    | RemoteFileDataSource
    | RestDataSource
    | SnowflakeDataSource;
