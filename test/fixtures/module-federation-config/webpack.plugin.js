import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import webpack from "webpack";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { ModuleFederationPlugin } = webpack.container;
export default {
  mode: "development",
  target: "node",
  stats: "none",
  context: __dirname,
  entry: ["./entry1.js"],
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      library: {
        type: "var",
        name: "app1",
      },
      filename: "remoteEntry.js",
      exposes: {
        "./entry1": "./entry1",
      },
    }),
  ],
  infrastructureLogging: {
    level: "warn",
  },
};
