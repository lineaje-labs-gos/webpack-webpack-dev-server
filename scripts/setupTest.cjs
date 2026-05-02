"use strict";

const jestGlobals = require("@jest/globals");

// In Jest's ESM runtime, `jest` is not auto-injected as a global into ESM
// test modules — only the test runner's automatic CJS binding gets it.
// Expose it on globalThis so ESM tests can use `jest.fn`, `jest.spyOn`, etc.
// without an explicit `import { jest } from "@jest/globals"` in every file.
globalThis.jest = jestGlobals.jest;

process.env.CHOKIDAR_USEPOLLING = true;

jestGlobals.jest.setTimeout(400000);
