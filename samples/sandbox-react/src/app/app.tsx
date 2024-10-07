// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef, useState } from 'react';
import styles from './app.module.scss';
import { RvRevealView, RvRevealViewRef } from 'reveal-sdk-wrappers-react';
import { RevealViewOptions } from 'reveal-sdk-wrappers';

declare const $: any;
$.ig.RevealSdkSettings.setBaseUrl("https://samples.revealbi.io/upmedia-backend/reveal-api/");

export function App() {

  const rvRef = useRef<RvRevealViewRef>(null);
  const [dashboard, setDashboard] = useState<string>("Campaigns");
  const options: RevealViewOptions = {
    dataSources: [
      { type: "REST", title: "Sales by Category", subtitle: "Excel2Json", url: "https://excel2json.io/api/share/6e0f06b3-72d3-4fec-7984-08da43f56bb9" },
    ],
    header: {
      menu: {
        items: [
          { title: "Item 1", click: () => console.log(rvRef.current?.getRVDashboard())},
          { title: "Item 2", click: () => alert("Item 2") },
          { title: "Item 3", click: () => alert("Item 3") },
        ]
      }
    },
  }
  
  return (
    <div  style={{height: '100%'}}>
      <RvRevealView ref={rvRef} dashboard={dashboard} options={options}></RvRevealView>
    </div>
  );
}

export default App;
