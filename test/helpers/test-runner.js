"use strict";

// Compat layer that exposes a jest-like API on top of node:test.
// Test files import from here, then call describe/it/expect/jest as before.
// Snapshot state is wired per-file via the exported `setupSnapshots(__filename)`.

const path = require("node:path");
const nodeTest = require("node:test");
const { expect } = require("expect");
const jestMock = require("jest-mock");
const {
  SnapshotState,
  toMatchInlineSnapshot,
  toMatchSnapshot,
  toThrowErrorMatchingInlineSnapshot,
  toThrowErrorMatchingSnapshot,
} = require("jest-snapshot");
const webpack = require("webpack");

const [webpackVersion] = webpack.version;
const snapshotExtension = `.snap.webpack${webpackVersion}`;

const updateMode = process.env.CI
  ? "none"
  : process.env.UPDATE_SNAPSHOT === "1" ||
      process.argv.includes("--update-snapshots")
    ? "all"
    : "new";

const fileSnapshotStates = new Map();
const ctx = { snapshotState: null, currentTestName: null };

/**
 * @param testFilePath
 */
function getSnapshotState(testFilePath) {
  let state = fileSnapshotStates.get(testFilePath);
  if (state) return state;
  const snapshotPath = path.join(
    path.dirname(testFilePath),
    "__snapshots__",
    `${path.basename(testFilePath)}${snapshotExtension}`,
  );
  state = new SnapshotState(snapshotPath, {
    updateSnapshot: updateMode,
    snapshotFormat: { escapeString: false, printBasicPrototype: false },
    prettierPath: null,
    rootDir: path.dirname(testFilePath),
  });
  fileSnapshotStates.set(testFilePath, state);
  return state;
}

/**
 * @param thisArg
 */
function snapshotMatcherCtx(thisArg) {
  return {
    ...thisArg,
    snapshotState: ctx.snapshotState,
    currentTestName: ctx.currentTestName,
  };
}

expect.extend({
  toMatchSnapshot(received, ...rest) {
    return toMatchSnapshot.call(snapshotMatcherCtx(this), received, ...rest);
  },
  toThrowErrorMatchingSnapshot(received, ...rest) {
    return toThrowErrorMatchingSnapshot.call(
      snapshotMatcherCtx(this),
      received,
      ...rest,
    );
  },
  toMatchInlineSnapshot(received, ...rest) {
    return toMatchInlineSnapshot.call(
      snapshotMatcherCtx(this),
      received,
      ...rest,
    );
  },
  toThrowErrorMatchingInlineSnapshot(received, ...rest) {
    return toThrowErrorMatchingInlineSnapshot.call(
      snapshotMatcherCtx(this),
      received,
      ...rest,
    );
  },
});

const trackedMocks = new Set();

/**
 * @param impl
 */
function trackedFn(impl) {
  const m = jestMock.fn(impl);
  trackedMocks.add(m);
  return m;
}

/**
 * @param obj
 * @param method
 * @param accessType
 */
function trackedSpyOn(obj, method, accessType) {
  const m = jestMock.spyOn(obj, method, accessType);
  trackedMocks.add(m);
  return m;
}

/**
 *
 */
function clearAllMocks() {
  for (const m of trackedMocks) m.mockClear?.();
}
/**
 *
 */
function resetAllMocks() {
  for (const m of trackedMocks) m.mockReset?.();
}
/**
 *
 */
function restoreAllMocks() {
  for (const m of trackedMocks) m.mockRestore?.();
  trackedMocks.clear();
}

const activeModuleMocks = new Map();
const originalCacheEntries = new Map();
/**
 * @param resolved
 */
function rememberOriginal(resolved) {
  if (!originalCacheEntries.has(resolved)) {
    originalCacheEntries.set(resolved, require.cache[resolved]);
  }
}
/**
 * @param modulePath
 * @param mockExports
 */
function setMock(modulePath, mockExports) {
  const resolved = require.resolve(modulePath);
  rememberOriginal(resolved);
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: mockExports,
    children: [],
    parent: null,
    paths: [],
  };
}

/**
 *
 */
function clearLocalRequireCache() {
  for (const k of Object.keys(require.cache)) {
    if (!k.includes(`${path.sep}node_modules${path.sep}`)) {
      delete require.cache[k];
    }
  }
}

/**
 * @param callback
 */
function isolateModules(callback) {
  const saved = new Map(Object.entries(require.cache));
  clearLocalRequireCache();
  try {
    callback();
  } finally {
    clearLocalRequireCache();
    for (const [k, v] of saved) require.cache[k] = v;
  }
}

let timersEnabled = false;
/**
 *
 */
function useFakeTimers() {
  if (!timersEnabled) {
    nodeTest.mock.timers.enable({
      apis: ["setTimeout", "setInterval", "setImmediate", "Date"],
    });
    timersEnabled = true;
  }
}
/**
 *
 */
function useRealTimers() {
  if (timersEnabled) {
    nodeTest.mock.timers.reset();
    timersEnabled = false;
  }
}
/**
 * @param ms
 */
function advanceTimersByTime(ms) {
  nodeTest.mock.timers.tick(ms);
}
/**
 *
 */
function runAllTimers() {
  nodeTest.mock.timers.runAll();
}

const jest = {
  fn: trackedFn,
  spyOn: trackedSpyOn,
  clearAllMocks,
  resetAllMocks,
  restoreAllMocks,
  resetModules: clearLocalRequireCache,
  isolateModules,
  setMock,
  // eslint-disable-next-line camelcase
  unstable_mockModule(modulePath, factory) {
    const result = factory();
    const mod = result && typeof result.then === "function" ? null : result;
    if (!mod) {
      throw new Error(
        "jest.unstable_mockModule with async factory is not supported in compat layer",
      );
    }
    if (typeof nodeTest.mock.module === "function") {
      // node:test refuses to mock the same path twice — restore the previous
      // mock first so re-mocking from beforeEach works the way Jest does.
      const previous = activeModuleMocks.get(modulePath);
      if (previous) {
        try {
          previous.restore();
        } catch {
          // ignore: already restored
        }
        activeModuleMocks.delete(modulePath);
      }
      const namedExports = { ...mod };
      const defaultExport = "default" in mod ? mod.default : undefined;
      delete namedExports.default;
      const handle = nodeTest.mock.module(modulePath, {
        namedExports,
        defaultExport,
        cache: false,
      });
      activeModuleMocks.set(modulePath, handle);
      return handle;
    }
    setMock(
      modulePath,
      mod.default && Object.keys(mod).length === 1 ? mod.default : mod,
    );
    return undefined;
  },
  doMock(modulePath, factory) {
    setMock(modulePath, factory());
  },
  mock(modulePath, factory) {
    if (factory) setMock(modulePath, factory());
  },
  requireActual(modulePath) {
    const resolved = require.resolve(modulePath);
    const cached = require.cache[resolved];
    delete require.cache[resolved];
    try {
      return require(resolved);
    } finally {
      if (cached) require.cache[resolved] = cached;
    }
  },
  useFakeTimers,
  useRealTimers,
  advanceTimersByTime,
  runAllTimers,
  setTimeout(_ms) {
    // No-op: per-file timeout is set via test options or env
  },
};

/**
 * @param itFn
 */
function wrapIt(itFn) {
  function wrapped(...args) {
    return itFn(...args);
  }
  wrapped.only = itFn.only.bind(itFn);
  wrapped.skip = itFn.skip.bind(itFn);
  wrapped.todo = itFn.todo.bind(itFn);
  wrapped.each = (cases) => (name, body, opts) => {
    for (let i = 0; i < cases.length; i++) {
      const row = cases[i];
      const args = Array.isArray(row) ? row : [row];
      // cspell:disable-next-line
      const interpolated = name.replaceAll(/%[psdijoO%]/g, (token) => {
        if (token === "%%") return "%";
        const next = args.shift();
        return typeof next === "object" ? JSON.stringify(next) : String(next);
      });
      const argsForBody = Array.isArray(row) ? row : [row];
      itFn(interpolated, opts, () => body(...argsForBody));
    }
  };
  return wrapped;
}

const it = wrapIt(nodeTest.it);
const test = wrapIt(nodeTest.test);

/**
 * @param testFilePath
 */
function setupSnapshots(testFilePath) {
  const state = getSnapshotState(testFilePath);
  nodeTest.before(() => {
    ctx.snapshotState = state;
  });
  nodeTest.beforeEach((t) => {
    ctx.snapshotState = state;
    ctx.currentTestName = (t.fullName || t.name || "").split(" > ").join(" ");
  });
  nodeTest.after(() => {
    state.save();
    if (process.env.CI) {
      const unchecked = state.getUncheckedCount();
      if (unchecked > 0) {
        throw new Error(
          `${unchecked} obsolete snapshot(s) in ${testFilePath}. Run with UPDATE_SNAPSHOT=1 to update.`,
        );
      }
    }
  });
}

/**
 * @param testFilePath
 */
function setupTest(testFilePath) {
  setupSnapshots(testFilePath);
  return module.exports;
}

module.exports = {
  describe: nodeTest.describe,
  suite: nodeTest.suite,
  it,
  test,
  before: nodeTest.before,
  after: nodeTest.after,
  beforeAll: nodeTest.before,
  afterAll: nodeTest.after,
  beforeEach: nodeTest.beforeEach,
  afterEach: nodeTest.afterEach,
  expect,
  jest,
  setupTest,
  setupSnapshots,
};
