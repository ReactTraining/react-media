import * as React from "react";
export interface MediaQueryObject {
  [id: string]: boolean | number | string;
}

/**
 * All allowed forms of media query inputs
 */
type MediaQueryValue = string | MediaQueryObject | MediaQueryObject[];

/**
 * The type of the `queries` prop
 */
interface MediaQueries {
  [key: string]: MediaQueryValue;
}

/**
 * The type of returned `matches` in case the `queries` prop is provided. The keys on `matches`
 * are inferred from the shape of `queries`.
 *
 * @example
 *
 * <Media queries={{ small: '...', medium: '...' }}>{
 *   // matches: { small: boolean, medium: boolean }
 *   matches => {}
 * }</Media>
 */
type QueryResults<Queries = MediaQueries> = { [key in keyof Queries]: boolean };

type BaseProps = {
  render?: () => React.ReactNode;
  targetWindow?: Window;
};

/**
 * Props for the <Media> component when specifying `queries` (as opposed to `query`)
 */
export type MultiQueryProps<Queries> = BaseProps & {
  queries: Queries;
  defaultMatches?: Partial<QueryResults<Queries>>;
  children?:
    | ((matches: QueryResults<Queries>) => React.ReactNode)
    | React.ReactNode;
  onChange?: (matches: QueryResults<Queries>) => void;
};


/**
 * Props for the <Media> component when specifying `query` (as opposed to `queries`)
 */
export type SingleQueryProps = BaseProps & {
  query: MediaQueryValue;
  defaultMatches?: boolean;
  children?: ((matches: boolean) => React.ReactNode) | React.ReactNode;
  onChange?: (matches: boolean) => void;
};

/**
 * Conditionally renders based on whether or not a media query matches.
 */
export default function Media(props: SingleQueryProps): React.ReactElement;
export default function Media<Q>(props: MultiQueryProps<Q>): React.ReactElement;
