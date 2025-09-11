import { property } from "lit/decorators.js";
import { RvDashboardChangedArgs, DashboardLinkRequestedArgs, DataLoadingArgs, DataPointClickedArgs, DataSourceDialogOpeningArgs, DataSourcesRequestedArgs, EditModeEnteredArgs, EditModeExitedArgs, EditorClosedArgs, EditorClosingArgs, EditorOpenedArgs, EditorOpeningArgs, FieldsInitializingArgs, ImageExportedArgs, LinkSelectionDialogOpeningArgs, MenuOpeningArgs, SavingArgs, SeriesColorRequestedArgs, TooltipShowingArgs, UrlLinkRequestedArgs } from "./reveal-view.callback-args";
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
     * Can return a string (dashboard ID/title), Promise<any> (resolving to RVDashboard), or RDashDocument.
     * 
     * @example
     * ```typescript
     * revealView.dashboardLinkRequested = (args: DashboardLinkRequestedArgs) => {
     *   console.log('Dashboard link requested:', args);
     *   return args.dashboardId;
     *   //return $.ig.RVDashboard.loadDashboard(args.dashboardId);
     * }
     * ```
     */
    @property({ type: Function, attribute: false }) dashboardLinkRequested?: (args: DashboardLinkRequestedArgs) => string | Promise<any> | any;


    /**
     * Callback triggered when the underlying RevealView dashboard instance changes.
     * This does not fire when the web component's `dashboard` property changes,
     * but only when the wrapped jQuery RevealView's dashboard instance changes.
     * 
     * @example
     * ```typescript
     * revealView.rvDashboardChanged = (args: RvDashboardChangedArgs) => {
     *   console.log("Underlying RevealView dashboard changed", args);
     * }
     * ```
     */
    @property({ type: Function, attribute: false }) rvDashboardChanged?: (args: RvDashboardChangedArgs) => void;

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

    /**
     * Callback triggered when a URL link is requested.
     * @example
     * ```typescript
     * revealView.urlLinkRequested = (args: UrlLinkRequestedArgs) => {
     *   console.log("urlLinkRequested", args);
     *   return args.url;
     * }
     * ```
     */
    @property({ type: Function, attribute: false }) urlLinkRequested?: (args: UrlLinkRequestedArgs) => string;

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

    protected override async firstUpdated(changedProperties: Map<PropertyKey, unknown>): Promise<void> {
        await this.init(this.dashboard, this.options, changedProperties);
    }

    private async init(dashboard?: string | unknown, options?: RevealViewOptions, changedProperties?: Map<PropertyKey, unknown>): Promise<void> {
        const rvDashboard = await this.loadRVDashboard(dashboard);

        const selector = this.renderRoot.querySelector('#rv-viewer');
        this._revealView = new $.ig.RevealView(selector);
        this._revealView.interactiveFilteringEnabled = true;

        this.updateOptions(options);
        this.initializeEvents();

        // Set up initial dynamic event handlers using the actual changed properties
        if (changedProperties) {
            this.updateIndividualCallbacks(changedProperties);
        }

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
        if (!this._revealView) return;

        this._mergedOptions = merge({}, RevealViewDefaults, options);

        this._revealView.canEdit = this._mergedOptions.canEdit;
        this._revealView.canSave = this._mergedOptions.canSave;
        this._revealView.showSave = this._mergedOptions.canSave;
        this._revealView.serverSideSave = this._mergedOptions.saveOnServer;
        this._revealView.startInEditMode = this._mergedOptions.startInEditMode;
        this._revealView.startWithNewVisualization = this._mergedOptions.startWithNewVisualization;

        //header
        if (typeof this._mergedOptions.header === 'boolean') {
            this._revealView.showHeader = this._mergedOptions.header;
        } else if (this._mergedOptions.header) {
            this._revealView.canAddVisualization = this._mergedOptions.header.canAddVisualization;
            this._revealView.showTitle = this._mergedOptions.header.showTitle;
            this._revealView.showDescription = this._mergedOptions.header.showDescription;

            if (typeof this._mergedOptions.header.menu === 'boolean') {
                this._revealView.showMenu = this._mergedOptions.header.menu;
            } else if (this._mergedOptions.header.menu) {
                this._revealView.showExportToExcel = this._mergedOptions.header.menu.exportToExcel;
                this._revealView.showExportImage = this._mergedOptions.header.menu.exportToImage;
                this._revealView.showExportToPDF = this._mergedOptions.header.menu.exportToPdf;
                this._revealView.showExportToPowerPoint = this._mergedOptions.header.menu.exportToPowerPoint;
                this._revealView.showRefresh = this._mergedOptions.header.menu.refresh;
                this._revealView.canSaveAs = this._mergedOptions.header.menu.saveAs;
            }
        }

        //filters
        this._revealView.showFilters = this._mergedOptions.filters!.showFilters;
        this._revealView.canAddDashboardFilter = this._mergedOptions.filters!.addDashboardFilter;
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
        this.updateMenuOpeningHandler();
        this.updateDataSourcesRequestedHandler();
        this.updateDashboardLinkRequestedHandler();
    }

    private updateIndividualCallbacks(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {

        if (changedProperties.has('dataLoading')) {
            //this event must be set BEFORE the dashboard is set
            this.assignHandler(this.dataLoading, 'onVisualizationDataLoading', (e: any) => e);
        }

        if (changedProperties.has('dataPointClicked')) {
            this.assignHandler(this.dataPointClicked, 'onVisualizationDataPointClicked', (visualization: any, cell: any, row: any) => {
                return { visualization: visualization, cell: cell, row: row };
            });
        }

        if (changedProperties.has('dataSourceDialogOpening')) {
            this.assignHandler(this.dataSourceDialogOpening, 'onDataSourceSelectionDialogShowing', (e: any) => e);
        }

        if (changedProperties.has('rvDashboardChanged')) {
            this.assignHandler(this.rvDashboardChanged, 'onDashboardChanged', (e: any) => e);
        }

        if (changedProperties.has('fieldsInitializing')) {
            this.assignHandler(this.fieldsInitializing, 'onFieldsInitializing', (e: any) => e);
        }

        if (changedProperties.has('tooltipShowing')) {
            this.assignHandler(this.tooltipShowing, 'onTooltipShowing', (e: any) => e);
        }

        if (changedProperties.has('editModeEntered')) {
            this.assignHandler(this.editModeEntered, 'onEditModeEntered', (e: any) => e);
        }

        if (changedProperties.has('editModeExited')) {
            this.assignHandler(this.editModeExited, 'onEditModeExited', (e: any) => e);
        }

        if (changedProperties.has('editorClosed')) {
            this.assignHandler(this.editorClosed, 'onVisualizationEditorClosed', (e: any) => e);
        }

        if (changedProperties.has('editorClosing')) {
            this.assignHandler(this.editorClosing, 'onVisualizationEditorClosing', (e: any) => e);
        }

        if (changedProperties.has('editorOpened')) {
            this.assignHandler(this.editorOpened, 'onVisualizationEditorOpened', (e: any) => e);
        }

        if (changedProperties.has('editorOpening')) {
            this.assignHandler(this.editorOpening, 'onVisualizationEditorOpening', (e: any) => e);
        }

        if (changedProperties.has('imageExported')) {
            this.assignHandler(this.imageExported, 'onImageExported', (e: any) => {
                return { image: e };
            });
        }

        if (changedProperties.has('linkSelectionDialogOpening')) {
            this.assignHandler(this.linkSelectionDialogOpening, 'onDashboardSelectorRequested', (e: any) => e);
        }

        if (changedProperties.has('saving')) {
            this.assignHandler(this.saving, 'onSave', (rv: any, e: any) => e);
        }

        if (changedProperties.has('seriesColorRequested')) {
            if (this.seriesColorRequested !== undefined) {
                this._revealView.onVisualizationSeriesColorAssigning = (visualization: any, defaultColor: any, fieldName: any, categoryName: any) => {
                    return this.seriesColorRequested?.({
                        visualization: visualization,
                        defaultColor: defaultColor,
                        fieldName: fieldName,
                        categoryName: categoryName
                    });
                }
            } else {
                this._revealView.onVisualizationSeriesColorAssigning = undefined;
            }
        }

        if (changedProperties.has('urlLinkRequested')) {
            if (this.urlLinkRequested !== undefined) {
                this._revealView.onUrlLinkRequested = (args: any) => {
                    return this.urlLinkRequested?.(args);
                }
            } else {
                this._revealView.onUrlLinkRequested = undefined;
            }
        }
    }

    private updateMenuOpeningHandler(): void {
        this._revealView.onMenuOpening = (viz: any, e: any) => {
            const createMenuItems = (items: MenuItem[], clickCallback: (item: any) => void) => {
                items.forEach(item => {
                    const icon = item.icon ? new $.ig.RVImage(item.icon) : undefined;
                    e.menuItems.push(new $.ig.RVMenuItem(item.title, icon, () => clickCallback(item)));
                });
            };

            if (viz === null) {
                if (typeof this._mergedOptions.header !== 'boolean' && this._mergedOptions.header && typeof this._mergedOptions.header.menu !== 'boolean' && this._mergedOptions.header.menu && this._mergedOptions.header.menu.items) {
                    const items = this._mergedOptions.header.menu.items;
                    createMenuItems(items, item => item.click());
                }
            } else {
                const vizItems = this._mergedOptions.visualizations!.menu!.items!;
                createMenuItems(vizItems, vizItem => vizItem.click(viz));
            }

            if (this.menuOpening !== undefined) {
                this.menuOpening({ cancel: e.cancel, isInEditMode: e.isInEditMode, menuLocation: e.menuLocation, menuItems: e.menuItems, visualization: viz });
            }
        };
    }

    private updateDataSourcesRequestedHandler(): void {
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
    }

    private updateDashboardLinkRequestedHandler(): void {
        this._revealView.onLinkedDashboardProviderAsync = (dashboardId: string, title: string) => {

            if (this.dashboardLinkRequested !== undefined) {
                const result = this.dashboardLinkRequested({ dashboardId: dashboardId, title: title });

                // Handle string return type
                if (typeof result === 'string') {
                    return $.ig.RVDashboard.loadDashboard(result);
                }

                // Handle Promise<any> return type
                if (result && typeof result.then === 'function') {
                    return result;
                }

                // Use DashboardLoader for consistent handling of RDashDocument and other types
                return DashboardLoader.load(result);
            }

            // Default behavior: load dashboard by ID
            return $.ig.RVDashboard.loadDashboard(dashboardId);
        };
    }

    private assignHandler(eventProperty: Function | undefined, eventListenerName: string, handler: Function) {
        if (!this._revealView) return;

        if (eventProperty !== undefined) {
            this._revealView[eventListenerName] = (...args: any[]) => {
                if (eventProperty) {
                    eventProperty(handler(...args));
                }
            };
        } else {
            this._revealView[eventListenerName] = undefined;
        }
    }

    private onRevealThemeChanged = () => {
        this.refreshTheme();
    };

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
     * Gets the current dashboard filters in the RevealView component.
     * @returns {DashboardFilters | undefined} The current dashboard filters, or undefined if the RevealView component is not initialized.
     */
    getFilters(): DashboardFilters | undefined {
        return this._revealView ? this._revealView.dashboard.filters : undefined;
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

    /**
     * Refreshes the theme of the component.
     * @returns {void}
     */
    refreshTheme(): void {
        this._revealView?.refreshTheme();
    }

    protected override updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        if (!this._revealView) return;

        const dashboardChanged = changedProperties.has("dashboard") && this.dashboard !== undefined;
        const optionsChanged = changedProperties.has("options") && this.options !== undefined;

        if (dashboardChanged) {
            this.updateDashboard(this.dashboard);
        }

        if (optionsChanged) {
            this.updateOptions(this.options);
        }

        this.updateIndividualCallbacks(changedProperties);
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