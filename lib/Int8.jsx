import React from "react";
import Int from "./Int";
import { encodeValue, decodeValue, byteLengthFunc } from "./encoding";
import dmodelPropTypes from "./PropTypes";


export default class Int8 extends Int {
	static displayName = "Int8";
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

	static validate(value, props) {
		const error = Int.validate(value, props);
		if (error) {
			return error;
		}
		value *= props.encodingFactor;
		if (value < -128 || value > +127) {
			return new RangeError(`Value ${value} is not within 8 bit integer range [-128...+127]`);
		}
		return null;
	}

	static byteLength = byteLengthFunc(1);

	static readBinary(dataView, byteOffset, littleEndian, props) {
		return dataView.getInt8(byteOffset) / props.encodingFactor;
	}

	static writeBinary(value, dataView, byteOffset, littleEndian, props) {
		dataView.setInt8(byteOffset, value * props.encodingFactor);
	}

	static read(dataView, byteOffset, littleEndian, props) {
		return decodeValue(dataView, byteOffset, littleEndian, props, Int8);
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		encodeValue(value, dataView, byteOffset, littleEndian, props, Int8);
	}
}
