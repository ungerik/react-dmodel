import React from "react";

import Float from "./Float";
import { encodeValue, decodeValue, byteLengthFunc } from "./encoding";
import dmodelPropTypes from "./PropTypes";


export default class Float64 extends Float {
	static displayName = "Float64";
	static dataModelType = "Float";

	static propTypes = {
		...Float.propTypes,
		encodingFactor: dmodelPropTypes.validNumber,
		encoding: React.PropTypes.oneOf(["binary", "hex", "HEX"]),
	};

	static defaultProps = {
		...Float.defaultProps,
		defaultValue: 0,
		encodingFactor: 1,
		encoding: "binary",
	}

	static validate(value, props) {
		const error = Float.validate(value, props);
		if (error) {
			return error;
		}
		return null;
	}

	static byteLength = byteLengthFunc(8);

	static readBinary(dataView, byteOffset, littleEndian, props) {
		return dataView.getFloat64(byteOffset, littleEndian) / props.encodingFactor;
	}

	static writeBinary(value, dataView, byteOffset, littleEndian, props) {
		dataView.setFloat64(byteOffset, value * props.encodingFactor, littleEndian);
	}

	static read(dataView, byteOffset, littleEndian, props) {
		return decodeValue(dataView, byteOffset, littleEndian, props, Float64);
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		encodeValue(value, dataView, byteOffset, littleEndian, props, Float64);
	}
}
