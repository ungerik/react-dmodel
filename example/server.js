/*eslint-env node */

var hot = process.argv.length >= 3 && process.argv[2] === "hot";

var webpackConfig;
var runServer;

if (hot) {
	webpackConfig = require("./webpack.hot-debug.config");
	runServer = require("react-webpack-config").runHotDevServer;
} else {
	throw new Error("not implemented");
}

runServer(webpackConfig, "0.0.0.0");
