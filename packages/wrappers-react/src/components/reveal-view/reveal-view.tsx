import React, { useRef, useEffect, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { defineRevealSdkWrappers, RvRevealView as WebComponent, RevealViewOptions, DashboardLinkRequestedArgs, DataLoadingArgs, DataPointClickedArgs, DataSourceDialogOpeningArgs, DataSourcesRequestedArgs, EditModeEnteredArgs, EditModeExitedArgs, EditorClosedArgs, EditorClosingArgs, EditorOpenedArgs, EditorOpeningArgs, FieldsInitializingArgs, ImageExportedArgs, LinkSelectionDialogOpeningArgs, MenuOpeningArgs, SavingArgs, SeriesColorRequestedArgs, TooltipShowingArgs, UrlLinkRequestedArgs, DashboardFilters } from 'reveal-sdk-wrappers';

// Ensure the web component is defined
defineRevealSdkWrappers(WebComponent);

export interface RvRevealViewProps extends React.HTMLAttributes<HTMLElement> {
  dashboard?: string | unknown;
  options?: RevealViewOptions;
  dataLoading?: (args: DataLoadingArgs) => void;
  dataPointClicked?: (args: DataPointClickedArgs) => void;
  dataSourceDialogOpening?: (args: DataSourceDialogOpeningArgs) => void;
  dataSourcesRequested?: (args: DataSourcesRequestedArgs) => any;
  dashboardLinkRequested?: (args: DashboardLinkRequestedArgs) => string | Promise<any> | any;
  editModeEntered?: (args: EditModeEnteredArgs) => void;
  editModeExited?: (args: EditModeExitedArgs) => void;
  editorClosed?: (args: EditorClosedArgs) => void;
  editorClosing?: (args: EditorClosingArgs) => void;
  editorOpened?: (args: EditorOpenedArgs) => void;
  editorOpening?: (args: EditorOpeningArgs) => void;
  fieldsInitializing?: (args: FieldsInitializingArgs) => void;
  imageExported?: (args: ImageExportedArgs) => void;
  initialized?: () => void;
  linkSelectionDialogOpening?: (args: LinkSelectionDialogOpeningArgs) => void;
  menuOpening?: (args: MenuOpeningArgs) => void;
  saving?: (args: SavingArgs) => void;
  seriesColorRequested?: (args: SeriesColorRequestedArgs) => string;
  tooltipShowing?: (args: TooltipShowingArgs) => void;
  urlLinkRequested?: (args: UrlLinkRequestedArgs) => string;
}

export interface RvRevealViewRef {
  // Methods
  addTextBoxVisualization(): void;
  addVisualization(): void;
  copy(input: string | number): void;
  enterEditMode(): void;
  exitEditMode(applyChanges?: boolean): void;
  exportToExcel(): void;
  exportToImage(showDialog?: boolean): void | Promise<Element | null>;
  exportToPdf(): void;
  exportToPowerPoint(): void;
  getFilters(): DashboardFilters | undefined;
  getRVDashboard(): any;
  paste(target?: WebComponent): void;
  refreshData(input?: string | number): void;
  refreshTheme(): void;
}

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'rv-reveal-view': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<WebComponent>;
      };
    }
  }
}

export const RvRevealView = forwardRef<RvRevealViewRef, RvRevealViewProps>((props, ref) => {
  const { 
    dashboard,
    options,
    dataLoading,
    dataPointClicked,
    dataSourceDialogOpening,
    dataSourcesRequested,
    dashboardLinkRequested,
    editModeEntered,
    editModeExited,
    editorClosed,
    editorClosing,
    editorOpened,
    editorOpening,
    fieldsInitializing,
    imageExported,
    initialized,
    linkSelectionDialogOpening,
    menuOpening,
    saving,
    seriesColorRequested,
    tooltipShowing,
    urlLinkRequested,
    ...htmlProps 
  } = props;
  
  const elementRef = useRef<WebComponent>(null);

  // CRITICAL: Use useLayoutEffect for initialized callback to fix timing issue
  // This runs synchronously BEFORE the web component initializes
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (element && initialized !== undefined) {
      element.initialized = initialized;
    }
  }, [initialized]);

  // Effect for core properties (dashboard, options) - these change frequently
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (dashboard !== undefined) {
      element.dashboard = dashboard;
    }

    if (options !== undefined) {
      element.options = options;
    }
  }, [dashboard, options]);

  // Effect for callback properties - these rarely change
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (dataLoading !== undefined) {
      element.dataLoading = dataLoading;
    }

    if (dataPointClicked !== undefined) {
      element.dataPointClicked = dataPointClicked;
    }

    if (dataSourceDialogOpening !== undefined) {
      element.dataSourceDialogOpening = dataSourceDialogOpening;
    }

    if (dataSourcesRequested !== undefined) {
      element.dataSourcesRequested = dataSourcesRequested;
    }

    if (dashboardLinkRequested !== undefined) {
      element.dashboardLinkRequested = dashboardLinkRequested;
    }

    if (editModeEntered !== undefined) {
      element.editModeEntered = editModeEntered;
    }

    if (editModeExited !== undefined) {
      element.editModeExited = editModeExited;
    }

    if (editorClosed !== undefined) {
      element.editorClosed = editorClosed;
    }

    if (editorClosing !== undefined) {
      element.editorClosing = editorClosing;
    }

    if (editorOpened !== undefined) {
      element.editorOpened = editorOpened;
    }

    if (editorOpening !== undefined) {
      element.editorOpening = editorOpening;
    }

    if (fieldsInitializing !== undefined) {
      element.fieldsInitializing = fieldsInitializing;
    }

    if (imageExported !== undefined) {
      element.imageExported = imageExported;
    }

    if (linkSelectionDialogOpening !== undefined) {
      element.linkSelectionDialogOpening = linkSelectionDialogOpening;
    }

    if (menuOpening !== undefined) {
      element.menuOpening = menuOpening;
    }

    if (saving !== undefined) {
      element.saving = saving;
    }

    if (seriesColorRequested !== undefined) {
      element.seriesColorRequested = seriesColorRequested;
    }

    if (tooltipShowing !== undefined) {
      element.tooltipShowing = tooltipShowing;
    }

    if (urlLinkRequested !== undefined) {
      element.urlLinkRequested = urlLinkRequested;
    }
  }, [
    dataLoading,
    dataPointClicked,
    dataSourceDialogOpening,
    dataSourcesRequested,
    dashboardLinkRequested,
    editModeEntered,
    editModeExited,
    editorClosed,
    editorClosing,
    editorOpened,
    editorOpening,
    fieldsInitializing,
    imageExported,
    linkSelectionDialogOpening,
    menuOpening,
    saving,
    seriesColorRequested,
    tooltipShowing,
    urlLinkRequested
  ]);

  // Expose methods and getters through ref
  useImperativeHandle(ref, () => ({
    // Methods
    addTextBoxVisualization: () => {
      elementRef.current?.addTextBoxVisualization();
    },

    addVisualization: () => {
      elementRef.current?.addVisualization();
    },

    copy: (input: string | number) => {
      elementRef.current?.copy(input);
    },

    enterEditMode: () => {
      elementRef.current?.enterEditMode();
    },

    exitEditMode: (applyChanges: boolean = false) => {
      elementRef.current?.exitEditMode(applyChanges);
    },

    exportToExcel: () => {
      elementRef.current?.exportToExcel();
    },

    exportToImage: (showDialog: boolean = true) => {
      return elementRef.current?.exportToImage(showDialog);
    },

    exportToPdf: () => {
      elementRef.current?.exportToPdf();
    },

    exportToPowerPoint: () => {
      elementRef.current?.exportToPowerPoint();
    },

    getFilters: () => {
      return elementRef.current?.getFilters();
    },

    getRVDashboard: () => {
      return elementRef.current?.getRVDashboard();
    },

    paste: (target?: WebComponent) => {
      elementRef.current?.paste(target);
    },

    refreshData: (input?: string | number) => {
      elementRef.current?.refreshData(input);
    },

    refreshTheme: () => {
      elementRef.current?.refreshTheme();
    }
  }), []);

  return <rv-reveal-view ref={elementRef} {...htmlProps} />;
});

RvRevealView.displayName = 'RvRevealView';