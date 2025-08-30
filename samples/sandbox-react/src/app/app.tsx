// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef, useState } from 'react';
import styles from './app.module.scss';
import { RvRevealView, RvRevealViewRef, RvVisualizationViewer, RvVisualizationViewerRef } from 'reveal-sdk-wrappers-react';
import { MenuOpeningArgs, RevealViewOptions, SeriesColorRequestedArgs } from 'reveal-sdk-wrappers';

declare const $: any;
$.ig.RevealSdkSettings.setBaseUrl("https://samples.revealbi.io/upmedia-backend/reveal-api/");

export function App() {

  const rvRef = useRef<RvRevealViewRef>(null);
  const rvViewerRef = useRef<RvVisualizationViewerRef>(null);
  const [dashboard, setDashboard] = useState<string>("Marketing");
  const options: RevealViewOptions = {
    startInEditMode: false,
    dataSources: [
      { type: "REST", title: "Sales by Category", subtitle: "Excel2Json", url: "https://excel2json.io/api/share/6e0f06b3-72d3-4fec-7984-08da43f56bb9" },
    ],
    header: {
      menu: {
        exportToPowerPoint: false,
        items: [
          { title: "Item 1", click: () => console.log(rvRef.current?.getRVDashboard())},
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

    //window.dispatchEvent(new CustomEvent('reveal-theme-changed'));
  }

  return (
    <div  style={{height: '100%'}}>
      <button onClick={onClick}>Switch Dashboard</button>
      <RvVisualizationViewer ref={rvViewerRef} dashboard={dashboard} visualization={0} style={{height: 400}}
        options={{
          menu: {
            copy: false,
          }
        }}></RvVisualizationViewer>
      <RvRevealView ref={rvRef} dashboard={dashboard} options={options} menuOpening={menuOpening}></RvRevealView>
    </div>
  );
}

export default App;
