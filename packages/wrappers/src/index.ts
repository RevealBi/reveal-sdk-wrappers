import { defineRevealSdkWrappers } from "./components/common";

export * from "./components/common";
export * from "./components/reveal-view";
export * from "./components/visualization-viewer";

// Extend the Window interface to include RevealSdkWrappers
declare global {
    interface Window {
        RevealSdkWrappers?: any;
        $: any;
    }
}

// Auto-register components when loaded via UMD script tag
if (typeof window !== 'undefined' && window.RevealSdkWrappers) {
    defineRevealSdkWrappers();
}

(function patchRevealThemeSetter() {
    if (typeof window !== 'undefined' && window.$ && window.$.ig && window.$.ig.RevealSdkSettings) {
        const RevealSdkSettings = window.$.ig.RevealSdkSettings;
        // Avoid double-patching
        if (!Object.prototype.hasOwnProperty.call(RevealSdkSettings, '__themePatched')) {
            const themeDescriptor = Object.getOwnPropertyDescriptor(RevealSdkSettings, 'theme');
            Object.defineProperty(RevealSdkSettings, 'theme', {
                configurable: true,
                enumerable: true,
                get: themeDescriptor?.get
                    ? function (this: any) { return themeDescriptor.get!.call(this); }
                    : function () { return undefined; },
                set: themeDescriptor?.set
                    ? function (this: any, value) {
                        themeDescriptor.set!.call(this, value);
                        window.dispatchEvent(new CustomEvent('reveal-theme-changed'));
                    }
                    : function (value) {
                        window.dispatchEvent(new CustomEvent('reveal-theme-changed'));
                    }
            });
            Object.defineProperty(RevealSdkSettings, '__themePatched', {
                value: true,
                writable: false,
                configurable: false,
                enumerable: false
            });
            console.log("Reveal Theme Setter Patched");
        }
    }
})();