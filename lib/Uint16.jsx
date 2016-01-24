import React from "react";
import Uint from "./Uint";
import { encodeValue, decodeValue, byteLengthFunc } from "./encoding";
import dmodelPropTypes from "./PropTypes";


export default class Uint16 extends Uint {
	static displayName = "Uint16";
	static dataModelType = "Uint";

	static propTypes = {
		...Uint.propTypes,
		encodingFactor: dmodelPropTypes.validNumber,
		encoding: React.PropTypes.oneOf(["binary", "hex", "HEX"]),
	};

	static defaultProps = {
		...Uint.defaultProps,
		defaultValue: 0,
		encodingFactor: 1,
		encoding: "binary",
	}

	static validate(value, props) {
		const error = Uint.validate(value, props);
		if (error) {
			return error;
		}
		value *= props.encodingFactor;
		if (value > 65535) {
			return new RangeError(`Value ${value} is not within 16 bit unsigned integer range [0...65535]`);
		}
		return null;
	}

	static byteLength = byteLengthFunc(2);

	static readBinary(dataView, byteOffset, littleEndian, props) {
		return dataView.getUint16(byteOffset, littleEndian) / props.encodingFactor;
	}

	static writeBinary(value, dataView, byteOffset, littleEndian, props) {
		dataView.setUint16(byteOffset, value * props.encodingFactor, littleEndian);
	}

	static read(dataView, byteOffset, littleEndian, props) {
		return decodeValue(dataView, byteOffset, littleEndian, props, Uint16);
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		encodeValue(value, dataView, byteOffset, littleEndian, props, Uint16);
	}
}
