declare module 'react-media' {
  interface MediaProps {
    query: string;
    defaultMatches?: boolean;
    children: ((matches: boolean) => JSX.Element) | JSX.Element
  }

  export default class Media extends React.Component<MediaProps, any> {}
}
