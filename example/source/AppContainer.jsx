import React from "react";
// import { Label } from "react-bootstrap";


export default class AppContainer extends React.Component {
	static displayName = "AppContainer";

	static propTypes = {
		children: React.PropTypes.node,
	};

	render() {
		return (
			<div className="app-container">
				{this.props.children}
			</div>
		);
	}
}
