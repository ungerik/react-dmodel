import React from "react";
import Int from "./Int";
import { encodeValue, decodeValue, byteLengthFunc } from "./encoding";
import dmodelPropTypes from "./PropTypes";


export default class Int16 extends Int {
	static displayName = "Int16";
	static dataModelType = "Int";

	static propTypes = {
		...Int.propTypes,
		encodingFactor: dmodelPropTypes.validNumber,
		encoding: React.PropTypes.oneOf(["binary", "hex", "HEX"]),
	};

	static defaultProps = {
		...Int.defaultProps,
		defaultValue: 0,
		encodingFactor: 1,
		encoding: "binary",
	}

	static checkValue(value, props) {
		const error = Int.checkValue(value, props);
		if (error) {
			return error;
		}
		value *= props.encodingFactor;
		if (value < -32768 || value > +32767) {
			return new RangeError(`Value ${value} is not within 16 bit integer range [-32768...+32767]`);
		}
		return null;
	}

	static byteLength = byteLengthFunc(2);

	static readBinary(dataView, byteOffset, littleEndian, props) {
		return dataView.getInt16(byteOffset, littleEndian) / props.encodingFactor;
	}

	static writeBinary(value, dataView, byteOffset, littleEndian, props) {
		dataView.setInt16(byteOffset, value * props.encodingFactor, littleEndian);
	}

	static read(dataView, byteOffset, littleEndian, props) {
		return decodeValue(dataView, byteOffset, littleEndian, props, Int16);
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		encodeValue(value, dataView, byteOffset, littleEndian, props, Int16);
	}
}
