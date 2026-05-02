import { defineConfig, globalIgnores } from "eslint/config";
import config from "eslint-config-webpack";
import configs from "eslint-config-webpack/configs.js";

export default defineConfig([
  globalIgnores(["client/**/*", "tmp-client/**/*", "examples/**/*"]),
  {
    extends: [config],
    ignores: ["client-src/**/*", "!client-src/webpack.config.js"],
    rules: {
      // TODO fix me
      "prefer-destructuring": "off",
      "jsdoc/require-property-description": "off",
    },
  },
  {
    files: ["client-src/**/*"],
    ignores: ["client-src/webpack.config.js"],
    extends: [configs["browser-outdated-recommended"]],
  },
  {
    files: ["test/**/*"],
    extends: [configs["universal-recommended"]],
    languageOptions: {
      globals: {
        // Injected via `node --import scripts/setupTest.js`.
        describe: "readonly",
        suite: "readonly",
        it: "readonly",
        test: "readonly",
        before: "readonly",
        after: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        expect: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      // Tests are internal; we don't want JSDoc on every helper function.
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/no-blank-blocks": "off",
      // Debug logs and short reducer args are common in test code.
      "no-console": "off",
      "id-length": "off",
    },
  },
  {
    files: ["test/helpers/**/*", "scripts/setupTest.js"],
    rules: {
      // The compat helpers wrap third-party APIs and intentionally use
      // experimental Node features behind documented flags.
      "jsdoc/require-param-type": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/no-blank-blocks": "off",
      "n/no-unsupported-features/node-builtins": "off",
    },
  },
]);
