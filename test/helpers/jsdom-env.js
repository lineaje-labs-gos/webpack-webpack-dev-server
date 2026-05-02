"use strict";

// Replaces jest-environment-jsdom: installs a jsdom window's globals onto
// globalThis so client-side code that expects browser globals (window,
// document, location, etc.) runs under node:test.

const { after } = require("node:test");
const { JSDOM } = require("jsdom");

let active = null;

/**
 * @param options
 */
function install(options = {}) {
  if (active) return active;
  // Force-close jsdom and any leaked handles (websockets, timers from
  // client-src reconnect loops) once the test file finishes.
  after(() => {
    if (active) active.restore();
    // Some jsdom resources (XHR, websockets) keep the loop alive. Force exit
    // once node:test reports the file has finished.
    setImmediate(() => {
      // eslint-disable-next-line n/no-process-exit
      process.exit(process.exitCode || 0);
    }).unref();
  });
  const dom = new JSDOM(
    "<!doctype html><html><head></head><body></body></html>",
    {
      url: options.url || "http://localhost/",
      pretendToBeVisual: true,
      ...options,
    },
  );
  const { window } = dom;
  const propsToCopy = [
    "window",
    "document",
    "navigator",
    "HTMLElement",
    "HTMLDivElement",
    "HTMLScriptElement",
    "Element",
    "Node",
    "Event",
    "CustomEvent",
    "MessageEvent",
    "MutationObserver",
    "getComputedStyle",
    "DOMParser",
    "Blob",
    "FormData",
    "Headers",
    "Request",
    "Response",
    "XMLHttpRequest",
    "WebSocket",
    "FileReader",
    "File",
    "Image",
    "performance",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    "postMessage",
    "addEventListener",
    "removeEventListener",
    "dispatchEvent",
    "scrollTo",
    "alert",
    "confirm",
    "prompt",
    "matchMedia",
    "getSelection",
  ];
  // Methods that rely on `this` being a window instance must be bound;
  // otherwise jsdom throws "called on an object that is not a valid instance".
  const methodsToBind = new Set([
    "addEventListener",
    "removeEventListener",
    "dispatchEvent",
    "postMessage",
    "getComputedStyle",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    "scrollTo",
    "alert",
    "confirm",
    "prompt",
    "matchMedia",
    "getSelection",
  ]);

  const previous = new Map();
  for (const prop of propsToCopy) {
    if (!(prop in window)) continue;
    previous.set(prop, Object.getOwnPropertyDescriptor(globalThis, prop));
    let value = window[prop];
    if (methodsToBind.has(prop) && typeof value === "function") {
      value = value.bind(window);
    }
    try {
      Object.defineProperty(globalThis, prop, {
        configurable: true,
        writable: true,
        value,
      });
    } catch {
      try {
        globalThis[prop] = value;
      } catch {
        // ignore — leave the original
      }
    }
  }
  try {
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      writable: true,
      value: window.location,
    });
  } catch {
    // ignore
  }
  // `self` should reference globalThis (matching browser/jest-environment-jsdom
  // behavior where window === globalThis === self), so spying on globalThis.x
  // is reflected on self.x.
  if (!previous.has("self")) {
    previous.set("self", Object.getOwnPropertyDescriptor(globalThis, "self"));
  }
  Object.defineProperty(globalThis, "self", {
    configurable: true,
    writable: true,
    value: globalThis,
  });

  active = {
    dom,
    window,
    restore() {
      for (const [k, descriptor] of previous) {
        try {
          if (descriptor) Object.defineProperty(globalThis, k, descriptor);
          else delete globalThis[k];
        } catch {
          // ignore
        }
      }
      try {
        dom.window.close();
      } catch {
        // ignore
      }
      active = null;
    },
  };
  return active;
}

module.exports = { install };
