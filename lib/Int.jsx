import React from "react";
import DataType from "./DataType";
import dmodelPropTypes from "./PropTypes";


export default class Int extends DataType {
	static displayName = "Int";
	static dataModelType = "Int";

	static propTypes = {
		children: React.PropTypes.element, // optional custom component to render the data, will receive following props from parent DataModel.props.mapFunc: {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}}
		name: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		unit: React.PropTypes.string,
		defaultValue: React.PropTypes.number,
		min: dmodelPropTypes.minMax,
		max: dmodelPropTypes.minMax,
		required: React.PropTypes.bool,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		label: null,
		unit: null,
		defaultValue: NaN,
		min: -Number.MAX_SAFE_INTEGER,
		max: +Number.MAX_SAFE_INTEGER,
		required: false,
		style: {},
	};

	static validate(value, props) {
		if (typeof value !== "number") {
			return new TypeError("Value must be a number, but is of type " + typeof value);
		}
		if (!Number.isInteger(value)) {
			return new TypeError("Value must be an integer number, but is " + value);
		}
		if (value < props.min || value > props.max) {
			return new Error(`Value ${value} is not within min/max range [${props.min}...${props.max}]`);
		}
		return null;
	}
}
