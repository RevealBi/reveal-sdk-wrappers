export type DataSourceInfo = {
    id?: string;
    title: string;
    subtitle?: string;
}

export type DataSourceInfoCollection = DataSourceInfo & {
    items?: DataSourceInfo[];
}

