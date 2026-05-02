import { testBin } from "../helpers/test-bin.js";
import _ports_map from "../ports-map.js";

const port = _ports_map["cli-web-socket-server"];

describe('"webSocketServer" CLI option', () => {
  it('should work using "--web-socket-server-type ws"', async () => {
    const { exitCode } = await testBin([
      "--port",
      port,
      "--web-socket-server-type",
      "ws",
    ]);
    expect(exitCode).toBe(0);
  });

  it('should work using "--no-web-socket-server"', async () => {
    const { exitCode } = await testBin([
      "--port",
      port,
      "--no-web-socket-server",
    ]);
    expect(exitCode).toBe(0);
  });
});
