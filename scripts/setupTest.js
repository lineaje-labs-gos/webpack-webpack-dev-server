"use strict";

// Loaded into every test process via `node --import`.
// Exposes the jest-style globals (describe, it, expect, jest, beforeEach,
// etc.) sourced from test/helpers/test-runner so existing test bodies keep
// working unchanged. Per-file snapshot state is wired by `setupTest(__filename)`
// in each test file that needs it.

process.env.CHOKIDAR_USEPOLLING = true;

const runner = require("../test/helpers/test-runner");

const globals = {
  describe: runner.describe,
  suite: runner.suite,
  it: runner.it,
  test: runner.test,
  before: runner.before,
  after: runner.after,
  beforeAll: runner.beforeAll,
  afterAll: runner.afterAll,
  beforeEach: runner.beforeEach,
  afterEach: runner.afterEach,
  expect: runner.expect,
  jest: runner.jest,
};

for (const [name, value] of Object.entries(globals)) {
  if (!(name in globalThis)) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      writable: true,
      value,
    });
  }
}
