import { DataSourceInfoCollection, DataSourceInfo } from "./data-source-info";

export type AmazonAthenaDataSource = DataSourceInfoCollection & {
    type: "AmazonAthena";
}

export type AmazonS3DataSource = DataSourceInfo & {
    type: "AmazonS3";
}

export type GoogleBigQueryDataSource = DataSourceInfoCollection & {
    type: "GoogleBigQuery";
}

export type GoogleDriveDataSource = DataSourceInfo & {
    type: "GoogleDrive";
}

export type GoogleSheetsDataSource = DataSourceInfoCollection & {
    type: "GoogleSheets";
}

export type LocalFileFormat = "Excel" | "CSV";
export type LocalFileDataSource = DataSourceInfo & {
    type: "LocalFile";
    format: LocalFileFormat;
    fileName?: string;
}

export type MicrosoftAzureSqlServerDataSource = DataSourceInfoCollection & {
    type: "MicrosoftAzureSqlServer";
}

export type MicrosoftSqlServerDataSource = DataSourceInfoCollection & {
    type: "MicrosoftSqlServer";
}

export type MongoDBDataSource = DataSourceInfoCollection & {
    type: "MongoDB";
}

export type MySqlDataSource = DataSourceInfoCollection & {
    type: "MySql";
}

export type OracleProvider = "SID" | "ServiceName";
export type OracleDataSource = DataSourceInfoCollection & {
    type: "Oracle";
    provider: OracleProvider;
}

export type PostgreSQLDataSource = DataSourceInfoCollection & {
    type: "PostgreSQL";
}

export type RemoteFileFormat = "Excel" | "CSV" | "JSON"; //todo: can this be consolidated with LocalFileFormat?
export type RemoteFileDataSource = DataSourceInfo & {
    type: "RemoteFile";
    format: RemoteFileFormat;
    url?: string;
    useAnonymousAuthentication?: boolean;
}

export type RestDataSource = DataSourceInfo & {
    type: "REST";
    url?: string;
    useAnonymousAuthentication?: boolean;
}

export type SnowflakeDataSource = DataSourceInfoCollection & {
    type: "Snowflake";
}