import { property } from "lit/decorators.js";
import { DashboardLinkRequestedArgs, DataLoadingArgs, DataPointClickedArgs, DataSourceDialogOpeningArgs, DataSourcesRequestedArgs, EditModeEnteredArgs, EditModeExitedArgs, EditorClosedArgs, EditorClosingArgs, EditorOpenedArgs, EditorOpeningArgs, FieldsInitializingArgs, ImageExportedArgs, LinkSelectionDialogOpeningArgs, MenuOpeningArgs, SavingArgs, SeriesColorRequestedArgs, TooltipShowingArgs } from "./reveal-view.callback-args";
import styles from "./reveal-view.styles";
import { LitElement, PropertyValueMap, html } from "lit";
import { MenuItem } from "../common";
import { RevealViewOptions } from "./options/reveal-view-options";
import { DashboardFilters } from "./interfaces/dashboard-filters";
import { RevealViewDefaults } from "./options/reveal-view-options-defaults";
import { ChartType } from "./enums";
import { DashboardLoader } from "../common/utilties/dashboard-loader";
import { getRVDataSources } from "../common/utilties/data-source-factory";
import { merge } from "../common/utilties/merge";

declare let $: any;

/**
 * A web component that wraps the jQuery RevealView component.
 */
export class RvRevealView extends LitElement {
    static override styles = styles;
    static readonly tagName = 'rv-reveal-view';

    private _revealView: any = null;
    private _mergedOptions: RevealViewOptions = {};

    /**
     * Gets or sets the dashboard to display in the RevealView component.
     */
    @property({ type: String }) dashboard: string | unknown = "";

    /**
     * Gets or sets the options for the RevealView component.
     */
    @property({ type: Object, attribute: false }) options: RevealViewOptions = {};

    /**
     * Gets the dashboard date filter.
     */
    get dateFilter(): any {
        return this._revealView?.dashboard?.dateFilter;
    }

    /**
     * Gets the dashboard filters.
     */
    get filters(): DashboardFilters {
        return this._revealView?.dashboard?.filters;
    }

    /**
     * Callback triggered when data is loading.
     */
    @property({ type: Function, attribute: false }) dataLoading?: (args: DataLoadingArgs) => void;

    /**
     * Callback triggered when a data point is clicked.
     */
    @property({ type: Function, attribute: false }) dataPointClicked?: (args: DataPointClickedArgs) => void;

    /**
     * Callback triggered when the data source dialog is opening.
     */
    @property({ type: Function, attribute: false }) dataSourceDialogOpening?: (args: DataSourceDialogOpeningArgs) => void;

    /**
     * Callback triggered when data sources are requested.     
     * 
     * @example
     * ```typescript
     * revealView.dataSourcesRequested = (args: DataSourcesRequestedArgs) => {
     *    const restDataSource = new $.ig.RVRESTDataSource();
     *    restDataSource.url = "https://excel2json.io/api/share/6e0f06b3-72d3-4fec-7984-08da43f56bb9";
     *    restDataSource.title = "Sales by Category";
     *    restDataSource.subtitle = "Excel2Json";
     *    restDataSource.useAnonymousAuthentication = true;
     * 
     *    return { dataSources: [restDataSource], dataSourceItems: [] };
     * }
     * ```
     */
    @property({ type: Function, attribute: false }) dataSourcesRequested?: (args: DataSourcesRequestedArgs) => any; //todo: create interface for return type

    /**
     * Callback triggered when a dashboard link is requested.
     */
    @property({ type: Function, attribute: false }) dashboardLinkRequested?: (args: DashboardLinkRequestedArgs) => string;

    /**
     * Callback triggered when edit mode is entered.
     * 
     * @example
     * ```typescript
     * revealView.editModeEntered = (e: EditModeEnteredArgs) => {
     *   console.log("Edit mode entered", e.dashboard);
     * }
     * ```
     */
    @property({ type: Function, attribute: false }) editModeEntered?: (args: EditModeEnteredArgs) => void;

    /**
     * Callback triggered when edit mode is exited.
     * 
     * @example
     * ```typescript
     * revealView.editModeExited = (e: EditModeExitedArgs) => {
     *  console.log("Edit mode exited", e.dashboard);
     * }
     * ```
     */
    @property({ type: Function, attribute: false }) editModeExited?: (args: EditModeExitedArgs) => void;

    /**
     * Callback triggered when the editor is closed.
     */
    @property({ type: Function, attribute: false }) editorClosed?: (args: EditorClosedArgs) => void;

    /**
     * Callback triggered when the editor is closing.
     */
    @property({ type: Function, attribute: false }) editorClosing?: (args: EditorClosingArgs) => void;

    /**
     * Callback triggered when the editor is opened.     
     */
    @property({ type: Function, attribute: false }) editorOpened?: (args: EditorOpenedArgs) => void;

    /**
     * Callback triggered when the editor is opening.
     */
    @property({ type: Function, attribute: false }) editorOpening?: (args: EditorOpeningArgs) => void;

    /**
     * Callback triggered when fields are initializing.
     */
    @property({ type: Function, attribute: false }) fieldsInitializing?: (args: FieldsInitializingArgs) => void;

    /**
     * Callback triggered when an image is exported.
     */
    @property({ type: Function, attribute: false }) imageExported?: (image: ImageExportedArgs) => void;

    /**
     * Callback triggered when the RevealView component is initialized.
     */
    @property({ type: Function, attribute: false }) initialized?: () => void;

    /**
     * Callback triggered when a link selection dialog is opening.
     */
    @property({ type: Function, attribute: false }) linkSelectionDialogOpening?: (args: LinkSelectionDialogOpeningArgs) => void;

    /**
     * Callback triggered when a menu is opening.
     */
    @property({ type: Function, attribute: false }) menuOpening?: (args: MenuOpeningArgs) => void;

    /**
     * Callback triggered when a dashboard is saving.
     */
    @property({ type: Function, attribute: false }) saving?: (args: SavingArgs) => void;

    /**
     * Callback triggered when a series color is requested.
     */
    @property({ type: Function, attribute: false }) seriesColorRequested?: (args: SeriesColorRequestedArgs) => string;

    /**
     * Callback triggered when a tooltip is showing.
     */
    @property({ type: Function, attribute: false }) tooltipShowing?: (args: TooltipShowingArgs) => void;

    protected override firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
        this.init(this.dashboard, this.options);
    }

    private async init(dashboard?: string | unknown, options?: RevealViewOptions): Promise<void> {
        const rvDashboard = await this.loadRVDashboard(dashboard);

        const selector = this.renderRoot.querySelector('#rv-viewer');
        this._revealView = new $.ig.RevealView(selector);
        this._revealView.interactiveFilteringEnabled = true;

        //this event must be set BEFORE the dashboard is set
        this.assignHandler(this.dataLoading, 'onVisualizationDataLoading', (e: any) => e);

        this.updateOptions(options);
        this.initializeEvents();

        //todo: there is a bug in the Reveal SDK where the saved event args.isNew is always false if the dashboard property is set to null or undefined
        if (dashboard) {
            this._revealView.dashboard = rvDashboard;
        }

        // After the dashboard has been initialized and set, invoke the onInitialized event if it is defined.
        if (this.initialized) {
            this.initialized();
        }
    }

    private loadRVDashboard(dashboard?: string | unknown): Promise<unknown> {
        return DashboardLoader.load(dashboard);
    }

    private updateOptions(options: RevealViewOptions | undefined) {

        if (!this._revealView) {
            return;
        }

        this._mergedOptions = merge({}, RevealViewDefaults, options);

        this._revealView.canEdit = this._mergedOptions.canEdit;
        this._revealView.canSave = this._mergedOptions.canSave;
        this._revealView.canSaveAs = this._mergedOptions.canSaveAs;
        this._revealView.serverSideSave = this._mergedOptions.saveOnServer;
        this._revealView.startInEditMode = this._mergedOptions.startInEditMode;
        this._revealView.startWithNewVisualization = this._mergedOptions.startWithNewVisualization;

        //header
        this._revealView.showHeader = this._mergedOptions.header!.showHeader;
        this._revealView.canAddVisualization = this._mergedOptions.header!.canAddVisualization;
        this._revealView.showMenu = this._mergedOptions.header!.menu!.showMenu;
        this._revealView.showExportToExcel = this._mergedOptions.header!.menu!.exportToExcel;
        this._revealView.showExportImage = this._mergedOptions.header!.menu!.exportToImage;
        this._revealView.showExportToPDF = this._mergedOptions.header!.menu!.exportToPdf;
        this._revealView.showExportToPowerPoint = this._mergedOptions.header!.menu!.exportToPowerPoint;
        this._revealView.showRefresh = this._mergedOptions.header!.menu!.refresh;

        //filters
        this._revealView.showFilters = this._mergedOptions.filters!.showFilters;
        this._revealView.canAddDashboardFiter = this._mergedOptions.filters!.addDashboardFiter;
        this._revealView.canAddDateFilter = this._mergedOptions.filters!.addDateFilter;
        this._revealView.interactiveFilteringEnabled = this._mergedOptions.filters!.interactiveFiltering;

        //visualizations
        this._revealView.canMaximizeVisualization = this._mergedOptions.visualizations!.canMaximize;
        this._revealView.categoryGroupingSeparator = this._mergedOptions.visualizations!.categoryGroupingSeparator;
        this._revealView.crosshairsEnabled = this._mergedOptions.visualizations!.crosshairs;
        this._revealView.hoverTooltipsEnabled = this._mergedOptions.visualizations!.hoverTooltips;
        this._revealView.showChangeVisualization = this._mergedOptions.visualizations!.changeChartType;
        this._revealView.showStatisticalFunctions = this._mergedOptions.visualizations!.statisticalFunctions;
        this._revealView.canCopyVisualization = this._mergedOptions.visualizations!.menu!.copy;
        this._revealView.canDuplicateVisualization = this._mergedOptions.visualizations!.menu!.duplicate;

        //dataSourceDialog
        this._revealView.showDataSourceSelectionDialogSearch = this._mergedOptions.dataSourceDialog!.showSearch;

        //editor
        if (this._mergedOptions.editor!.chartTypes) {
            this._revealView.chartTypes = this._mergedOptions.editor!.chartTypes(this._revealView.chartTypes);
        }

        if (this._mergedOptions.editor!.chartTypesToRemove) {
            this._revealView.chartTypes = this._revealView.chartTypes.filter((x: any) => !this._mergedOptions.editor!.chartTypesToRemove!.includes(x.chartType));
        }

        if (this._mergedOptions.editor!.chartTypesToAdd) {
            this._revealView.chartTypes.push(...this._mergedOptions.editor!.chartTypesToAdd);
        }

        if (typeof this._mergedOptions.editor!.defaultChartType === "string") {
            const isValidChartType = Object.values(ChartType).includes(this._mergedOptions.editor!.defaultChartType as ChartType);
            this._revealView.defaultChartType = isValidChartType ? this._mergedOptions.editor!.defaultChartType : undefined;
            this._revealView.defaultCustomChartType = !isValidChartType ? this._mergedOptions.editor!.defaultChartType : undefined;
        }
        else {
            this._revealView.defaultChartType = this._mergedOptions.editor!.defaultChartType;
        }

        this._revealView.canAddCalculatedFields = this._mergedOptions.editor!.addCalculatedFields;
        this._revealView.canAddPostCalculatedFields = this._mergedOptions.editor!.addPostCalculatedFields;
        this._revealView.showDataBlending = this._mergedOptions.editor!.dataBlending;
        this._revealView.showEditDataSource = this._mergedOptions.editor!.editDataSource;
        this._revealView.showMachineLearningModelsIntegration = this._mergedOptions.editor!.machineLearning;
    }

    private async updateDashboard(dashboard: string | unknown): Promise<void> {
        if (!this._revealView) {
            return;
        }
        this._revealView.dashboard = await this.loadRVDashboard(dashboard);
    }

    private initializeEvents() {

        this.assignHandler(this.dataPointClicked, 'onVisualizationDataPointClicked', (visualization: any, cell: any, row: any) => {
            return { visualization: visualization, cell: cell, row: row };
        });
        this.assignHandler(this.dataSourceDialogOpening, 'onDataSourceSelectionDialogShowing', (e: any) => e);
        this.assignHandler(this.fieldsInitializing, 'onFieldsInitializing', (e: any) => e);
        this.assignHandler(this.tooltipShowing, 'onTooltipShowing', (e: any) => e);
        this.assignHandler(this.editModeEntered, 'onEditModeEntered', (e: any) => e);
        this.assignHandler(this.editModeExited, 'onEditModeExited', (e: any) => e);
        this.assignHandler(this.editorClosed, 'onVisualizationEditorClosed', (e: any) => e);
        this.assignHandler(this.editorClosing, 'onVisualizationEditorClosing', (e: any) => e);
        this.assignHandler(this.editorOpened, 'onVisualizationEditorOpened', (e: any) => e);
        this.assignHandler(this.editorOpening, 'onVisualizationEditorOpening', (e: any) => e);
        this.assignHandler(this.imageExported, 'onImageExported', (e: any) => {
            return { image: e };
        });
        this.assignHandler(this.linkSelectionDialogOpening, 'onDashboardSelectorRequested', (e: any) => e);
        this.assignHandler(this.saving, 'onSave', (rv: any, e: any) => e);

        if (this.seriesColorRequested !== undefined) {
            this._revealView.onVisualizationSeriesColorAssigning = (visualization: any, defaultColor: any, fieldName: any, categoryName: any) => {
                return this.seriesColorRequested?.({
                    visualization: visualization,
                    defaultColor: defaultColor,
                    fieldName: fieldName,
                    categoryName: categoryName
                });
            }
        }

        this._revealView.onMenuOpening = (viz: any, e: any) => {
            const createMenuItems = (items: MenuItem[], clickCallback: (item: any) => void) => {
                items.forEach(item => {
                    const icon = item.icon ? new $.ig.RVImage(item.icon) : undefined;
                    e.menuItems.push(new $.ig.RVMenuItem(item.title, icon, () => clickCallback(item)));
                });
            };

            if (viz === null) {
                const items = this._mergedOptions.header!.menu!.items!;
                createMenuItems(items, item => item.click());
            } else {
                const vizItems = this._mergedOptions.visualizations!.menu!.items!;
                createMenuItems(vizItems, vizItem => vizItem.click(viz));
            }

            this.assignHandler(this.menuOpening, 'onMenuOpening', (visualization: any, e: any) => {
                return { cancel: e.cancel, isInEditMode: e.isInEditMode, menuLocation: e.menuLocation, menuItems: e.menuItems, visualization: visualization };
            });
        };

        this._revealView.onDataSourcesRequested = (onComplete: any, trigger: any) => {
            //get the data source from the options first
            const { dataSources, dataSourceItems } = getRVDataSources(this._mergedOptions.dataSources);
            //if a custom data source handler is provided, add the data sources from it
            if (this.dataSourcesRequested !== undefined) {
                const result = this.dataSourcesRequested({ trigger: trigger });
                dataSources.push(...result.dataSources);
                dataSourceItems.push(...result.dataSourceItems);
            }
            onComplete(new $.ig.RevealDataSources(dataSources, dataSourceItems, this._mergedOptions.dataSourceDialog!.showExistingDataSources));
        };

        this._revealView.onLinkedDashboardProviderAsync = (dashboardId: string, title: string) => {
            let dashbordLink = dashboardId;
            if (this.dashboardLinkRequested !== undefined) {
                dashbordLink = this.dashboardLinkRequested({ dashboardId: dashboardId, title: title });
            }
            return $.ig.RVDashboard.loadDashboard(dashbordLink);
        };
    }

    private assignHandler(eventProperty: Function | undefined, eventListenerName: string, handler: Function) {
        if (eventProperty !== undefined) {
            this._revealView[eventListenerName] = (...args: any[]) => {
                if (eventProperty) {
                    eventProperty(handler(...args));
                }
            };
        }
    }

    /**
     * Adds a textbox visualization to the dashboard.
     * @returns {void}
     */
    addTextBoxVisualization(): void {
        this._revealView.enterEditMode(); //enter edit mode so that we can save the newly added textbox
        $.ig.RPEditorTextVisualization.prototype.show(this._revealView._dashboardView, null, this._revealView._dashboardView.theme(), ((e: any) => {
            this._revealView._dashboardView.addWidget(e)
        }));
    }

    /**
     * Adds a visualization to the dashboard.
     * @returns {void}
     */
    addVisualization(): void {
        this._revealView._dashboardView._delegate.addWidgetTriggered();
    }

    /**
     * Copies a visualization to the clipboard.
     * If a string ID is provided, the visualization with that ID is copied.
     * If a number index is provided, the visualization at that index is copied.
     * @param {string | number} input The ID or index of the visualization to copy
     * @returns {void}
     */
    copy(input: string | number): void {
        const widgets = this._revealView._dashboardView.__widgets;
        const sourceWidget = typeof input === "string" ? widgets.find((widget: any) => widget._widget._id === input) : widgets[input];
        if (sourceWidget) {
            this._revealView._dashboardView.widgetCopied(sourceWidget._widget);
        }
    }

    /**
     * Places the component in edit mode.
     * @returns {void}
     */
    enterEditMode(): void {
        this._revealView.enterEditMode();
    }

    /**
     * Exits edit mode.
     * @param {boolean} applyChanges If true, the changes made in edit mode will be applied. If false, the changes will be discarded.
     * @returns {void}
     */
    exitEditMode(applyChanges: boolean): void {
        this._revealView.exitEditMode(applyChanges);
    }

    /**
     * Export the dashboard to Excel.
     * @returns {void}
     */
    exportToExcel(): void {
        this._revealView._dashboardView.exportToExcel();
    }

    /**
     * Export the dashboard to an image.
     * @param {boolean} showDialog If true, the export dialog will be shown. If false, the image will be exported directly.
     * @returns {void | Promise<Element | null>} A promise that resolves to the exported image element or null.
     */
    exportToImage(showDialog: boolean = true): void | Promise<Element | null> {

        if (showDialog) {
            this._revealView._dashboardView.exportImage();
            return;
        }

        return this._revealView.toImage();
    }

    /**
     * Export the dashboard to PDF.
     * @returns {void}
     */
    exportToPdf(): void {
        this._revealView._dashboardView.exportToFormat("pdf");
    }

    /**
     * Export the dashboard to PowerPoint.
     * @returns {void}
     */
    exportToPowerPoint(): void {
        this._revealView._dashboardView.exportToFormat("pptx");
    }

    /**
     * Gets the RVDashboard instance from the underlying RevealView object.
     * @returns {RVDashboard} The RVDashboard instance.
     */
    getRVDashboard(): any {
        return this._revealView ? this._revealView.dashboard : null;
    }

    /**
     * Pastes a visualization from the clipboard.
     * If a target RevealView component is provided, the visualization is pasted to that component.
     * @param {RvRevealView} target The target RevealView component to paste the visualization to.
     * @returns {void}
     */
    paste(target?: RvRevealView): void {
        target?.paste() ?? this._revealView._dashboardView.pasteWidget();
    }

    /**
     * Refreshes the data in the dashboard.
     * If no parameter is provided, the entire dashboard is refreshed.
     * If a string ID is provided, the visualization with that ID is refreshed.
     * If a number index is provided, the visualization at that index is refreshed.
     * @param {string | number} input The ID or index of the visualization to refresh, or nothing to refresh the entire dashboard.
     * @returns {void}
     */
    refreshData(input?: string | number): void {
        if (typeof input === "string") {
            this._revealView._dashboardView.refreshWidget(input);
        } else if (typeof input === "number") {
            this._revealView._dashboardView.refreshWidget(this._revealView.dashboard.visualizations[input].id);
        } else {
            this._revealView.refreshDashboardData();
        }
    }

    protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        const dashboardChanged = changedProperties.has("dashboard") && this.dashboard !== undefined;
        const optionsChanged = changedProperties.has("options") && this.options !== undefined;

        if (dashboardChanged) {
            this.updateDashboard(this.dashboard);
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
        'rv-reveal-view': RvRevealView;
    }
}