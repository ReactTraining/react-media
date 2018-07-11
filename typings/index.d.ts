import * as React from 'react'

export type MediaQuery = {[key: string]: string | number | boolean}
export type MediaProps = {
  query: string | MediaQuery | MediaQuery[],
  render?: () => React.ReactNode,
  children?: React.ReactNode | ((matches: boolean) => React.ReactNode),
  targetWindow?: Window,
  defaultMatches?: boolean,
}
export type MediaInterface = React.ComponentClass<MediaProps>

declare const Media: MediaInterface
export default Media
