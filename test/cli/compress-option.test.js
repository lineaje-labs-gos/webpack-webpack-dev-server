"use strict";

const { testBin } = require("../helpers/test-bin");
const { setupTest } = require("../helpers/test-runner");
const port = require("../ports-map")["cli-compress"];

setupTest(__filename);

describe('"compress" CLI option', () => {
  it('should work using "--compress"', async () => {
    const { exitCode } = await testBin(["--port", port, "--compress"]);

    expect(exitCode).toBe(0);
  });

  it('should work using "--no-compress"', async () => {
    const { exitCode } = await testBin(["--port", port, "--no-compress"]);

    expect(exitCode).toBe(0);
  });
});
