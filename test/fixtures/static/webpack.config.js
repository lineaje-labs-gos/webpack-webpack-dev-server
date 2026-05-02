import path from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "development",
  entry: path.resolve(__dirname, "foo.js"),
  devServer: {
    static: path.resolve(__dirname, "static"),
  },
};
