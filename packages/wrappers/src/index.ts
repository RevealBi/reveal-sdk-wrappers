import { defineRevealSdkWrappers } from "./components/common";

export * from "./components/common";
export * from "./components/reveal-view";
export * from "./components/visualization-viewer";

// Extend the Window interface to include RevealSdkWrappers
declare global {
    interface Window {
        RevealSdkWrappers?: any;
    }
}

// Auto-register components when loaded via UMD script tag
if (typeof window !== 'undefined' && window.RevealSdkWrappers) {
    defineRevealSdkWrappers();
}