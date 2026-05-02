import CustomClient from "../custom-client/CustomWebSocketClient.js";
window.expectedClient = CustomClient;
// eslint-disable-next-line camelcase, no-undef
window.injectedClient = __webpack_dev_server_client__;
