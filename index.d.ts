import * as React from "react";
export interface MediaQueryObject {
    [id: string]: boolean | number | string;
}
export interface MediaProps {
    query: string | MediaQueryObject | MediaQueryObject[];
    defaultMatches?: boolean;
    children?: ((matches: boolean) => React.ReactNode) | React.ReactNode;
    render?: () => React.ReactNode;
    targetWindow?: Window;
    onChange?: (matches: boolean) => void;
}
/**
 * Conditionally renders based on whether or not a media query matches.
 */
declare class Media extends React.Component<MediaProps> {}
export default Media;
