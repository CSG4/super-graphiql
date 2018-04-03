/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import { expect } from "chai";
import { describe, it } from "mocha";
import React from "react";
import ReactTestRenderer from "react-test-renderer";

import { SuperGraphiQL } from "../SuperGraphiQL";

document.createRange = () => ({
  setEnd() {},
  setStart() {},
  getBoundingClientRect() {
    return { right: 0 };
  },
  getClientRects() {
    return { right: 0 };
  }
});

const mockStorage = (function() {
  let store = {};
  return {
    getItem(key) {
      return store.hasOwnProperty(key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();

// The smallest possible introspection result that builds a schema.
const simpleIntrospection = {
  data: {
    __schema: {
      queryType: { name: "Q" },
      types: [
        {
          kind: "OBJECT",
          name: "Q",
          interfaces: [],
          fields: [{ name: "q", args: [], type: { name: "Q" } }]
        }
      ]
    }
  }
};

// Spins the promise loop a few times before continuing.
const wait = () =>
  Promise.resolve()
    .then(() => Promise.resolve())
    .then(() => Promise.resolve())
    .then(() => Promise.resolve());

Object.defineProperty(window, "localStorage", {
  value: mockStorage
});

describe("SuperGraphiQL", () => {
  const noOpFetcher = () => {};

  it("should throw error without fetcher", () => {
    expect(() => ReactTestRenderer.create(<SuperGraphiQL />)).to.throw(
      "SuperGraphiQL requires a fetcher function"
    );
  });

  it("should construct correctly with fetcher", () => {
    expect(() =>
      ReactTestRenderer.create(<SuperGraphiQL fetcher={noOpFetcher} />)
    ).to.not.throw();
  });

  it("should refetch schema with new fetcher", async () => {
    let firstCalled = false;
    function firstFetcher() {
      firstCalled = true;
      return Promise.resolve(simpleIntrospection);
    }

    let secondCalled = false;
    function secondFetcher() {
      secondCalled = true;
      return Promise.resolve(simpleIntrospection);
    }

    // Initial render calls fetcher
    const instance = ReactTestRenderer.create(
      <SuperGraphiQL fetcher={firstFetcher} />
    );
    expect(firstCalled).to.equal(true);

    await wait();

    // Re-render does not call fetcher again
    firstCalled = false;
    instance.update(<SuperGraphiQL fetcher={firstFetcher} />);
    expect(firstCalled).to.equal(false);

    await wait();

    // Re-render with new fetcher is called.
    instance.update(<SuperGraphiQL fetcher={secondFetcher} />);
    expect(secondCalled).to.equal(true);
  });

  it("should not throw error if schema missing and query provided", () => {
    expect(() =>
      ReactTestRenderer.create(
        <SuperGraphiQL fetcher={noOpFetcher} query="{}" />
      )
    ).to.not.throw();
  });

  it("defaults to the built-in default query", () => {
    const graphiQL = ReactTestRenderer.create(
      <SuperGraphiQL fetcher={noOpFetcher} />
    );
    expect(graphiQL.getInstance().state.query).to.include(
      "# Welcome to SuperGraphiQL"
    );
  });

  it("accepts a custom default query", () => {
    const graphiQL = ReactTestRenderer.create(
      <SuperGraphiQL fetcher={noOpFetcher} defaultQuery="GraphQL Party!!" />
    );
    expect(graphiQL.getInstance().state.query).to.equal("GraphQL Party!!");
  });
});
