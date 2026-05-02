import webpack from "webpack";
import Server from "../../lib/Server.js";
import config from "../fixtures/client-config/webpack.config.js";
import runBrowser from "../helpers/run-browser.js";
import sessionSubscribe from "../helpers/session-subscribe.js";
import _ports_map from "../ports-map.js";

const port = _ports_map["web-socket-server-test"];

describe("web socket server", () => {
  it("should work allow to disable", async () => {
    const devServerPort = port;
    const compiler = webpack(config);
    const devServerOptions = {
      webSocketServer: false,
      port: devServerPort,
    };
    const server = new Server(devServerOptions, compiler);
    await server.start();
    const { page, browser } = await runBrowser();
    try {
      const pageErrors = [];
      const consoleMessages = [];
      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });
      const webSocketRequests = [];
      const session = await page.createCDPSession();
      await session.send("Target.setAutoAttach", {
        autoAttach: true,
        flatten: true,
        waitForDebuggerOnStart: true,
      });
      await sessionSubscribe(session);
      session.on("Network.webSocketCreated", (test) => {
        webSocketRequests.push(test);
      });
      await page.goto(`http://localhost:${port}/`, {
        waitUntil: "networkidle0",
      });
      expect(webSocketRequests).toHaveLength(0);
      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages",
      );
      expect(pageErrors).toMatchSnapshot("page errors");
    } finally {
      await browser.close();
      await server.stop();
    }
  });
});
