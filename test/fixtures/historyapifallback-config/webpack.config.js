import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const moduleRuleForHTML = {
  test: /\.html$/,
  type: "asset/resource",
  generator: {
    filename: "[name][ext]",
  },
};
export default {
  mode: "development",
  context: __dirname,
  stats: "none",
  entry: "./foo.js",
  output: {
    path: "/",
  },
  module: {
    rules: [
      {
        ...moduleRuleForHTML,
      },
    ],
  },
  infrastructureLogging: {
    level: "warn",
  },
};
