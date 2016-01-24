import React from "react";
import DataType from "./DataType";


export default class Bool extends DataType {
	static displayName = "Bool";
	static dataModelType = "Bool";

	static propTypes = {
		name: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		defaultValue: React.PropTypes.bool,
		trueString: React.PropTypes.string,
		falseString: React.PropTypes.string,
		required: React.PropTypes.bool,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		label: null,
		defaultValue: false,
		trueString: "true",
		falseString: "false",
		required: false,
		style: {},
	};

	static validate(value) {
		if (typeof value !== "boolean") {
			return new TypeError("Value must be a boolean, but is of type " + typeof value);
		}
		return null;
	}
}
