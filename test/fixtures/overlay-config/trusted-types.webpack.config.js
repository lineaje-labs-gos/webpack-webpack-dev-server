import HTMLGeneratorPlugin from "../../helpers/trusted-types-html-generator-plugin.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "development",
  context: __dirname,
  stats: "none",
  entry: "./foo.js",
  output: {
    path: "/",
    trustedTypes: {
      policyName: "webpack",
    },
  },
  infrastructureLogging: {
    level: "info",
    stream: {
      write: () => {},
    },
  },
  plugins: [new HTMLGeneratorPlugin()],
};
