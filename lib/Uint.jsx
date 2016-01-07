import React from "react";
import DataType from "./DataType";
import dmodelPropTypes from "./PropTypes";


export default class Uint extends DataType {
	static displayName = "Uint";
	static dataModelType = "Uint";

	static propTypes = {
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
		min: 0,
		max: Number.MAX_SAFE_INTEGER,
		required: false,
		style: {},
	};

	static checkValue(value, props) {
		if (typeof value !== "number") {
			return new TypeError("Value must be a number, but is of type " + typeof value);
		}
		if (!Number.isInteger(value) || value < 0) {
			return new TypeError("Value must be an unsigned integer number, but is " + value);
		}
		if (value < props.min || value > props.max) {
			return new RangeError(`Value ${value} is not within min/max range [${props.min}...${props.max}]`);
		}
		return null;
	}
}
