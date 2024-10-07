export interface DashboardLinkRequestedArgs {
    readonly dashboardId: string;
    readonly title: string;
}

export interface DataLoadingArgs {
    cancel: boolean;
    errorMessage: string;
    readonly visualization: any;
}

export interface DataPointClickedArgs {
    readonly visualization: any;
    readonly cell: any;
    readonly  row: any;
}

export interface DataSourceDialogOpeningArgs {
    /**
     * set to true to show custom dialog
     */
    cancel: boolean;
    /**
     * the callback to use when the selection is ready, can only be used if the event is cancelled.
     */
    readonly callback: any;
    /**
     * list of data sources returned by onDataSourcesRequested
     */
    readonly dataSources: any;
    /**
     * indicates the context where the data sources are being requested
     */
    readonly trigger: string;
}

export interface DataSourcesRequestedArgs {
    trigger: string;
}

export interface EditModeEnteredArgs {
    readonly dashboard: any;
}

export interface EditModeExitedArgs {
    readonly dashboard: any;
}

export interface EditorClosedArgs {
    readonly isCancelled: boolean;
    readonly isNewVisualization: boolean;
    readonly visualization: any;
}

export interface EditorClosingArgs {
    cancel: boolean;
    readonly isNewVisualization: boolean;
    resetVisualization: boolean;
    readonly visualization: any;
}

export interface EditorOpenedArgs {
    readonly isNewVisualization: boolean;
    readonly visualization: any;
}

export interface EditorOpeningArgs {
    cancel: boolean;
    readonly isNewVisualization: boolean;
    readonly visualization: any;
}

export interface FieldsInitializingArgs {
    readonly dataSourceItem: any;
    fields: any[];
    useCustomSort: boolean;
}

export interface ImageExportedArgs {
    readonly image: Element;
}

export interface LinkSelectionDialogOpeningArgs {
    /**
     *  The callback to be called when the dialog is closed.
     * @param dashboardId The id of the dashboard that was selected.
     */
    readonly callback: (dashboardId: string) => void;
}

export interface MenuOpeningArgs {
    cancel: boolean;
    readonly isInEditMode: boolean;
    menuItems: any[];
    readonly menuLocation: any;
    readonly visualization: any;
}

export interface SavingArgs {
    dashboardId: string;
    name: string;
    readonly isNew: boolean;
    readonly saveAs: boolean;
    saveFinished: () => void;
    serialize: (callback: (result: any) => void, errorCallback: (error: any) => void) => void;
    serializeWithNewName: (newName: string, callback: (result: any) => void, errorCallback: (error: any) => void) => void;
}

export interface SeriesColorRequestedArgs {
    readonly visualization: any;
    readonly defaultColor: string;
    readonly fieldName: string;
    readonly categoryName: string;
}

export interface TooltipShowingArgs {
    cancel: boolean;
    readonly cell: any;
    readonly row: any;
    readonly visualization: any;
}