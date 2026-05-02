"use strict";

require("../../helpers/jsdom-env").install();

const sendMessage = require("../../../client-src/utils/sendMessage").default;
const { setupTest } = require("../../helpers/test-runner");

setupTest(__filename);

describe("'sendMessage' function", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should run self.postMessage", () => {
    jest.spyOn(globalThis, "postMessage").mockImplementation();

    sendMessage("foo", "bar");

    expect(self.postMessage).toHaveBeenCalled();
    expect(self.postMessage.mock.calls[0]).toMatchSnapshot();
  });
});
