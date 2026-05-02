import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeStderr, testBin } from "../helpers/test-bin.js";
import _ports_map from "../ports-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = _ports_map["cli-watch-files"];

describe('"watchFiles" CLI option', () => {
  it('should work using "--watch-files <value>"', async () => {
    const watchDirectory = path.resolve(__dirname, "../fixtures/static/static");
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--watch-files",
      watchDirectory,
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
      }),
    ).toMatchSnapshot("stderr");
  });

  it('should work using "--watch-files <value> --watch-files <other-value>"', async () => {
    const watchDirectory = path.resolve(__dirname, "../fixtures/static/static");
    const watchOtherDirectory = path.resolve(
      __dirname,
      "../fixtures/static/simple-config",
    );
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--watch-files",
      watchDirectory,
      "--watch-files",
      watchOtherDirectory,
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
      }),
    ).toMatchSnapshot("stderr");
  });

  it('should work using "--watch-files-reset --watch-files <static>"', async () => {
    const watchDirectory = path.resolve(__dirname, "../fixtures/static/static");
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--watch-files-reset",
      "--watch-files",
      watchDirectory,
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
      }),
    ).toMatchSnapshot("stderr");
  });
});
