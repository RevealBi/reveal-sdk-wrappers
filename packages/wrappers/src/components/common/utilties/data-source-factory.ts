import { RVAthenaDataSource, RVAthenaDataSourceItem, RVDashboardDataSource, RVPostgresDataSource, RVAzureSqlDataSource, RVAzureSqlDataSourceItem, RVBigQueryDataSource, RVBigQueryDataSourceItem, RVCsvDataSourceItem, RVExcelDataSourceItem, RVGoogleDriveDataSource, RVGoogleDriveDataSourceItem, RVGoogleSheetDataSourceItem, RVLocalFileDataSourceItem, RVMySqlDataSourceItem, RVMongoDBDataSourceItem, RVS3DataSource, RVSqlServerDataSource, RVMySqlDataSource, RVMongoDBDataSource, RVSqlServerDataSourceItem, RVOracleDataSourceItem, RVOracleServiceDataSource, RVOracleSIDDataSource, RVWebResourceDataSource, RVPostgresDataSourceItem, RVJsonDataSourceItem, RVWebResourceDataSourceItem, RVRESTDataSource, RVSnowflakeDataSourceItem, RVSnowflakeDataSource } from "reveal-sdk";
import { DataSourceConfig, DataSourcesConfig } from "../../reveal-view";

type DataSourceFactory = {
    [key: string]: {
        dataSourceCreator?: (dsConfig: DataSourceConfig) => any;
        dataSourceItemCreator?: (rvDataSource: any, dsConfig: DataSourceConfig) => any;
    };
};

const dataSourceFactory: DataSourceFactory = {
    "AmazonAthena": {
        dataSourceCreator: () => new RVAthenaDataSource(),
        dataSourceItemCreator: (rvDataSource) => new RVAthenaDataSourceItem(rvDataSource),
    },
    "AmazonS3": {
        dataSourceCreator: () => new RVS3DataSource(),
    },
    "Excel": {
        dataSourceItemCreator: (rvDataSource: RVDashboardDataSource, dsConfig: any) => {
            const fdsi = new RVLocalFileDataSourceItem()
            fdsi.id = dsConfig.id;
            fdsi.uri = dsConfig.fileName ? `local:/${dsConfig.fileName}` : null;
            const dsi = new RVExcelDataSourceItem(fdsi)
            return dsi;
        },
    },
    "GoogleBigQuery": {
        dataSourceCreator: () => new RVBigQueryDataSource(),
        dataSourceItemCreator: (rvDataSource) => new RVBigQueryDataSourceItem(rvDataSource),
    },
    "GoogleDrive": {
        dataSourceCreator: () => new RVGoogleDriveDataSource(),
    },
    "GoogleSheets": {
        dataSourceCreator: () => new RVGoogleDriveDataSourceItem(),
        dataSourceItemCreator: (rvDataSource) => new RVGoogleSheetDataSourceItem(rvDataSource),
    },
    "LocalFile": {
        dataSourceItemCreator: (rvDataSource, dsConfig: any) => {
            const fdsi = new RVLocalFileDataSourceItem()
            fdsi.id = dsConfig.id;
            fdsi.uri = dsConfig.fileName ? `local:/${dsConfig.fileName}` : null;
            let dsi = dsConfig.format === "Excel" ? new RVExcelDataSourceItem(fdsi) : new RVCsvDataSourceItem(fdsi)
            return dsi;
        },
    },
    "MicrosoftAzureSqlServer": {
        dataSourceCreator: () => new RVAzureSqlDataSource(),
        dataSourceItemCreator: (rvDataSource) => new RVAzureSqlDataSourceItem(rvDataSource),
    },
    "MicrosoftSqlServer": {
        dataSourceCreator: () => new RVSqlServerDataSource(),
        dataSourceItemCreator: (rvDataSource) => new RVSqlServerDataSourceItem(rvDataSource),
    },
    "MongoDB": {
        dataSourceCreator: () => new RVMongoDBDataSource(),
        dataSourceItemCreator: (rvDataSource) => new RVMongoDBDataSourceItem(rvDataSource),
    },
    "MySql": {
        dataSourceCreator: () => new RVMySqlDataSource(),
        dataSourceItemCreator: (rvDataSource) => new RVMySqlDataSourceItem(rvDataSource),
    },
    "Oracle": {
        dataSourceCreator: (dsConfig: any) => {
            return dsConfig.provider === "SID" ? new RVOracleSIDDataSource() : new RVOracleServiceDataSource();
        },
        dataSourceItemCreator: (rvDataSource) => new RVOracleDataSourceItem(rvDataSource),
    },
    "PostgreSQL": {
        dataSourceCreator: () => new RVPostgresDataSource(),
        dataSourceItemCreator: (rvDataSource) => new RVPostgresDataSourceItem(rvDataSource),
    },
    "RemoteFile": {
        dataSourceItemCreator: (rvDataSource, dsConfig: any) => {
            const webDS = new RVWebResourceDataSource();
            webDS.id = dsConfig.id;
            webDS.url = dsConfig.url;
            webDS.useAnonymousAuthentication = dsConfig.useAnonymousAuthentication ?? true;
            const webDSI = new RVWebResourceDataSourceItem(webDS); 
            if (dsConfig.format === "JSON") {
                return new RVJsonDataSourceItem(webDSI); 
            } else if (dsConfig.format === "CSV") {
                return new RVCsvDataSourceItem(webDSI);
            } else if (dsConfig.format === "Excel") {
                return new RVExcelDataSourceItem(webDSI);
            } else {
                throw new Error(`Unsupported RemoteFile: ${dsConfig.type}`);
            }
        },
    },
    "REST": {
        dataSourceCreator: (dsConfig: any) => {
            const ds = new RVRESTDataSource();
            ds.useAnonymousAuthentication = dsConfig.useAnonymousAuthentication ?? true;
            return ds;
        },
    },
    "Snowflake": {
        dataSourceCreator: () => new RVSnowflakeDataSource(),
        dataSourceItemCreator: (rvDataSource) => new RVSnowflakeDataSourceItem(rvDataSource),
    },
};

export function getRVDataSources(dsConfigs?: DataSourcesConfig) {
    const rvDataSources: any[] = [];
    let rvDataSourceItems: any[] = [];

    if (dsConfigs) {
        dsConfigs.forEach(dsConfig => {
            let rvDataSource;
            
            const creator = dataSourceFactory[dsConfig.type].dataSourceCreator;
            if (creator) {                
                rvDataSource = creator(dsConfig);
                setRVDataSourceProperties(dsConfig, rvDataSource);
                rvDataSources.push(rvDataSource);
            }
            
            // Create DataSourceItems only if a dataSourceItemCreator exists
            if (dataSourceFactory[dsConfig.type]?.dataSourceItemCreator) {
                rvDataSourceItems.push(...getRVDataSourceItems(dsConfig, rvDataSource));
            }
        });        
    }

    return { dataSources: rvDataSources, dataSourceItems: rvDataSourceItems };
}

function hasItems(dsConfig: DataSourceConfig): dsConfig is DataSourceConfig & { items: any[] } {
    return 'items' in dsConfig && Array.isArray(dsConfig.items);
}

function getRVDataSourceItems(dsConfig: DataSourceConfig, rvDataSource: any) {
    const rvDataSourceItems: any[] = [];
    const itemCreator = dataSourceFactory[dsConfig.type].dataSourceItemCreator;
    if (!itemCreator) {
        throw new Error(`Unsupported dataSourceItemType: ${dsConfig.type}`);
    }

    const items = hasItems(dsConfig) ? dsConfig.items : [ dsConfig ];
    items.forEach(item => {
        const dsi = itemCreator(rvDataSource, item);
        setRVDataSourceItemProperties(item, dsi);
        rvDataSourceItems.push(dsi);
    });

    return rvDataSourceItems;
}

function setRVDataSourceProperties(dsConfig: DataSourceConfig, rvDataSource: any) {
    copyObjectProperties(dsConfig, rvDataSource);
}

function setRVDataSourceItemProperties(dataSourceItem: any, rvDataSourceItem: any) {
    copyObjectProperties(dataSourceItem, rvDataSourceItem);
}

function copyObjectProperties(source: any, target: any) {
    for (const prop in source) {
        if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
        }
    }
}