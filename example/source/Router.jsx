import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute } from "react-router";

import AppContainer from "./AppContainer";
import Start from "./screens/Start";
import NotFound from "./screens/NotFound";


const router = (
	<Router>
		<Route path="/" component={AppContainer}>
			<IndexRoute component={Start} />
			<Route path="*" component={NotFound} />
		</Route>
	</Router>
);


ReactDOM.render(router, document.getElementById("app"));
