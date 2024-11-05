import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataSourcesRequestedArgs, RevealViewOptions } from 'reveal-sdk-wrappers';
import { RevealViewComponent, VisualizationViewerComponent } from 'reveal-sdk-wrappers-angular';

declare const $: any;
$.ig.RevealSdkSettings.setBaseUrl("https://samples.revealbi.io/upmedia-backend/reveal-api/");

@Component({
  standalone: true,
  imports: [RouterModule, RevealViewComponent, VisualizationViewerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  dashboard: string = "Sales";
  options: RevealViewOptions = {
    header: {
      menu: {
        items: [
          {
            title: "Edit", click: () => { console.log("Edit"); }
          }
        ]
      }
    },
    dataSources: [
      { type: "REST", title: "Sales by Category", subtitle: "Excel2Json", url: "https://excel2json.io/api/share/6e0f06b3-72d3-4fec-7984-08da43f56bb9" }
    ]
  };

  dataSourcesRequested = (args: DataSourcesRequestedArgs) => {
    const restDataSource = new $.ig.RVRESTDataSource();
    restDataSource.url = "https://excel2json.io/api/share/6e0f06b3-72d3-4fec-7984-08da43f56bb9";
    restDataSource.title = "Sales by Category";
    restDataSource.subtitle = "Excel2Json";
    restDataSource.useAnonymousAuthentication = true;

    return { dataSources: [restDataSource], dataSourceItems: [] };
  }
}
