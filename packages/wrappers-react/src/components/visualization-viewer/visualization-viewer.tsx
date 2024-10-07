import React from 'react';
import { createComponent } from '@lit/react';
import { defineRevealSdkWrappers, RvVisualizationViewer as Component } from 'reveal-sdk-wrappers';
defineRevealSdkWrappers(Component);

export type RvVisualizationViewerRef = InstanceType<typeof Component>;

export const RvVisualizationViewer = createComponent({
  tagName: 'rv-visualization-viewer',
  elementClass: Component,
  react: React,
});