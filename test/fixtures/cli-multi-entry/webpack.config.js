import { resolve } from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "development",
  stats: "detailed",
  context: __dirname,
  entry: {
    foo: resolve(__dirname, "./foo.js"),
    bar: resolve(__dirname, "./bar.js"),
  },
};
