import HTMLGeneratorPlugin from "../../helpers/html-generator-plugin.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "development",
  devtool: false,
  context: __dirname,
  stats: "none",
  entry: "./foo.js",
  output: {
    publicPath: "/",
  },
  infrastructureLogging: {
    level: "warn",
  },
  plugins: [new HTMLGeneratorPlugin()],
};
