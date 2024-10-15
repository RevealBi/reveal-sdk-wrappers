import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { doc } from 'prettier';
import './index';

// This default export determines where your story goes in the story list
const meta: Meta = {
    title: 'Visualization Viewer',
    component: 'rv-visualization-viewer',
};

export default meta;
type Story = StoryObj;

export const FirstStory: Story = {
    name: 'Default',
    args: {
        dashboard: 'Sales',
    },
    argTypes: {
        dashboard: { 
            options: [ 'Sales', 'Marketing', 'Campaigns' ],
            control: 'select' 
        },
    },
    render: (args: any) => html`
    <rv-visualization-viewer .dashboard=${args.dashboard}></rv-visualization-viewer>
    `,
};

export const SecondStory: Story = {
    name: 'Visualization by Title',
    args: {
        visualization: 'Leads by Year'
    },
    argTypes: {
        visualization: { 
            options: [ 'Leads by Year', 'Revenue by State', 'New Seats Avg by Employee', 'Sales by Product' ],
            control: 'select' 
        },
    },
    render: (args: any) => html`
    <rv-visualization-viewer dashboard="Sales" .visualization=${args.visualization}></rv-visualization-viewer>
    `,
};

export const ThirdStory: Story = {
    name: 'Visualization by Index',
    args: {
        visualization: '3'
    },
    argTypes: {
        visualization: { 
            options: [ '0', '1', '2', '3', '4', '5'],
            control: 'select' 
        },
    },
    render: (args: any) => html`
    <rv-visualization-viewer dashboard="Sales" .visualization=${args.visualization}></rv-visualization-viewer>
    `,
};