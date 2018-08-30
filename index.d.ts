import { ReactNode, Component } from 'react';

export interface MediaQueryObject {
  [id: string]: boolean | number | string;
}

export interface MediaProps {
  query: string | MediaQueryObject | MediaQueryObject[];
  defaultMatches?: boolean;
  children?: ((matches: boolean) => ReactNode) | ReactNode;
  render?: () => ReactNode;
}

export default class Media extends Component<MediaProps, any> {}
