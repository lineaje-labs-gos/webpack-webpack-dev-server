import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "development",
  target: "node",
  stats: "none",
  context: __dirname,
  entry: ["./entry1.js", "./entry2.js"],
  output: {
    path: "/",
    libraryTarget: "umd",
  },
  infrastructureLogging: {
    level: "warn",
  },
};
