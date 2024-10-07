export interface DashboardFilters extends Array<DashboardFilter> {
    getByTitle(filterName: string): DashboardFilter;
    getById(filterId: string): DashboardFilter;
}

export interface DashboardFilter {
    readonly id: string;
    readonly title: string;
    selectedValues: any[];
    getFilterValues(): Promise<DashboardFilterValue[]>;
}

export interface DashboardFilterValue {
    readonly label: string;
    readonly value: any;
}
