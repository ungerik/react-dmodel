import React from "react";
import { ButtonInput } from "react-bootstrap";

import DataModel from "../../DataModel";
import mapDefault from "./mapDefault";


export default class Form extends DataModel {
	static displayName = "Form";

	static propTypes = {
		children: React.PropTypes.node,
		onSave: React.PropTypes.func.isRequired,
		saveText: React.PropTypes.string,
		data: React.PropTypes.object.isRequired,
		mapFunc: React.PropTypes.func,
	};

	static defaultProps = {
		saveText: "Save",
		mapFunc: mapDefault,
	};

	onSubmit(event) {
		event.preventDefault();
		this.props.onSave(this.state);
	}

	render() {
		return (
			<form onSubmit={event => this.onSubmit(event)}>
				{super.render()}
				<ButtonInput type='submit' value={this.props.saveText} />
			</form>
		);
	}
}
