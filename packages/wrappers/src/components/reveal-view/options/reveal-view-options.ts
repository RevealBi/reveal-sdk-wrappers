import { MenuItem } from "../../common/interfaces/menu-item";
import { ChartType } from "../enums/chart-type";
import { DataSourcesConfig } from "../data-sources";


export interface RevealViewOptions {
    /**
     * Gets or sets if the user can end edit mode to edit the dashboard.
     */
    canEdit?: boolean;
    /**
     * Gets or sets if the user can save the dashboard.
     */
    canSave?: boolean;
    /**
     * Gets or sets the data sources that can be used to create dashboards.
     */
    dataSources?: DataSourcesConfig;
    /**
     * Gets or sets if saving occurs on the server
     */
    saveOnServer?: boolean;
    /**
     * Gets or sets if the DashboardViewer should start in edit mode.
     */
    startInEditMode?: boolean;
    /**
     * Gets or sets if the DashboardViewer should start with a new visualization.
     */
    startWithNewVisualization?: boolean;
    header?: HeaderOptions | boolean;
    filters?: FilterOptions;
    dataSourceDialog?: DataSourceDialogOptions;
    visualizations?: VisualizationOptions;
    editor?: EditorOptions;
}

export interface ChartTypeItem {
    chartType: ChartType;
    title: string;
    icon: string;
    groups: string[];
}

export interface ChartTypeCustomItem {
    title: string;
    icon?: string;
    url: string;
    groups?: string[];
}

export interface DataSourceDialogOptions {
    /**
     * Gets or sets if data sources defined in the dashboard are shown in the data source dialog.
     */
    showExistingDataSources?: boolean;
    /**
     * Gets or sets if the search input is shown in the data source dialog.
     */
    showSearch?: boolean;
}


export interface EditorOptions {
    /**
     * Modifies, filters, or augments the provided list of chart types that appear in the Chart Types selection dialog.
     * @param {ChartTypeItem[]} chartTypes - The array of default chart type items.
     * @returns {ChartTypeItem[]} - An array of processed chart type items.
     */
    chartTypes?: (chartTypes: ChartTypeItem[]) => ChartTypeItem[];
    /**
     * Gets or sets the array of chart types to remove from the default chart types.
     */
    chartTypesToRemove?: ChartType[];
    /**
     * Gets or sets the array of custom chart types to add to the Chart Types selection dialog.
     */
    chartTypesToAdd?: ChartTypeCustomItem[];
    /**
     * Gets or sets the default chart type to use when creating a new visualization.
     */
    defaultChartType?: ChartType | string;
    /**
     * Gets or set if the f(x) option in numeric values sections (like "Values") should be displayed or not.
     */
    addPostCalculatedFields?: boolean;
    /**
     * Gets or sets if new (calculated) fields can be added to the list of fields.
     */
    addCalculatedFields?: boolean;
    /**
     * Gets or sets if the button "Add fields from another data source" should be available or not.
     */
    dataBlending?: boolean;
    /**
     * Gets or sets if the edit button for a datasource should be displayed or not.
     */
    editDataSource?: boolean;
    /**
     * Gets or sets if the button "Add fields from a Machine Learning model" should be available or not.
     */
    machineLearning?: boolean;
}

export interface FilterOptions {
    /**
     * Gets or sets if the interactive filter behavior is enabled.
     */
    interactiveFiltering?: boolean;
    /**
     * Gets or sets if the filters are shown.
     */
    showFilters?: boolean;
    /**
     * Gets or sets if the user can add a date filter.
     */
    addDateFilter?: boolean;
    /**
     * Gets or sets if the user can add a dashboard filter.
     */
    addDashboardFilter?: boolean;
}

export interface HeaderOptions {
    /**
     * Gets or sets if the user can add a new visualization.
     */
    canAddVisualization?: boolean;

    /**
     * Gets or sets if the title is shown in the header.
     */
    showTitle?: boolean;

    menu?: boolean | {
        /**
         * Gets or sets if the menu item "Export to Image" is shown.
         */
        exportToImage?: boolean;
        /**
         * Gets or sets if the menu item "Export to Excel" is shown.
         */
        exportToExcel?: boolean;
        /**
         * Gets or sets if the menu item "Export to PowerPoint" is shown.
         */
        exportToPowerPoint?: boolean;
        /**
         * Gets or sets if the menu item "Export to PDF" is shown.
         */
        exportToPdf?: boolean;
        /**
         * Gets or sets if the menu item "Refresh" is shown.
         */
        refresh?: boolean;
        /**
         * Gets or sets if the menu item "Save As" is shown.
         */
        saveAs?: boolean;
        /**
         * Adds custom menu items to the menu.
         * @example
         * menu: {
         *    items: [
         *       { icon: "icon", title: "title", action: () => { } },
         *    ]
         * }
         */
        items?: MenuItem[];
    };
}

export interface VisualizationOptions {
    /**
     * Gets or sets if the user can maximize a visualization.
     */
    canMaximize?: boolean;
    /**
     * Gets or sets the grouping separator that appears between the category and field name. The default character used is "/" (forward slash).
     */
    categoryGroupingSeparator?: string;
    /**
     * Gets or sets if crosshairs are shown when hovering over a visualization.
     */
    crosshairs?: boolean;
    /**
     * Gets or sets if tooltips are shown when hovering over a visualization.
     */
    hoverTooltips?: boolean;
    /**
     * Gets or sets if the Change Chart Type dropdown is shown.
     */
    changeChartType?: boolean;
    /**
     * Gets or sets if the Statistical Functions dropdown is shown.
     */
    statisticalFunctions?: boolean;
    menu?: {
        /**
         * Gets or sets if the "Copy" menu item is shown.
         */
        copy?: boolean;
        /**
         * Gets or sets if the "Duplicate" menu item is shown.
         */
        duplicate?: boolean;
        /**
         * Adds custom menu items to the menu.
         * @example
         * menu: {
         *    items: [
         *       { icon: "icon", title: "title", action: (visualization) => { } },
         *    ]
         * }
         */
        items?: MenuItem[];
    };
}
