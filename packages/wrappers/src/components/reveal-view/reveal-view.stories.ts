import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { doc } from 'prettier';
import { RevealViewDefaults } from './options/reveal-view-options-defaults';
import './index';
import { RvRevealView } from './index';

// This default export determines where your story goes in the story list
const meta: Meta = {
    title: 'Reveal View',
    component: 'rv-reveal-view',
    args: {
        dashboard: 'Sales',
    },
    argTypes: {
        dashboard: { 
            options: [ 'Sales', 'Marketing', 'Campaigns' ],
            control: 'select' 
        },
    },
};

export default meta;
type Story = StoryObj;

export const DefaultStory: Story = {
    name: 'Default',
    render: (args: any) => html`
    <rv-reveal-view .dashboard=${args.dashboard}></rv-reveal-view>
    `,
};

export const ExportStory: Story = {
    name: 'Export',
    render: (args: any) => html`
    <div style="height: 100%">
        <div>
            <button onclick="revealView.exportToImage()">Export Image</button>    
            <button onclick="revealView.exportToExcel()">Export Excel</button>
            <button onclick="revealView.exportToPdf()">Export PDF</button>
            <button onclick="revealView.exportToPowerPoint()">Export PPT</button>            
        </div>
        <rv-reveal-view id="revealView" dashboard="Sales"></rv-reveal-view>
    </div>
    `,
};

export const OptionsStory: Story = {
    name: 'Options',
    args: {
        options: RevealViewDefaults
    },
    render: (args: any) => html`
    <rv-reveal-view dashboard="Sales" .options=${args.options}></rv-reveal-view>
    `,
};

export const RefreshtStory: Story = {
    name: 'Refresh',
    args: {
        index: 0
    },
    render: (args: any) => html`
    <div style="height: 100%">
        <div>
            <button onclick="revealView.refreshData()">Refresh Dashboard</button>    
            <button onclick="revealView.refreshData(${args.index})">Refresh Visualization by Index</button>                  
            <button @click=${()=> {
                const rv = document.getElementById('revealView') as RvRevealView;
                const rvDashboard = rv.getRVDashboard();
                const vizId = rvDashboard.visualizations[args.index].id;
                rv.refreshData(vizId);
            }} >Refresh Visualization by Id</button>                      
        </div>
        <rv-reveal-view id="revealView" dashboard="Sales"></rv-reveal-view>
    </div>
    `,
};