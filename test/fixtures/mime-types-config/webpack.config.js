import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const moduleRuleForCustom = {
  test: /\.custom$/,
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
  node: false,
  infrastructureLogging: {
    level: "warn",
  },
  module: {
    rules: [
      {
        ...moduleRuleForCustom,
      },
    ],
  },
};
