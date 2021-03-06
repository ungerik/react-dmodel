import React from "react";
import Int from "./Int";
import { encodeValue, decodeValue, byteLengthFunc } from "./encoding";
import dmodelPropTypes from "./PropTypes";


export default class Int32 extends Int {
	static displayName = "Int32";
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
		if (value < -2147483648 || value > +2147483647) {
			return new RangeError(`Value ${value} is not within 32 bit integer range [-2147483648...+2147483647]`);
		}
		return null;
	}

	static byteLength = byteLengthFunc(4);

	static readBinary(dataView, byteOffset, littleEndian, props) {
		return dataView.getInt32(byteOffset, littleEndian) / props.encodingFactor;
	}

	static writeBinary(value, dataView, byteOffset, littleEndian, props) {
		dataView.setInt32(byteOffset, value * props.encodingFactor, littleEndian);
	}

	static read(dataView, byteOffset, littleEndian, props) {
		return decodeValue(dataView, byteOffset, littleEndian, props, Int32);
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		encodeValue(value, dataView, byteOffset, littleEndian, props, Int32);
	}
}
