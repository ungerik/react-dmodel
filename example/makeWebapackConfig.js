/*eslint-env node */

function debugWebapackConfig(outputPath, makeConfigFunc) {
	console.log("debugWebapackConfig");
	var config = makeConfigFunc(__dirname, "./source/main.js", outputPath);

	// Polyfills:
	config.addLib("console-polyfill", "bower_components/console-polyfill/index.js");
	config.addLib("es5-shim", "bower_components/es5-shim/es5-shim.js");
	config.addLib("es5-sham", "bower_components/es5-shim/es5-sham.js");
	config.addLib("html5shiv-printshiv", "bower_components/html5shiv/dist/html5shiv-printshiv.js");
	config.addLib("browser-polyfill", "node_modules/babel-core/browser-polyfill.js");

	// CSS:
	config.addLib("bootstrap.css", "bower_components/bootstrap/dist/css/bootstrap.css");

	// Required libs:
	config.addLib("react");
	config.addLib("react-bootstrap");
	config.addLib("react-router");
	config.addLib("react-router-bootstrap");
	config.addLib("core-decorators");
	config.addLib("interact.js", "node_modules/interact.js/dist/interact.js");
	config.addLibES6("react-dmodel");

	return config;
}


function releaseWebapackConfig(outputPath, makeConfigFunc) {
	console.log("releaseWebapackConfig");
	var config = makeConfigFunc(__dirname, "./source/main.js", outputPath);

	// Polyfills:
	config.addLib("console-polyfill", "bower_components/console-polyfill/index.js");
	config.addLib("es5-shim", "bower_components/es5-shim/es5-shim.min.js");
	config.addLib("es5-sham", "bower_components/es5-shim/es5-sham.min.js");
	config.addLib("html5shiv-printshiv", "bower_components/html5shiv/dist/html5shiv-printshiv.min.js");
	config.addLib("browser-polyfill", "node_modules/babel-core/browser-polyfill.min.js");

	// CSS:
	config.addLib("bootstrap.css", "bower_components/bootstrap/dist/css/bootstrap.min.css");

	// Required libs:
	config.addLib("react");
	config.addLib("react-bootstrap");
	config.addLib("react-router");
	config.addLib("react-router-bootstrap");
	config.addLib("core-decorators");
	config.addLib("interact.js", "node_modules/interact.js/dist/interact.min.js");
	config.addLibES6("react-dmodel");

	return config;
}

module.exports = {
	debugWebapackConfig: debugWebapackConfig,
	releaseWebapackConfig: releaseWebapackConfig,
};
