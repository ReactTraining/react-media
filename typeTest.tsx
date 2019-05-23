import * as React from "react";
import Media from ".";

/**
 * This file is used to test the types in `index.d.ts`.
 */

export function SingleQuery() {
  return (
    <Media query="min-width: 300px" defaultMatches={true}>
      {matches => matches && <div>it works</div>}
    </Media>
  );
}

export function MultiQuery() {
  return (
    <Media
      queries={{
        small: "(max-width: 599px)",
        medium: "(min-width: 600px) and (max-width: 1199px)",
        large: "(min-width: 1200px)"
      }}
      defaultMatches={{
        small: true
      }}
      onChange={matches => console.log(matches.small)}
    >
      {matches => matches && <div>it works</div>}
    </Media>
  );
}
