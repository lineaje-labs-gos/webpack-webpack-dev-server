import { resolve } from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "development",
  stats: "detailed",
  entry: resolve(__dirname, "./foo.js"),
  devServer: {
    webSocketServer: {
      type: "ws",
    },
  },
};
