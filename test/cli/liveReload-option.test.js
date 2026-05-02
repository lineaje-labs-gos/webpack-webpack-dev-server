import { testBin } from "../helpers/test-bin.js";
import _ports_map from "../ports-map.js";

const port = _ports_map["cli-live-reload"];

describe('"liveReload" CLI option', () => {
  it('should work using "--live-reload"', async () => {
    const { exitCode } = await testBin(["--port", port, "--live-reload"]);
    expect(exitCode).toBe(0);
  });

  it('should work using "--no-live-reload"', async () => {
    const { exitCode } = await testBin(["--port", port, "--no-live-reload"]);
    expect(exitCode).toBe(0);
  });
});
