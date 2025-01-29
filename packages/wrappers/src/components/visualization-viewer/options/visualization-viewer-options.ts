import { MenuItem } from "../../common/interfaces/menu-item";

export interface VisualizationViewerOptions {
    showFilters?: boolean;
    categoryGroupingSeparator?: string;
    crosshairs?: boolean;
    hoverTooltips?: boolean;
    changeChartType?: boolean;
    statisticalFunctions?: boolean;
    menu?: boolean | {
        items?: MenuItem[];
        copy?: boolean;
        duplicate?: boolean;
        exportToExcel?: boolean;
        exportToImage?: boolean;
        refresh?: boolean;
    }
}
