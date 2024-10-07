import { VisualizationViewerOptions } from "./visualization-viewer-options";

export const VisualizationViewerDefaults: VisualizationViewerOptions = Object.freeze({
    categoryGroupingSeparator: " - ",
    crosshairs: false,
    hoverTooltips: true,
    showFilters: false,
    changeChartType: false,
    statisticalFunctions: false,
    menu: {
        items: [],
        copy: true,
        duplicate: true,
        exportToExcel: true,
        exportToImage: true,
        showMenu: false,
        refresh: true,
    }
});