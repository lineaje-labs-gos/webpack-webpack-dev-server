import os from "node:os";
import path from "node:path";
import { normalizeStderr, testBin } from "../helpers/test-bin.js";

describe('"ipc" CLI option', () => {
  it('should work using "--ipc"', async () => {
    const { exitCode, stderr } = await testBin(["--ipc"]);
    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
  });

  it('should work using "--ipc=<string>"', async () => {
    const isWindows = process.platform === "win32";
    const pipePrefix = isWindows ? "\\\\.\\pipe\\" : os.tmpdir();
    const pipeName = "webpack-dev-server.cli.sock";
    const ipc = path.join(pipePrefix, pipeName);
    const { exitCode, stderr } = await testBin(["--ipc", ipc]);
    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
  });
});
