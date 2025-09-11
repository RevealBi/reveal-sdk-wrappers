// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef, useState } from 'react';
import styles from './app.module.scss';
import { RvRevealView, RvRevealViewRef, RvVisualizationViewer, RvVisualizationViewerRef } from 'reveal-sdk-wrappers-react';
import { DashboardLinkRequestedArgs, MenuOpeningArgs, RevealViewOptions, SeriesColorRequestedArgs } from 'reveal-sdk-wrappers';

declare const $: any;
$.ig.RevealSdkSettings.setBaseUrl("https://samples.revealbi.io/upmedia-backend/reveal-api/");

export function App() {

  const rvRef = useRef<RvRevealViewRef>(null);
  const rvViewerRef = useRef<RvVisualizationViewerRef>(null);
  const [dashboard, setDashboard] = useState<string>("Marketing");
  const options: RevealViewOptions = {
    startInEditMode: false,
    //canSave: false,
    dataSources: [
      { type: "REST", title: "Sales by Category", subtitle: "Excel2Json", url: "https://excel2json.io/api/share/6e0f06b3-72d3-4fec-7984-08da43f56bb9" },
      { type: "LocalFile", title: "Local File", subtitle: "Upload a local file", fileName: "LocalFile", format: "Excel" }
    ],
    header: {
      menu: {
        exportToPowerPoint: false,
        items: [
          { title: "Item 1", click: () => console.log(rvRef.current?.getRVDashboard()) },
          { title: "Item 2", click: () => alert("Item 2") },
          { title: "Item 3", click: () => alert("Item 3") },
        ]
      }
    },
  }

  const menuOpening = (args: MenuOpeningArgs) => {
    if (args.visualization) {
      args.menuItems[6].isHidden = true; //hide the delete button
      const newDeleteButton = new $.ig.RVMenuItem("Delete", null, () => {
        //todo: do you custom code here

        //perform the built-in delete operation using a backdoor
        (rvRef.current as any)?._revealView._dashboardView.deleteWidgetFromDashboard(args.visualization._widgetModel)
      });
      args.menuItems.push(newDeleteButton);
    }
  }

  const onClick = () => {
    if ($.ig.RevealSdkSettings.theme.isDark) {
      $.ig.RevealSdkSettings.theme = new $.ig.MountainLightTheme();
    }
    else {
      $.ig.RevealSdkSettings.theme = new $.ig.MountainDarkTheme();
    }
  }

  const handleDashboardLinkRequested = (args: DashboardLinkRequestedArgs) => {
    //return args.dashboardId;
    console.log("Dashboard link requested: " + args.dashboardId);

    return $.ig.RVDashboard.loadDashboard(args.dashboardId);
    //return $.ig.RVDashboard.loadDashboard(args.dashboardId);
    //const dashboard = DashboardService.getDashboardById(args.dashboardId);
    // if (dashboard) {
    //   //const document = RdashDocument.loadFromJson(dashboard.documentJsonString);
    //   // if (document) {
    //   //   return document.toRVDashboard();
    //   // }
    // } else {
    //   alert('The requested dashboard could not be found.');
    // }
  }

  return (
    <div style={{ height: '100%' }}>
      <button onClick={onClick}>Switch Dashboard</button>
      {/* <RvVisualizationViewer ref={rvViewerRef} dashboard={dashboard} visualization={0} style={{ height: 400 }}
        options={{
          menu: {
            copy: false,
          }
        }}></RvVisualizationViewer> */}
      <RvRevealView
        ref={rvRef}
        dashboard={dashboard}
        options={options}        
        dashboardLinkRequested={handleDashboardLinkRequested}
        linkSelectionDialogOpening={(args) => { args.callback("Sales") }}
        initialized={() => console.log(rvRef.current?.getFilters())}
      ></RvRevealView>
    </div>
  );
}

export default App;
