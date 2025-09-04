import { defineRevealSdkWrappers, RevealViewOptions, RvRevealView } from "reveal-sdk-wrappers";
defineRevealSdkWrappers();

declare const $: any;
$.ig.RevealSdkSettings.setBaseUrl("https://samples.revealbi.io/upmedia-backend/reveal-api/");

const options: RevealViewOptions = {
    canSave: false,
    //canSaveAs: false,
    //canEdit: false,
    header: {
        menu: {
            refresh: false,
            //saveAs: false,
        }        
    },
}

const revealView = document.getElementById('revealView') as RvRevealView;
revealView.options = options;
revealView.dashboard = "Sales";
