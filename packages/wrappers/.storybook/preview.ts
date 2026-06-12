import type { Preview } from '@storybook/web-components';
import { defineRevealSdkWrappers } from 'reveal-sdk-wrappers';
import { RevealSdkSettings } from 'reveal-sdk';

defineRevealSdkWrappers();
RevealSdkSettings.setBaseUrl('https://samples.revealbi.io/upmedia-backend/reveal-api/');

const preview: Preview = {
    parameters: {},
};
  
export default preview;