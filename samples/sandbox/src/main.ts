import { RvDashboardChangedArgs, defineRevealSdkWrappers, RevealViewOptions, RvRevealView, UrlLinkRequestedArgs } from "reveal-sdk-wrappers";
defineRevealSdkWrappers();

declare const $: any;
$.ig.RevealSdkSettings.setBaseUrl("https://samples.revealbi.io/upmedia-backend/reveal-api/");

const options: RevealViewOptions = {
    //canSave: false,
    //canSaveAs: false,
    //canEdit: false,
    header: {
        showTitle: false,
        menu: {
            //refresh: false,
            //saveAs: false,
        }
    },
}

const revealView = document.getElementById('revealView') as RvRevealView;
revealView.options = options;
revealView.dashboard = "Marketing";

revealView.urlLinkRequested = (args: UrlLinkRequestedArgs) => {
    console.log("urlLinkRequested", args);
    return args.url;
}

revealView.rvDashboardChanged = (args: RvDashboardChangedArgs) => {
    console.log("dashboardChanged", args);
}

// revealView.linkSelectionDialogOpening = (evt: any) => {
//     console.log("linkSelectionDialogOpening", evt);
// }

// const actionBUtton = document.getElementById("actionButton") as HTMLButtonElement;
// actionBUtton.onclick = () => {
//     console.log("Performing action...");
//     revealView.linkSelectionDialogOpening = (evt: any) => {
//         console.log("linkSelectionDialogOpening", evt);
//     }
// }