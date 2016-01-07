import React from "react";
import DataType from "./DataType";


export default class Group extends DataType {
	static displayName = "Group";
	static dataModelType = "Group";

	static propTypes = {
		children: React.PropTypes.node,
		name: React.PropTypes.string,
		label: React.PropTypes.string,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		name: null,
		label: null,
		style: {},
	};

	static checkValue(value) {
		if (typeof value !== "object") {
			return new Error("Value must be an object, but is of type " + typeof value);
		}
		return null;
	}
}
