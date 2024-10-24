import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourcesRequestedArgs, defineRevealSdkWrappers, RevealViewOptions, RvRevealView } from 'reveal-sdk-wrappers';
defineRevealSdkWrappers(RvRevealView);

@Component({
  selector: 'ng-reveal-view',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<rv-reveal-view #viewer [dashboard]='dashboard' [options]='options' [dataSourcesRequested]='dataSourcesRequested'></rv-reveal-view>`,
  styleUrl: './reveal-view.component.scss',
})
export class RevealViewComponent {
  @ViewChild('viewer', { static: true }) revealView!: ElementRef;

  /**
   * Gets or sets the dashboard to display in the RevealView component.
   */
  @Input() dashboard?: string | unknown;

  /**
   * Gets or sets the options for the RevealView component.
   */
  @Input() options?: RevealViewOptions;

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
  @Input() dataSourcesRequested?: (args: DataSourcesRequestedArgs) => any;

  /**
   * Places the component in edit mode.
   * @returns {void}
   */
  public enterEditMode(): void {
    this.revealView.nativeElement.enterEditMode();
  }
  
}
