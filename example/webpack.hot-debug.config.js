/*eslint-env node */

const debugWebapackConfig = require("./makeWebapackConfig").debugWebapackConfig;
const makeStandardHotConfig = require("react-webpack-config").makeStandardHotConfig;

module.exports = debugWebapackConfig("./hot-debug", makeStandardHotConfig);
