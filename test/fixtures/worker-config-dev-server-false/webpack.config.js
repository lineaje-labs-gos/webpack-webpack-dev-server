import path from "path";
import HTMLGeneratorPlugin from "../../helpers/html-generator-plugin.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default [
  {
    name: "app",
    // dependencies: ["worker"],
    devtool: false,
    target: "web",
    entry: "./index.js",
    mode: "development",
    context: __dirname,
    stats: "none",
    output: {
      path: path.resolve(__dirname, "./dist/"),
    },
    infrastructureLogging: {
      level: "info",
      stream: {
        write: () => {},
      },
    },
    plugins: [new HTMLGeneratorPlugin()],
  },
  {
    name: "worker",
    devtool: false,
    target: "webworker",
    entry: "./worker.js",
    mode: "development",
    context: __dirname,
    stats: "none",
    output: {
      path: path.resolve(__dirname, "public"),
      filename: "worker-bundle.js",
    },
    infrastructureLogging: {
      level: "info",
      stream: {
        write: () => {},
      },
    },
    devServer: false,
  },
];
