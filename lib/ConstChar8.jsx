import React from "react";
import Char8 from "./Char8";


export default class ConstChar8 extends Char8 {
	static displayName = "ConstChar8";
	static dataModelType = "StaticText";

	static propTypes = {
		...Char8.propTypes,
		defaultValue: React.PropTypes.string.isRequired,
	};

	static checkValue(value, props) {
		if (typeof value !== "string") {
			return new TypeError("Value must be a string, but is of type " + typeof value);
		}
		if (value !== props.defaultValue) {
			return new Error(`ConstChar8 must be "${props.defaultValue}" but is "${value}"`);
		}
		return null;
	}

	static byteLength = (props) => props.length;

	static read = Char8.read;

	static write = Char8.write;
}
