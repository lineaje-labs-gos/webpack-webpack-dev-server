import { join } from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default () =>
  new Promise((resolve) => {
    resolve({
      mode: "development",
      entry: join(__dirname, "foo.js"),
    });
  });
