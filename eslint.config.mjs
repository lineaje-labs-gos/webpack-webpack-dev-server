import { defineConfig, globalIgnores } from "eslint/config";
import config from "eslint-config-webpack";
import configs from "eslint-config-webpack/configs.js";

export default defineConfig([
  globalIgnores(["client/**/*", "examples/**/*"]),
  {
    extends: [config],
    ignores: ["client-src/**/*", "!client-src/webpack.config.js"],
    languageOptions: {
      // ES2025 needed for import attributes (`import x from "y" with { ... }`).
      // eslint-config-webpack pins ecmaVersion to 2024 for Node 22.
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      // eslint-plugin-import re-parses imported modules with espree, which on
      // its bundled version doesn't understand import attributes. Delegate to
      // @babel/eslint-parser so files importing JSON via `with { type: "json" }`
      // (e.g. lib/Server.js) parse correctly.
      "import/parsers": {
        "@babel/eslint-parser": [".js", ".cjs", ".mjs"],
      },
    },
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
  },
  {
    // test/client/* still uses CJS (jest.mock + require for module reload).
    // It is scoped to commonjs via test/client/package.json.
    files: ["test/client/**/*"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "import/extensions": "off",
      "no-undef": "off",
      strict: "off",
      // test/client/package.json scopes these files to commonjs but does not
      // re-declare devDependencies; resolve from the project root instead.
      "import/no-extraneous-dependencies": [
        "error",
        { packageDir: import.meta.dirname },
      ],
    },
  },
]);
