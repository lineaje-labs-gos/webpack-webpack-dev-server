import path from "node:path";
import { fileURLToPath } from "node:url";
import { rimraf } from "rimraf";
import Server from "../../lib/Server.js";
import { normalizeStderr, testBin } from "../helpers/test-bin.js";
import _ports_map from "../ports-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = _ports_map["cli-server"];
const httpsCertificateDirectory = path.resolve(
  __dirname,
  "../fixtures/https-certificate",
);
const defaultCertificateDir = Server.findCacheDir();

describe('"server" CLI options', () => {
  beforeEach(async () => {
    await rimraf(defaultCertificateDir);
  });

  it('should work using "--server-type http"', async () => {
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--server-type",
      "http",
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
        https: false,
      }),
    ).toMatchSnapshot();
  });

  it('should work using "--server-type https"', async () => {
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--server-type",
      "https",
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
        https: true,
      }),
    ).toMatchSnapshot();
  });

  it('should work using "--server-options-key <path> --server-options-pfx <path> --server-options-passphrase webpack-dev-server --server-options-cert <path> --server-options-ca <path>"', async () => {
    const pfxFile = path.join(httpsCertificateDirectory, "server.pfx");
    const key = path.join(httpsCertificateDirectory, "server.key");
    const cert = path.join(httpsCertificateDirectory, "server.crt");
    const ca = path.join(httpsCertificateDirectory, "ca.pem");
    const passphrase = "webpack-dev-server";
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--server-type",
      "https",
      "--server-options-key",
      key,
      "--server-options-pfx",
      pfxFile,
      "--server-options-passphrase",
      passphrase,
      "--server-options-cert",
      cert,
      "--server-options-ca",
      ca,
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
        https: true,
      }),
    ).toMatchSnapshot();
  });

  it('should work using "--server-options-key-reset --server-options-key <path> --server-options-pfx-reset --server-options-pfx <path> --server-options-passphrase webpack-dev-server --server-options-cert-reset  --server-options-cert <path> --server-options-ca-reset --server-options-ca <path>"', async () => {
    const pfxFile = path.join(httpsCertificateDirectory, "server.pfx");
    const key = path.join(httpsCertificateDirectory, "server.key");
    const cert = path.join(httpsCertificateDirectory, "server.crt");
    const ca = path.join(httpsCertificateDirectory, "ca.pem");
    const passphrase = "webpack-dev-server";
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--server-type",
      "https",
      "--server-options-key-reset",
      "--server-options-key",
      key,
      "--server-options-pfx-reset",
      "--server-options-pfx",
      pfxFile,
      "--server-options-passphrase",
      passphrase,
      "--server-options-cert-reset",
      "--server-options-cert",
      cert,
      "--server-options-ca-reset",
      "--server-options-ca",
      ca,
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
        https: true,
      }),
    ).toMatchSnapshot();
  });

  // For https://github.com/webpack/webpack-dev-server/issues/3306
  it('should work using "--server-options-key <path> --server-options-pfx <path> --server-options-passphrase webpack-dev-server --server-options-cert <path>"', async () => {
    const pfxFile = path.join(httpsCertificateDirectory, "server.pfx");
    const key = path.join(httpsCertificateDirectory, "server.key");
    const cert = path.join(httpsCertificateDirectory, "server.crt");
    const passphrase = "webpack-dev-server";
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--server-type",
      "https",
      "--server-options-key",
      key,
      "--server-options-pfx",
      pfxFile,
      "--server-options-passphrase",
      passphrase,
      "--server-options-cert",
      cert,
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
        https: true,
      }),
    ).toMatchSnapshot();
  });

  it('should work using "--server-options-request-cert"', async () => {
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--server-type",
      "https",
      "--server-options-request-cert",
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
        https: true,
      }),
    ).toMatchSnapshot();
  });

  it('should work using "--no-server-options-request-cert"', async () => {
    const { exitCode, stderr } = await testBin([
      "--port",
      port,
      "--server-type",
      "https",
      "--no-server-options-request-cert",
    ]);
    expect(exitCode).toBe(0);
    expect(
      normalizeStderr(stderr, {
        ipv6: true,
        https: true,
      }),
    ).toMatchSnapshot();
  });
});
