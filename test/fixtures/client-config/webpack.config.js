import HTMLGeneratorPlugin from "../../helpers/html-generator-plugin.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  devtool: false,
  mode: "development",
  context: __dirname,
  stats: "none",
  entry: "./foo.js",
  output: {
    path: "/",
  },
  infrastructureLogging: {
    level: "info",
    stream: {
      write: () => {},
    },
  },
  plugins: [new HTMLGeneratorPlugin()],
};
