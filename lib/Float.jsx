import React from "react";
import DataType from "./DataType";
import dmodelPropTypes from "./PropTypes";


export default class Float extends DataType {
	static displayName = "Float";
	static dataModelType = "Float";

	static propTypes = {
		children: React.PropTypes.element, // optional custom component to render the data, will receive following props from parent DataModel.props.mapFunc: {...{getValue, setValue, parents, refCallback, key}, ...extraProps}
		name: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		unit: React.PropTypes.string,
		defaultValue: React.PropTypes.number,
		min: dmodelPropTypes.minMax,
		max: dmodelPropTypes.minMax,
		decimals: dmodelPropTypes.validNumber,
		required: React.PropTypes.bool,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		label: null,
		unit: null,
		defaultValue: NaN,
		min: -Number.MAX_VALUE,
		max: +Number.MAX_VALUE,
		decimals: 6,
		required: false,
		style: {},
	};

	static validate(value, props) {
		if (typeof value !== "number") {
			return new TypeError("Value must be a number, but is of type " + typeof value);
		}
		// if (props.required && isNaN(value)) {
		// 	return new Error("Required number is NaN");
		// }
		if (value < props.min || value > props.max) {
			return new RangeError(`Value ${value} is not within min/max range [${props.min}...${props.max}]`);
		}
		return null;
	}
}
