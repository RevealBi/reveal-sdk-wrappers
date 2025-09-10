import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { defineRevealSdkWrappers, RvVisualizationViewer as WebComponent, VisualizationViewerOptions } from 'reveal-sdk-wrappers';

// Ensure the web component is defined
defineRevealSdkWrappers(WebComponent);

export interface RvVisualizationViewerProps extends React.HTMLAttributes<HTMLElement> {
  dashboard?: string | unknown;
  visualization?: string | number;
  options?: VisualizationViewerOptions;
}

export interface RvVisualizationViewerRef {
  // Methods
  copy(): void;
  refreshTheme(): void;
}

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'rv-visualization-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<WebComponent>;
      };
    }
  }
}

export const RvVisualizationViewer = forwardRef<RvVisualizationViewerRef, RvVisualizationViewerProps>((props, ref) => {
  const { dashboard, visualization, options, ...htmlProps } = props;
  const elementRef = useRef<WebComponent>(null);

  // Update properties when they change
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set all properties on the web component
    if (dashboard !== undefined) {
      element.dashboard = dashboard;
    }

    if (visualization !== undefined) {
      element.visualization = visualization;
    }

    if (options !== undefined) {
      element.options = options;
    }
  }, [dashboard, visualization, options]);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    // Methods
    copy: () => {
      elementRef.current?.copy();
    },

    refreshTheme: () => {
      elementRef.current?.refreshTheme();
    }
  }), []);

  return <rv-visualization-viewer ref={elementRef} {...htmlProps} />;
});

RvVisualizationViewer.displayName = 'RvVisualizationViewer';