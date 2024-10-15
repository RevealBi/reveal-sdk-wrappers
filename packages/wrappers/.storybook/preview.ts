import type { Preview } from '@storybook/web-components';
import { defineRevealSdkWrappers } from 'reveal-sdk-wrappers';

defineRevealSdkWrappers();

const preview: Preview = {
    parameters: {},
};
  
export default preview;