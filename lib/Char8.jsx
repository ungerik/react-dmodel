import React from "react";
import DataType from "./DataType";
import dmodelPropTypes from "./PropTypes";


export default class Char8 extends DataType {
	static displayName = "Char8";
	static dataModelType = "Text";

	static propTypes = {
		length: dmodelPropTypes.uint.isRequired,
		name: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		defaultValue: React.PropTypes.string,
		nullTerminated: React.PropTypes.bool,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		label: null,
		defaultValue: "",
		nullTerminated: false,
		style: {},
	};

	static dynamicDefaultValue(props) {
		let str = props.defaultValue;
		while (str.length < props.length) {
			str += "\0";
		}
		return str;
	}

	static validate(value, props) {
		if (typeof value !== "string") {
			return new TypeError("Value must be a string, but is of type " + typeof value);
		}
		if (props.nullTerminated) {
			if (value.length > props.length) {
				return new RangeError(`Char8 must have ${props.length} or less characters but has ${value.length}`);
			}
		} else {
			if (value.length !== props.length) {
				return new RangeError(`Char8 must have ${props.length} characters but has ${value.length}`);
			}
		}
		return null;
	}

	static byteLength = (props) => props.length;

	static read(dataView, byteOffset, littleEndian, props) {
		let str = "";
		const nt = props.nullTerminated;
		const end = byteOffset + props.length;
		for (let i = byteOffset; i < end; i++) {
			const c = dataView.getUint8(i);
			if (nt && c === 0) {
				return str;
			}
			str += String.fromCharCode(c);
		}
		return str;
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		for (let i = 0; i < value.length; i++) {
			dataView.setUint8(byteOffset + i, value.charCodeAt(i));
		}
		for (let i = value.length; i < props.length; i++) {
			dataView.setUint8(byteOffset + i, 0);
		}
	}

}
