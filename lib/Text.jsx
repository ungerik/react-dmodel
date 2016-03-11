import React from "react";
import DataType from "./DataType";
import dmodelPropTypes from "./PropTypes";


export default class Text extends DataType {
	static displayName = "Text";
	static dataModelType = "Text";

	static propTypes = {
		children: React.PropTypes.element, // optional custom component to render the data, will receive following props from parent DataModel.props.mapFunc: {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}}
		name: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		defaultValue: React.PropTypes.string,
		minLength: dmodelPropTypes.uint,
		maxLength: dmodelPropTypes.uint,
		multiLine: React.PropTypes.bool,
		required: React.PropTypes.bool,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		children: null,
		label: null,
		defaultValue: "",
		minLength: 0,
		maxLength: Number.MAX_SAFE_INTEGER,
		multiLine: false,
		required: false,
		style: {},
	};

	static validate(value, props) {
		if (typeof value !== "string") {
			return new TypeError("Value must be a string, but is of type " + typeof value);
		}
		if (value.length < props.minLength) {
			return new RangeError(`String is to short. Length ${value.length} < minLength ${props.minLength}`);
		}
		if (value.length > props.maxLength) {
			return new RangeError(`String is to long. Length ${value.length} > maxLength ${props.maxLength}`);
		}
		return null;
	}
}
