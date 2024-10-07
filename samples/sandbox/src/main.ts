import { defineRevealSdkWrappers, RvRevealView } from "reveal-sdk-wrappers";
defineRevealSdkWrappers();

declare const $: any;
$.ig.RevealSdkSettings.setBaseUrl("https://samples.revealbi.io/upmedia-backend/reveal-api/");

const revealView = document.getElementById('revealView') as RvRevealView;
revealView.dashboard = "Sales";
