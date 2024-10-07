import { DataSourceConfig, DataSourcesConfig } from "../../reveal-view";



declare let $: any;

type DataSourceFactory = {
    [key: string]: {
        dataSourceCreator?: (dsConfig: DataSourceConfig) => any;
        dataSourceItemCreator?: (rvDataSource: any, dsConfig: DataSourceConfig) => any;
    };
};

const dataSourceFactory: DataSourceFactory = {
    "AmazonAthena": {
        dataSourceCreator: () => new $.ig.RVAthenaDataSource(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVAthenaDataSourceItem(rvDataSource),
    },
    "AmazonS3": {
        dataSourceCreator: () => new $.ig.RVS3DataSource(),
    },
    "Excel": {
        dataSourceItemCreator: (rvDataSource, dsConfig: any) => {
            const fdsi = new $.ig.RVLocalFileDataSourceItem()
            fdsi.id = dsConfig.id;
            fdsi.uri = dsConfig.fileName ? `local:/${dsConfig.fileName}` : undefined;
            const dsi = new $.ig.RVExcelDataSourceItem(fdsi)
            return dsi;
        },
    },
    "GoogleBigQuery": {
        dataSourceCreator: () => new $.ig.RVBigQueryDataSource(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVBigQueryDataSourceItem(rvDataSource),
    },
    "GoogleDrive": {
        dataSourceCreator: () => new $.ig.RVGoogleDriveDataSource(),
    },
    "GoogleSheets": {
        dataSourceCreator: () => new $.ig.RVGoogleDriveDataSourceItem(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVGoogleSheetDataSourceItem(rvDataSource),
    },
    "LocalFile": {
        dataSourceItemCreator: (rvDataSource, dsConfig: any) => {
            const fdsi = new $.ig.RVLocalFileDataSourceItem()
            fdsi.id = dsConfig.id;
            fdsi.uri = dsConfig.fileName ? `local:/${dsConfig.fileName}` : undefined;
            let dsi = dsConfig.format === "Excel" ? new $.ig.RVExcelDataSourceItem(fdsi) : new $.ig.RVCsvDataSourceItem(fdsi)
            return dsi;
        },
    },
    "MicrosoftAzureSqlServer": {
        dataSourceCreator: () => new $.ig.RVAzureSqlDataSource(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVAzureSqlDataSourceItem(rvDataSource),
    },
    "MicrosoftSqlServer": {
        dataSourceCreator: () => new $.ig.RVSqlServerDataSource(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVSqlServerDataSourceItem(rvDataSource),
    },
    "MongoDB": {
        dataSourceCreator: () => new $.ig.RVMongoDBDataSource(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVMongoDBDataSourceItem(rvDataSource),
    },
    "MySql": {
        dataSourceCreator: () => new $.ig.RVMySqlDataSource(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVMySqlDataSourceItem(rvDataSource),
    },
    "Oracle": {
        dataSourceCreator: (dsConfig: any) => {
            return dsConfig.provider === "SID" ? new $.ig.RVOracleSIDDataSource() : new $.ig.RVOracleServiceDataSource();
        },
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVOracleDataSourceItem(rvDataSource),
    },
    "PostgreSQL": {
        dataSourceCreator: () => new $.ig.RVPostgresDataSource(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVPostgresDataSourceItem(rvDataSource),
    },
    "RemoteFile": {
        dataSourceItemCreator: (rvDataSource, dsConfig: any) => {
            const webDS = new $.ig.RVWebResourceDataSource();
            webDS.id = dsConfig.id;
            webDS.url = dsConfig.url;
            webDS.useAnonymousAuthentication = dsConfig.useAnonymousAuthentication ?? true;
            const webDSI = new $.ig.RVWebResourceDataSourceItem(webDS); 
            if (dsConfig.format === "JSON") {
                return new $.ig.RVJsonDataSourceItem(webDSI); 
            } else if (dsConfig.format === "CSV") {
                return new $.ig.RVCsvDataSourceItem(webDSI);
            } else if (dsConfig.format === "Excel") {
                return new $.ig.RVExcelDataSourceItem(webDSI);
            } else {
                throw new Error(`Unsupported RemoteFile: ${dsConfig.type}`);
            }
        },
    },
    "REST": {
        dataSourceCreator: (dsConfig: any) => {
            const ds = new $.ig.RVRESTDataSource();
            ds.useAnonymousAuthentication = dsConfig.useAnonymousAuthentication ?? true;
            return ds;
        },
    },
    "Snowflake": {
        dataSourceCreator: () => new $.ig.RVSnowflakeDataSource(),
        dataSourceItemCreator: (rvDataSource) => new $.ig.RVSnowflakeDataSourceItem(rvDataSource),
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