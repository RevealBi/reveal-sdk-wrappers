import { RevealViewOptions } from "./reveal-view-options";
import { RVChartTypeItem, RVChartType} from "reveal-sdk";

export const RevealViewDefaults: RevealViewOptions = Object.freeze({
    canEdit: true,
    canSave: true,
    canCancel: true,
    dataSources: [],
    saveOnServer: true,
    startInEditMode: false,
    startWithNewVisualization: false,

    header: {
        canAddVisualization: true,
        showTitle: true,
        showDescription: true,
        menu: {
            exportToExcel: true,
            exportToImage: true,
            exportToPdf: true,
            exportToPowerPoint: true,
            refresh: true,
            saveAs: true,
            items: [],
        },
    },

    filters: {
        addDashboardFilter: true,
        addDateFilter: true,
        interactiveFiltering: true,
        showFilters: true,
    },

    dataSourceDialog: {
        showExistingDataSources: false,
        showSearch: false,        
    },

    visualizations: {
        canMaximize: true,
        categoryGroupingSeparator: " - ",
        crosshairs: false,
        hoverTooltips: true,
        changeChartType: true,
        statisticalFunctions: true,
        menu: {
            copy: true,
            duplicate: true,
            items: []
        }
    },

    editor: {
        chartTypes: (chartTypes: RVChartTypeItem[]) => chartTypes,
        chartTypesToRemove: [], 
        chartTypesToAdd: [], 
        defaultChartType: RVChartType.ColumnChart,
        addPostCalculatedFields: true,
        addCalculatedFields: true,
        dataBlending: true,
        editDataSource: false,
        machineLearning: false,
    },
});