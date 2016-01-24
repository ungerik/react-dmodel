import React from "react";

import Float from "./Float";
import { encodeValue, decodeValue, byteLengthFunc } from "./encoding";
import dmodelPropTypes from "./PropTypes";


export default class Float32 extends Float {
	static displayName = "Float32";
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
		value *= props.encodingFactor;
		if (value < -3.4028234e38 || value > +3.4028234e38) {
			return new RangeError(`Value ${value} is not within 32 bit float range [-3.4028234e38...+3.4028234e38]`);
		}
		return null;
	}

	static byteLength = byteLengthFunc(4);

	static readBinary(dataView, byteOffset, littleEndian, props) {
		return dataView.getFloat32(byteOffset, littleEndian) / props.encodingFactor;
	}

	static writeBinary(value, dataView, byteOffset, littleEndian, props) {
		dataView.setFloat32(byteOffset, value * props.encodingFactor, littleEndian);
	}

	static read(dataView, byteOffset, littleEndian, props) {
		return decodeValue(dataView, byteOffset, littleEndian, props, Float32);
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		encodeValue(value, dataView, byteOffset, littleEndian, props, Float32);
	}
}
