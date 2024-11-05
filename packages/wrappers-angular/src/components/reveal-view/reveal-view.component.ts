import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLoadingArgs, DataPointClickedArgs, DataSourceDialogOpeningArgs, DataSourcesRequestedArgs, defineRevealSdkWrappers, EditModeEnteredArgs, EditModeExitedArgs, EditorClosedArgs, EditorClosingArgs, EditorOpenedArgs, EditorOpeningArgs, FieldsInitializingArgs, ImageExportedArgs, LinkSelectionDialogOpeningArgs, MenuOpeningArgs, RevealViewOptions, RvRevealView, SavingArgs, SeriesColorRequestedArgs, TooltipShowingArgs } from 'reveal-sdk-wrappers';
defineRevealSdkWrappers(RvRevealView);

@Component({
  selector: 'rva-reveal-view',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<rv-reveal-view #viewer 
      [dashboard]='dashboard'
      [options]='options'
      [dataLoading]='dataLoading'
      [dataPointClicked]='dataPointClicked'
      [dataSourceDialogOpening]='dataSourceDialogOpening'
      [dataSourcesRequested]='dataSourcesRequested'
      [dashboardLinkRequested]='dashboardLinkRequested'
      [editModeEntered]='editModeEntered'
      [editModeExited]='editModeExited'
      [editorClosed]='editorClosed'
      [editorClosing]='editorClosing'
      [editorOpened]='editorOpened'
      [editorOpening]='editorOpening'
      [fieldsInitializing]='fieldsInitializing'
      [imageExported]='imageExported'
      [initialized]='initialized'
      [linkSelectionDialogOpening]='linkSelectionDialogOpening'
      [menuOpening]='menuOpening'
      [saving]='saving'
      [seriesColorRequested]='seriesColorRequested'
      [tooltipShowing]='tooltipShowing'
  ></rv-reveal-view>`,
  styleUrl: './reveal-view.component.scss',
})
export class RevealViewComponent {
  @ViewChild('viewer', { static: true }) revealView!: ElementRef;

  @Input() dashboard?: string | unknown;
  @Input() options: RevealViewOptions = {};
  @Input() dataLoading?: (args: DataLoadingArgs) => void;
  @Input() dataPointClicked?: (args: DataPointClickedArgs) => void;
  @Input() dataSourceDialogOpening?: (args: DataSourceDialogOpeningArgs) => void;
  @Input() dataSourcesRequested?: (args: DataSourcesRequestedArgs) => any;
  @Input() dashboardLinkRequested?: (args: any) => string;
  @Input() editModeEntered?: (args: EditModeEnteredArgs) => void;
  @Input() editModeExited?: (args: EditModeExitedArgs) => void;
  @Input() editorClosed?: (args: EditorClosedArgs) => void;
  @Input() editorClosing?: (args: EditorClosingArgs) => void;
  @Input() editorOpened?: (args: EditorOpenedArgs) => void;
  @Input() editorOpening?: (args: EditorOpeningArgs) => void;
  @Input() fieldsInitializing?: (args: FieldsInitializingArgs) => void;
  @Input() imageExported?: (args: ImageExportedArgs) => void;
  @Input() initialized?: () => void;
  @Input() linkSelectionDialogOpening?: (args: LinkSelectionDialogOpeningArgs) => void;
  @Input() menuOpening?: (args: MenuOpeningArgs) => void;
  @Input() saving?: (args: SavingArgs) => void;
  @Input() seriesColorRequested?: (args: SeriesColorRequestedArgs) => string;
  @Input() tooltipShowing?: (args: TooltipShowingArgs) => void;

  public enterEditMode(): void {
    this.revealView.nativeElement.enterEditMode();
  }

  public exitEditMode(applyChanges: boolean = false): void {
    this.revealView.nativeElement.exitEditMode(applyChanges);
  }

  public exportToExcel(): void {
    this.revealView.nativeElement.exportToExcel();
  }

  public exportToImage(showDialog: boolean = true): void | Promise<Element | null> {
    return this.revealView.nativeElement.exportToImage(showDialog);
  }

  public exportToPdf(): void {
    this.revealView.nativeElement.exportToPdf();
  }

  public exportToPowerPoint(): void {
    this.revealView.nativeElement.exportToPowerPoint();
  }

  public refreshData(input?: string | number): void {
    this.revealView.nativeElement.refreshData(input);
  }

  public addVisualization(): void {
    this.revealView.nativeElement.addVisualization();
  }

  public addTextBoxVisualization(): void {
    this.revealView.nativeElement.addTextBoxVisualization();
  }

  public getRVDashboard(): any {
    return this.revealView.nativeElement.getRVDashboard();
  }
}