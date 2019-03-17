/** @jest-environment node */

import React from "react";
import Media from "../Media";

import { serverRenderStrict } from "./utils";

describe("A <Media> in server environment", () => {
  describe("and a single query is defined", () => {
    const query = "(max-width: 1000px)";

    describe("when no default matches prop provided", () => {
      it("should render its children as if the query matches", () => {
        const element = (
          <Media query={query}>
            {matches =>
              matches === true ? <span>Matches, render!</span> : null
            }
          </Media>
        );

        const result = serverRenderStrict(element);

        expect(result).toBe("<span>Matches, render!</span>");
      });
    });

    describe("when default matches prop provided", () => {
      it("should render its children according to the provided defaultMatches", () => {
        const render = matches => (matches === true ? <span>matches</span> : null);

        const matched = (
          <Media query={query} defaultMatches={true}>
            {render}
          </Media>
        );

        const matchedResult = serverRenderStrict(matched);

        expect(matchedResult).toBe("<span>matches</span>");

        const notMatched = (
          <Media query={query} defaultMatches={false}>
            {render}
          </Media>
        );

        const notMatchedResult = serverRenderStrict(notMatched);

        expect(notMatchedResult).toBe("");
      });
    });
  });

  describe("and multiple queries are defined", () => {
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
              matches.sm && matches.lg && matches.xl ? (
                <span>All matches, render!</span>
              ) : null
            }
          </Media>
        );

        const result = serverRenderStrict(element);

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

        const result = serverRenderStrict(element);

        expect(result).toBe("<div><span>small</span></div>");
      });
    });
  });
});
