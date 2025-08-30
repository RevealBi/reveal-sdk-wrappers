import { property } from "lit/decorators.js";
import { LitElement, PropertyValueMap, html } from "lit";
import { VisualizationViewerOptions } from "./options/visualization-viewer-options";
import { VisualizationViewerDefaults } from "./options/visualization-viewer-options-defaults";
import styles from "./visualization-viewer.styles";
import { merge } from "../common/utilties/merge";
import { DashboardLoader } from "../common/utilties/dashboard-loader";

declare let $: any;

/**
 * A web component that wraps the jQuery RevealView component and configures it to display a single visualization.
 */
export class RvVisualizationViewer extends LitElement {
    static override styles = styles;
    static readonly tagName = 'rv-visualization-viewer';

    private _revealView: any = null;
    private _mergedOptions: VisualizationViewerOptions = {};

    @property({ type: String }) dashboard: string | unknown = "";
    @property({ type: Object, attribute: false }) options: VisualizationViewerOptions = {};
    @property({ type: String }) visualization: string | number = 0;

    override connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('reveal-theme-changed', this.onRevealThemeChanged);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener('reveal-theme-changed', this.onRevealThemeChanged);

        if (this._revealView) {
            this._revealView = null;
        }
    }

    protected override firstUpdated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this.init(this.dashboard, this.visualization, this.options);
    }

    private async init(dashboard?: string | unknown, visualization?: string | number, options?: VisualizationViewerOptions): Promise<void> {

        const rvDashboard = await this.loadRVDashboard(dashboard);

        const selector = this.renderRoot.querySelector('#rv-viewer');
        this._revealView = new $.ig.RevealView(selector);
        this._revealView.singleVisualizationMode = true;

        this.updateOptions(options);

        this._revealView.dashboard = rvDashboard;

        this.setVisualization(rvDashboard, visualization);

        this._revealView.onMenuOpening = (viz: any, e: any) => {
            if (viz === null) {
                return;
            }
            else {
                if (typeof this._mergedOptions.menu !== 'boolean' && this._mergedOptions.menu && this._mergedOptions.menu.items) {
                    const vizItems = this._mergedOptions.menu.items;
                    vizItems.forEach(vizItem => {
                        e.menuItems.push(new $.ig.RVMenuItem(vizItem.title, vizItem.icon, () => vizItem.click(viz)));
                    })
                }
            }
        }
    }

    private setVisualization(dashboard: any, visualization: string | number | undefined) {
        if (!dashboard || !dashboard.visualizations || dashboard.visualizations.length === 0) {
            this._revealView.maximizedVisualization = null;
            return;
        }

        visualization = visualization !== undefined ? visualization : 0;

        let viz = null;
        if (typeof visualization === "string") {
            //First try to get the visualization by title
            viz = dashboard.visualizations.getByTitle(visualization);

            //If not found by title, try to get it by ID
            if (viz === null) {
                viz = dashboard.visualizations.getById(visualization);
            }

            //if an index was provided in the html attribute, it would be a string, so let's try using it as an index
            if (viz === null) {
                viz = dashboard.visualizations[visualization];
            }
        } else if (typeof visualization === "number") {
            viz = dashboard.visualizations[visualization];
        }

        if (!viz) {
            console.log(`Visualization ${typeof visualization === "string" ? `with ID or title "${visualization}"` : `at index ${visualization}`} is not found. Loading the default vizualization.`);
        }

        this._revealView.maximizedVisualization = viz;
    }

    private async updateDashboard(dashboard: string | unknown, visualization?: string | number): Promise<void> {
        if (!this._revealView) {
            return;
        }
        this._revealView.dashboard = await this.loadRVDashboard(dashboard);
        this.setVisualization(this._revealView.dashboard, visualization);
    }

    private updateOptions(options: VisualizationViewerOptions | undefined) {
        if (!this._revealView) {
            return;
        }

        this._mergedOptions = merge({}, VisualizationViewerDefaults, options);

        if (typeof this._mergedOptions.menu === 'boolean') {
            this._revealView.showMenu = this._mergedOptions.menu;
        } else if (this._mergedOptions.menu) {
            this._revealView.showMenu = true;
            this._revealView.canCopyVisualization = this._mergedOptions.menu.copy;
            this._revealView.canDuplicateVisualization = this._mergedOptions.menu.duplicate;
            this._revealView.showExportToExcel = this._mergedOptions.menu.exportToExcel;
            this._revealView.showExportImage = this._mergedOptions.menu.exportToImage;
            this._revealView.showRefresh = this._mergedOptions.menu.refresh;
        }

        this._revealView.showFilters = this._mergedOptions.showFilters;
        this._revealView.categoryGroupingSeparator = this._mergedOptions.categoryGroupingSeparator;
        this._revealView.crosshairsEnabled = this._mergedOptions.crosshairs;
        this._revealView.hoverTooltipsEnabled = this._mergedOptions.hoverTooltips;
        this._revealView.showChangeVisualization = this._mergedOptions.changeChartType;
        this._revealView.showStatisticalFunctions = this._mergedOptions.statisticalFunctions;
    }

    private updateVisualization(visualization?: string | number) {
        if (!this._revealView) {
            return;
        }
        this.setVisualization(this._revealView.dashboard, visualization);
    }

    private async loadRVDashboard(dashboard?: string | unknown): Promise<any | null> {
        return DashboardLoader.load(dashboard);
    }

    private onRevealThemeChanged = () => {
        this.refreshTheme();
    };

    /**
     * Copies a visualization to the clipboard.
     * If a string ID is provided, the visualization with that ID is copied.
     * If a number index is provided, the visualization at that index is copied.
     * @param {string | number} input The ID or index of the visualization to copy
     * @returns {void}
     */
    copy(): void {
        const widgetId = this._revealView.maximizedVisualization.id;
        if (!widgetId) {
            console.warn("No visualization is currently loaded to copy.");
            return;
        }

        const widgets = this._revealView._dashboardView.__widgets;
        const sourceWidget = widgets.find((widget: any) => widget._widget._id === widgetId);
        if (sourceWidget) {
            this._revealView._dashboardView.widgetCopied(sourceWidget._widget);
        }
    }

    /**
     * Refreshes the theme of the component.
     * @returns {void}
     */
    refreshTheme(): void {
        this._revealView.refreshTheme();
    }

    protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        const dashboardChanged = changedProperties.has("dashboard") && this.dashboard !== undefined;
        const visualizationChanged = changedProperties.has("visualization") && this.visualization !== undefined;
        const optionsChanged = changedProperties.has("options") && this.options !== undefined;

        //the dashboard property can be changed on its own or with the visualization property. if only the visualization property is changed, we don't need to update the dashboard
        if (dashboardChanged) {
            this.updateDashboard(this.dashboard, this.visualization);
        } else if (visualizationChanged) {
            this.updateVisualization(this.visualization);
        }

        if (optionsChanged) {
            this.updateOptions(this.options);
        }
    }

    protected override render(): unknown {
        return html`
            <div id="rv-viewer"></div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'rv-visualization-viewer': RvVisualizationViewer;
    }
}