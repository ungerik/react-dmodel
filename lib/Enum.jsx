import React from "react";
import DataType from "./DataType";


export default class Enum extends DataType {
	static displayName = "Enum";
	static dataModelType = "Enum";

	static propTypes = {
		children: React.PropTypes.element, // optional custom component to render the data, will receive following props from parent DataModel.props.mapFunc: {...{getValue, setValue, parents, refCallback, key}, ...extraProps}
		name: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		options: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
		optionsPrefix: React.PropTypes.string,
		optionsPostfix: React.PropTypes.string,
		defaultValue: React.PropTypes.any,
		required: React.PropTypes.bool,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		label: null,
		optionsPrefix: "",
		optionsPostfix: "",
		defaultValue: null,
		required: false,
		style: {},
	};

	static validate(value, props) {
		for (const option of props.options) {
			if (value === option) {
				return null;
			}
		}
		return new Error("Value not found in enum options: " + value);
	}

	static dynamicDefaultValue(props) {
		return props.defaultValue !== null ? props.defaultValue : props.options[0];
	}
}
