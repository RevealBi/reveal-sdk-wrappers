import { RvRevealView } from "../../reveal-view";
import { RvVisualizationViewer } from "../../visualization-viewer";

type RevealSdkWrapperComponent = CustomElementConstructor & {
    tagName: string;
};

export function defineRevealSdkWrappers(...components: RevealSdkWrapperComponent[]) {
    const componentsToRegister = components.length === 0 ? [RvRevealView, RvVisualizationViewer] : components;
    componentsToRegister.forEach(component => {
        if (!customElements.get(component.tagName)) {
            customElements.define(component.tagName, component);
        }
    });
}

