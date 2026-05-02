import HTMLGeneratorPlugin from "../../helpers/html-generator-plugin.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default [
  {
    target: "web",
    name: "one",
    mode: "development",
    context: __dirname,
    entry: "./one.js",
    stats: "none",
    output: {
      path: "/",
      filename: "one-[name].js",
    },
    plugins: [new HTMLGeneratorPlugin()],
    infrastructureLogging: {
      level: "info",
      stream: {
        write: () => {},
      },
    },
  },
  {
    target: "web",
    name: "two",
    mode: "development",
    context: __dirname,
    entry: "./two.js",
    stats: "none",
    output: {
      path: "/",
      filename: "two-[name].js",
    },
    plugins: [new HTMLGeneratorPlugin()],
    infrastructureLogging: {
      level: "info",
      stream: {
        write: () => {},
      },
    },
  },
];
