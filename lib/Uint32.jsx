import React from "react";
import Uint from "./Uint";
import { encodeValue, decodeValue, byteLengthFunc } from "./encoding";
import dmodelPropTypes from "./PropTypes";


export default class Uint32 extends Uint {
	static displayName = "Uint32";
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

	static checkValue(value, props) {
		const error = Uint.checkValue(value, props);
		if (error) {
			return error;
		}
		value *= props.encodingFactor;
		if (value > 4294967295) {
			return new RangeError(`Value ${value} is not within 32 bit unsigned integer range [0...4294967295]`);
		}
		return null;
	}

	static byteLength = byteLengthFunc(4);

	static readBinary(dataView, byteOffset, littleEndian, props) {
		return dataView.getUint32(byteOffset, littleEndian) / props.encodingFactor;
	}

	static writeBinary(value, dataView, byteOffset, littleEndian, props) {
		dataView.setUint32(byteOffset, value * props.encodingFactor, littleEndian);
	}

	static read(dataView, byteOffset, littleEndian, props) {
		return decodeValue(dataView, byteOffset, littleEndian, props, Uint32);
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		encodeValue(value, dataView, byteOffset, littleEndian, props, Uint32);
	}
}
