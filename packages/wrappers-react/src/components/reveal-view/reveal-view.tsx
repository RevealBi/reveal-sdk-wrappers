import React from 'react';
import { createComponent } from '@lit/react';
import { defineRevealSdkWrappers, RvRevealView as Component } from 'reveal-sdk-wrappers';
defineRevealSdkWrappers(Component);

export type RvRevealViewRef = InstanceType<typeof Component>;

export const RvRevealView = createComponent({
  tagName: 'rv-reveal-view',
  elementClass: Component,
  react: React,
});