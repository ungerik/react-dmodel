import Bool from "./Bool";
import { encodeValue, decodeValue, byteLengthFunc } from "./encoding";


export default class Bool8 extends Bool {
	static displayName = "Bool8";
	static dataModelType = "Bool";

	static propTypes = {
		...Bool8.propTypes,
		encoding: React.PropTypes.oneOf(["binary", "hex", "HEX"]),
	};

	static defaultProps = {
		...Bool8.defaultProps,
		encoding: "binary",
	}

	static byteLength = byteLengthFunc(1);

	static readBinary(dataView, byteOffset) {
		return dataView.getUint8(byteOffset) !== 0;
	}

	static writeBinary(value, dataView, byteOffset) {
		dataView.setUint8(byteOffset, value ? 1 : 0);
	}

	static read(dataView, byteOffset, littleEndian, props) {
		return decodeValue(dataView, byteOffset, littleEndian, props, Bool8);
	}

	static write(value, dataView, byteOffset, littleEndian, props) {
		encodeValue(value, dataView, byteOffset, littleEndian, props, Bool8);
	}

}
