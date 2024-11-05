import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defineRevealSdkWrappers, RvVisualizationViewer, VisualizationViewerOptions } from 'reveal-sdk-wrappers';
defineRevealSdkWrappers(RvVisualizationViewer);

@Component({
  selector: 'rva-visualization-viewer',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<rv-visualization-viewer #viewer
    [dashboard]="dashboard"
    [options]="options"
    [visualization]="visualization"
  ></rv-visualization-viewer>`,
  styleUrl: './visualization-viewer.component.scss',
})
export class VisualizationViewerComponent {
  @ViewChild('viewer', { static: true }) viewer!: ElementRef;
  @Input() dashboard?: string | unknown;
  @Input() options: VisualizationViewerOptions = {};
  @Input() visualization: string | number = 0;
}
