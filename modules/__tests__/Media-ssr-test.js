/** @jest-environment node */

import React from "react";
import ReactDOMServer from "react-dom/server";
import Media from "../Media";

describe("A <Media> in server environment", () => {
  const queries = {
    sm: "(max-width: 1000px)",
    lg: "(max-width: 2000px)",
    xl: "(max-width: 3000px)"
  };

  describe("when no default matches prop provided", () => {
    it("should render its children as if all queries are matching", () => {
      const element = (
        <Media queries={queries}>
          {matches =>
            matches.sm &&
            matches.lg &&
            matches.xl && <span>All matches, render!</span>
          }
        </Media>
      );

      const result = ReactDOMServer.renderToStaticMarkup(element);

      expect(result).toBe("<span>All matches, render!</span>");
    });
  });

  describe("when default matches prop provided", () => {
    const defaultMatches = {
      sm: true,
      lg: false,
      xl: false
    };

    it("should render its children according to the provided defaultMatches", () => {
      const element = (
        <Media queries={queries} defaultMatches={defaultMatches}>
          {matches => (
            <div>
              {matches.sm && <span>small</span>}
              {matches.lg && <span>large</span>}
              {matches.xl && <span>extra large</span>}
            </div>
          )}
        </Media>
      );

      const result = ReactDOMServer.renderToStaticMarkup(element);

      expect(result).toBe("<div><span>small</span></div>");
    });
  });
});
