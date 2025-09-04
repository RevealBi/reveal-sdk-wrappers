import { ChartType } from "../enums";
import { RevealViewOptions } from "./reveal-view-options";

export const RevealViewDefaults: RevealViewOptions = Object.freeze({
    canEdit: true,
    canSave: true,
    dataSources: [],
    saveOnServer: true,
    startInEditMode: false,
    startWithNewVisualization: false,

    header: {
        canAddVisualization: true,
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
        defaultChartType: ChartType.ColumnChart,
        addPostCalculatedFields: true,
        addCalculatedFields: true,
        dataBlending: true,
        editDataSource: false,
        machineLearning: false,
    },
});