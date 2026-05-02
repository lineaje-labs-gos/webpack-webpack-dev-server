import { join } from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "development",
  entry: join(__dirname, "foo.js"),
  devServer: {
    devMiddleware: {
      publicPath: "/foo/bar",
    },
  },
};
