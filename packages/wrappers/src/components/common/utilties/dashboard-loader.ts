/* eslint-disable @typescript-eslint/no-explicit-any */

declare let $: any;

export class DashboardLoader {

    static async load(dashboard?: any): Promise<any | null> {
        if (!dashboard) {
            return null;
        }
    
        if (typeof dashboard === "string" || dashboard instanceof Blob) {
            return await this.loadRVDashboard(dashboard);
        } 
    
        if (typeof dashboard.toRVDashboard === 'function') {
            return await dashboard.toRVDashboard();
        }
    
        if (dashboard.constructor.name === "RVDashboard") {
            return dashboard;
        }
    
        throw new Error("Invalid Dashboard provided to DashboardLoader.load: " + dashboard);    
    }
    
    private static async loadRVDashboard(input: string | Blob): Promise<any> {    
        if (typeof input === 'string') {
           return await $.ig.RVDashboard.loadDashboard(input);
        } else {
            return $.ig.RVDashboard.loadDashboardFromContainer(input);
        }
    }

}
