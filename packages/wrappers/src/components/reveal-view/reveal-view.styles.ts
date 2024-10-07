import { css } from "lit";

export default css`
    :host {
        display: block;
        height: 100%;
        width: 100%;
        min-height: 250px;

        > div {
            height: inherit;
            width: inherit;
            min-height: inherit;
            position: relative;
        }
    }
`;