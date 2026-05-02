import { normalizeStderr, testBin } from "../helpers/test-bin.js";
import _ports_map from "../ports-map.js";

const port = _ports_map["cli-history-api-fallback"];

describe('"historyApiFallback" CLI option', () => {
  it('should work using "--history-api-fallback"', async () => {
    const { exitCode, stderr } = await testBin(
      ["--port", port, "--history-api-fallback"],
      {
        outputKillStr: /404s will fallback/,
      },
    );
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
      }),
    ).toMatchSnapshot();
  });

  it('should work using "--no-history-api-fallback"', async () => {
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--no-history-api-fallback",
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
      }),
    ).toMatchSnapshot();
  });
});
