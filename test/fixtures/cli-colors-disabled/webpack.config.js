import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "development",
  stats: {
    colors: false,
  },
  context: __dirname,
  entry: "./foo.js",
  infrastructureLogging: {
    colors: false,
  },
};
